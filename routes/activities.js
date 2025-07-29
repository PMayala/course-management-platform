const express = require("express")
const { body, query, param, validationResult } = require("express-validator")
const { authenticate, authorize } = require("../middleware/auth")
const { ActivityTracker, CourseOffering, Module, Facilitator } = require("../models")
const { queueNotification } = require("../services/notificationService")

const router = express.Router()

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get activity logs with filters
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: facilitatorId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: allocationId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: weekNumber
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of activity logs
 */
router.get(
  "/",
  authenticate,
  [
    query("facilitatorId").optional().isInt(),
    query("allocationId").optional().isInt(),
    query("weekNumber").optional().isInt({ min: 1, max: 52 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { facilitatorId, allocationId, weekNumber } = req.query

      const whereClause = {}
      if (facilitatorId) whereClause.facilitatorId = Number.parseInt(facilitatorId)
      if (allocationId) whereClause.allocationId = Number.parseInt(allocationId)
      if (weekNumber) whereClause.weekNumber = Number.parseInt(weekNumber)

      // If user is facilitator, only show their logs
      if (req.userRole === "facilitator") {
        whereClause.facilitatorId = req.user.id
      }

      const activities = await ActivityTracker.findAll({
        where: whereClause,
        include: [
          {
            model: CourseOffering,
            include: [{ model: Module, attributes: ["name", "code"] }],
          },
          {
            model: Facilitator,
            attributes: ["firstName", "lastName", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      })

      res.json({
        success: true,
        data: activities,
        count: activities.length,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  },
)

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create or update activity log (facilitators only)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - allocationId
 *               - weekNumber
 *             properties:
 *               allocationId:
 *                 type: integer
 *               weekNumber:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 52
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: boolean
 *               formativeOneGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               formativeTwoGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               summativeGrading:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               courseModeration:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               intranetSync:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               gradeBookStatus:
 *                 type: string
 *                 enum: [Done, Pending, Not Started]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Activity log created/updated successfully
 */
router.post(
  "/",
  authenticate,
  authorize("facilitator"),
  [
    body("allocationId").isInt(),
    body("weekNumber").isInt({ min: 1, max: 52 }),
    body("attendance").optional().isArray(),
    body("formativeOneGrading").optional().isIn(["Done", "Pending", "Not Started"]),
    body("formativeTwoGrading").optional().isIn(["Done", "Pending", "Not Started"]),
    body("summativeGrading").optional().isIn(["Done", "Pending", "Not Started"]),
    body("courseModeration").optional().isIn(["Done", "Pending", "Not Started"]),
    body("intranetSync").optional().isIn(["Done", "Pending", "Not Started"]),
    body("gradeBookStatus").optional().isIn(["Done", "Pending", "Not Started"]),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { allocationId, weekNumber } = req.body

      // Verify facilitator owns this allocation
      const courseOffering = await CourseOffering.findOne({
        where: {
          id: allocationId,
          facilitatorId: req.user.id,
        },
      })

      if (!courseOffering) {
        return res.status(403).json({
          success: false,
          message: "You can only manage logs for your assigned courses",
        })
      }

      const activityData = {
        ...req.body,
        facilitatorId: req.user.id,
        submittedAt: new Date(),
      }

      const [activity, created] = await ActivityTracker.upsert(activityData, {
        returning: true,
      })

      // Queue notification to manager about submission
      await queueNotification({
        type: "activity_submitted",
        facilitatorId: req.user.id,
        allocationId,
        weekNumber,
        facilitatorName: `${req.user.firstName} ${req.user.lastName}`,
      })

      const activityWithDetails = await ActivityTracker.findByPk(activity.id, {
        include: [
          {
            model: CourseOffering,
            include: [{ model: Module, attributes: ["name", "code"] }],
          },
        ],
      })

      res.status(created ? 201 : 200).json({
        success: true,
        message: `Activity log ${created ? "created" : "updated"} successfully`,
        data: activityWithDetails,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  },
)

module.exports = router
