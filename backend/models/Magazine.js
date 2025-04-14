const mongoose = require('mongoose');

const MagazineSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  quarter: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  year: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: false
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure only one magazine per quarter per year
MagazineSchema.index({ quarter: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Magazine', MagazineSchema);