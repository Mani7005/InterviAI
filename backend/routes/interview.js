const express = require('express');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const axios = require('axios');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const auth = authMiddleware;

// Start interview
router.post('/start', auth, async (req, res) => {
  try {
    const { resumeId, role } = req.body;

    // Verify resume exists
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Create interview
    const interview = new Interview({
      userId: req.userId,
      resumeId,
      role,
      status: 'in_progress'
    });

    // Call AI service to generate questions
    try {
      const response = await axios.post('http://localhost:8000/generate-questions', {
        skills: resume.parsedSkills,
        role: role,
        difficulty: 'medium'
      });

      interview.questions = response.data.questions || [];
    } catch (aiError) {
      console.warn('AI service not yet available:', aiError.message);
      // Continue without AI for now (will be implemented in Week 2)
      interview.questions = [];
    }

    await interview.save();

    res.status(201).json({
      message: 'Interview started',
      interview: {
        id: interview._id,
        role: interview.role,
        questionCount: interview.questions.length,
        firstQuestion: interview.questions[0] || null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get interview
router.get('/:interviewId', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json(interview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;