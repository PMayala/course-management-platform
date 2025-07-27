const express = require('express');
const { Op } = require('sequelize');
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
 *         name: cohort_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: class_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: module_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: string
 *       - in: query
 *         name: facilitator_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: manager_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Activity tracker logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityTracker'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
