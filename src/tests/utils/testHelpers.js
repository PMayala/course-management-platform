const { sequelize, User } = require('../../models');

const setupTestDb = async () => {
  await sequelize.sync({ force: true });
};

const teardownTestDb = async () => {
  await sequelize.close();
};

const createTestUser = async (role = 'student', userData = {}) => {
  const defaultData = {
    email: `test-${role}-${Date.now()}@example.com`,
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    role: role,
    is_active: true
  };

  return await User.create({ ...defaultData, ...userData });
};

const createAuthToken = (user) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = {
  setupTestDb,
  teardownTestDb,
  createTestUser,
  createAuthToken
};
