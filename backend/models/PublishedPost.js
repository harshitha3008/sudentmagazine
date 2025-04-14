const mongoose = require('mongoose');

const publishedPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  coordinatorName: {
    type: String,
    required: true
  },
  coordinatorPic: {
    type: String,
    required: true
  },
  eventPics: [{
    type: String
  }],
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
  status: {
    type: String,
    default: 'approved',
    enum: ['approved', 'pending', 'rejected']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PublishedPost', publishedPostSchema);