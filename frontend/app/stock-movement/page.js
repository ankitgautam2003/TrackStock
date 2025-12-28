'use client';

export const dynamic = 'force-dynamic';

import Navigation from '@/components/Navigation';
import StockMovementForm from '@/components/StockMovementForm';
import { stockMovementsAPI } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function StockMovementPage() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: 'createdAt', order: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const loadMovements = async () => {
    try {
      const response = await stockMovementsAPI.getAll(100);
      setMovements(response.data.data || []);
    } catch (err) {
      setError('Failed to load movements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const getTypeColor = (type) => {
    return type === 'INWARD' ? 'badge-high' : 'badge-low';
  };

  const handleSort = (field) => {
    setSortConfig({
      field,
      order: sortConfig.field === field && sortConfig.order === 'asc' ? 'desc' : 'asc'
    });
  };

  const getFilteredAndSortedMovements = () => {
    let filtered = movements;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.materialId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.materialId?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(m => m.type === typeFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      // Handle nested fields
      if (sortConfig.field === 'material') {
        aValue = a.materialId?.name || '';
        bValue = b.materialId?.name || '';
      } else if (sortConfig.field === 'sku') {
        aValue = a.materialId?.sku || '';
        bValue = b.materialId?.sku || '';
      }

      if (typeof aValue === 'string') {
        return sortConfig.order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.order === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  };

  const filteredMovements = getFilteredAndSortedMovements();

  return (
    <div>
      <Navigation />
      <div className="container">
        <h1 className="text-4xl font-bold mb-8">Stock Movement</h1>

        <StockMovementForm
          onSuccess={() => {
            loadMovements();
          }}
        />

        {/* Movement History */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Recent Movements</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <input
                type="text"
                placeholder="Search by SKU, Material or Reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="form-group">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full"
              >
                <option value="">All Types</option>
                <option value="INWARD">INWARD</option>
                <option value="OUTWARD">OUTWARD</option>
                <option value="DAMAGE">DAMAGE</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : filteredMovements.length === 0 ? (
            <p className="text-gray-500">No movements found</p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th 
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('createdAt')}
                    >
                      Date {sortConfig.field === 'createdAt' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('type')}
                    >
                      Type {sortConfig.field === 'type' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('sku')}
                    >
                      SKU {sortConfig.field === 'sku' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('material')}
                    >
                      Material {sortConfig.field === 'material' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort('quantity')}
                    >
                      Quantity {sortConfig.field === 'quantity' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>Reason</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((movement) => (
                    <tr key={movement._id}>
                      <td>{new Date(movement.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getTypeColor(movement.type)}`}>
                          {movement.type}
                        </span>
                      </td>
                      <td className="font-mono font-bold">{movement.materialId?.sku || 'N/A'}</td>
                      <td>{movement.materialId?.name || 'N/A'}</td>
                      <td className="font-bold">{movement.quantity}</td>
                      <td>{movement.reason}</td>
                      <td className="text-sm text-gray-600">{movement.reference || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
