import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-db';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}
