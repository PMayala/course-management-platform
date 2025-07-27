const { getNotificationQueue } = require('./redisService');

class NotificationService {
  static async queueFacilitatorReminder(facilitatorId, courseOfferingId, weekNumber) {
    const queue = getNotificationQueue();
    
    await queue.add('facilitator-reminder', {
      facilitatorId,
      courseOfferingId,
      weekNumber,
      type: 'reminder'
    }, {
      delay: 24 * 60 * 60 * 1000, // 24 hours delay
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
  }

  static async queueManagerAlert(managerId, facilitatorId, courseOfferingId, alertType) {
    const queue = getNotificationQueue();
    
    await queue.add('manager-alert', {
      managerId,
      facilitatorId,
      courseOfferingId,
      alertType,
      type: 'alert'
    }, {
      attempts: 3,
      backoff: {
        type: 'fixed',
        delay: 5000
      }
    });
  }

  static async queueDeadlineCheck() {
    const queue = getNotificationQueue();
    
    await queue.add('deadline-check', {
      type: 'deadline-check'
    }, {
      repeat: { cron: '0 9 * * 1' }, // Every Monday at 9 AM
      attempts: 1
    });
  }
}

module.exports = NotificationService;