const express = require('express');
const multer = require('multer');
const Resume = require('../models/Resume');
const { uploadToS3 } = require('../utils/aws');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
const auth = authMiddleware;

// Upload resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to S3
    const s3Url = await uploadToS3(req.file.buffer, req.file.originalname);

    // Save resume metadata (parsing happens in Week 2)
    const resume = new Resume({
      userId: req.userId,
      fileName: req.file.originalname,
      s3Url,
      parsedSkills: req.body.skills ? req.body.skills.split(',') : [],
      education: req.body.education || '',
      experience: req.body.experience || ''
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        fileName: resume.fileName,
        s3Url: resume.s3Url
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get resume
router.get('/:resumeId', auth, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;