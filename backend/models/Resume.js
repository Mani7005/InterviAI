const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: String,
  s3Url: String,
  parsedSkills: [String],
  projects: [String],
  education: String,
  experience: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);