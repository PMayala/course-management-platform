const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const path = require("path")
require("dotenv").config()

const { sequelize } = require("./models")
const authRoutes = require("./routes/auth")
const courseRoutes = require("./routes/courses")
const facilitatorRoutes = require("./routes/facilitators")
const activityRoutes = require("./routes/activities")
const uploadRoutes = require("./routes/uploads")
const { setupSwagger } = require("./config/swagger")
const { startNotificationWorker } = require("./services/notificationService")

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "your-domain.com" : "*",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Setup Swagger documentation
setupSwagger(app)

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Course Management Platform API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/facilitators", facilitatorRoutes)
app.use("/api/activities", activityRoutes)
app.use("/api/uploads", uploadRoutes)

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error)
  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  })
})

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate()
    console.log("✅ Database connected successfully")

    // Sync database models
    await sequelize.sync({ alter: true })
    console.log("✅ Database synchronized")

    // Start notification worker
    startNotificationWorker()

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`)
      console.log(`🏥 Health check at http://localhost:${PORT}/health`)
      console.log(`📁 File uploads available at http://localhost:${PORT}/uploads`)
    })
  } catch (error) {
    console.error("❌ Unable to start server:", error)
    process.exit(1)
  }
}

startServer()
