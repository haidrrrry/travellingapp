const mongoose = require('mongoose');

class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.connection && this.isConnected) {
      return this.connection;
    }

    try {
      console.log('🔄 Connecting to MongoDB...');

      // Prioritize DigitalOcean App Platform's DATABASE_URL
      const mongoURI = process.env.DATABASE_URL || process.env.MONGODB_URI;

      if (!mongoURI) {
        throw new Error('MongoDB connection URI is not defined in environment variables.');
      }

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 15000, // Reduced timeout for faster feedback
        socketTimeoutMS: 45000,
        bufferCommands: false,
      };

      // Add CA certificate for DigitalOcean TLS connection if available
      if (process.env.CA_CERT) {
        options.tlsCAFile = process.env.CA_CERT;
        console.log('🔐 Using CA_CERT for TLS connection.');
      }

      this.connection = await mongoose.connect(mongoURI, options);
      this.isConnected = true;

      const { name, host } = this.connection.connection;

      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Database: ${name}`);
      console.log(`🌐 Host: ${host}`);

      // Connection events
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
        this.isConnected = true;
      });

      return this.connection;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    if (this.connection && this.isConnected) {
      await mongoose.disconnect();
      this.connection = null;
      this.isConnected = false;
      console.log('✅ MongoDB disconnected');
    }
  }

  getConnectionStatus() {
    const conn = mongoose.connection;
    return {
      isConnected: this.isConnected,
      readyState: conn.readyState,
      host: conn.host || 'N/A',
      name: conn.name || 'N/A'
    };
  }
}

module.exports = new DatabaseConnection();
