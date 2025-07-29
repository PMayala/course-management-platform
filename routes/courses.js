const express = require("express")
const { body, query, param, validationResult } = require("express-validator")
const { authenticate, authorize } = require("../middleware/auth")
const { CourseOffering, Module, Cohort, Class, Mode, Facilitator, Manager } = require("../models")

const router = express.Router()

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all course offerings with filters
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trimester
 *         schema:
 *           type: string
 *           enum: [T1, T2, T3]
 *       - in: query
 *         name: cohortId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: intakePeriod
 *         schema:
 *           type: string
 *           enum: [HT1, HT2, FT]
 *       - in: query
 *         name: facilitatorId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: modeId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of course offerings
 */
router.get(
  "/",
  authenticate,
  [
    query("trimester").optional().isIn(["T1", "T2", "T3"]),
    query("cohortId").optional().isInt(),
    query("intakePeriod").optional().isIn(["HT1", "HT2", "FT"]),
    query("facilitatorId").optional().isInt(),
    query("modeId").optional().isInt(),
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

      const { trimester, cohortId, intakePeriod, facilitatorId, modeId } = req.query

      const whereClause = {}
      if (trimester) whereClause.trimester = trimester
      if (cohortId) whereClause.cohortId = Number.parseInt(cohortId)
      if (intakePeriod) whereClause.intakePeriod = intakePeriod
      if (facilitatorId) whereClause.facilitatorId = Number.parseInt(facilitatorId)
      if (modeId) whereClause.modeId = Number.parseInt(modeId)

      // If user is facilitator, only show their assigned courses
      if (req.userRole === "facilitator") {
        whereClause.facilitatorId = req.user.id
      }

      const courses = await CourseOffering.findAll({
        where: whereClause,
        include: [
          { model: Module, attributes: ["id", "name", "code", "credits"] },
          { model: Cohort, attributes: ["id", "name", "program"] },
          { model: Class, attributes: ["id", "name", "year", "semester"] },
          { model: Mode, attributes: ["id", "name"] },
          { model: Facilitator, attributes: ["id", "firstName", "lastName", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      })

      res.json({
        success: true,
        data: courses,
        count: courses.length,
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
 * /courses:
 *   post:
 *     summary: Create a new course offering (managers only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *               - classId
 *               - trimester
 *               - cohortId
 *               - intakePeriod
 *               - modeId
 *             properties:
 *               moduleId:
 *                 type: integer
 *               classId:
 *                 type: integer
 *               trimester:
 *                 type: string
 *                 enum: [T1, T2, T3]
 *               cohortId:
 *                 type: integer
 *               intakePeriod:
 *                 type: string
 *                 enum: [HT1, HT2, FT]
 *               modeId:
 *                 type: integer
 *               facilitatorId:
 *                 type: integer
 *               maxCapacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Course offering created successfully
 */
router.post(
  "/",
  authenticate,
  authorize("manager"),
  [
    body("moduleId").isInt(),
    body("classId").isInt(),
    body("trimester").isIn(["T1", "T2", "T3"]),
    body("cohortId").isInt(),
    body("intakePeriod").isIn(["HT1", "HT2", "FT"]),
    body("modeId").isInt(),
    body("facilitatorId").optional().isInt(),
    body("maxCapacity").optional().isInt({ min: 1 }),
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

      const courseData = {
        ...req.body,
        createdBy: req.user.id,
      }

      const course = await CourseOffering.create(courseData)

      const courseWithDetails = await CourseOffering.findByPk(course.id, {
        include: [
          { model: Module, attributes: ["id", "name", "code"] },
          { model: Cohort, attributes: ["id", "name"] },
          { model: Class, attributes: ["id", "name"] },
          { model: Mode, attributes: ["id", "name"] },
          { model: Facilitator, attributes: ["id", "firstName", "lastName"] },
        ],
      })

      res.status(201).json({
        success: true,
        message: "Course offering created successfully",
        data: courseWithDetails,
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
 * /courses/{id}:
 *   put:
 *     summary: Update a course offering (managers only)
 *     tags: [Courses]
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
 *         description: Course offering updated successfully
 */
router.put(
  "/:id",
  authenticate,
  authorize("manager"),
  [
    param("id").isInt(),
    body("moduleId").optional().isInt(),
    body("facilitatorId").optional().isInt(),
    body("maxCapacity").optional().isInt({ min: 1 }),
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

      const { id } = req.params
      const course = await CourseOffering.findByPk(id)

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course offering not found",
        })
      }

      await course.update(req.body)

      const updatedCourse = await CourseOffering.findByPk(id, {
        include: [
          { model: Module, attributes: ["id", "name", "code"] },
          { model: Cohort, attributes: ["id", "name"] },
          { model: Class, attributes: ["id", "name"] },
          { model: Mode, attributes: ["id", "name"] },
          { model: Facilitator, attributes: ["id", "firstName", "lastName"] },
        ],
      })

      res.json({
        success: true,
        message: "Course offering updated successfully",
        data: updatedCourse,
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
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course offering (managers only)
 *     tags: [Courses]
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
router.delete("/:id", authenticate, authorize("manager"), [param("id").isInt()], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { id } = req.params
    const course = await CourseOffering.findByPk(id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course offering not found",
      })
    }

    await course.destroy()

    res.json({
      success: true,
      message: "Course offering deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
})

module.exports = router
