const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGODB_URI); // Debug log
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit on failure
  }
};

module.exports = connectDB;
