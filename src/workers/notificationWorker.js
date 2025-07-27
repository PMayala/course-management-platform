const { getNotificationQueue } = require('../services/redisService');
const { User, Facilitator, Manager, CourseOffering, Module, ActivityTracker } = require('../models');
const { Op } = require('sequelize');

const startNotificationWorkers = () => {
  const queue = getNotificationQueue();

  // Process facilitator reminders
  queue.process('facilitator-reminder', async (job) => {
    const { facilitatorId, courseOfferingId, weekNumber } = job.data;
    
    try {
      const facilitator = await Facilitator.findByPk(facilitatorId, {
        include: [{ model: User, as: 'user' }]
      });

      const courseOffering = await CourseOffering.findByPk(courseOfferingId, {
        include: [{ model: Module, as: 'module' }]
      });

      // Check if activity tracker exists for this week
      const activityTracker = await ActivityTracker.findOne({
        where: {
          allocation_id: courseOfferingId,
          week_number: weekNumber
        }
      });

      if (!activityTracker) {
        console.log(`Reminder: Facilitator ${facilitator.user.first_name} ${facilitator.user.last_name} needs to submit activity log for week ${weekNumber} of ${courseOffering.module.name}`);
        
        // Here you would typically send an email notification
        // For demo purposes, we'll just log it
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing facilitator reminder:', error);
      throw error;
    }
  });

  // Process manager alerts
  queue.process('manager-alert', async (job) => {
    const { managerId, facilitatorId, courseOfferingId, alertType } = job.data;
    
    try {
      const manager = await Manager.findByPk(managerId, {
        include: [{ model: User, as: 'user' }]
      });

      const facilitator = await Facilitator.findByPk(facilitatorId, {
        include: [{ model: User, as: 'user' }]
      });

      console.log(`Alert to Manager ${manager.user.first_name}: ${alertType} for facilitator ${facilitator.user.first_name} ${facilitator.user.last_name}`);
      
      return { success: true };
    } catch (error) {
      console.error('Error processing manager alert:', error);
      throw error;
    }
  });

  // Process deadline checks
  queue.process('deadline-check', async (job) => {
    try {
      const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 7));
      
      // Find all active course offerings
      const activeOfferings = await CourseOffering.findAll({
        where: { is_active: true },
        include: [
          { model: Facilitator, as: 'facilitator' },
          { model: Module, as: 'module' }
        ]
      });

      for (const offering of activeOfferings) {
        if (offering.facilitator) {
          // Check if activity tracker exists for current week
          const tracker = await ActivityTracker.findOne({
            where: {
              allocation_id: offering.id,
              week_number: currentWeek
            }
          });

          if (!tracker) {
            // Queue reminder for facilitator
            await queue.add('facilitator-reminder', {
              facilitatorId: offering.facilitator.id,
              courseOfferingId: offering.id,
              weekNumber: currentWeek
            });
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing deadline check:', error);
      throw error;
    }
  });

  console.log('Notification workers started successfully');
};

module.exports = { startNotificationWorkers };