import express from 'express';
import { MaterialService } from '../services/MaterialService.js';

const router = express.Router();

// Instantiate service (no longer needs prisma)
const materialService = new MaterialService();

// Create a new material
router.post('/', async (req, res) => {
  try {
    const material = await materialService.createMaterial(req.body);
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all materials
router.get('/', async (req, res) => {
  try {
    const materials = await materialService.getAllMaterials();
    res.status(200).json({ success: true, data: materials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single material by ID
router.get('/:id', async (req, res) => {
  try {
    const material = await materialService.getMaterial(req.params.id);
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Update material
router.put('/:id', async (req, res) => {
  try {
    const material = await materialService.updateMaterial(req.params.id, req.body);
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete material
router.delete('/:id', async (req, res) => {
  try {
    const material = await materialService.deleteMaterial(req.params.id);
    res.status(200).json({ success: true, data: { message: 'Material deleted successfully' } });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Get material by SKU
router.get('/sku/:sku', async (req, res) => {
  try {
    const material = await materialService.getMaterialBySku(req.params.sku);
    res.status(200).json({ success: true, data: material });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

export default router;
