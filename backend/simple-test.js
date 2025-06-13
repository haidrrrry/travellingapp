const mongoose = require('mongoose');

// Your DigitalOcean MongoDB connection string
const MONGODB_URI = 'mongodb+srv://doadmin:Kr6I08ymRYD91732@private-db-mongodb-nyc2-32145-c68e7b33.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=db-mongodb-nyc2-32145&retryWrites=true&w=majority';

console.log('🔍 Testing DigitalOcean MongoDB connection...');
console.log('📍 Host: private-db-mongodb-nyc2-32145-c68e7b33.mongo.ondigitalocean.com');

// Set a shorter timeout for faster testing (moved to connect options)

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Now directly in connect options
})
  .then(() => {
    console.log('✅ Successfully connected to DigitalOcean MongoDB!');
    console.log('🎉 Your database is working!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('timed out')) {
      console.log('\n💡 This is likely an IP whitelist issue.');
      console.log('🔧 To fix this:');
      console.log('1. Go to DigitalOcean dashboard');
      console.log('2. Navigate to your MongoDB cluster');
      console.log('3. Go to "Settings" → "Trusted Sources"');
      console.log('4. Add your current IP address');
      console.log('5. Or temporarily allow "All IPs" for testing');
    }
    
    process.exit(1);
  }); 