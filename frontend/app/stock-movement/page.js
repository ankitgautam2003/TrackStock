'use client';

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import StockMovementForm from '@/components/StockMovementForm';
import { stockMovementsAPI } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function StockMovementPage() {
  const searchParams = useSearchParams();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          {loading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : movements.length === 0 ? (
            <p className="text-gray-500">No movements recorded yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>SKU</th>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Reason</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
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
