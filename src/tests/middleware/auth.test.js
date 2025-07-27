const jwt = require('jsonwebtoken');
const { authenticate, authorize } = require('../../middleware/auth');
const { User, Manager, Facilitator, Student } = require('../../models');
const { setupTestDb, teardownTestDb, createTestUser } = require('../utils/testHelpers');
const jest = require('jest'); // Import jest to fix the undeclared variable error

describe('Auth Middleware', () => {
  let testUser, testManager, testFacilitator;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    // Clean up
    await User.destroy({ where: {}, force: true });
    await Manager.destroy({ where: {}, force: true });
    await Facilitator.destroy({ where: {}, force: true });
    await Student.destroy({ where: {}, force: true });

    // Create test users
    testUser = await createTestUser('student');
    
    const managerUser = await createTestUser('manager');
    testManager = await Manager.create({
      user_id: managerUser.id,
      department: 'Computer Science',
      employee_id: 'MGR001'
    });

    const facilitatorUser = await createTestUser('facilitator');
    testFacilitator = await Facilitator.create({
      user_id: facilitatorUser.id,
      specialization: 'Web Development',
      employee_id: 'FAC001'
    });
  });

  describe('authenticate middleware', () => {
    test('should authenticate valid token', async () => {
      const token = jwt.sign(
        { id: testUser.id, email: testUser.email, role: testUser.role },
        process.env.JWT_SECRET
      );

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`)
      };
      const res = {};
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.id).toBe(testUser.id);
      expect(next).toHaveBeenCalled();
    });

    test('should reject request without token', async () => {
      const req = {
        header: jest.fn().mockReturnValue(null)
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Access denied. No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject invalid token', async () => {
      const req = {
        header: jest.fn().mockReturnValue('Bearer invalid-token')
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid token.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject token for inactive user', async () => {
      await testUser.update({ is_active: false });

      const token = jwt.sign(
        { id: testUser.id, email: testUser.email, role: testUser.role },
        process.env.JWT_SECRET
      );

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`)
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid token.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject token for non-existent user', async () => {
      const token = jwt.sign(
        { id: 999, email: 'nonexistent@test.com', role: 'student' },
        process.env.JWT_SECRET
      );

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`)
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid token.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    test('should allow access for authorized role', () => {
      const req = {
        user: { role: 'manager' }
      };
      const res = {};
      const next = jest.fn();

      const middleware = authorize('manager');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should allow access for multiple authorized roles', () => {
      const req = {
        user: { role: 'facilitator' }
      };
      const res = {};
      const next = jest.fn();

      const middleware = authorize('manager', 'facilitator');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should deny access for unauthorized role', () => {
      const req = {
        user: { role: 'student' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      const middleware = authorize('manager');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Access denied. Insufficient permissions.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should deny access when user is not authenticated', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      const middleware = authorize('manager');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Access denied. Not authenticated.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
