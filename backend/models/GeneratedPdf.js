// models/GeneratedPdf.js
const mongoose = require('mongoose');

const GeneratedPdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  postIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  pdfPath: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GeneratedPdf', GeneratedPdfSchema);