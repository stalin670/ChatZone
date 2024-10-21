const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Databse Connected Successfully`);
  } catch (error) {
    console.log(`Database Connection Failed`);
    process.exit(1);
  }
};

module.exports = connectDB;
