const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedUsers = async () => {
  try {
    await User.deleteMany(); // Clear existing users

    const users = [
      {
        username: "admin",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
      },
      {
        username: "221FA04399",
        password: await bcrypt.hash("123456789", 10),
        role: "student",
      },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedUsers();
