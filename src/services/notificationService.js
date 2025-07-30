const { notificationQueue, reminderQueue } = require('../config/redis');
const { User, Facilitator, Manager, ActivityTracker, CourseOffering } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class NotificationService {
  // Queue a notification
  async queueNotification(type, data) {
    try {
      const job = await notificationQueue.add(type, data);
      logger.info(`Notification queued: ${type}, Job ID: ${job.id}`);
      return job;
    } catch (error) {
      logger.error('Failed to queue notification:', error);
      throw error;
    }
  }

  // Queue a reminder
  async queueReminder(data, delay = 0) {
    try {
      const job = await reminderQueue.add('activity-reminder', data, { delay });
      logger.info(`Reminder queued for delay: ${delay}ms, Job ID: ${job.id}`);
      return job;
    } catch (error) {
      logger.error('Failed to queue reminder:', error);
      throw error;
    }
  }

  // Send reminder to facilitator
  async sendFacilitatorReminder(facilitatorId, courseOfferingId, weekNumber) {
    try {
      const facilitator = await Facilitator.findByPk(facilitatorId, {
        include: [{ model: User, as: 'user' }]
      });

      if (!facilitator) {
        throw new Error('Facilitator not found');
      }

      const courseOffering = await CourseOffering.findByPk(courseOfferingId, {
        include: ['module', 'class', 'cohort']
      });

      const notificationData = {
        to: facilitator.user.email,
        subject: `Activity Log Reminder - Week ${weekNumber}`,
        template: 'activity-reminder',
        data: {
          facilitatorName: facilitator.user.getFullName(),
          courseName: courseOffering.module.name,
          className: courseOffering.class.name,
          cohortName: courseOffering.cohort.name,
          weekNumber,
          dueDate: this.calculateDueDate()
        }
      };

      await this.queueNotification('email', notificationData);
      
      // Update activity tracker reminder count
      const activityLog = await ActivityTracker.findOne({
        where: {
          allocationId: courseOfferingId,
          weekNumber
        }
      });

      if (activityLog) {
        await activityLog.incrementReminderCount();
      }

      return true;
    } catch (error) {
      logger.error('Failed to send facilitator reminder:', error);
      throw error;
    }
  }

  // Send alert to managers
  async sendManagerAlert(type, data) {
    try {
      const managers = await Manager.findAll({
        include: [{ model: User, as: 'user', where: { isActive: true } }]
      });

      const notifications = managers.map(manager => ({
        to: manager.user.email,
        subject: this.getAlertSubject(type),
        template: 'manager-alert',
        data: {
          managerName: manager.user.getFullName(),
          alertType: type,
          ...data
        }
      }));

      // Queue all notifications
      await Promise.all(
        notifications.map(notification => 
          this.queueNotification('email', notification)
        )
      );

      return true;
    } catch (error) {
      logger.error('Failed to send manager alert:', error);
      throw error;
    }
  }

  // Check for missing activity logs and send reminders
  async checkAndSendReminders() {
    try {
      const currentWeek = this.getCurrentWeek();
      const deadlineHours = parseInt(process.env.NOTIFICATION_DEADLINE_HOURS) || 48;
      const deadline = new Date();
      deadline.setHours(deadline.getHours() - deadlineHours);

      // Find all active course offerings
      const activeOfferings = await CourseOffering.findAll({
        where: { status: 'active' },
        include: ['facilitator']
      });

      for (const offering of activeOfferings) {
        // Check if activity log exists for current week
        const activityLog = await ActivityTracker.findOne({
          where: {
            allocationId: offering.id,
            weekNumber: currentWeek
          }
        });

        // If no log or incomplete log past deadline
        if (!activityLog || (!activityLog.submittedAt && activityLog.createdAt < deadline)) {
          // Send reminder if not sent recently (within 24 hours)
          const lastReminderTime = activityLog?.lastReminderSent || new Date(0);
          const hoursSinceLastReminder = (Date.now() - lastReminderTime) / (1000 * 60 * 60);
          
          if (hoursSinceLastReminder > 24) {
            await this.sendFacilitatorReminder(
              offering.facilitatorId,
              offering.id,
              currentWeek
            );
          }
        }

        // Alert managers about critical missing logs
        if (!activityLog && new Date() > deadline) {
          await this.sendManagerAlert('missing-activity-log', {
            facilitatorName: offering.facilitator.user.getFullName(),
            courseName: offering.module.name,
            weekNumber: currentWeek
          });
        }
      }

      return true;
    } catch (error) {
      logger.error('Failed to check and send reminders:', error);
      throw error;
    }
  }

  // Calculate due date for activity logs
  calculateDueDate() {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 2); // 48 hours from now
    return dueDate;
  }

  // Get current week number (simplified - in production, calculate based on course start date)
  getCurrentWeek() {
    // This is a simplified version. In production, calculate based on course start date
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((new Date() - startOfYear) / 86400000 + 1) / 7);
    return weekNumber % 16 || 16; // Assuming 16-week courses
  }

  // Get alert subject based on type
  getAlertSubject(type) {
    const subjects = {
      'missing-activity-log': 'Missing Activity Log Alert',
      'activity-submitted': 'Activity Log Submitted',
      'deadline-missed': 'Activity Log Deadline Missed',
      'course-update': 'Course Allocation Update'
    };
    return subjects[type] || 'System Alert';
  }

  // Process submission notification
  async notifyActivitySubmission(activityTrackerId) {
    try {
      const activityLog = await ActivityTracker.findByPk(activityTrackerId, {
        include: [{
          model: CourseOffering,
          as: 'courseOffering',
          include: ['module', 'facilitator']
        }]
      });

      if (!activityLog) {
        throw new Error('Activity log not found');
      }

      // Notify managers about submission
      await this.sendManagerAlert('activity-submitted', {
        facilitatorName: activityLog.courseOffering.facilitator.user.getFullName(),
        courseName: activityLog.courseOffering.module.name,
        weekNumber: activityLog.weekNumber,
        completionPercentage: activityLog.getCompletionPercentage(),
        submittedAt: activityLog.submittedAt
      });

      return true;
    } catch (error) {
      logger.error('Failed to notify activity submission:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();