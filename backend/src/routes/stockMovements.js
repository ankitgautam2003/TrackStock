import express from 'express';
import { StockMovementService } from '../services/StockMovementService.js';

const router = express.Router();

// Instantiate service (no longer needs prisma)
const stockMovementService = new StockMovementService();

// Record a stock movement (inward/outward)
router.post('/', async (req, res) => {
  try {
    const movement = await stockMovementService.recordMovement(req.body);
    res.status(201).json({ success: true, data: movement });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all movements (paginated)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const movements = await stockMovementService.getAllMovements(limit);
    res.status(200).json({ success: true, data: movements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get movements for a specific material
router.get('/material/:materialId', async (req, res) => {
  try {
    const movements = await stockMovementService.getMovementsByMaterial(req.params.materialId);
    res.status(200).json({ success: true, data: movements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get movements by date range
router.get('/range/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        error: 'startDate and endDate query parameters are required' 
      });
    }
    const movements = await stockMovementService.getMovementsByDateRange(startDate, endDate);
    res.status(200).json({ success: true, data: movements });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Record damage
router.post('/damage', async (req, res) => {
  try {
    const { materialId, quantity, reason } = req.body;
    const movement = await stockMovementService.recordDamage(materialId, quantity, reason);
    res.status(201).json({ success: true, data: movement });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
