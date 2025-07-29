const Bull = require("bull")
const redisClient = require("../config/redis")

// Create notification queue
const notificationQueue = new Bull("notification queue", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
})

// Queue notification
async function queueNotification(notificationData) {
  try {
    await notificationQueue.add("send_notification", notificationData, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    })
    console.log("📧 Notification queued:", notificationData.type)
  } catch (error) {
    console.error("❌ Error queuing notification:", error)
  }
}

// Process notifications
notificationQueue.process("send_notification", async (job) => {
  const { type, facilitatorId, facilitatorName, allocationId, weekNumber } = job.data

  try {
    // Simulate sending notification (in real app, this would send email/SMS)
    console.log(`📧 Notification sent: ${type}`)
    console.log(`   Facilitator: ${facilitatorName} (ID: ${facilitatorId})`)
    console.log(`   Course Allocation: ${allocationId}`)
    console.log(`   Week: ${weekNumber}`)

    // Log to Redis for tracking
    const logKey = `notification:${Date.now()}`
    await redisClient.hSet(logKey, {
      type,
      facilitatorId: facilitatorId.toString(),
      allocationId: allocationId.toString(),
      weekNumber: weekNumber.toString(),
      sentAt: new Date().toISOString(),
      status: "sent",
    })

    await redisClient.expire(logKey, 7 * 24 * 60 * 60) // Expire after 7 days

    return { success: true, message: "Notification sent successfully" }
  } catch (error) {
    console.error("❌ Error processing notification:", error)
    throw error
  }
})

// Start background worker for checking missed deadlines
function startNotificationWorker() {
  console.log("🚀 Notification worker started")

  // Check for missed deadlines every hour
  setInterval(
    async () => {
      try {
        await checkMissedDeadlines()
      } catch (error) {
        console.error("❌ Error checking missed deadlines:", error)
      }
    },
    60 * 60 * 1000,
  ) // 1 hour
}

async function checkMissedDeadlines() {
  // This would check for facilitators who haven't submitted logs by deadline
  console.log("🔍 Checking for missed deadlines...")

  // In a real implementation, this would:
  // 1. Query database for expected submissions
  // 2. Compare with actual submissions
  // 3. Send reminder notifications for missing submissions
  // 4. Alert managers about compliance issues
}

module.exports = {
  queueNotification,
  startNotificationWorker,
}
