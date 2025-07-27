const { User } = require('../../models');
const { setupTestDb, teardownTestDb } = require('../utils/testHelpers');

describe('User Model', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  describe('User Creation', () => {
    test('should create a valid user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      const user = await User.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.first_name).toBe(userData.first_name);
      expect(user.last_name).toBe(userData.last_name);
      expect(user.role).toBe(userData.role);
      expect(user.is_active).toBe(true);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    test('should hash password before saving', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      const user = await User.create(userData);
      const isValid = await user.comparePassword('password123');

      expect(isValid).toBe(true);
    });

    test('should fail validation with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail validation with short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should fail validation with invalid role', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'invalid_role'
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should not allow duplicate emails', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      };

      await User.create(userData);
      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    test('comparePassword should work correctly', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      });

      const validPassword = await user.comparePassword('password123');
      const invalidPassword = await user.comparePassword('wrongpassword');

      expect(validPassword).toBe(true);
      expect(invalidPassword).toBe(false);
    });

    test('toJSON should exclude password', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      });

      const json = user.toJSON();

      expect(json.password).toBeUndefined();
      expect(json.email).toBe('test@example.com');
    });
  });

  describe('User Updates', () => {
    test('should hash password on update', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      });

      const originalPassword = user.password;
      await user.update({ password: 'newpassword123' });

      expect(user.password).not.toBe(originalPassword);
      expect(user.password).not.toBe('newpassword123');

      const isValid = await user.comparePassword('newpassword123');
      expect(isValid).toBe(true);
    });

    test('should not rehash password if not changed', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'student'
      });

      const originalPassword = user.password;
      await user.update({ first_name: 'Jane' });

      expect(user.password).toBe(originalPassword);
    });
  });
});
