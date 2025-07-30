const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const activityRoutes = require('./activityRoutes');
const userRoutes = require('./userRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/activities', activityRoutes);
router.use('/users', userRoutes);

// Base route
router.get('/', (req, res) => {
  res.json({
    message: 'Course Management Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      activities: '/api/activities',
      users: '/api/users',
      documentation: '/api-docs'
    }
  });
});

module.exports = router;