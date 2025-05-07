const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const Magazine = require('../models/Magazine');
const cors = require('cors');
const os = require('os');

// Apply CORS specifically for this router
const corsOptions = {
  origin: "https://sudentmagazine-frontend.vercel.app",
  methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type']
};

// Apply CORS middleware to all routes in this router
router.use(cors(corsOptions));

// AWS S3 client v3 setup with more graceful error handling
const createS3Client = () => {
  try {
    return new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
  } catch (error) {
    console.error("Error creating S3 client:", error);
    throw new Error("Failed to initialize S3 client: " + error.message);
  }
};

// Initialize S3 client
let s3Client;
try {
  s3Client = createS3Client();
  console.log("S3 client initialized successfully");
} catch (error) {
  console.error("S3 client initialization failed:", error);
  // We'll create it on demand when needed
}

// Use memory storage for serverless environment
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 50 * 1024 * 1024 // Limit to 50MB for serverless functions
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Debug route to verify this module is loaded correctly
router.get('/magazines-debug', (req, res) => {
  res.json({ 
    message: 'Magazine routes are loaded correctly',
    tempDir: os.tmpdir(),
    environment: process.env.NODE_ENV,
    memoryLimit: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || 'unknown'
  });
});

// Get all magazines with optional year filter
router.get('/magazines', async (req, res) => {
  console.log('GET /api/magazines endpoint hit');
  
  try {
    // Create query object based on parameters
    const query = {};
    
    // If year parameter exists, add it to the query
    if (req.query.year) {
      query.year = parseInt(req.query.year);
      console.log(`Filtering by year: ${query.year}`);
    }
    
    const magazines = await Magazine.find(query).sort({ year: -1, quarter: -1 });
    console.log(`Found ${magazines.length} magazines`);
    res.json(magazines);
  } catch (err) {
    console.error('Error fetching magazines:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
});

// Handle preflight OPTIONS requests for the upload endpoint
router.options('/magazines/upload', cors(corsOptions));

// Upload a new magazine - apply CORS specifically to this route
router.post('/magazines/upload', cors(corsOptions), upload.single('file'), async (req, res) => {
  console.log('Magazine upload request received');
  
  try {
    // Validate request
    const { quarter, year, title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    console.log(`Processing file: ${req.file.originalname}, size: ${req.file.size} bytes`);
    
    // Make sure S3 client is initialized
    if (!s3Client) {
      console.log("Creating S3 client on demand");
      s3Client = createS3Client();
    }
    
    const fileExtension = '.pdf'; // Since we're filtering for PDFs only
    const fileName = `magazines/magazine_${year}_q${quarter}_${uuidv4()}${fileExtension}`;

    console.log(`Uploading to S3: ${fileName}`);
    
    // Upload directly from memory buffer (no filesystem needed)
    const uploadCommand = new PutObjectCommand({
      Bucket: 'studentmagazine',
      Key: fileName,
      Body: req.file.buffer,
      ContentType: 'application/pdf',
    });

    await s3Client.send(uploadCommand);
    console.log('S3 upload successful');

    const region = process.env.AWS_REGION || 'ap-south-1';
    const fileUrl = `https://studentmagazine.s3.${region}.amazonaws.com/${fileName}`;

    console.log(`File URL: ${fileUrl}`);

    const existingMagazine = await Magazine.findOne({
      quarter: parseInt(quarter),
      year: parseInt(year)
    });

    if (existingMagazine) {
      console.log(`Updating existing magazine for Q${quarter} ${year}`);
      existingMagazine.fileUrl = fileUrl;
      existingMagazine.uploadedAt = Date.now();
      await existingMagazine.save();
      return res.json({ 
        success: true, 
        message: 'Magazine updated', 
        magazine: existingMagazine 
      });
    }

    console.log(`Creating new magazine for Q${quarter} ${year}`);
    const newMagazine = new Magazine({
      title,
      quarter: parseInt(quarter),
      year: parseInt(year),
      fileUrl: fileUrl,
    });
    
    await newMagazine.save();
    console.log('Magazine saved to database');

    res.status(201).json({ 
      success: true, 
      magazine: newMagazine
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed', 
      error: error.message 
    });
  }
});

// Get a specific magazine by ID
router.get('/magazines/:id', async (req, res) => {
  console.log(`GET /api/magazines/${req.params.id} endpoint hit`);
  try {
    const magazine = await Magazine.findById(req.params.id);
    
    if (!magazine) {
      return res.status(404).json({ success: false, message: 'Magazine not found' });
    }
    
    res.json({ success: true, magazine });
  } catch (error) {
    console.error('Error fetching magazine:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a magazine
router.delete('/magazines/:id', async (req, res) => {
  try {
    const magazine = await Magazine.findById(req.params.id);
    if (!magazine) {
      return res.status(404).json({ success: false, message: 'Magazine not found' });
    }

    // Make sure S3 client is initialized
    if (!s3Client) {
      console.log("Creating S3 client on demand");
      s3Client = createS3Client();
    }

    const s3Key = magazine.fileUrl.split('.amazonaws.com/')[1];
    if (s3Key) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: 'studentmagazine',
        Key: s3Key
      });
      await s3Client.send(deleteCommand);
    }

    await Magazine.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Magazine deleted successfully' });
  } catch (error) {
    console.error('Error deleting magazine:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
