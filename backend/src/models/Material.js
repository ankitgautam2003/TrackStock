import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  damagedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  reorderLevel: {
    type: Number,
    default: 10,
    min: 0,
  },
}, {
  timestamps: true, // Creates createdAt and updatedAt automatically
});

// Virtual for getting related movements
materialSchema.virtual('movements', {
  ref: 'StockMovement',
  localField: '_id',
  foreignField: 'materialId',
});

// Ensure virtuals are included when converting to JSON
materialSchema.set('toJSON', { virtuals: true });
materialSchema.set('toObject', { virtuals: true });

export const Material = mongoose.model('Material', materialSchema);
