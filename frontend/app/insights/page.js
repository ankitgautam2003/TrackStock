'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { insightsAPI } from '@/lib/api';

export default function InsightsPage() {
  const [comprehensiveInsights, setComprehensiveInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const res = await insightsAPI.getComprehensiveInsights();
        setComprehensiveInsights(res.data.data);
      } catch (err) {
        setError('Failed to load insights');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

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
        </div>
      </div>
    );
  }

  const { summary, fastMovingItems, deadStockItems, lowStockItems } = comprehensiveInsights || {};

  return (
    <div>
      <Navigation />
      <div className="container">
        <h1 className="text-4xl font-bold mb-8">Inventory Insights</h1>

        {/* Summary Cards */}
        <div className="metrics-grid mb-8">
          <div className="metric-card">
            <div className="metric-label">Fast-Moving Items</div>
            <div className="metric-value text-green-600">{summary?.fastMovingCount || 0}</div>
            <div className="metric-hint">High sales velocity</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Dead Stock Items</div>
            <div className="metric-value text-orange-600">{summary?.deadStockCount || 0}</div>
            <div className="metric-hint">No sales in 30 days</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Low Stock Alerts</div>
            <div className="metric-value text-red-600">{summary?.lowStockCount || 0}</div>
            <div className="metric-hint">Below reorder level</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Critical Issues</div>
            <div className="metric-value text-red-700">{summary?.totalIssues || 0}</div>
            <div className="metric-hint">Needs immediate action</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('fast-moving')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'fast-moving'
                ? 'border-b-2 border-green-600 text-green-600'
                : 'text-gray-600'
            }`}
          >
            Fast-Moving ({fastMovingItems?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('dead-stock')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'dead-stock'
                ? 'border-b-2 border-orange-600 text-orange-600'
                : 'text-gray-600'
            }`}
          >
            Dead Stock ({deadStockItems?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('low-stock')}
            className={`px-4 py-2 font-semibold ${
              activeTab === 'low-stock'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600'
            }`}
          >
            Low Stock ({lowStockItems?.length || 0})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Action Items</h2>
              <div className="space-y-4">
                {lowStockItems && lowStockItems.length > 0 && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-600 rounded">
                    <h3 className="font-bold text-red-800 mb-2">🔴 {lowStockItems.length} Critical Low Stock Alert(s)</h3>
                    <p className="text-sm text-red-700">Immediate reorder required to avoid stockout</p>
                  </div>
                )}
                {fastMovingItems && fastMovingItems.filter(i => i.urgency === 'critical').length > 0 && (
                  <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
                    <h3 className="font-bold text-green-800 mb-2">🟢 {fastMovingItems.filter(i => i.urgency === 'critical').length} Fast-Moving Item(s) Running Low</h3>
                    <p className="text-sm text-green-700">Restock early to maintain sales momentum</p>
                  </div>
                )}
                {deadStockItems && deadStockItems.length > 0 && (
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-600 rounded">
                    <h3 className="font-bold text-orange-800 mb-2">🟠 {deadStockItems.length} Dead Stock Item(s)</h3>
                    <p className="text-sm text-orange-700">Capital tied up — consider discount or promotions</p>
                  </div>
                )}
                {(!lowStockItems || lowStockItems.length === 0) &&
                 (!fastMovingItems || fastMovingItems.filter(i => i.urgency === 'critical').length === 0) &&
                 (!deadStockItems || deadStockItems.length === 0) && (
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                    <h3 className="font-bold text-blue-800 mb-2">All Clear</h3>
                    <p className="text-sm text-blue-700">No critical issues detected. Inventory is healthy!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fast-Moving Tab */}
        {activeTab === 'fast-moving' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Fast-Moving Items</h2>
            <p className="text-gray-600 mb-6">
              Products with high sales velocity in the last 30 days. Restock early to avoid stockouts.
            </p>
            {!fastMovingItems || fastMovingItems.length === 0 ? (
              <p className="text-gray-500">No fast-moving items detected</p>
            ) : (
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Name</th>
                      <th>Current Stock</th>
                      <th>Sales Velocity</th>
                      <th>Total Sold (30d)</th>
                      <th>Days Remaining</th>
                      <th>Urgency</th>
                      <th>Reorder Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fastMovingItems.map((item) => (
                      <tr key={item._id}>
                        <td className="font-mono font-bold">{item.sku}</td>
                        <td>{item.name}</td>
                        <td>{item.availableQuantity}</td>
                        <td className="font-bold text-green-600">
                          {item.salesMetrics.salesVelocity} units/day
                        </td>
                        <td>{item.salesMetrics.totalQuantitySold} units</td>
                        <td className={item.stockStatus.daysOfStockRemaining <= 7 ? 'text-red-600 font-bold' : ''}>
                          {item.stockStatus.daysOfStockRemaining === 999 
                            ? 'Stable' 
                            : `${item.stockStatus.daysOfStockRemaining} days`}
                        </td>
                        <td>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            item.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                            item.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {item.urgency.toUpperCase()}
                          </span>
                        </td>
                        <td>{item.stockStatus.recommendedReorderQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Dead Stock Tab */}
        {activeTab === 'dead-stock' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Dead Stock Items</h2>
            <p className="text-gray-600 mb-6">
              Products with zero sales in the last 30 days. Consider discounts or promotions.
            </p>
            {!deadStockItems || deadStockItems.length === 0 ? (
              <p className="text-gray-500">No dead stock detected</p>
            ) : (
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Name</th>
                      <th>Current Stock</th>
                      <th>Unit Price</th>
                      <th>Tied-Up Capital</th>
                      <th>Days Inactive</th>
                      <th>Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deadStockItems.map((item) => (
                      <tr key={item._id}>
                        <td className="font-mono font-bold">{item.sku}</td>
                        <td>{item.name}</td>
                        <td>{item.availableQuantity}</td>
                        <td>₹{item.unitPrice}</td>
                        <td className="font-bold text-orange-600">₹{item.tiedUpCapital}</td>
                        <td>{item.daysInactive} days</td>
                        <td className="text-sm text-gray-600">{item.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Low Stock Tab */}
        {activeTab === 'low-stock' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Low Stock Alerts</h2>
            <p className="text-gray-600 mb-6">
              Products below reorder level. Immediate action required to prevent stockouts.
            </p>
            {!lowStockItems || lowStockItems.length === 0 ? (
              <p className="text-gray-500">No low stock alerts</p>
            ) : (
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Name</th>
                      <th>Current Stock</th>
                      <th>Reorder Level</th>
                      <th>Unit Price</th>
                      <th>Urgency</th>
                      <th>Est. Stockout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map((item) => (
                      <tr key={item._id}>
                        <td className="font-mono font-bold">{item.sku}</td>
                        <td>{item.name}</td>
                        <td className="font-bold text-red-600">{item.availableQuantity}</td>
                        <td>{item.reorderLevel}</td>
                        <td>₹{item.unitPrice}</td>
                        <td>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            item.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                            item.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.urgency.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {item.daysUntilStockout !== null 
                            ? `${item.daysUntilStockout} days` 
                            : 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
