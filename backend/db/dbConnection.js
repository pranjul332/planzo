const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/go");
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
