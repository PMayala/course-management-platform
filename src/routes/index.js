const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const moduleRoutes = require('./modules');
const courseOfferingRoutes = require('./courseOfferings');
const activityTrackerRoutes = require('./activityTracker');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/modules', moduleRoutes);
router.use('/course-offerings', courseOfferingRoutes);
router.use('/activity-tracker', activityTrackerRoutes);

module.exports = router;