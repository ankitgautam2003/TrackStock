import { Material } from '../models/Material.js';
import { StockMovement } from '../models/StockMovement.js';

/**
 * Insights Service - Analytics and health metrics for inventory
 * 
 * Provides simple, rule-based insights without AI/ML:
 * - Fast-Moving Items (high sales frequency)
 * - Dead Stock (no sales in 30 days)
 * - Low Stock Alerts (below reorder level)
 */

// Configurable thresholds
const DEAD_STOCK_DAYS = 30; // No sales in 30 days = dead stock
const FAST_MOVING_DAYS = 30; // Sales frequency calculated over 30 days
const FAST_MOVING_THRESHOLD = 5; // Minimum 5 sales to be considered fast-moving

export class InsightsService {
  /**
   * Get dashboard metrics with all key statistics
   */
  async getDashboardMetrics() {
    const materials = await Material.find().lean();

    const totalMaterials = materials.length;
    const totalValue = materials.reduce((sum, m) => sum + (m.unitPrice * m.availableQuantity), 0);
    const totalDamaged = materials.reduce((sum, m) => sum + m.damagedQuantity, 0);
    const totalQuantity = materials.reduce((sum, m) => sum + m.availableQuantity, 0);

    const lowStockCount = materials.filter(m => m.availableQuantity <= m.reorderLevel).length;
    const deadStockCount = await this.getDeadStockCount();

    return {
      totalMaterials,
      totalValue: Math.round(totalValue * 100) / 100,
      totalQuantity,
      totalDamaged,
      lowStockCount,
      deadStockCount,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * LOW STOCK ALERTS
   * 
   * Logic: Identify products where current stock <= reorder level
   * 
   * Returns products sorted by urgency (lowest stock first)
   */
  async getLowStockAlerts() {
    const materials = await Material.find().lean();
    
    const lowStockItems = materials
      .filter(m => m.availableQuantity <= m.reorderLevel)
      .map(m => ({
        ...m,
        alert: 'Low stock — reorder recommended',
        urgency: this.calculateUrgency(m.availableQuantity, m.reorderLevel),
        daysUntilStockout: this.estimateDaysUntilStockout(m),
      }))
      .sort((a, b) => {
        // Sort by urgency: critical first, then by quantity
        if (a.urgency !== b.urgency) {
          return a.urgency === 'critical' ? -1 : 1;
        }
        return a.availableQuantity - b.availableQuantity;
      });

    return lowStockItems;
  }

  /**
   * Calculate urgency level based on stock vs reorder level
   */
  calculateUrgency(availableQuantity, reorderLevel) {
    if (availableQuantity === 0) return 'critical';
    if (availableQuantity <= reorderLevel * 0.5) return 'critical';
    if (availableQuantity <= reorderLevel * 0.75) return 'high';
    return 'medium';
  }

  /**
   * Estimate days until stockout based on recent sales velocity
   * Returns null if no recent sales data or if stock is increasing
   */
  async estimateDaysUntilStockout(material) {
    const daysToCheck = 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToCheck);

    // Get recent OUTWARD movements (sales)
    const recentSales = await StockMovement.find({
      materialId: material._id,
      type: 'OUTWARD',
      createdAt: { $gte: cutoffDate },
    }).lean();

    if (recentSales.length === 0) return null;

    const totalSold = recentSales.reduce((sum, sale) => sum + sale.quantity, 0);
    const dailySalesRate = totalSold / daysToCheck;

    if (dailySalesRate === 0) return null;

    const daysUntilStockout = Math.floor(material.availableQuantity / dailySalesRate);
    return daysUntilStockout;
  }

  /**
   * DEAD STOCK DETECTION
   * 
   * Logic: Products with ZERO sales in the last 30 days AND have stock available
   * 
   * Calculation:
   * 1. Get all products with availableQuantity > 0
   * 2. Check if they have any OUTWARD movements with reason='Sales' in last 30 days
   * 3. If no sales found, mark as dead stock
   */
  async getDeadStockItems() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DEAD_STOCK_DAYS);

    const materials = await Material.find({ availableQuantity: { $gt: 0 } }).lean();
    
    const deadStock = [];
    
    for (const material of materials) {
      // Check for any OUTWARD movements (sales, transfers, etc.) in the period
      const recentSales = await StockMovement.countDocuments({
        materialId: material._id,
        type: 'OUTWARD',
        reason: 'Sales', // Only check actual sales, not damages
        createdAt: { $gte: cutoffDate },
      });
      
      if (recentSales === 0) {
        // Calculate tied-up capital
        const tiedUpCapital = material.unitPrice * material.availableQuantity;
        
        deadStock.push({
          ...material,
          alert: 'Dead stock — no sales in 30 days',
          daysInactive: DEAD_STOCK_DAYS,
          tiedUpCapital: Math.round(tiedUpCapital * 100) / 100,
          recommendation: this.getDeadStockRecommendation(tiedUpCapital, material.availableQuantity),
        });
      }
    }

    // Sort by tied-up capital (highest impact first)
    return deadStock.sort((a, b) => b.tiedUpCapital - a.tiedUpCapital);
  }

  /**
   * Generate recommendation for dead stock items
   */
  getDeadStockRecommendation(tiedUpCapital, quantity) {
    if (tiedUpCapital > 10000) {
      return 'High-value dead stock — consider discount sale or return to supplier';
    } else if (quantity > 50) {
      return 'Large quantity sitting idle — consider promotional offer';
    } else {
      return 'Monitor for another 30 days or consider bundling with fast-moving items';
    }
  }

  /**
   * Count dead stock items (for dashboard)
   */
  async getDeadStockCount() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DEAD_STOCK_DAYS);

    const materials = await Material.find({ availableQuantity: { $gt: 0 } }).lean();
    
    let count = 0;
    for (const material of materials) {
      const recentSales = await StockMovement.countDocuments({
        materialId: material._id,
        type: 'OUTWARD',
        reason: 'Sales',
        createdAt: { $gte: cutoffDate },
      });
      
      if (recentSales === 0) {
        count++;
      }
    }

    return count;
  }

  /**
   * FAST-MOVING ITEMS
   * 
   * Logic: Products with high sales frequency or quantity in last 30 days
   * 
   * Calculation:
   * 1. Get all sales (OUTWARD movements with reason='Sales') in last 30 days
   * 2. Group by product
   * 3. Calculate total quantity sold and sales frequency
   * 4. Mark as fast-moving if:
   *    - Total sales >= FAST_MOVING_THRESHOLD (5 transactions)
   *    OR
   *    - Total quantity sold >= 20 units
   * 5. Sort by sales velocity (quantity sold per day)
   */
  async getFastMovingItems(days = FAST_MOVING_DAYS) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Aggregate sales by product
    const salesAggregation = await StockMovement.aggregate([
      {
        $match: {
          type: 'OUTWARD',
          reason: 'Sales',
          createdAt: { $gte: cutoffDate },
        },
      },
      {
        $group: {
          _id: '$materialId',
          totalQuantitySold: { $sum: '$quantity' },
          salesCount: { $sum: 1 },
          lastSaleDate: { $max: '$createdAt' },
        },
      },
      {
        $match: {
          $or: [
            { salesCount: { $gte: FAST_MOVING_THRESHOLD } }, // At least 5 sales
            { totalQuantitySold: { $gte: 20 } }, // Or at least 20 units sold
          ],
        },
      },
    ]);

    // Enrich with product details and calculate metrics
    const fastMovingItems = [];
    
    for (const item of salesAggregation) {
      const material = await Material.findById(item._id).lean();
      
      if (material) {
        const salesVelocity = item.totalQuantitySold / days; // Units per day
        const salesFrequency = item.salesCount / days; // Transactions per day
        
        // Calculate restock suggestion based on velocity
        const daysOfStockRemaining = salesVelocity > 0 
          ? Math.floor(material.availableQuantity / salesVelocity)
          : 999;

        fastMovingItems.push({
          ...material,
          alert: 'Fast-moving item — restock early to avoid stock-out',
          salesMetrics: {
            totalQuantitySold: item.totalQuantitySold,
            salesCount: item.salesCount,
            salesVelocity: Math.round(salesVelocity * 100) / 100,
            salesFrequency: Math.round(salesFrequency * 100) / 100,
            lastSaleDate: item.lastSaleDate,
            periodDays: days,
          },
          stockStatus: {
            currentStock: material.availableQuantity,
            daysOfStockRemaining: daysOfStockRemaining,
            recommendedReorderQuantity: Math.ceil(salesVelocity * 14), // 2 weeks buffer
          },
          urgency: daysOfStockRemaining <= 7 ? 'critical' : 
                   daysOfStockRemaining <= 14 ? 'high' : 'medium',
        });
      }
    }

    // Sort by sales velocity (fastest moving first)
    return fastMovingItems.sort((a, b) => 
      b.salesMetrics.salesVelocity - a.salesMetrics.salesVelocity
    );
  }

  /**
   * Get top moving SKUs by movement count (existing functionality)
   */
  async getTopMovingSkus(limit = 10) {
    const movementAggregation = await StockMovement.aggregate([
      {
        $group: {
          _id: '$materialId',
          movementCount: { $sum: 1 },
        },
      },
      { $sort: { movementCount: -1 } },
      { $limit: limit },
    ]);

    const results = [];
    for (const item of movementAggregation) {
      const material = await Material.findById(item._id).lean();
      if (material) {
        results.push({
          ...material,
          movementCount: item.movementCount,
        });
      }
    }

    return results;
  }

  /**
   * Get damaged inventory summary
   */
  async getDamagedInventorySummary() {
    const materials = await Material.find({ damagedQuantity: { $gt: 0 } })
      .sort({ damagedQuantity: -1 })
      .lean();

    const totalDamagedValue = materials.reduce(
      (sum, m) => sum + (m.unitPrice * m.damagedQuantity),
      0
    );

    return {
      items: materials,
      totalQuantity: materials.reduce((sum, m) => sum + m.damagedQuantity, 0),
      totalValue: Math.round(totalDamagedValue * 100) / 100,
    };
  }

  /**
   * Get category breakdown
   */
  async getCategoryBreakdown() {
    const materials = await Material.find().lean();

    const breakdown = {};
    materials.forEach(m => {
      if (!breakdown[m.category]) {
        breakdown[m.category] = {
          category: m.category,
          count: 0,
          totalQuantity: 0,
          totalValue: 0,
          items: [],
        };
      }
      breakdown[m.category].count++;
      breakdown[m.category].totalQuantity += m.availableQuantity;
      breakdown[m.category].totalValue += m.unitPrice * m.availableQuantity;
      breakdown[m.category].items.push({
        id: m._id.toString(),
        sku: m.sku,
        name: m.name,
        quantity: m.availableQuantity,
      });
    });

    return Object.values(breakdown).map(cat => ({
      ...cat,
      totalValue: Math.round(cat.totalValue * 100) / 100,
    }));
  }

  /**
   * Get comprehensive insights summary
   * Combines all insights into one response
   */
  async getComprehensiveInsights() {
    const [fastMoving, deadStock, lowStock] = await Promise.all([
      this.getFastMovingItems(),
      this.getDeadStockItems(),
      this.getLowStockAlerts(),
    ]);

    return {
      summary: {
        fastMovingCount: fastMoving.length,
        deadStockCount: deadStock.length,
        lowStockCount: lowStock.length,
        totalIssues: fastMoving.filter(i => i.urgency === 'critical').length +
                     deadStock.length +
                     lowStock.filter(i => i.urgency === 'critical').length,
      },
      fastMovingItems: fastMoving.slice(0, 10), // Top 10
      deadStockItems: deadStock.slice(0, 10), // Top 10 by tied-up capital
      lowStockItems: lowStock.filter(i => i.urgency === 'critical'), // Only critical
      timestamp: new Date().toISOString(),
    };
  }
}
