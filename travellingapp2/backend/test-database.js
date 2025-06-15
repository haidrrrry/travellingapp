const mongoose = require('mongoose');

// Your DigitalOcean MongoDB connection string
const MONGODB_URI = 'mongodb+srv://doadmin:Kr6I08ymRYD91732@private-db-mongodb-nyc2-32145-c68e7b33.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-nyc2-32145&retryWrites=true&w=majority';

async function testDatabaseConnection() {
  console.log('🔍 Testing DigitalOcean MongoDB connection...');
  console.log('📍 Host: private-db-mongodb-nyc2-32145-c68e7b33.mongo.ondigitalocean.com');
  console.log('🌍 Region: NYC2 (New York)');
  console.log('📊 Database: admin');
  
  try {
    // Connect to MongoDB
    console.log('\n🔄 Connecting to database...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to DigitalOcean MongoDB!');
    
    // Test basic operations
    console.log('\n🧪 Testing basic database operations...');
    
    // Get database info
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    
    // Get server info
    const serverInfo = await adminDb.serverInfo();
    console.log('📋 Server Version:', serverInfo.version);
    console.log('🏗️ MongoDB Version:', serverInfo.mongodbVersion);
    
    // List databases
    const databases = await adminDb.listDatabases();
    console.log('\n📚 Available databases:');
    databases.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Test creating a collection
    console.log('\n🔄 Testing collection creation...');
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: 'Database connection test successful'
    });
    console.log('✅ Successfully created test document');
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('🧹 Cleaned up test document');
    
    console.log('\n🎉 All database tests passed! Your DigitalOcean MongoDB is working perfectly.');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error('Error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.log('\n💡 Possible solutions:');
      console.log('1. Check if your IP is whitelisted in DigitalOcean');
      console.log('2. Verify the connection string is correct');
      console.log('3. Check if the database cluster is running');
      console.log('4. Verify username and password');
    }
    
    if (error.name === 'MongoNetworkError') {
      console.log('\n💡 Network-related issues:');
      console.log('1. Check your internet connection');
      console.log('2. Verify the hostname is correct');
      console.log('3. Check if port 27017 is accessible');
    }
    
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 Database connection closed.');
    }
  }
}

// Run the test
testDatabaseConnection(); 