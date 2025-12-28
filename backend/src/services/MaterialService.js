import { Material } from '../models/Material.js';
import { StockMovement } from '../models/StockMovement.js';
import { 
  validateSKU, 
  validateNonEmptyString, 
  validatePositiveNumber, 
  validateNonNegativeInteger 
} from '../utils/validators.js';

// Material service - contains business logic for materials
export class MaterialService {
  async createMaterial(data) {
    // Validate and sanitize required fields
    const sku = validateSKU(data.sku);
    const name = validateNonEmptyString(data.name, 'Name');
    const category = validateNonEmptyString(data.category, 'Category');
    const supplier = validateNonEmptyString(data.supplier, 'Supplier');
    const unitPrice = validatePositiveNumber(data.unitPrice, 'Unit Price');

    // Check if SKU already exists (case-insensitive)
    const existing = await Material.findOne({ 
      sku: new RegExp(`^${sku}$`, 'i') 
    });
    if (existing) {
      throw new Error(`Material with SKU ${sku} already exists`);
    }

    const material = new Material({
      sku,
      name,
      category,
      supplier,
      unitPrice,
      availableQuantity: 0, // Always initialize to 0, stock updates via movements only
      damagedQuantity: 0,
      reorderLevel: validateNonNegativeInteger(data.reorderLevel, 'Reorder Level') || 10,
    });

    return await material.save();
  }

  async updateMaterial(id, data) {
    const material = await Material.findById(id);
    if (!material) {
      throw new Error('Material not found');
    }

    // If SKU is being updated, validate and check for duplicates
    if (data.sku) {
      const sku = validateSKU(data.sku);
      if (sku.toUpperCase() !== material.sku.toUpperCase()) {
        const existing = await Material.findOne({ 
          sku: new RegExp(`^${sku}$`, 'i') 
        });
        if (existing) {
          throw new Error(`Material with SKU ${sku} already exists`);
        }
        material.sku = sku;
      }
    }

    // Update other fields with validation
    if (data.name) material.name = validateNonEmptyString(data.name, 'Name');
    if (data.category) material.category = validateNonEmptyString(data.category, 'Category');
    if (data.supplier) material.supplier = validateNonEmptyString(data.supplier, 'Supplier');
    if (data.unitPrice !== undefined) material.unitPrice = validatePositiveNumber(data.unitPrice, 'Unit Price');
    if (data.reorderLevel !== undefined) material.reorderLevel = validateNonNegativeInteger(data.reorderLevel, 'Reorder Level');

    // DO NOT allow direct quantity updates - these should only happen via stock movements
    // This prevents bypassing the audit trail

    return await material.save();
  }

  async getMaterial(id) {
    const material = await Material.findById(id).lean();
    
    if (!material) {
      throw new Error('Material not found');
    }

    // Get last 10 movements for this material
    const movements = await StockMovement.find({ materialId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      ...material,
      movements,
    };
  }

  async getAllMaterials() {
    return await Material.find().sort({ createdAt: -1 }).lean();
  }

  async deleteMaterial(id) {
    const material = await Material.findById(id);
    if (!material) {
      throw new Error('Material not found');
    }

    // Delete associated stock movements
    await StockMovement.deleteMany({ materialId: id });
    
    return await Material.findByIdAndDelete(id);
  }

  async getMaterialBySku(sku) {
    const material = await Material.findOne({ sku }).lean();
    if (!material) {
      throw new Error(`Material with SKU ${sku} not found`);
    }
    return material;
  }
}
