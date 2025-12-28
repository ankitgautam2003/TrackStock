import { Material } from '../models/Material.js';
import { StockMovement } from '../models/StockMovement.js';
import { validatePositiveInteger } from '../utils/validators.js';

/**
 * Sales Service - Simple sales tracking with automatic inventory updates
 * 
 * This service provides a clean interface for recording sales while
 * leveraging the existing StockMovement system for data persistence
 * and inventory management.
 */
export class SalesService {
  /**
   * Record a sale by SKU
   * 
   * @param {Object} saleData - Sale information
   * @param {string} saleData.sku - Product SKU
   * @param {number} saleData.quantity - Quantity sold
   * @param {string} [saleData.reference] - Invoice/order reference (optional)
   * @param {string} [saleData.customerName] - Customer name (optional)
   * @param {Date} [saleData.saleDate] - Sale date (defaults to now)
   * 
   * @returns {Object} Created sale record with updated stock info
   * @throws {Error} If SKU not found, insufficient stock, or invalid quantity
   */
  async recordSale(saleData) {
    const { sku, quantity, reference, customerName, saleDate } = saleData;

    // Validate required fields
    if (!sku) {
      throw new Error('SKU is required');
    }

    if (!quantity) {
      throw new Error('Quantity is required');
    }

    // Validate quantity is a positive number
    const parsedQuantity = validatePositiveInteger(quantity, 'Quantity');

    // Find product by SKU (case-insensitive)
    const material = await Material.findOne({ 
      sku: new RegExp(`^${sku}$`, 'i') 
    });

    if (!material) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    // Check sufficient stock
    if (material.availableQuantity < parsedQuantity) {
      throw new Error(
        `Insufficient stock for ${sku}. Available: ${material.availableQuantity}, Requested: ${parsedQuantity}`
      );
    }

    // Build notes with customer info if provided
    let notes = customerName ? `Customer: ${customerName}` : null;

    // Create stock movement record (OUTWARD with reason: Sales)
    const saleMovement = new StockMovement({
      materialId: material._id,
      type: 'OUTWARD',
      quantity: parsedQuantity,
      reason: 'Sales',
      reference: reference || null,
      notes: notes,
      createdAt: saleDate || new Date(), // Use provided date or current date
    });

    await saleMovement.save();

    // Update product stock (atomic operation)
    const previousStock = material.availableQuantity;
    material.availableQuantity -= parsedQuantity;
    await material.save();

    // Return sale information with stock update details
    return {
      saleId: saleMovement._id,
      sku: material.sku,
      productName: material.name,
      category: material.category,
      quantitySold: parsedQuantity,
      unitPrice: material.unitPrice,
      totalAmount: material.unitPrice * parsedQuantity,
      reference: reference || null,
      customerName: customerName || null,
      saleDate: saleMovement.createdAt,
      stockBefore: previousStock,
      stockAfter: material.availableQuantity,
      isLowStock: material.availableQuantity <= material.reorderLevel,
    };
  }

  /**
   * Get all sales (stock movements with reason: Sales)
   * 
   * @param {Object} options - Query options
   * @param {number} [options.limit=100] - Maximum number of records
   * @param {Date} [options.startDate] - Filter from date
   * @param {Date} [options.endDate] - Filter to date
   * 
   * @returns {Array} List of sales records
   */
  async getAllSales(options = {}) {
    const { limit = 100, startDate, endDate } = options;

    let query = { reason: 'Sales' };

    // Add date filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sales = await StockMovement.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('materialId')
      .lean();

    // Format response
    return sales.map(sale => ({
      saleId: sale._id,
      sku: sale.materialId?.sku,
      productName: sale.materialId?.name,
      category: sale.materialId?.category,
      quantitySold: sale.quantity,
      unitPrice: sale.materialId?.unitPrice,
      totalAmount: sale.materialId?.unitPrice * sale.quantity,
      reference: sale.reference,
      customerName: sale.notes?.includes('Customer:') 
        ? sale.notes.replace('Customer: ', '')
        : null,
      saleDate: sale.createdAt,
    }));
  }

  /**
   * Get sales for a specific product by SKU
   * 
   * @param {string} sku - Product SKU
   * @returns {Array} List of sales for the product
   */
  async getSalesBySku(sku) {
    // Find product by SKU
    const material = await Material.findOne({ 
      sku: new RegExp(`^${sku}$`, 'i') 
    });

    if (!material) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    // Get all sales movements for this product
    const sales = await StockMovement.find({ 
      materialId: material._id,
      reason: 'Sales' 
    })
      .sort({ createdAt: -1 })
      .lean();

    return sales.map(sale => ({
      saleId: sale._id,
      sku: material.sku,
      productName: material.name,
      quantitySold: sale.quantity,
      unitPrice: material.unitPrice,
      totalAmount: material.unitPrice * sale.quantity,
      reference: sale.reference,
      customerName: sale.notes?.includes('Customer:') 
        ? sale.notes.replace('Customer: ', '')
        : null,
      saleDate: sale.createdAt,
    }));
  }

  /**
   * Get sales summary/analytics
   * 
   * @param {Object} options - Query options
   * @param {Date} [options.startDate] - Filter from date
   * @param {Date} [options.endDate] - Filter to date
   * 
   * @returns {Object} Sales summary statistics
   */
  async getSalesSummary(options = {}) {
    const { startDate, endDate } = options;

    let matchQuery = { reason: 'Sales' };

    // Add date filter if provided
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    // Aggregate sales data
    const salesData = await StockMovement.find(matchQuery)
      .populate('materialId')
      .lean();

    const totalQuantity = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalRevenue = salesData.reduce((sum, sale) => {
      return sum + (sale.quantity * (sale.materialId?.unitPrice || 0));
    }, 0);

    // Group by product
    const productSales = {};
    salesData.forEach(sale => {
      const sku = sale.materialId?.sku;
      if (sku) {
        if (!productSales[sku]) {
          productSales[sku] = {
            sku,
            name: sale.materialId.name,
            totalQuantity: 0,
            totalRevenue: 0,
            salesCount: 0,
          };
        }
        productSales[sku].totalQuantity += sale.quantity;
        productSales[sku].totalRevenue += sale.quantity * sale.materialId.unitPrice;
        productSales[sku].salesCount += 1;
      }
    });

    return {
      totalSales: salesData.length,
      totalQuantitySold: totalQuantity,
      totalRevenue: totalRevenue,
      averageOrderValue: salesData.length > 0 ? totalRevenue / salesData.length : 0,
      topProducts: Object.values(productSales)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10),
    };
  }
}
