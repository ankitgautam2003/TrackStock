'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import MaterialForm from '@/components/MaterialForm';
import { materialsAPI } from '@/lib/api';
import Link from 'next/link';

export default function EditMaterialPage() {
  const params = useParams();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movements, setMovements] = useState([]);

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        const response = await materialsAPI.getById(params.id);
        setMaterial(response.data.data);
        setMovements(response.data.data.movements || []);
      } catch (err) {
        setError('Failed to load material');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMaterial();
  }, [params.id]);

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

  if (error) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <Link href="/inventory" className="btn btn-primary">
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container">
        <Link href="/inventory" className="text-blue-600 hover:text-blue-800 mb-4">
          ← Back to Inventory
        </Link>

        {material && (
          <>
            <MaterialForm
              initialData={material}
              onSuccess={() => {
                alert('Material updated successfully!');
              }}
            />

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">📋 Stock Movement History</h2>
              {movements.length === 0 ? (
                <p className="text-gray-500">No movements recorded</p>
              ) : (
                <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Reason</th>
                        <th>Reference</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movements.map((movement) => (
                        <tr key={movement._id}>
                          <td>{new Date(movement.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span
                              className={
                                movement.type === 'INWARD'
                                  ? 'badge badge-high'
                                  : 'badge badge-low'
                              }
                            >
                              {movement.type}
                            </span>
                          </td>
                          <td className="font-bold">{movement.quantity}</td>
                          <td>{movement.reason}</td>
                          <td className="font-mono text-sm">{movement.reference || '-'}</td>
                          <td>{movement.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
