'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { insightsAPI } from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [deadStockItems, setDeadStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardRes, lowStockRes, deadStockRes] = await Promise.all([
          insightsAPI.getDashboard(),
          insightsAPI.getLowStock(),
          insightsAPI.getDeadStock(),
        ]);

        setMetrics(dashboardRes.data.data);
        setLowStockItems(lowStockRes.data.data);
        setDeadStockItems(deadStockRes.data.data);
      } catch (err) {
        setError('Failed to load dashboard. Please check your internet connection or try again later.');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container">
          <div className="flex justify-center items-center h-64">
            <div className="spinner"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Dashboard</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Metrics Grid */}
        {metrics && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Total Materials</div>
              <div className="metric-value">{metrics.totalMaterials}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Total Quantity</div>
              <div className="metric-value">{metrics.totalQuantity}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Inventory Value</div>
              <div className="metric-value text-sm sm:text-2xl">₹{metrics.totalValue.toLocaleString()}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Damaged Items</div>
              <div className="metric-value text-red-600">{metrics.totalDamaged}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Low Stock Alerts</div>
              <div className="metric-value text-yellow-600">{metrics.lowStockCount}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Dead Stock Items</div>
              <div className="metric-value text-orange-600">{metrics.deadStockCount}</div>
            </div>
          </div>
        )}

        {/* Low Stock Alerts */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Low Stock Alerts</h2>
            <Link href="/inventory" className="btn btn-primary btn-small w-full sm:w-auto text-center">
              View All
            </Link>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500">No items below reorder level</p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th className="hidden sm:table-cell">SKU</th>
                    <th>Name</th>
                    <th>Current Stock</th>
                    <th className="hidden md:table-cell">Reorder Level</th>
                    <th className="hidden lg:table-cell">Unit Price</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono font-bold hidden sm:table-cell">{item.sku}</td>
                      <td>{item.name}</td>
                      <td>
                        <span className="badge badge-low">{item.availableQuantity}</span>
                      </td>
                      <td className="hidden md:table-cell">{item.reorderLevel}</td>
                      <td className="hidden lg:table-cell">₹{item.unitPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dead Stock Items */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">Dead Stock (Inactive 30+ days)</h2>
            <Link href="/insights" className="btn btn-primary btn-small w-full sm:w-auto text-center">
              View All
            </Link>
          </div>
          {deadStockItems.length === 0 ? (
            <p className="text-gray-500">No dead stock detected</p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th className="hidden sm:table-cell">SKU</th>
                    <th>Name</th>
                    <th>Stock Quantity</th>
                    <th className="hidden md:table-cell">Unit Price</th>
                    <th className="hidden lg:table-cell">Stock Value</th>
                  </tr>
                </thead>
                <tbody>
                  {deadStockItems.slice(0, 5).map((item) => (
                    <tr key={item.id}>
                      <td className="font-mono font-bold hidden sm:table-cell">{item.sku}</td>
                      <td>{item.name}</td>
                      <td>{item.availableQuantity}</td>
                      <td className="hidden md:table-cell">₹{item.unitPrice}</td>
                      <td className="font-bold hidden lg:table-cell">₹{(item.availableQuantity * item.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/inventory/add" className="btn btn-primary text-center">
              ➕ Add Material
            </Link>
            <Link href="/stock-movement?type=INWARD" className="btn btn-primary text-center">
              📥 Stock In
            </Link>
            <Link href="/stock-movement?type=OUTWARD" className="btn btn-primary text-center">
              📤 Stock Out
            </Link>
            <Link href="/insights" className="btn btn-secondary text-center">
              📈 View Analytics
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
