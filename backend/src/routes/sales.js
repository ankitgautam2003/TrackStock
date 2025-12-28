import express from 'express';
import { SalesService } from '../services/SalesService.js';

const router = express.Router();
const salesService = new SalesService();

/**
 * Record a new sale
 * POST /api/sales
 * 
 * Body:
 * {
 *   "sku": "TILE-001",           // Required
 *   "quantity": 10,              // Required
 *   "reference": "INV-2025-001", // Optional
 *   "customerName": "John Doe",  // Optional
 *   "saleDate": "2025-12-28"     // Optional (defaults to now)
 * }
 */
router.post('/', async (req, res) => {
  try {
    const sale = await salesService.recordSale(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Sale recorded successfully',
      data: sale 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get all sales
 * GET /api/sales
 * 
 * Query params:
 * - limit: Maximum number of records (default: 100)
 * - startDate: Filter from date (ISO format)
 * - endDate: Filter to date (ISO format)
 */
router.get('/', async (req, res) => {
  try {
    const options = {
      limit: parseInt(req.query.limit) || 100,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    
    const sales = await salesService.getAllSales(options);
    res.status(200).json({ 
      success: true, 
      data: sales,
      count: sales.length 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get sales for a specific product by SKU
 * GET /api/sales/sku/:sku
 */
router.get('/sku/:sku', async (req, res) => {
  try {
    const sales = await salesService.getSalesBySku(req.params.sku);
    res.status(200).json({ 
      success: true, 
      data: sales,
      count: sales.length 
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * Get sales summary/analytics
 * GET /api/sales/summary
 * 
 * Query params:
 * - startDate: Filter from date (ISO format)
 * - endDate: Filter to date (ISO format)
 */
router.get('/summary', async (req, res) => {
  try {
    const options = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    
    const summary = await salesService.getSalesSummary(options);
    res.status(200).json({ 
      success: true, 
      data: summary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
