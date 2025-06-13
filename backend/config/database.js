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
      
      // Get connection URI
      let mongoURI = process.env.DATABASE_URL || process.env.MONGODB_URI;
      
      if (!mongoURI) {
        throw new Error('MongoDB connection URI is not defined in environment variables (DATABASE_URL or MONGODB_URI).');
      }

      // Clean up the URI in case it has the variable name prefix (common mistake)
      if (mongoURI.startsWith('MONGODB_URI=')) {
        mongoURI = mongoURI.replace('MONGODB_URI=', '');
        console.log('⚠️  Removed MONGODB_URI= prefix from connection string');
      }
      if (mongoURI.startsWith('DATABASE_URL=')) {
        mongoURI = mongoURI.replace('DATABASE_URL=', '');
        console.log('⚠️  Removed DATABASE_URL= prefix from connection string');
      }

      // Validate URI format
      if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
        throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
      }

      // For DigitalOcean, ensure proper connection string format
      if (mongoURI.includes('mongo.ondigitalocean.com') && !mongoURI.includes('mongodb+srv://')) {
        // If it's a standard mongodb:// URI, convert to mongodb+srv://
        mongoURI = mongoURI.replace('mongodb://', 'mongodb+srv://');
      }

      // Ensure TLS is enabled for DigitalOcean
      if (mongoURI.includes('mongo.ondigitalocean.com') && !mongoURI.includes('tls=true')) {
        const separator = mongoURI.includes('?') ? '&' : '?';
        mongoURI += `${separator}tls=true`;
      }

      // Log sanitized URI for debugging (without password)
      const sanitizedURI = mongoURI.replace(/:([^:@]*@)/, ':****@');
      console.log('🔗 Attempting connection to:', sanitizedURI);

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000, // Increased timeout for DigitalOcean
        socketTimeoutMS: 45000,
        bufferCommands: false,
        retryWrites: true,
        // DigitalOcean MongoDB settings
        authSource: 'admin',
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
        console.error('❌ MongoDB connection error:', error.message);
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
      console.error('❌ MongoDB connection failed:');
      console.error('Error message:', error.message);
      
      // Provide specific guidance based on error type
      if (error.message.includes('Authentication failed')) {
        console.error('🔍 Authentication troubleshooting:');
        console.error('   - Verify username and password are correct');
        console.error('   - Check if password contains special characters that need URL encoding');
        console.error('   - Ensure database user exists and has proper permissions');
        console.error('   - For Atlas: verify IP whitelist includes your server IP');
      } else if (error.message.includes('Invalid scheme')) {
        console.error('🔍 URI format troubleshooting:');
        console.error('   - Ensure URI starts with mongodb:// or mongodb+srv://');
        console.error('   - Check .env file format: MONGODB_URI=mongodb+srv://...');
        console.error('   - Verify no extra prefixes in environment variable');
      }
      
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
      readyStateString: this.getReadyStateString(conn.readyState),
      host: conn.host || 'N/A',
      name: conn.name || 'N/A'
    };
  }

  getReadyStateString(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }

  // Test connection method
  async testConnection() {
    try {
      const status = this.getConnectionStatus();
      console.log('📊 Connection Status:', status);
      
      if (this.isConnected) {
        // Try a simple operation
        const admin = mongoose.connection.db.admin();
        const result = await admin.ping();
        console.log('🏓 Ping successful:', result);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new DatabaseConnection();
