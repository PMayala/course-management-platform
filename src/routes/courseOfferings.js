const express = require('express');
const { Op } = require('sequelize');
const { 
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

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseOffering:
 *       type: object
 *       required:
 *         - module_id
 *         - class_id
 *         - cohort_id
 *         - mode_id
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: integer
 *         module_id:
 *           type: integer
 *         class_id:
 *           type: integer
 *         cohort_id:
 *           type: integer
 *         mode_id:
 *           type: integer
 *         facilitator_id:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         max_students:
 *           type: integer
 *         is_active:
 *           type: boolean
 */

/**
 * @swagger
 * /course-offerings:
 *   get:
 *     summary: Get course offerings with filters
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trimester
 *         schema:
 *           type: string
 *           enum: ['1', '2', '3']
 *       - in: query
 *         name: cohort_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: intake
 *         schema:
 *           type: string
 *           enum: ['HT1', 'HT2', 'FT']
 *       - in: query
 *         name: facilitator_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: mode_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of course offerings
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { trimester, cohort_id, intake, facilitator_id, mode_id } = req.query;
    
    let where = { is_active: true };
    let include = [
      { model: Module, as: 'module' },
      { model: Class, as: 'class' },
      { model: Cohort, as: 'cohort' },
      { model: Mode, as: 'mode' },
      { 
        model: Facilitator, 
        as: 'facilitator',
        include: [{ model: User, as: 'user' }]
      }
    ];

    // Apply filters
    if (facilitator_id) {
      where.facilitator_id = facilitator_id;
    }
    
    if (mode_id) {
      where.mode_id = mode_id;
    }
    
    if (cohort_id) {
      where.cohort_id = cohort_id;
    }

    // Filter by trimester or intake through Class model
    if (trimester || intake) {
      const classWhere = {};
      if (trimester) classWhere.trimester = trimester;
      if (intake) classWhere.intake_period = intake;
      
      include = include.map(inc => {
        if (inc.model === Class) {
          return { ...inc, where: classWhere };
        }
        return inc;
      });
    }

    // If user is facilitator, only show their assignments
    if (req.user.role === 'facilitator') {
      where.facilitator_id = req.user.facilitatorProfile.id;
    }

    const courseOfferings = await CourseOffering.findAll({
      where,
      include,
      order: [['created_at', 'DESC']]
    });

    res.json(courseOfferings);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /course-offerings/{id}:
 *   get:
 *     summary: Get course offering by ID
 *     tags: [Course Offerings]
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
 *         description: Course offering details
 *       404:
 *         description: Course offering not found
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const courseOffering = await CourseOffering.findByPk(req.params.id, {
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
    });

    if (!courseOffering) {
      return res.status(404).json({ error: 'Course offering not found' });
    }

    // Check access permissions
    if (req.user.role === 'facilitator' && 
        courseOffering.facilitator_id !== req.user.facilitatorProfile.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(courseOffering);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /course-offerings:
 *   post:
 *     summary: Create course offering (Manager only)
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseOffering'
 *     responses:
 *       201:
 *         description: Course offering created successfully
 */
router.post('/', authenticate, authorize('manager'), validate(schemas.courseOffering), async (req, res, next) => {
  try {
    const courseOffering = await CourseOffering.create(req.body);
    
    // Fetch the created offering with all relations
    const createdOffering = await CourseOffering.findByPk(courseOffering.id, {
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
    });

    res.status(201).json(createdOffering);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /course-offerings/{id}:
 *   put:
 *     summary: Update course offering (Manager only)
 *     tags: [Course Offerings]
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
 *             $ref: '#/components/schemas/CourseOffering'
 *     responses:
 *       200:
 *         description: Course offering updated successfully
 */
router.put('/:id', authenticate, authorize('manager'), validate(schemas.courseOffering), async (req, res, next) => {
  try {
    const courseOffering = await CourseOffering.findByPk(req.params.id);
    if (!courseOffering) {
      return res.status(404).json({ error: 'Course offering not found' });
    }

    await courseOffering.update(req.body);
    
    // Fetch updated offering with relations
    const updatedOffering = await CourseOffering.findByPk(courseOffering.id, {
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
    });

    res.json(updatedOffering);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /course-offerings/{id}:
 *   delete:
 *     summary: Delete course offering (Manager only)
 *     tags: [Course Offerings]
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
 *         description: Course offering deleted successfully
 */
router.delete('/:id', authenticate, authorize('manager'), async (req, res, next) => {
  try {
    const courseOffering = await CourseOffering.findByPk(req.params.id);
    if (!courseOffering) {
      return res.status(404).json({ error: 'Course offering not found' });
    }

    await courseOffering.update({ is_active: false });
    res.json({ message: 'Course offering deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;