
# Truck Management System Backend

This is the backend API for the Truck Management System. It's built with Node.js, Express, MongoDB, and JWT authentication.

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
2. Navigate to the server directory
   ```
   cd server
   ```
3. Install dependencies
   ```
   npm install
   ```
4. Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   PORT=5000
   ```
5. Start the server
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user and company
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/me` - Get current user info

### Company Management
- `GET /api/company` - Get company details
- `PUT /api/company` - Update company details
- `GET /api/company/users` - Get all company users (admin only)
- `POST /api/company/users` - Create a new user (admin only)
- `PUT /api/company/users/:id` - Update a user (admin only)
- `DELETE /api/company/users/:id` - Delete a user (admin only)

### Truck Management
- `GET /api/trucks` - Get all trucks
- `GET /api/trucks/:id` - Get truck details
- `POST /api/trucks` - Add new truck
- `PUT /api/trucks/:id` - Update truck
- `DELETE /api/trucks/:id` - Delete truck

### Driver Management
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get driver details
- `GET /api/drivers/:id/trips` - Get trips for a driver
- `POST /api/drivers` - Add new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Trip Management
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips` - Create a trip
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

### Finance Management
- `GET /api/finances` - Get all finance records
- `GET /api/finances/summary` - Get financial summary
- `GET /api/finances/categories` - Get summary by categories
- `POST /api/finances` - Add finance record
- `PUT /api/finances/:id` - Update finance record
- `DELETE /api/finances/:id` - Delete finance record

### Settings
- `GET /api/settings` - Get company settings
- `PUT /api/settings` - Update settings

### Profile Management
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/password` - Change password

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-trips` - Get recent trips
- `GET /api/dashboard/revenue-overview` - Get revenue chart data
- `GET /api/dashboard/fuel-data` - Get fuel data for trucks

## Authentication

All API routes except for login and signup are protected and require a valid JWT token.
The token must be included in the Authorization header as follows:
```
Authorization: Bearer your_token_here
```

## Role-Based Authorization

The API implements role-based authorization with three roles:
- admin: Full access to all features
- manager: Can manage trucks, drivers, trips, and finances
- driver: Limited access (can only view assigned trips)

## Company Data Isolation

Each company's data is isolated. Users can only access data that belongs to their company.
