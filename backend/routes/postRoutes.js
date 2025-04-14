const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const Post = require('../models/Post');
const router = express.Router();
require('dotenv').config();

// AWS SDK v3 S3 configuration
const s3 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Multer memory storage to read files in memory buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Word count requirements for each template
const templateWordCounts = {
  technical: {
    1: 396,
    2: 236,
    3: 307,
    4: 300
  },
  nonTechnical: {
    1: 396,
    2: 230,
    3: 317,
    4: 268
  },
  sports: {
    1: 381,
    2: 236,
    3: 257,
    4: 333
  },
  alumni: {
    1: 287,
    2: 227,
    3: 249,
    4: 268
  }
};

// Helper function to count words in a string with improved validation
function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  // Split by whitespace and filter out empty strings
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Create a new post
router.post(
  '/create',
  upload.fields([
    { name: 'eventPics', maxCount: 5 },
    { name: 'coordinatorPic', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("Request body:", req.body); // Debug log

      const { 
        title, 
        studentNames, 
        category, 
        coordinatorName, 
        content,
        templateId 
      } = req.body;

      // Check if content exists
      if (!content) {
        return res.status(400).json({ message: 'Content is required' });
      }

      const templateIdNum = parseInt(templateId);
      if (isNaN(templateIdNum) || templateIdNum < 1 || templateIdNum > 4) {
        return res.status(400).json({ message: 'Invalid template ID' });
      }

      // Validate category with better error handling
      if (!category || !['technical', 'nonTechnical', 'sports', 'alumni'].includes(category)) {
        return res.status(400).json({ 
          message: 'Invalid category. Must be technical, nonTechnical, sports, or alumni'
        });
      }

      // Validate word count with more detailed logging
      const requiredWordCount = templateWordCounts[category][templateIdNum];
      const wordCount = countWords(content);
      
      console.log(`Category: ${category}, Template ID: ${templateIdNum}`);
      console.log(`Required word count: ${requiredWordCount}, Actual word count: ${wordCount}`);
      
      // Strict word count validation
      if (wordCount !== requiredWordCount) {
        return res.status(400).json({ 
          message: `${category.charAt(0).toUpperCase() + category.slice(1)}Template${templateIdNum} requires exactly ${requiredWordCount} words. You provided ${wordCount} words.`,
          wordCount: wordCount,
          requiredWordCount: requiredWordCount
        });
      }

      // Validate photo count
      const requiredPhotos = templateIdNum;
      const eventPicsFiles = req.files['eventPics'] || [];
      const coordinatorPicFile = req.files['coordinatorPic']?.[0];

      if (eventPicsFiles.length !== requiredPhotos) {
        return res.status(400).json({ 
          message: `Template ${templateIdNum} requires exactly ${requiredPhotos} photo${requiredPhotos !== 1 ? 's' : ''}`
        });
      }

      const bucket = 'studentmagazine';
      const region = 'ap-south-1';

      // Upload eventPics to S3
      const eventPics = [];
      for (const file of eventPicsFiles) {
        const fileKey = `images/${uuidv4()}_${file.originalname}`;
        await s3.send(new PutObjectCommand({
          Bucket: bucket,
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL: 'public-read'
        }));
        eventPics.push(`https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`);
      }

      // Upload coordinatorPic to S3
      let coordinatorPic = '';
      if (coordinatorPicFile) {
        const fileKey = `images/${uuidv4()}_${coordinatorPicFile.originalname}`;
        await s3.send(new PutObjectCommand({
          Bucket: bucket,
          Key: fileKey,
          Body: coordinatorPicFile.buffer,
          ContentType: coordinatorPicFile.mimetype,
          // ACL: 'public-read'
        }));
        coordinatorPic = `https://${bucket}.s3.${region}.amazonaws.com/${fileKey}`;
      }

      // Create and save post
      const post = new Post({
        title,
        studentNames,
        category,
        templateId: templateIdNum,
        eventPics,
        coordinatorName,
        coordinatorPic,
        content,
      });

      await post.save();
      res.status(201).json({ message: 'Post created successfully!', post });

    } catch (err) {
      console.error("Error in post creation:", err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

// Debug endpoint to test word counting
router.post('/test-word-count', (req, res) => {
  try {
    const { content, category, templateId } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const wordCount = countWords(content);
    let requiredWordCount = null;
    
    if (category && templateId) {
      const templateIdNum = parseInt(templateId);
      if (!isNaN(templateIdNum) && templateWordCounts[category] && templateWordCounts[category][templateIdNum]) {
        requiredWordCount = templateWordCounts[category][templateIdNum];
      }
    }
    
    res.json({
      wordCount,
      requiredWordCount,
      matches: requiredWordCount === wordCount,
      content: content
    });
  } catch (error) {
    res.status(500).json({ message: 'Error testing word count', error: error.message });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update post status (for admin approval/rejection)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get word count requirements for templates
router.get('/templates/wordcounts', (req, res) => {
  res.json(templateWordCounts);
});

module.exports = router;