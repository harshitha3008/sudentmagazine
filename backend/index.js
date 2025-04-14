// server.js (update)
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
const pdfRoutes = require('./routes/pdfRoutes'); // Add this line
const path = require("path");
const magazineRoutes = require('./routes/magazineRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin:["https://sudentmagazine-frontend.vercel.app"],
  methods:["POST", "GET"],
  credentials: true
}))
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", publishedPostsRoutes);
app.use("/api/posts", posts);
app.use("/api", notificationRoutes);
app.use("/api", pdfRoutes); // Add this line
app.use("/api", magazineRoutes);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
