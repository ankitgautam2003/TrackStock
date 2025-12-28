import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './config/database.js';

// Import routes
import materialRoutes from './routes/materials.js';
import stockMovementRoutes from './routes/stockMovements.js';
import insightsRoutes from './routes/insights.js';
import salesRoutes from './routes/sales.js';

dotenv.config();

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
app.use(express.json());

// Routes
app.use('/api/materials', materialRoutes);
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/sales', salesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});
