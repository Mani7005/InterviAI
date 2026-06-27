const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ CREATE APP FIRST
const app = express();

// ✅ MIDDLEWARE (after app created)
app.use(cors());
app.use(express.json());

// ✅ MONGODB CONNECTION (after app created)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ ROUTES (after app created)
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
const resumeRoutes = require('./routes/resume');
app.use('/resume', resumeRoutes);
const interviewRoutes = require('./routes/interview');
app.use('/interview', interviewRoutes);

// ✅ HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'InterviAI Backend', timestamp: new Date() });
});

// ✅ ERROR HANDLER (last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// ✅ START SERVER (at the end)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});