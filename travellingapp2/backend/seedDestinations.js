const mongoose = require('mongoose');
const Destination = require('./models/Destination');
require('dotenv').config();

const famousDestinations = [
  {
    "name": "Eiffel Tower",
    "location": "Paris, France",
    "price": 300,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg"
  },
  {
    "name": "Great Wall",
    "location": "Beijing, China",
    "price": 450,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/10/2016_Mutianyu_Great_Wall_02.jpg"
  },
  {
    "name": "Statue of Liberty",
    "location": "New York, USA",
    "price": 350,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg"
  },
  {
    "name": "Colosseum",
    "location": "Rome, Italy",
    "price": 400,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg"
  },
  {
    "name": "Machu Picchu",
    "location": "Cusco, Peru",
    "price": 500,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg"
  },
  {
    "name": "Sydney Opera House",
    "location": "Sydney, Australia",
    "price": 370,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/4/40/Sydney_Opera_House_Sails.jpg"
  },
  {
    "name": "Burj Khalifa",
    "location": "Dubai, UAE",
    "price": 420,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/93/Burj_Khalifa.jpg"
  },
  {
    "name": "Christ the Redeemer",
    "location": "Rio, Brazil",
    "price": 330,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/97/Cristo_Redentor_-_Rio.jpg"
  },
  {
    "name": "Big Ben",
    "location": "London, UK",
    "price": 310,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Elizabeth_Tower_from_London_Eye_-_Sept_2006.jpg"
  },
  {
    "name": "Mount Fuji",
    "location": "Honshu, Japan",
    "price": 390,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/12/Mount_Fuji_from_Hotel_Mt_Fuji.jpg"
  },
  {
    "name": "Santorini",
    "location": "Greece",
    "price": 430,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/a/a5/Santorini_-_Thera.jpg"
  },
  {
    "name": "Niagara Falls",
    "location": "Ontario, Canada",
    "price": 340,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Niagara_Falls_2013.jpg"
  },
  {
    "name": "Petra",
    "location": "Ma'an, Jordan",
    "price": 460,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/18/Al_Khazneh_Petra_Edit_1.jpg"
  },
  {
    "name": "Banff National Park",
    "location": "Alberta, Canada",
    "price": 320,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Lake_Louise_Banff_National_Park.jpg"
  },
  {
    "name": "Taj Mahal",
    "location": "Agra, India",
    "price": 280,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg"
  },
  {
    "name": "Chichen Itza",
    "location": "Yucatan, Mexico",
    "price": 360,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Chichen_Itza_3.jpg"
  },
  {
    "name": "Angkor Wat",
    "location": "Siem Reap, Cambodia",
    "price": 370,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Angkor_Wat_temple.jpg"
  },
  {
    "name": "Pyramids of Giza",
    "location": "Giza, Egypt",
    "price": 410,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg"
  },
  {
    "name": "Golden Gate Bridge",
    "location": "San Francisco, USA",
    "price": 300,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/0c/GoldenGateBridge-001.jpg"
  },
  {
    "name": "Table Mountain",
    "location": "Cape Town, South Africa",
    "price": 380,
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Table_Mountain_from_Blaydon%2C_Cape_Town.jpg"
  }
];

const seedDestinations = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traveling-app');
    console.log('Connected to MongoDB');

    // Clear existing destinations
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

    // Insert famous destinations
    const insertedDestinations = await Destination.insertMany(famousDestinations);
    console.log(`✅ Successfully seeded ${insertedDestinations.length} famous destinations:`);
    
    insertedDestinations.forEach(dest => {
      console.log(`- ${dest.name} - ${dest.location} ($${dest.price})`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDestinations(); 