# Traveling App

A full-stack web application for planning, discovering, and managing travel experiences. Built with Node.js, Express, MongoDB (backend), and React (frontend).

---

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
- [Design Patterns](#design-patterns)
- [Contributing](#contributing)
- [License](#license)

---

## Overview
Traveling App helps users discover destinations, create and manage trips, and keep travel notes. It features authentication, user dashboards, and a modern, responsive UI.

## Tech Stack
- **Frontend:** React, React Router, Axios, React Icons, CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, CORS, dotenv
- **Design Patterns:** Singleton, Factory

## Features
- User authentication (JWT-based signup/login)
- Discover and add travel destinations
- Create, view, and manage trips
- Add notes to trips
- User profile management
- Responsive, modern UI

## Project Structure
```
travellingapp/
├── backend/
│   ├── controllers/         # Route controllers
│   ├── factories/           # Factory pattern for Trip creation
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose models (User, Trip, Destination)
│   ├── routes/              # Express routes
│   ├── config/              # Database config
│   ├── env.example          # Backend environment variables
│   └── server.js            # Main server entry point
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Main app pages (Home, MyTrips, etc.)
│   │   ├── services/        # API service (Axios)
│   │   └── App.js           # Main React app
│   ├── env.example          # Frontend environment variables
│   └── package.json         # Frontend dependencies
├── README.md                # Project documentation
├── package.json             # Root scripts (dev, etc.)
└── .gitignore
```

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <repo-url>
cd travellingapp
```

### 2. Install dependencies
```bash
npm install           # Installs root dependencies (concurrently)
cd backend && npm install   # Installs backend dependencies
cd ../frontend && npm install   # Installs frontend dependencies
```

### 3. Configure environment variables
- Copy `backend/env.example` to `backend/.env` and set your values.
- Copy `frontend/env.example` to `frontend/.env` and set your values.

### 4. Start the app (dev mode)
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/traveling-app
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=Traveling App
```

## Scripts
- `npm run dev` (root): Runs both backend and frontend in dev mode
- `npm run server:dev` (root): Runs backend only (dev)
- `npm run client` (root): Runs frontend only
- `npm start` (backend/frontend): Runs respective server/app

## API Endpoints
- `POST   /api/auth/signup` - Register new user
- `POST   /api/auth/login` - Login user
- `GET    /api/users/me` - Get current user profile
- `GET    /api/destinations` - List all destinations
- `POST   /api/destinations` - Add new destination
- `GET    /api/trips` - List all trips for user
- `POST   /api/trips` - Create new trip
- `PUT    /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `GET    /health` - Health check

## Design Patterns
- **Singleton:** Database connection (ensures only one connection instance)
- **Factory:** TripFactory for creating trip objects

## Contribution Guidelines
1. Fork the repo and create your branch from `main`.
2. Install dependencies as above.
3. Make your changes and add tests if applicable.
4. Submit a pull request with a clear description.

## License
This project is licensed under the MIT License. 