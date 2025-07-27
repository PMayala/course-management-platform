const NotificationService = require('../../services/notificationService');
const { getNotificationQueue } = require('../../services/redisService');
const { setupTestDb, teardownTestDb } = require('../utils/testHelpers');
const jest = require('jest'); // Import jest to declare the variable

// Mock Redis and Bull
jest.mock('../../services/redisService');

describe('NotificationService', () => {
  let mockQueue;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(() => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({}),
    };
    getNotificationQueue.mockReturnValue(mockQueue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('queueFacilitatorReminder', () => {
    test('should queue facilitator reminder successfully', async () => {
      const facilitatorId = 1;
      const courseOfferingId = 1;
      const weekNumber = 5;

      await NotificationService.queueFacilitatorReminder(
        facilitatorId,
        courseOfferingId,
        weekNumber
      );

      expect(mockQueue.add).toHaveBeenCalledWith(
        'facilitator-reminder',
        {
          facilitatorId,
          courseOfferingId,
          weekNumber,
          type: 'reminder'
        },
        {
          delay: 24 * 60 * 60 * 1000,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000
          }
        }
      );
    });

    test('should handle queue errors gracefully', async () => {
      mockQueue.add.mockRejectedValue(new Error('Redis connection failed'));

      await expect(
        NotificationService.queueFacilitatorReminder(1, 1, 5)
      ).rejects.toThrow('Redis connection failed');
    });
  });

  describe('queueManagerAlert', () => {
    test('should queue manager alert successfully', async () => {
      const managerId = 1;
      const facilitatorId = 2;
      const courseOfferingId = 1;
      const alertType = 'late_submission';

      await NotificationService.queueManagerAlert(
        managerId,
        facilitatorId,
        courseOfferingId,
        alertType
      );

      expect(mockQueue.add).toHaveBeenCalledWith(
        'manager-alert',
        {
          managerId,
          facilitatorId,
          courseOfferingId,
          alertType,
          type: 'alert'
        },
        {
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 5000
          }
        }
      );
    });

    test('should handle null managerId', async () => {
      await NotificationService.queueManagerAlert(
        null,
        2,
        1,
        'activity_log_submitted'
      );

      expect(mockQueue.add).toHaveBeenCalledWith(
        'manager-alert',
        {
          managerId: null,
          facilitatorId: 2,
          courseOfferingId: 1,
          alertType: 'activity_log_submitted',
          type: 'alert'
        },
        expect.any(Object)
      );
    });
  });

  describe('queueDeadlineCheck', () => {
    test('should queue deadline check successfully', async () => {
      await NotificationService.queueDeadlineCheck();

      expect(mockQueue.add).toHaveBeenCalledWith(
        'deadline-check',
        {
          type: 'deadline-check'
        },
        {
          repeat: { cron: '0 9 * * 1' },
          attempts: 1
        }
      );
    });
  });

  describe('Error Handling', () => {
    test('should propagate queue errors', async () => {
      const error = new Error('Queue is full');
      mockQueue.add.mockRejectedValue(error);

      await expect(
        NotificationService.queueFacilitatorReminder(1, 1, 5)
      ).rejects.toThrow('Queue is full');

      await expect(
        NotificationService.queueManagerAlert(1, 2, 1, 'test')
      ).rejects.toThrow('Queue is full');

      await expect(
        NotificationService.queueDeadlineCheck()
      ).rejects.toThrow('Queue is full');
    });
  });
});
