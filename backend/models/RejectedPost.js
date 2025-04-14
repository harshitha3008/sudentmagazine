const mongoose = require('mongoose');

const rejectedPostSchema = new mongoose.Schema({
  postId: String,
  title: String,
  reason: String,
  status: { type: String, default: 'rejected' }
});

module.exports = mongoose.model('RejectedPost', rejectedPostSchema);
