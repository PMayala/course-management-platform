const Redis = require('redis');
const Bull = require('bull');

let redisClient;
let notificationQueue;

const initializeRedis = async () => {
  try {
    redisClient = Redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null
    });

    await redisClient.connect();
    
    // Initialize Bull queue for notifications
    notificationQueue = new Bull('notification queue', {
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined
      }
    });

    console.log('Redis connected successfully');
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
};

const getRedisClient = () => redisClient;
const getNotificationQueue = () => notificationQueue;

module.exports = {
  initializeRedis,
  getRedisClient,
  getNotificationQueue
};