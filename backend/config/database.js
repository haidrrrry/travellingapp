const mongoose = require('mongoose');

class DatabaseConnection {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      return this.connection;
    }

    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/traveling-app';
      this.connection = await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      console.log('MongoDB connected successfully');
      return this.connection;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log('MongoDB disconnected');
    }
  }
}

// Singleton instance
const databaseConnection = new DatabaseConnection();

module.exports = databaseConnection; 