const express = require("express")
const { authenticate, authorize } = require("../middleware/auth")
const { Facilitator, CourseOffering, Module, Cohort, Class, Mode } = require("../models")

const router = express.Router()

/**
 * @swagger
 * /facilitators:
 *   get:
 *     summary: Get all facilitators (managers only)
 *     tags: [Facilitators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of facilitators
 */
router.get("/", authenticate, authorize("manager"), async (req, res) => {
  try {
    const facilitators = await Facilitator.findAll({
      attributes: ["id", "firstName", "lastName", "email", "specialization"],
      order: [["firstName", "ASC"]],
    })

    res.json({
      success: true,
      data: facilitators,
      count: facilitators.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /facilitators/my-courses:
 *   get:
 *     summary: Get courses assigned to current facilitator
 *     tags: [Facilitators]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assigned courses
 */
router.get("/my-courses", authenticate, authorize("facilitator"), async (req, res) => {
  try {
    const courses = await CourseOffering.findAll({
      where: { facilitatorId: req.user.id },
      include: [
        { model: Module, attributes: ["id", "name", "code", "credits"] },
        { model: Cohort, attributes: ["id", "name", "program"] },
        { model: Class, attributes: ["id", "name", "year", "semester"] },
        { model: Mode, attributes: ["id", "name"] },
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
})

module.exports = router
