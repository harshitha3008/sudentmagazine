const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const Magazine = require('../models/Magazine');

// Debug route to verify this module is loaded correctly
router.get('/magazines-debug', (req, res) => {
  res.json({ message: 'Magazine routes are loaded correctly' });
});

// Configure multer storage
// AWS S3 client v3 setup
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Multer local storage before upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'temp/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Get all magazines with optional year filter
router.get('/magazines', (req, res) => {
  console.log('GET /api/magazines endpoint hit');
  
  // Create query object based on parameters
  const query = {};
  
  // If year parameter exists, add it to the query
  if (req.query.year) {
    query.year = parseInt(req.query.year);
    console.log(`Filtering by year: ${query.year}`);
  }
  
  Magazine.find(query)
    .sort({ year: -1, quarter: -1 })
    .then(magazines => {
      console.log(`Found ${magazines.length} magazines`);
      res.json(magazines);
    })
    .catch(err => {
      console.error('Error fetching magazines:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    });
});

// Upload a new magazine
router.post('/magazines/upload', upload.single('file'), async (req, res) => {
  try {
    const { quarter, year, title } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(req.file.path);
    const fileExtension = path.extname(req.file.originalname);
    const fileName = `magazines/magazine_${year}_q${quarter}_${uuidv4()}${fileExtension}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: 'studentmagazine',
      Key: fileName,
      Body: fileContent,
      ContentType: 'application/pdf',
      // ACL: 'public-read'
    });

    await s3Client.send(uploadCommand);
    fs.unlinkSync(req.file.path); // Clean up local file

    const region = process.env.AWS_REGION || 'ap-south-1';
    const fileUrl = `https://studentmagazine.s3.${region}.amazonaws.com/${fileName}`;


    const existingMagazine = await Magazine.findOne({
      quarter: parseInt(quarter),
      year: parseInt(year)
    });

    if (existingMagazine) {
      existingMagazine.fileUrl = fileUrl;
      existingMagazine.uploadedAt = Date.now();
      await existingMagazine.save();
      return res.json({ success: true, message: 'Magazine updated', magazine: existingMagazine });
    }

    const newMagazine = new Magazine({
      title,
      quarter: parseInt(quarter),
      year: parseInt(year),
      fileUrl: fileUrl, // if not used anymore, you can also remove it from your schema
    });
    

    await newMagazine.save();


    res.status(201).json({ success: true, newMagazine });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
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