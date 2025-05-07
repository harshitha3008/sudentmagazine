const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const Post = require("./models/Post");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/postRoutes");
const posts = require('./routes/posts');
const publishedPostsRoutes = require('./routes/publishedPosts');
const notificationRoutes = require('./routes/notificationRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const path = require("path");
const magazineRoutes = require('./routes/magazineRoutes');

// Load environment variables first
dotenv.config();

// Configure Express
const app = express();

// Apply CORS first before any route handlers
app.use(cors({
  origin: ["https://sudentmagazine-frontend.vercel.app"],
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Add raw body parsing for webhook support
app.use(express.json({ 
  limit: '200mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Connect to database
let dbConnected = false;
const initializeDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('Database connected');
    } catch (error) {
      console.error('Database connection error:', error);
      // Don't throw - let the app continue even if DB connection fails initially
    }
  }
};
initializeDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", publishedPostsRoutes);
app.use("/api/posts", posts);
app.use("/api", notificationRoutes);
app.use("/api", pdfRoutes);
app.use("/api", magazineRoutes);
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    dbConnected
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Student Magazine API");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Determine the port and start server
const PORT = process.env.PORT || 5000;

// Only start the server if not imported by serverless function
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for serverless functions
module.exports = app;
