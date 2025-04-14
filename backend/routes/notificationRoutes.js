const express = require('express');
const router = express.Router();
const RejectedPost = require('../models/RejectedPost');
const PublishedPost = require('../models/PublishedPost');


router.get('/notifications', async (req, res) => {
  try {
    const approvedPosts = await PublishedPost.find({}, 'title');
    const rejectedPosts = await RejectedPost.find({}, 'title reason');

    const notifications = [
      ...approvedPosts.map((post) => ({
        title: post.title,
        status: 'approved',
      })),
      ...rejectedPosts.map((post) => ({
        title: post.title,
        status: 'rejected',
        reason: post.reason,
      })),
    ];

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
