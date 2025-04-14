const express = require('express');
const router = express.Router();
const PublishedPost = require('../models/PublishedPost');

// Get all published posts
router.get('/publishedposts', async (req, res) => {
  try {
    const publishedPosts = await PublishedPost.find({ status: 'approved' })
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(publishedPosts);
  } catch (error) {
    console.error('Error fetching published posts:', error);
    res.status(500).json({ message: 'Error fetching published posts' });
  }
});

// Get a single published post by ID
router.get('/publishedposts/:id', async (req, res) => {
  try {
    const post = await PublishedPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Published post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching published post:', error);
    res.status(500).json({ message: 'Error fetching published post' });
  }
});

// Create a new published post
router.post('/publishedposts', async (req, res) => {
  try {
    const post = new PublishedPost({
      title: req.body.title,
      content: req.body.content,
      coordinatorName: req.body.coordinatorName,
      coordinatorPic: req.body.coordinatorPic,
      eventPics: req.body.eventPics,
      category: req.body.category,
      templateId: req.body.templateId,
      status: 'approved'
    });
    
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating published post:', error);
    res.status(400).json({ message: error.message });
  }
});

// Approve a post
router.post('/posts/:id/approve', async (req, res) => {
  try {
    const post = await PublishedPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = 'approved';
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error approving post:', error);
    res.status(500).json({ message: 'Error approving post', error: error.message });
  }
});

module.exports = router;