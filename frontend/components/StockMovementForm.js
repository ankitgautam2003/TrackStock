'use client';

import { useState, useEffect } from 'react';
import { stockMovementsAPI, materialsAPI } from '@/lib/api';

export default function StockMovementForm({ onSuccess, type = 'INWARD' }) {
  const [formData, setFormData] = useState({
    materialId: '',
    type: type,
    quantity: '',
    reason: '',
    reference: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  // Load materials on mount
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await materialsAPI.getAll();
        setMaterials(response.data.data || []);
      } catch (err) {
        console.error('Failed to load materials:', err);
      } finally {
        setLoadingMaterials(false);
      }
    };
    loadMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'quantity') {
      // Only allow positive integers
      if (value === '') {
        processedValue = '';
      } else {
        const parsed = parseInt(value);
        processedValue = (!isNaN(parsed) && parsed > 0) ? parsed : formData.quantity;
      }
    }
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleTypeChange = (e) => {
    setFormData({
      ...formData,
      type: e.target.value,
      reason: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate quantity before submission
    if (!formData.quantity || formData.quantity <= 0) {
      setError('Please enter a valid quantity greater than 0');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      if (formData.type === 'DAMAGE') {
        await stockMovementsAPI.recordDamage({
          materialId: formData.materialId,
          quantity: formData.quantity,
          reason: formData.notes || 'Damage',
        });
      } else {
        await stockMovementsAPI.record(formData);
      }
      setFormData({
        materialId: '',
        type: type,
        quantity: '',
        reason: '',
        reference: '',
        notes: '',
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record movement');
    } finally {
      setLoading(false);
    }
  };

  const reasonOptions = {
    INWARD: ['Purchase', 'Return', 'Stock Transfer', 'Adjustment'],
    OUTWARD: ['Sales', 'Return to Supplier', 'Stock Transfer', 'Adjustment'],
    DAMAGE: ['Damage'],
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="text-2xl font-bold mb-6">Record Stock Movement</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="type">Movement Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleTypeChange}
            required
          >
            <option value="INWARD">Stock In (Inward)</option>
            <option value="OUTWARD">Stock Out (Outward)</option>
            <option value="DAMAGE">Mark as Damaged</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="materialId">Material *</label>
          {loadingMaterials ? (
            <div className="spinner"></div>
          ) : (
            <select
              id="materialId"
              name="materialId"
              value={formData.materialId}
              onChange={handleChange}
              required
            >
              <option value="">Select Material</option>
              {materials.map((material) => (
                <option key={material._id} value={material._id}>
                  {material.sku} - {material.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            placeholder="e.g., 50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason *</label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            disabled={formData.type === 'DAMAGE'}
          >
            <option value="">Select Reason</option>
            {reasonOptions[formData.type]?.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reference">Reference (PO/Invoice)</label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="e.g., PO-2025-001"
            disabled={formData.type === 'DAMAGE'}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <input
            type="text"
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading || loadingMaterials}>
        {loading ? 'Recording...' : 'Record Movement'}
      </button>
    </form>
  );
}
