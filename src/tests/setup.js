const jest = require('jest');
require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.DB_NAME = 'course_management_test';

// Mock Redis for testing
jest.mock('../services/redisService', () => ({
  initializeRedis: jest.fn().mockResolvedValue(),
  getRedisClient: jest.fn().mockReturnValue({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1)
  }),
  getNotificationQueue: jest.fn().mockReturnValue({
    add: jest.fn().mockResolvedValue({}),
    process: jest.fn()
  })
}));

// Increase timeout for database operations
jest.setTimeout(10000);
