require("dotenv").config()
const validateEnvironment = require('./src/config/validateEnv');
validateEnvironment();
const app = require("./src/app")
const { sequelize } = require("./src/models")
const logger = require("./src/utils/logger")
const cron = require("cron")
const notificationService = require("./src/services/notificationService")

const PORT = process.env.PORT || 3000

// Test database connection and sync models
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate()
    logger.info("Database connection established successfully.")

    // Sync database models (use migrations in production)
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true })
      logger.info("Database models synchronized.")
    }

    // Start cron job for reminders
    const reminderJob = new cron.CronJob(
      process.env.REMINDER_CRON_SCHEDULE || "0 9 * * MON",
      async () => {
        logger.info("Running scheduled reminder check...")
        try {
          await notificationService.checkAndSendReminders()
        } catch (error) {
          logger.error("Scheduled reminder check failed:", error)
        }
      },
      null,
      true,
      "America/New_York",
    )

    logger.info("Reminder cron job started")

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`)
      logger.info(`Student Reflection Page available at http://localhost:${PORT}/reflection`)
    })

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM signal received: closing HTTP server")
      reminderJob.destroy()
      server.close(() => {
        logger.info("HTTP server closed")
      })
      await sequelize.close()
      process.exit(0)
    })

    process.on("SIGINT", async () => {
      logger.info("SIGINT signal received: closing HTTP server")
      reminderJob.destroy()
      server.close(() => {
        logger.info("HTTP server closed")
      })
      await sequelize.close()
      process.exit(0)
    })
  } catch (error) {
    logger.error("Unable to start server:", error)
    process.exit(1)
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error)
  process.exit(1)
})

startServer()
