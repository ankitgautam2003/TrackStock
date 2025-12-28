import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  materialId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['INWARD', 'OUTWARD'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  reason: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    default: null,
  },
  notes: {
    type: String,
    default: null,
  },
}, {
  timestamps: true, // Creates createdAt and updatedAt automatically
});

// Index for efficient queries
stockMovementSchema.index({ createdAt: -1 });

export const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
