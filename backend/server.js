const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const connectDB = require("./db/dbConnection");
const tripRoutes = require("./routes/tripRoutes");
const groupChatRoutes = require("./routes/chatRoutes");

// Load environment variables
dotenv.config();

const app = express(); 

app.use(cors());
app.use(express.json());

// Connect to MongoDB 
connectDB();

// Routes
app.use("/api/users", authRoutes);
app.use("/api/trips", authMiddleware, tripRoutes);
app.use("/api/chats", authMiddleware, groupChatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
