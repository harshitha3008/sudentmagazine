const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const PublishedPost = require('../models/PublishedPost');
const RejectedPost = require('../models/RejectedPost');

router.put('/:id/approve', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new published post with all required fields from the schema
    const publishedPost = new PublishedPost({
      title: post.title,
      content: post.content,
      coordinatorName: post.coordinatorName,
      coordinatorPic: post.coordinatorPic,
      eventPics: post.eventPics,
      category: post.category,
      templateId: post.templateId, // Include templateId from the original post
      status: 'approved',
      createdAt: post.createdAt
    });

    await publishedPost.save();
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Post approved and published successfully',
      publishedPost,
    });
  } catch (error) {
    console.error('Error approving post:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const rejectedPost = new RejectedPost({
      postId: post._id,
      title: post.title,
      reason,
      coordinatorName: post.coordinatorName,
      category: post.category,
      createdAt: post.createdAt
    });

    await rejectedPost.save();
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Post rejected and archived successfully',
      rejectedPost,
    });
  } catch (error) {
    console.error('Error rejecting post:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;