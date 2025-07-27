const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('sequelize'); // Import sequelize
const { 
  ActivityTracker, 
  CourseOffering, 
  Module, 
  Class, 
  Cohort, 
  Mode, 
  Facilitator, 
  User 
} = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const NotificationService = require('../services/notificationService');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityTracker:
 *       type: object
 *       required:
 *         - allocation_id
 *         - week_number
 *       properties:
 *         id:
 *           type: integer
 *         allocation_id:
 *           type: integer
 *         week_number:
 *           type: integer
 *         attendance:
 *           type: array
 *           items:
 *             type: boolean
 *         formative_one_grading:
 *           type: string
 *           enum: ['Done', 'Pending', 'Not Started']
 *         formative_two_grading:
 *           type: string
 *           enum: ['Done', 'Pending', 'Not Started']
 *         summative_grading:
 *           type: string
 *           enum: ['Done', 'Pending', 'Not Started']
 *         course_moderation:
 *           type: string
 *           enum: ['Done', 'Pending', 'Not Started']
 *         intranet_sync:
 *           type: string
 *           enum: ['Done', 'Pending', 'Not Started']
 *         grade_book_status:
 *           type: string
 *           enum: ['Done', 'Pending', 'Not Started']
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * /activity-tracker:
 *   get:
 *     summary: Get activity tracker logs
 *     tags: [Activity Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: allocation_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: week_number
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['Done', 'Pending', 'Not Started']
 *     responses:
 *       200:
 *         description: List of activity tracker logs
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { allocation_id, week_number, status } = req.query;
    
    let where = {};
    let include = [
      {
        model: CourseOffering,
        as: 'courseOffering',
        include: [
          { model: Module, as: 'module' },
          { model: Class, as: 'class' },
          { model: Cohort, as: 'cohort' },
          { model: Mode, as: 'mode' },
          {
            model: Facilitator,
            as: 'facilitator',
            include: [{ model: User, as: 'user' }]
          }
        ]
      }
    ];

    // Apply filters
    if (allocation_id) {
      where.allocation_id = allocation_id;
    }

    if (week_number) {
      where.week_number = week_number;
    }

    // If user is facilitator, only show their logs
    if (req.user.role === 'facilitator') {
      const facilitatorCourses = await CourseOffering.findAll({
        where: { facilitator_id: req.user.facilitatorProfile.id },
        attributes: ['id']
      });
      
      const courseIds = facilitatorCourses.map(course => course.id);
      where.allocation_id = { [Op.in]: courseIds };
    }

    let logs = await ActivityTracker.findAll({
      where,
      include,
      order: [['week_number', 'DESC'], ['updated_at', 'DESC']]
    });

    // Filter by status if provided (check multiple status fields)
    if (status) {
      logs = logs.filter(log => {
        return log.formative_one_grading === status ||
               log.formative_two_grading === status ||
               log.summative_grading === status ||
               log.course_moderation === status ||
               log.intranet_sync === status ||
               log.grade_book_status === status;
      });
    }

    res.json(logs);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /activity-tracker/{id}:
 *   get:
 *     summary: Get activity tracker log by ID
 *     tags: [Activity Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity tracker log details
 *       404:
 *         description: Log not found
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const log = await ActivityTracker.findByPk(req.params.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: Class, as: 'class' },
            { model: Cohort, as: 'cohort' },
            { model: Mode, as: 'mode' },
            {
              model: Facilitator,
              as: 'facilitator',
              include: [{ model: User, as: 'user' }]
            }
          ]
        }
      ]
    });

    if (!log) {
      return res.status(404).json({ error: 'Activity log not found' });
    }

    // Check access permissions
    if (req.user.role === 'facilitator') {
      if (log.courseOffering.facilitator_id !== req.user.facilitatorProfile.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(log);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /activity-tracker:
 *   post:
 *     summary: Create activity tracker log (Facilitator only)
 *     tags: [Activity Tracker]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityTracker'
 *     responses:
 *       201:
 *         description: Activity log created successfully
 *       403:
 *         description: Access denied
 */
router.post('/', authenticate, authorize('facilitator'), validate(schemas.activityTracker), async (req, res, next) => {
  try {
    const { allocation_id } = req.body;

    // Verify the course offering belongs to the facilitator
    const courseOffering = await CourseOffering.findByPk(allocation_id);
    if (!courseOffering || courseOffering.facilitator_id !== req.user.facilitatorProfile.id) {
      return res.status(403).json({ error: 'Access denied. You can only create logs for your assigned courses.' });
    }

    // Check if log already exists for this week
    const existingLog = await ActivityTracker.findOne({
      where: {
        allocation_id: req.body.allocation_id,
        week_number: req.body.week_number
      }
    });

    if (existingLog) {
      return res.status(409).json({ error: 'Activity log already exists for this week' });
    }

    const log = await ActivityTracker.create({
      ...req.body,
      submitted_at: new Date()
    });

    // Fetch the created log with relations
    const createdLog = await ActivityTracker.findByPk(log.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: Class, as: 'class' },
            { model: Cohort, as: 'cohort' },
            { model: Mode, as: 'mode' },
            {
              model: Facilitator,
              as: 'facilitator',
              include: [{ model: User, as: 'user' }]
            }
          ]
        }
      ]
    });

    // Queue notification to managers about submission
    try {
      await NotificationService.queueManagerAlert(
        null, // Will be sent to all managers
        req.user.facilitatorProfile.id,
        allocation_id,
        'activity_log_submitted'
      );
    } catch (notificationError) {
      console.error('Failed to queue notification:', notificationError);
    }

    res.status(201).json(createdLog);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /activity-tracker/{id}:
 *   put:
 *     summary: Update activity tracker log (Facilitator only)
 *     tags: [Activity Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityTracker'
 *     responses:
 *       200:
 *         description: Activity log updated successfully
 *       404:
 *         description: Log not found
 */
router.put('/:id', authenticate, authorize('facilitator'), validate(schemas.activityTracker), async (req, res, next) => {
  try {
    const log = await ActivityTracker.findByPk(req.params.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering'
        }
      ]
    });

    if (!log) {
      return res.status(404).json({ error: 'Activity log not found' });
    }

    // Verify ownership
    if (log.courseOffering.facilitator_id !== req.user.facilitatorProfile.id) {
      return res.status(403).json({ error: 'Access denied. You can only update your own logs.' });
    }

    await log.update({
      ...req.body,
      submitted_at: new Date()
    });

    // Fetch updated log with relations
    const updatedLog = await ActivityTracker.findByPk(log.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: Class, as: 'class' },
            { model: Cohort, as: 'cohort' },
            { model: Mode, as: 'mode' },
            {
              model: Facilitator,
              as: 'facilitator',
              include: [{ model: User, as: 'user' }]
            }
          ]
        }
      ]
    });

    res.json(updatedLog);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /activity-tracker/{id}:
 *   delete:
 *     summary: Delete activity tracker log (Facilitator only)
 *     tags: [Activity Tracker]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity log deleted successfully
 *       404:
 *         description: Log not found
 */
router.delete('/:id', authenticate, authorize('facilitator'), async (req, res, next) => {
  try {
    const log = await ActivityTracker.findByPk(req.params.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering'
        }
      ]
    });

    if (!log) {
      return res.status(404).json({ error: 'Activity log not found' });
    }

    // Verify ownership
    if (log.courseOffering.facilitator_id !== req.user.facilitatorProfile.id) {
      return res.status(403).json({ error: 'Access denied. You can only delete your own logs.' });
    }

    await log.destroy();
    res.json({ message: 'Activity log deleted successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /activity-tracker/stats/overview:
 *   get:
 *     summary: Get activity tracker statistics (Manager only)
 *     tags: [Activity Tracker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity tracker statistics
 */
router.get('/stats/overview', authenticate, authorize('manager'), async (req, res, next) => {
  try {
    const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 7));
    
    // Get total active course offerings
    const totalCourseOfferings = await CourseOffering.count({
      where: { is_active: true }
    });

    // Get logs submitted this week
    const logsThisWeek = await ActivityTracker.count({
      where: { week_number: currentWeek }
    });

    // Get pending items across all status fields
    const pendingLogs = await ActivityTracker.count({
      where: {
        [Op.or]: [
          { formative_one_grading: 'Pending' },
          { formative_two_grading: 'Pending' },
          { summative_grading: 'Pending' },
          { course_moderation: 'Pending' },
          { intranet_sync: 'Pending' },
          { grade_book_status: 'Pending' }
        ]
      }
    });

    // Get facilitators with missing logs this week
    const facilitatorsWithMissingLogs = await CourseOffering.count({
      where: {
        is_active: true,
        facilitator_id: { [Op.not]: null }
      },
      include: [
        {
          model: ActivityTracker,
          as: 'activityTrackers',
          where: { week_number: currentWeek },
          required: false
        }
      ],
      having: sequelize.literal('COUNT(activityTrackers.id) = 0')
    });

    res.json({
      totalCourseOfferings,
      logsThisWeek,
      pendingLogs,
      facilitatorsWithMissingLogs,
      currentWeek
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
