# AEC Materials Inventory Visibility System

A simple but meaningful inventory management solution for Indian Architecture, Engineering, and Construction (AEC) material businesses. Solves critical problems of inventory visibility, dead stock detection, and margin optimization.

## Problem Being Solved

Indian AEC material businesses (tiles, laminates, lighting, sanitaryware suppliers) face critical operational challenges:

- **Dead/Slow-Moving Inventory**: No visibility into which SKUs are moving vs. stagnant, tying up working capital
- **Overstocking Poor Performers**: Lack of data-driven inventory decisions leads to excess stock of slow-moving items
- **Untracked Damaged Stock**: Damage and loss go unrecorded, creating margin leaks
- **Low Profit Margins**: Inefficient inventory causes capital waste and opportunity costs
- **Scaling Hesitation**: Without inventory visibility, businesses can't confidently scale operations

This system provides real-time inventory visibility and actionable insights to solve these problems.

## Key Features

### 1. Inventory Management
- Create and maintain materials with:
  - SKU (unique identifier)
  - Name, Category, Supplier information
  - Unit pricing
  - Available vs. damaged quantity tracking
  - Reorder levels for automated alerts
- Edit and delete materials
- Search and filter by SKU, name, category

### 2. Stock Movement Tracking
- **Stock In (Inward)**: Record purchases, returns, restocking
- **Stock Out (Outward)**: Record sales, dispatches, transfers
- **Damage Recording**: Track damaged items separately
- Automatic quantity updates
- Reference tracking (PO numbers, invoice numbers)
- Complete movement history per material

### 3. Inventory Health & Insights
- **🚀 Fast-Moving Items**: Products with high sales velocity, restock early to avoid stockouts
  - Sales velocity tracking (units/day)
  - Days of stock remaining calculation
  - Recommended reorder quantities
  - Urgency-based prioritization (critical/high/medium)
- **📦 Dead Stock Detection**: Items with no sales in 30+ days identified
  - Tied-up capital calculation
  - Context-aware recommendations (discount, return, bundle)
  - Sorted by financial impact
- **⚠️ Low Stock Alerts**: Materials below reorder level highlighted
  - Real-time stock level monitoring
  - Days until stockout estimation
  - Urgency indicators based on sales velocity
- **Top Moving SKUs**: Identify best-performing materials by total movements
- **Damaged Inventory Summary**: Visualize loss from damage
- **Category Breakdown**: Inventory value and quantity by category
- **Dashboard Metrics**: 
  - Total inventory value
  - Total quantity on hand
  - Damaged items count
  - Low stock and dead stock counts
  - Fast-moving items count
  - Critical issues requiring immediate action

### 4. Sales Tracking
- Record sales transactions with automatic inventory reduction
- Sales history by product (SKU)
- Sales summary with total revenue and quantity sold
- Integration with stock movement audit trail

### 5. User Interface
- Clean, intuitive dashboard with key metrics
- **Insights Dashboard** with tabbed interface:
  - Overview: Action items and critical alerts
  - Fast-Moving: Products selling quickly
  - Dead Stock: Capital optimization opportunities
  - Low Stock: Reorder recommendations
- Material list with real-time status indicators
- Quick add/edit/delete operations
- Stock movement recording form with validation
- Insights page with analytics and breakdowns
- Responsive design (mobile-friendly)

## Technology Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB (NoSQL, horizontally scalable)
- **ODM**: Mongoose (schema validation, middleware)
- **Runtime**: Node.js (ES modules)

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React hooks

### Database Schema
- **Materials**: SKU, name, category, supplier, pricing, quantities, reorder level
- **StockMovements**: Timestamp, material reference, type (INWARD/OUTWARD), quantity, reason, reference

## Architecture

```
inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # MongoDB connection
│   │   ├── models/
│   │   │   ├── Material.js        # Material schema
│   │   │   └── StockMovement.js   # StockMovement schema
│   │   ├── routes/
│   │   │   ├── materials.js       # Material endpoints
│   │   │   ├── stockMovements.js  # Stock movement endpoints
│   │   │   └── insights.js        # Analytics endpoints
│   │   ├── services/
│   │   │   ├── MaterialService.js # Material business logic
│   │   │   ├── StockMovementService.js # Movement logic
│   │   │   └── InsightsService.js # Analytics logic
│   │   ├── index.js               # Express app setup
│   │   └── seed.js                # Demo data seeding
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── page.js                # Dashboard
│   │   ├── inventory/             # Inventory pages
│   │   ├── stock-movement/        # Stock movement pages
│   │   ├── insights/              # Analytics pages
│   │   └── layout.js              # Root layout
│   ├── components/
│   │   ├── Navigation.js          # Top navigation
│   │   ├── MaterialForm.js        # Material form
│   │   └── StockMovementForm.js   # Movement form
│   ├── lib/
│   │   └── api.js                 # API client
│   ├── styles/
│   │   └── globals.css            # Global styles
│   ├── package.json
│   └── .env.example
│
└── README.md

```

## How It Improves Inventory Visibility & Margins

### Visibility Improvements
1. **Real-time Stock Levels**: See available vs. damaged quantities instantly
2. **Movement Tracking**: Know exactly which materials are moving and at what velocity
3. **Dead Stock Detection**: Automatically identifies stagnant inventory holding up capital
4. **Category Analysis**: Understand inventory distribution by product category
5. **Damaged Inventory Tracking**: Quantify losses from damage

### Margin Improvements
1. **Reduce Overstocking**: Data shows which items slow-move, preventing excess purchase
2. **Capital Efficiency**: Identify dead stock early, reduce working capital tied-up
3. **Lower Carrying Costs**: Smaller overall inventory = lower storage, insurance, handling costs
4. **Prevent Markdown Losses**: Know slow-movers before they become obsolete
5. **Damage Awareness**: Track and reduce damage losses with visibility

## Installation & Setup

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (v6.0 or higher)
   - See [MONGODB_SETUP.md](MONGODB_SETUP.md) for detailed installation instructions
   - Options: Local installation, MongoDB Atlas (cloud), or Docker

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB connection string
# Example: MONGODB_URI=mongodb://localhost:27017/inventory-db

# Seed demo data
npm run seed

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:3000`

### Access the Application

- **Dashboard**: http://localhost:3000
- **API Health Check**: http://localhost:5000/api/health

## API Endpoints

### Materials
- `GET /api/materials` - Get all materials
- `POST /api/materials` - Create material
- `GET /api/materials/:id` - Get material by ID
- `GET /api/materials/sku/:sku` - Get material by SKU
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Stock Movements
- `GET /api/stock-movements` - Get all movements
- `POST /api/stock-movements` - Record movement (INWARD/OUTWARD)
- `GET /api/stock-movements/material/:materialId` - Get movements for material
- `GET /api/stock-movements/range?startDate=&endDate=` - Get movements by date range
- `POST /api/stock-movements/damage` - Record damaged items

### Insights
- `GET /api/insights/dashboard` - Dashboard metrics
- `GET /api/insights/low-stock` - Low stock alerts with urgency levels
- `GET /api/insights/dead-stock` - Dead stock items (no sales in 30 days)
- `GET /api/insights/fast-moving?days=30` - Fast-moving items by sales velocity
- `GET /api/insights/comprehensive` - All insights in one call (recommended)
- `GET /api/insights/top-skus?limit=10` - Top moving SKUs
- `GET /api/insights/damaged-inventory` - Damaged items summary
- `GET /api/insights/category-breakdown` - Inventory by category

### Sales
- `POST /api/sales` - Record sale (auto-reduces inventory)
- `GET /api/sales` - Get all sales
- `GET /api/sales/sku/:sku` - Get sales by product SKU
- `GET /api/sales/summary` - Sales summary (total revenue, quantity)

## Demo Data

The seed script creates:
- **21 Materials** across 7 categories (Tiles, Laminates, Lighting, Sanitaryware, Paints, Hardware, Other)
- **42 Stock Movements** with varied dates to demonstrate:
  - Fast-moving items (high sales velocity)
  - Dead stock detection (no sales in 30 days)
  - Low stock scenarios (below reorder level)
  - Damage tracking
  - Recent and historical movements

Quick test script creates:
- **4 Materials** with specific insights scenarios:
  - Fast-moving item with critical low stock
  - Dead stock with tied-up capital
  - Low stock requiring immediate reorder
  - Fast-moving item at reorder level

Run seed: `cd backend && npm run seed`
Run quick test: `cd backend && node test-insights.js`

## 📊 Insights Feature

The system provides three key insights based on sales history:

### 🚀 Fast-Moving Items
- Identifies products with high sales velocity (≥5 sales OR ≥20 units in 30 days)
- Calculates days of stock remaining
- Recommends reorder quantities (2-week buffer)
- Prevents stockouts of best-sellers

### 📦 Dead Stock
- Detects products with zero sales in 30 days
- Calculates tied-up capital
- Provides context-aware recommendations (discount, return, bundle)
- Helps optimize working capital

### ⚠️ Low Stock Alerts
- Monitors products below reorder level
- Estimates days until stockout based on sales velocity
- Prioritizes by urgency (critical/high/medium)
- Prevents lost sales opportunities

**Frontend Dashboard:** http://localhost:3000/insights

**API Endpoint (All-in-One):** `GET /api/insights/comprehensive`

**Documentation:**
- Full Guide: `INSIGHTS_GUIDE.md`
- Quick Reference: `INSIGHTS_QUICKREF.md`
- Implementation Summary: `INSIGHTS_SUMMARY.md`

Run `MongoDB Database**: Suitable for scalability. Can handle growing datasets efficiently

## Assumptions Made

1. **Single Admin User**: No authentication/authorization required. This is an admin-only system.
2. **Single Warehouse**: All inventory is in one location. No multi-warehouse support.
3. **SQLite Database**: Suitable for small-to-mid businesses. Easily upgradeable to PostgreSQL.
4. **Dead Stock Definition**: 30 days of no movement (configurable in InsightsService.js).
5. **Simple UI**: Focus on functionality and clarity, not design complexity.
6. **Minimal Validation**: Basic input validation. Can be enhanced with more rules.
7. **No Billing/Invoicing**: This tracks inventory only, not transactions or payments.

## Code Quality

- **Clean Architecture**: Separation of routes, controllers/handlers, services, and models
- **Meaningful Names**: Functions and variables clearly describe their purpose
- **Error Handling**: Proper HTTP status codes and error messages
- **No Over-Engineering**: Simple, pragmatic solutions to real problems
- **Documented Assumptions**: All design decisions explained

## Future Enhancements (Non-Goals for This Assignment)

- Multi-warehouse support
- User authentication and roles
- Automated reorder triggers
- Forecast/demand prediction
- Mobile app
- Integration with accounting systems
- Batch operations
- Advanced reporting/exports

## Non-Goals

This system explicitly avoids:
- Full ERP functionality
- Multi-warehouse logic
- User roles or permissions
- Billing, invoicing, or payment processing
- Over-engineered abstractions
- Complex design patterns

## Running in Production

For production deployment:

1. Use MongoDB Atlas or a managed MongoDB service
2. Add authentication middleware
3. Use environment-based configuration
4. Implement rate limiting
5. Add comprehensive logging
6. Use a proper process manager (PM2, systemd, etc.)
7. Set up database backups (mongodump)
8. Use a reverse proxy (nginx)
9. Enable CORS properly for your domain
10. Use HTTPS

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Node.js version (18+)
- **Ensure MongoDB is running** (see [MONGODB_SETUP.md](MONGODB_SETUP.md))
- Verify `MONGODB_URI` in `.env` is correct

### Frontend won't connect
- Verify backend is running on port 5000
- Check CORS_ORIGIN environment variable
- Verify API_URL in frontend .env matches backend

### Database errors
- **Check MongoDB connection**: Run `mongosh` to test connectivity
- Verify MongoDB service is running: `Get-Service MongoDB` (Windows)
- Check MongoDB logs for connection issues
- Run `npm run seed` to reload demo data

### MongoDB-specific issues
- See [MONGODB_SETUP.md](MONGODB_SETUP.md) for installation help
- For Prisma to MongoDB migration, see [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)

## Support

For issues or questions about this implementation, review the clean code structure - it's designed to be self-documenting.

---

**Built with simplicity and pragmatism for real business value.**
