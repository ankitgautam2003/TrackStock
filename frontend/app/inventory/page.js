'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import MaterialForm from '@/components/MaterialForm';
import { materialsAPI } from '@/lib/api';
import Link from 'next/link';

export default function InventoryPage() {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = ['Tiles', 'Laminates', 'Lighting', 'Sanitaryware', 'Paints'];

  const loadMaterials = async () => {
    try {
      const response = await materialsAPI.getAll();
      setMaterials(response.data.data || []);
      setFilteredMaterials(response.data.data || []);
    } catch (err) {
      setError('Failed to load materials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((m) => m.category === categoryFilter);
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, categoryFilter, materials]);

  const handleDeleteMaterial = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) return;

    try {
      await materialsAPI.delete(id);
      loadMaterials();
    } catch (err) {
      setError('Failed to delete material');
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Inventory Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary w-full sm:w-auto"
          >
            {showForm ? '✕ Cancel' : '➕ Add Material'}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {showForm && (
          <MaterialForm
            onSuccess={() => {
              setShowForm(false);
              loadMaterials();
            }}
          />
        )}

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="search">Search by SKU or Name</label>
              <input
                type="text"
                id="search"
                placeholder="e.g., TILE-001 or Ceramic"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Filter by Category</label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="card">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Materials ({filteredMaterials.length})
          </h2>
          {filteredMaterials.length === 0 ? (
            <p className="text-gray-500">No materials found</p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th className="hidden sm:table-cell">SKU</th>
                    <th>Name</th>
                    <th className="hidden md:table-cell">Category</th>
                    <th className="hidden lg:table-cell">Supplier</th>
                    <th className="hidden md:table-cell">Unit Price</th>
                    <th>Available</th>
                    <th className="hidden sm:table-cell">Damaged</th>
                    <th className="hidden lg:table-cell">Reorder Level</th>
                    <th className="hidden md:table-cell">Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map((material) => {
                    const isLowStock = material.availableQuantity <= material.reorderLevel;
                    const isDamaged = material.damagedQuantity > 0;

                    return (
                      <tr key={material.id}>
                        <td className="font-mono font-bold hidden sm:table-cell">{material.sku}</td>
                        <td>{material.name}</td>
                        <td className="hidden md:table-cell">{material.category}</td>
                        <td className="hidden lg:table-cell">{material.supplier}</td>
                        <td className="hidden md:table-cell">₹{material.unitPrice}</td>
                        <td>{material.availableQuantity}</td>
                        <td className={`hidden sm:table-cell ${isDamaged ? 'text-red-600 font-bold' : ''}`}>
                          {material.damagedQuantity}
                        </td>
                        <td className="hidden lg:table-cell">{material.reorderLevel}</td>
                        <td className="hidden md:table-cell">
                          {isLowStock && (
                            <span className="badge badge-low">Low Stock</span>
                          )}
                          {isDamaged && (
                            <span className="badge badge-danger">Damage</span>
                          )}
                        </td>
                        <td>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                              href={`/inventory/${material.id}`}
                              className="btn btn-secondary btn-small text-center"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteMaterial(material.id)}
                              className="btn btn-danger btn-small"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
