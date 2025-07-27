const { Module } = require('../../models');
const { setupTestDb, teardownTestDb } = require('../utils/testHelpers');

describe('Module Model', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await Module.destroy({ where: {}, force: true });
  });

  describe('Module Creation', () => {
    test('should create a valid module', async () => {
      const moduleData = {
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 3
      };

      const module = await Module.create(moduleData);

      expect(module.code).toBe(moduleData.code);
      expect(module.name).toBe(moduleData.name);
      expect(module.description).toBe(moduleData.description);
      expect(module.credits).toBe(moduleData.credits);
      expect(module.is_active).toBe(true);
    });

    test('should fail validation with short code', async () => {
      const moduleData = {
        code: 'CS',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 3
      };

      await expect(Module.create(moduleData)).rejects.toThrow();
    });

    test('should fail validation with long code', async () => {
      const moduleData = {
        code: 'VERYLONGMODULECODEHERE',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 3
      };

      await expect(Module.create(moduleData)).rejects.toThrow();
    });

    test('should fail validation with short name', async () => {
      const moduleData = {
        code: 'CS101',
        name: 'CS',
        description: 'Basic programming concepts',
        credits: 3
      };

      await expect(Module.create(moduleData)).rejects.toThrow();
    });

    test('should fail validation with invalid credits (too low)', async () => {
      const moduleData = {
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 0
      };

      await expect(Module.create(moduleData)).rejects.toThrow();
    });

    test('should fail validation with invalid credits (too high)', async () => {
      const moduleData = {
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 15
      };

      await expect(Module.create(moduleData)).rejects.toThrow();
    });

    test('should not allow duplicate codes', async () => {
      const moduleData = {
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 3
      };

      await Module.create(moduleData);
      await expect(Module.create(moduleData)).rejects.toThrow();
    });
  });

  describe('Module Updates', () => {
    test('should update module successfully', async () => {
      const module = await Module.create({
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 3
      });

      await module.update({
        name: 'Advanced Programming',
        credits: 4
      });

      expect(module.name).toBe('Advanced Programming');
      expect(module.credits).toBe(4);
      expect(module.code).toBe('CS101'); // Should remain unchanged
    });

    test('should soft delete module by setting is_active to false', async () => {
      const module = await Module.create({
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts',
        credits: 3
      });

      await module.update({ is_active: false });

      expect(module.is_active).toBe(false);
    });
  });

  describe('Module Queries', () => {
    beforeEach(async () => {
      await Module.bulkCreate([
        {
          code: 'CS101',
          name: 'Introduction to Programming',
          description: 'Basic programming concepts',
          credits: 3,
          is_active: true
        },
        {
          code: 'CS201',
          name: 'Advanced Programming',
          description: 'Advanced programming concepts',
          credits: 4,
          is_active: true
        },
        {
          code: 'CS301',
          name: 'Inactive Module',
          description: 'This module is inactive',
          credits: 2,
          is_active: false
        }
      ]);
    });

    test('should find active modules', async () => {
      const activeModules = await Module.findAll({
        where: { is_active: true }
      });

      expect(activeModules).toHaveLength(2);
      expect(activeModules.every(module => module.is_active)).toBe(true);
    });

    test('should find module by code', async () => {
      const module = await Module.findOne({
        where: { code: 'CS101' }
      });

      expect(module).toBeTruthy();
      expect(module.name).toBe('Introduction to Programming');
    });

    test('should order modules by name', async () => {
      const modules = await Module.findAll({
        where: { is_active: true },
        order: [['name', 'ASC']]
      });

      expect(modules[0].name).toBe('Advanced Programming');
      expect(modules[1].name).toBe('Introduction to Programming');
    });
  });
});
