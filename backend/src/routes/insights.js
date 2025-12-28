import express from 'express';
import { InsightsService } from '../services/InsightsService.js';

const router = express.Router();

// Instantiate service (no longer needs prisma)
const insightsService = new InsightsService();

// Get dashboard metrics
router.get('/dashboard', async (req, res) => {
  try {
    const metrics = await insightsService.getDashboardMetrics();
    res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get low stock alerts
router.get('/low-stock', async (req, res) => {
  try {
    const items = await insightsService.getLowStockAlerts();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dead stock items
router.get('/dead-stock', async (req, res) => {
  try {
    const items = await insightsService.getDeadStockItems();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get top moving SKUs
router.get('/top-skus', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skus = await insightsService.getTopMovingSkus(limit);
    res.status(200).json({ success: true, data: skus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get damaged inventory summary
router.get('/damaged-inventory', async (req, res) => {
  try {
    const summary = await insightsService.getDamagedInventorySummary();
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get category breakdown
router.get('/category-breakdown', async (req, res) => {
  try {
    const breakdown = await insightsService.getCategoryBreakdown();
    res.status(200).json({ success: true, data: breakdown });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get fast-moving items based on sales velocity
router.get('/fast-moving', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const items = await insightsService.getFastMovingItems(days);
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get comprehensive insights (all key insights in one call)
router.get('/comprehensive', async (req, res) => {
  try {
    const insights = await insightsService.getComprehensiveInsights();
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
