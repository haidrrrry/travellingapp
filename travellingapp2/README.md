# 🌍 Traveling App - Full Stack Travel Planning Platform

A modern, full-stack traveling application built with React frontend and Node.js/Express backend, featuring user authentication, destination management, trip planning, and booking functionality.

## 🚀 Live Demo

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

## ✨ Features

### 🎯 Core Functionality
- **User Authentication**: Secure JWT-based login/signup system
- **Destination Discovery**: Browse and search travel destinations
- **Trip Planning**: Create and manage personalized travel itineraries
- **User Profiles**: Manage personal information and preferences
- **Responsive Design**: Mobile-first, modern UI/UX

### 🛠️ Technical Features
- **RESTful API**: Clean, well-documented backend endpoints
- **MongoDB Integration**: Robust data persistence with Mongoose ODM
- **Design Patterns**: Singleton and Factory patterns implementation
- **Environment Management**: Secure configuration with environment variables
- **Error Handling**: Comprehensive error management and validation

## 🏗️ Project Structure

```
travellingapp/
├── backend/                 # Node.js/Express API Server
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── config/           # Configuration files
│   └── server.js         # Main server file
├── frontend/              # React Application
│   ├── public/           # Static files
│   ├── src/              # React source code
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   └── utils/        # Utility functions
│   └── package.json      # Frontend dependencies
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Built-in Express validation
- **CORS**: Cross-origin resource sharing enabled

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: React Icons (FontAwesome)
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Context API
- **Build Tool**: Create React App

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/travellingapp.git
   cd travellingapp
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```bash
   cd ../backend
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/travellingapp
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start the application**
   
   **Option 1: Run both servers simultaneously**
   ```bash
   # From the root directory
   npm run dev
   ```
   
   **Option 2: Run servers separately**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Destination Endpoints
- `GET /api/destinations` - Get all destinations
- `POST /api/destinations` - Create new destination (admin)
- `GET /api/destinations/:id` - Get destination by ID
- `PUT /api/destinations/:id` - Update destination (admin)
- `DELETE /api/destinations/:id` - Delete destination (admin)

### Trip Endpoints
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### User Endpoints
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin)

## 🎨 Frontend Pages

- **Home** (`/`) - Landing page with featured destinations
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration
- **Destinations** (`/destinations`) - Browse all destinations
- **Create Trip** (`/create-trip`) - Plan new trips
- **My Trips** (`/my-trips`) - View user's trips
- **Book Trip** (`/book`) - Book travel packages
- **User Profile** (`/profile`) - Manage user account
- **My Notes** (`/notes`) - Personal travel notes
- **My Bookings** (`/bookings`) - View bookings

## 🔧 Development

### Available Scripts

**Backend:**
```bash
cd backend
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
```

**Frontend:**
```bash
cd frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

**Root (Both):**
```bash
npm run dev        # Start both servers simultaneously
npm run build      # Build frontend for production
```

### Code Structure

The application follows modern development practices:

- **Separation of Concerns**: Clear separation between frontend and backend
- **Component-Based Architecture**: Reusable React components
- **RESTful API Design**: Clean, predictable API endpoints
- **Error Handling**: Comprehensive error management
- **Security**: JWT authentication, password hashing, input validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly
- Ensure responsive design for mobile devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- React Icons for the beautiful icon library
- All contributors and supporters

## 📞 Support

If you have any questions or need help:
- Create an issue on GitHub
- Contact Me 
- Check the documentation

---

**Happy Traveling! ✈️🌍** 
