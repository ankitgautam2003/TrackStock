import { Material } from '../models/Material.js';
import { StockMovement } from '../models/StockMovement.js';
import { validatePositiveInteger } from '../utils/validators.js';

// Stock Movement service - handles stock in/out operations
export class StockMovementService {
  async recordMovement(data) {
    const { materialId, type, quantity, reason, reference, notes } = data;

    // Validate required fields
    if (!materialId || !type || !quantity) {
      throw new Error('Missing required fields: materialId, type, quantity');
    }

    // Validate type
    if (!['INWARD', 'OUTWARD'].includes(type)) {
      throw new Error('Type must be either INWARD or OUTWARD');
    }

    // Check material exists
    const material = await Material.findById(materialId);
    if (!material) {
      throw new Error('Material not found');
    }

    // Validate quantity with proper NaN checking
    const parsedQuantity = validatePositiveInteger(quantity, 'Quantity');

    // Validate outward movement
    if (type === 'OUTWARD' && material.availableQuantity < parsedQuantity) {
      throw new Error(`Insufficient stock. Available: ${material.availableQuantity}, Requested: ${parsedQuantity}`);
    }

    // Create movement record
    const movement = new StockMovement({
      materialId,
      type,
      quantity: parsedQuantity,
      reason: reason || 'Manual adjustment',
      reference: reference || null,
      notes: notes || null,
    });

    await movement.save();

    // Update material quantity
    const newQuantity = type === 'INWARD'
      ? material.availableQuantity + parsedQuantity
      : material.availableQuantity - parsedQuantity;

    material.availableQuantity = newQuantity;
    await material.save();

    return movement;
  }

  async getMovementsByMaterial(materialId) {
    return await StockMovement.find({ materialId })
      .sort({ createdAt: -1 })
      .populate('materialId')
      .lean();
  }

  async getAllMovements(limit = 100) {
    return await StockMovement.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('materialId')
      .lean();
  }

  async getMovementsByDateRange(startDate, endDate) {
    return await StockMovement.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .sort({ createdAt: -1 })
      .populate('materialId')
      .lean();
  }

  async recordDamage(materialId, quantity, reason = 'Damage') {
    const material = await Material.findById(materialId);
    if (!material) {
      throw new Error('Material not found');
    }

    // Validate quantity with proper NaN checking
    const parsedQuantity = validatePositiveInteger(quantity, 'Quantity');

    if (material.availableQuantity < parsedQuantity) {
      throw new Error(`Insufficient stock to mark as damaged. Available: ${material.availableQuantity}`);
    }

    // Create outward movement record for damage
    const movement = new StockMovement({
      materialId,
      type: 'OUTWARD',
      quantity: parsedQuantity,
      reason: 'Damage',
      notes: reason,
    });

    await movement.save();

    // Update quantities
    material.availableQuantity -= parsedQuantity;
    material.damagedQuantity += parsedQuantity;
    await material.save();

    return movement;
  }
}
