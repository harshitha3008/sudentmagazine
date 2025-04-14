const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studentNames: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'non-technical', 'alumni', 'sports']
  },
  templateId: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  eventPics: {
    type: [String],
    required: true
  },
  coordinatorName: {
    type: String,
    required: true
  },
  coordinatorPic: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;