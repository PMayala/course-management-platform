const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { authenticate } = require("../middleware/auth")

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = "uploads"
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt|csv|xlsx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype =
      allowedTypes.test(file.mimetype) || file.mimetype.includes("document") || file.mimetype.includes("spreadsheet")

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Invalid file type. Allowed: JPEG, PNG, PDF, DOC, DOCX, TXT, CSV, XLSX"))
    }
  },
})

/**
 * @swagger
 * /uploads/activity-document:
 *   post:
 *     summary: Upload activity-related document
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *               activityId:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file
 *       413:
 *         description: File too large
 *       500:
 *         description: Upload failed
 */
router.post("/activity-document", authenticate, upload.single("document"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    const { activityId, description } = req.body

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        mimetype: req.file.mimetype,
        activityId: activityId || null,
        description: description || null,
        uploadedBy: req.user.id,
        uploadedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "File upload failed",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /uploads/profile-picture:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 */
router.post("/profile-picture", authenticate, upload.single("picture"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    // Only allow image files for profile pictures
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed for profile pictures",
      })
    }

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path,
        url: `/uploads/${req.file.filename}`,
        uploadedBy: req.user.id,
        uploadedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile picture upload failed",
      error: error.message,
    })
  }
})

/**
 * @swagger
 * /uploads/bulk-upload:
 *   post:
 *     summary: Upload multiple files
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 */
router.post("/bulk-upload", authenticate, upload.array("files", 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      })
    }

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: file.path,
      mimetype: file.mimetype,
    }))

    res.json({
      success: true,
      message: `${req.files.length} files uploaded successfully`,
      data: {
        files: uploadedFiles,
        totalSize: req.files.reduce((total, file) => total + file.size, 0),
        uploadedBy: req.user.id,
        uploadedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk upload failed",
      error: error.message,
    })
  }
})

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File too large. Maximum size is 10MB.",
      })
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum is 5 files.",
      })
    }
  }

  res.status(400).json({
    success: false,
    message: error.message || "Upload failed",
  })
})

module.exports = router
