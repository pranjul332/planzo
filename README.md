# Planzo

A full-stack MERN (MongoDB, Express, React, Node.js) application with real-time features powered by Socket.IO with  AI trip planning, smart recommendations, and other built-in AI-assisted functionalities that enhance the user experience .

## Overview

Planzo is a modern web application that leverages the power of the MERN stack along with real-time communication capabilities. The project is structured with a React frontend and an Express/Node.js backend connected to MongoDB. A key feature of Planzo is its AI integration, which powers various intelligent features throughout the application including AI trip planning, smart recommendations, and other built-in AI-assisted functionalities that enhance the user experience.

## Features

- User authentication via Auth0
- Real-time communication using Socket.IO
- Interactive UI components with Radix UI
- Animation capabilities with Framer Motion
- Data visualization with Recharts
- AI integration with Google's Generative AI for trip planning and smart features
- RESTful API structure
- Responsive and modern user interface

## Tech Stack

### Frontend
- React 18
- React Router v7
- Auth0 for authentication
- Recharts for data visualization
- Framer Motion for animations
- Lucide React for icons
- React-Toastify for notifications
- Socket.IO client for real-time communication

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- Socket.IO for WebSocket connections
- JWT authentication
- Google Generative AI integration
- Express validators for request validation
- CORS support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Auth0 account for authentication

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/planzo.git
cd planzo
```

2. Install dependencies for the frontend
```bash
cd frontend
npm install
```

3. Install dependencies for the backend
```bash
cd ../backend
npm install
```

4. Set up environment variables:

Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AUTH0_DOMAIN=your_auth0_domain
AUTH0_AUDIENCE=your_auth0_audience
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

Create a `.env` file in the frontend directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_AUTH0_DOMAIN=your_auth0_domain
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
REACT_APP_AUTH0_AUDIENCE=your_auth0_audience
```

5. Start the backend server
```bash
cd backend
npm start
```

6. Start the frontend development server
```bash
cd frontend
npm start
```

The application should now be running with the frontend accessible at `http://localhost:3000` and the backend API at `http://localhost:5000`.

## Project Structure

```
planzo/
├── frontend/               # React frontend
│   ├── public/             # Public assets
│   ├── src/                # Source files
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
│
└── backend/                # Node.js backend
    ├── controllers/        # Request controllers
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    ├── middleware/         # Express middleware
    ├── utils/              # Utility functions
    ├── server.js           # Entry point
    └── package.json        # Backend dependencies
```

## API Endpoints

The backend provides the following API endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/users/profile` - Get user profile data
- `GET /api/data` - Fetch application data
- `POST /api/data` - Create new data entry
- `PUT /api/data/:id` - Update existing data entry
- `DELETE /api/data/:id` - Delete data entry

## Socket.IO Events

Real-time communication is implemented with the following events:

- `connection` - Client connects to socket server
- `disconnect` - Client disconnects from socket server
- `data_update` - Data has been updated, notifying all connected clients
- `user_status` - User status updates (online/offline)

## Deployment

### Frontend
The React frontend can be built for production using:
```bash
cd frontend
npm run build
```

This creates an optimized build in the `build` folder that can be deployed to services like Netlify, Vercel, or AWS S3.

### Backend
The Node.js backend can be deployed to platforms like Heroku, AWS EC2, or DigitalOcean.

For Heroku deployment:
```bash
heroku create
git push heroku main
```

## License

[MIT](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/)
- [Socket.IO](https://socket.io/)
- [Auth0](https://auth0.com/)
- [Recharts](https://recharts.org/)
