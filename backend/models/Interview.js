const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  role: { type: String, enum: ['Backend', 'Frontend', 'FullStack', 'AI/ML'], required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  questions: [{
    id: String,
    text: String,
    userAnswer: String,
    scores: {
      technical: Number,
      communication: Number,
      correctness: Number,
      confidence: Number
    },
    feedback: String
  }],
  overallScores: {
    technical: Number,
    communication: Number,
    correctness: Number,
    confidence: Number
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date
});

module.exports = mongoose.model('Interview', interviewSchema);