# Traveling App Backend

A robust Node.js/Express/MongoDB backend API for a full-stack traveling application with user authentication, destination management, trip planning, and booking functionality.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Destination Management**: CRUD operations for travel destinations
- **Trip Planning**: Create and manage travel itineraries
- **User Profiles**: User management and profile updates
- **RESTful API**: Clean, well-documented API endpoints
- **MongoDB Integration**: Mongoose ODM with proper data modeling
- **Middleware**: Authentication, error handling, and validation
- **Design Patterns**: Singleton and Factory patterns implementation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Mongoose schema validation
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-backend-repo-url>
   cd traveling-app-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travelingapp
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally, or
   - Update `MONGODB_URI` with your MongoDB Atlas connection string

5. **Seed Data (Optional)**
   ```bash
   node seedDestinations.js
   ```

6. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `POST /api/destinations` - Create new destination (authenticated)
- `PUT /api/destinations/:id` - Update destination
- `DELETE /api/destinations/:id` - Delete destination
- `GET /api/destinations/search?q=query` - Search destinations

### Trips
- `GET /api/trips` - Get user's trips (authenticated)
- `GET /api/trips/:id` - Get trip by ID
- `POST /api/trips` - Create new trip (authenticated)
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Health Check
- `GET /health` - API health status

## 🏗️ Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── destinationController.js # Destination CRUD
│   ├── tripController.js    # Trip management
│   └── userController.js    # User management
├── factories/
│   └── TripFactory.js       # Factory pattern implementation
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── Destination.js       # Destination schema
│   ├── Trip.js              # Trip schema
│   └── User.js              # User schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── destinations.js      # Destination routes
│   ├── trips.js             # Trip routes
│   └── users.js             # User routes
├── server.js                # Main server file
├── seedDestinations.js      # Database seeding script
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Models

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `createdAt`: Date

### Destination Model
- `name`: String (required)
- `country`: String (required)
- `location`: String (required)
- `description`: String (required)
- `category`: String (enum: beaches, mountains, cities, adventure, cultural, nature)
- `price`: Number (required)
- `rating`: Number (0-5, default: 4.5)
- `imageUrl`: String (optional)

### Trip Model
- `userId`: ObjectId (required, ref: User)
- `destinationId`: ObjectId (required, ref: Destination)
- `startDate`: Date (required)
- `endDate`: Date (required)
- `tripType`: String (enum: leisure, business, adventure, romantic, family, cultural)
- `budget`: Number
- `travelers`: Number
- `notes`: String

## 🚀 Deployment

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelingapp
JWT_SECRET=your_very_secure_jwt_secret
NODE_ENV=production
```

### Build and Deploy
```bash
npm install --production
npm start
```

## 🧪 Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands

Example curl commands:
```bash
# Health check
curl http://localhost:5000/health

# Get destinations
curl http://localhost:5000/api/destinations

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the error logs

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication
  - Destination management
  - Trip planning
  - RESTful API endpoints 