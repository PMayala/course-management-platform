const express = require('express');
const { Module } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - credits
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         credits:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         is_active:
 *           type: boolean
 */

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get all modules
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of modules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { is_active } = req.query;
    const where = {};
    
    if (is_active !== undefined) {
      where.is_active = is_active === 'true';
    }

    const modules = await Module.findAll({ where });
    res.json(modules);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Get module by ID
 *     tags: [Modules]
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
 *         description: Module details
 *       404:
 *         description: Module not found
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module (Manager only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Module'
 *     responses:
 *       201:
 *         description: Module created successfully
 *       403:
 *         description: Access denied
 */
router.post('/', authenticate, authorize('manager'), validate(schemas.module), async (req, res, next) => {
  try {
    const module = await Module.create(req.body);
    res.status(201).json(module);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update module (Manager only)
 *     tags: [Modules]
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
 *             $ref: '#/components/schemas/Module'
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       404:
 *         description: Module not found
 */
router.put('/:id', authenticate, authorize('manager'), validate(schemas.module), async (req, res, next) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await module.update(req.body);
    res.json(module);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete module (Manager only)
 *     tags: [Modules]
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
 *         description: Module deleted successfully
 *       404:
 *         description: Module not found
 */
router.delete('/:id', authenticate, authorize('manager'), async (req, res, next) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await module.update({ is_active: false });
    res.json({ message: 'Module deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;