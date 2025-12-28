'use client';

import { useState } from 'react';
import { materialsAPI } from '@/lib/api';

export default function MaterialForm({ onSuccess, initialData = null }) {
  const [formData, setFormData] = useState(
    initialData || {
      sku: '',
      name: '',
      category: '',
      supplier: '',
      unitPrice: '',
      availableQuantity: 0,
      damagedQuantity: 0,
      reorderLevel: 10,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Trim and normalize string inputs
    if (name === 'sku') {
      processedValue = value.trim().toUpperCase();
    } else if (name === 'name' || name === 'category' || name === 'supplier') {
      processedValue = value.trimStart(); // Allow trailing spaces while typing
    } else if (name === 'unitPrice' || name === 'reorderLevel') {
      processedValue = value === '' ? '' : parseFloat(value) || '';
    }
    
    setFormData({
      ...formData,
      [name]: processedValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Trim all string values before submitting
      const sanitizedData = {
        ...formData,
        sku: formData.sku.trim().toUpperCase(),
        name: formData.name.trim(),
        category: formData.category.trim(),
        supplier: formData.supplier.trim(),
      };

      if (initialData && initialData.id) {
        await materialsAPI.update(initialData.id, sanitizedData);
      } else {
        await materialsAPI.create(sanitizedData);
      }
      setFormData({
        sku: '',
        name: '',
        category: '',
        supplier: '',
        unitPrice: '',
        availableQuantity: 0,
        damagedQuantity: 0,
        reorderLevel: 10,
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? 'Update Material' : 'Add New Material'}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-group">
          <label htmlFor="sku">SKU *</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            required
            disabled={!!initialData}
            placeholder="e.g., TILE-001"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Material Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Ceramic Floor Tile 60x60"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Tiles">Tiles</option>
            <option value="Laminates">Laminates</option>
            <option value="Lighting">Lighting</option>
            <option value="Sanitaryware">Sanitaryware</option>
            <option value="Paints">Paints</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="supplier">Supplier *</label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            placeholder="e.g., Supreme Ceramics"
          />
        </div>

        <div className="form-group">
          <label htmlFor="unitPrice">Unit Price (₹) *</label>
          <input
            type="number"
            id="unitPrice"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="e.g., 450"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reorderLevel">Reorder Level</label>
          <input
            type="number"
            id="reorderLevel"
            name="reorderLevel"
            value={formData.reorderLevel}
            onChange={handleChange}
            min="0"
            step="1"
            placeholder="e.g., 10"
          />
          <small className="text-gray-600">Alert when stock falls below this level</small>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Material' : 'Add Material'}
      </button>
    </form>
  );
}
