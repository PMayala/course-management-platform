const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const { Manager, Facilitator } = require("../models")

const router = express.Router()

/**
 * @swagger
 * /auth/register/manager:
 *   post:
 *     summary: Register a new manager
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Alice
 *               lastName:
 *                 type: string
 *                 example: Johnson
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@university.edu
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Manager123!
 *     responses:
 *       201:
 *         description: Manager registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
  "/register/manager",
  [
    body("firstName").trim().isLength({ min: 2, max: 50 }),
    body("lastName").trim().isLength({ min: 2, max: 50 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
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

      const { firstName, lastName, email, password } = req.body

      const existingManager = await Manager.findOne({ where: { email } })
      if (existingManager) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        })
      }

      const manager = await Manager.create({
        firstName,
        lastName,
        email,
        password,
      })

      const token = jwt.sign({ id: manager.id, role: "manager" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      })

      res.status(201).json({
        success: true,
        message: "Manager registered successfully",
        data: {
          user: manager,
          token,
        },
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
 * /auth/register/facilitator:
 *   post:
 *     summary: Register a new facilitator
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@university.edu
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: Facilitator123!
 *               specialization:
 *                 type: string
 *                 example: JavaScript & Node.js
 *     responses:
 *       201:
 *         description: Facilitator registered successfully
 */
router.post(
  "/register/facilitator",
  [
    body("firstName").trim().isLength({ min: 2, max: 50 }),
    body("lastName").trim().isLength({ min: 2, max: 50 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("specialization").optional().trim(),
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

      const { firstName, lastName, email, password, specialization } = req.body

      const existingFacilitator = await Facilitator.findOne({ where: { email } })
      if (existingFacilitator) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        })
      }

      const facilitator = await Facilitator.create({
        firstName,
        lastName,
        email,
        password,
        specialization,
      })

      const token = jwt.sign({ id: facilitator.id, role: "facilitator" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      })

      res.status(201).json({
        success: true,
        message: "Facilitator registered successfully",
        data: {
          user: facilitator,
          token,
        },
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
 * /auth/login:
 *   post:
 *     summary: Login user (manager or facilitator)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice@university.edu
 *               password:
 *                 type: string
 *                 example: Manager123!
 *               role:
 *                 type: string
 *                 enum: [manager, facilitator]
 *                 example: manager
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    body("role").isIn(["manager", "facilitator"]),
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

      const { email, password, role } = req.body

      let user
      if (role === "manager") {
        user = await Manager.findOne({ where: { email } })
      } else {
        user = await Facilitator.findOne({ where: { email } })
      }

      if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
      }

      const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user,
          token,
        },
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
