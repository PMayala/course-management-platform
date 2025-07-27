const express = require('express');
const { Op } = require('sequelize');
const { User, Manager, Facilitator, Student } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Manager only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [manager, facilitator, student]
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authenticate, authorize('manager'), async (req, res, next) => {
  try {
    const { role, is_active, search } = req.query;
    
    let where = {};
    
    if (role) {
      where.role = role;
    }
    
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }
    
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const users = await User.findAll({
      where,
      include: [
        { model: Manager, as: 'managerProfile' },
        { model: Facilitator, as: 'facilitatorProfile' },
        { model: Student, as: 'studentProfile' }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (Manager only)
 *     tags: [Users]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticate, authorize('manager'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Manager, as: 'managerProfile' },
        { model: Facilitator, as: 'facilitatorProfile' },
        { model: Student, as: 'studentProfile' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/{id}/activate:
 *   patch:
 *     summary: Activate/deactivate user (Manager only)
 *     tags: [Users]
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
 *             type: object
 *             properties:
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       404:
 *         description: User not found
 */
router.patch('/:id/activate', authenticate, authorize('manager'), async (req, res, next) => {
  try {
    const { is_active } = req.body;
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ is_active });
    
    res.json({ 
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /users/facilitators/active:
 *   get:
 *     summary: Get all active facilitators
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active facilitators
 */
router.get('/facilitators/active', authenticate, async (req, res, next) => {
  try {
    const facilitators = await User.findAll({
      where: { 
        role: 'facilitator',
        is_active: true
      },
      include: [
        { model: Facilitator, as: 'facilitatorProfile' }
      ],
      order: [['first_name', 'ASC']]
    });

    res.json(facilitators);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
