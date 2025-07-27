const { CourseOffering, Module, Class, Cohort, Mode, Facilitator, User } = require('../../models');
const { setupTestDb, teardownTestDb, createTestUser } = require('../utils/testHelpers');

describe('CourseOffering Model', () => {
  let testModule, testClass, testCohort, testMode, testFacilitator;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    // Clean up
    await CourseOffering.destroy({ where: {}, force: true });
    await Module.destroy({ where: {}, force: true });
    await Class.destroy({ where: {}, force: true });
    await Cohort.destroy({ where: {}, force: true });
    await Mode.destroy({ where: {}, force: true });
    await Facilitator.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    // Create test data
    const facilitatorUser = await createTestUser('facilitator');
    testFacilitator = await Facilitator.create({
      user_id: facilitatorUser.id,
      specialization: 'Web Development',
      employee_id: 'FAC001'
    });

    testModule = await Module.create({
      code: 'CS101',
      name: 'Introduction to Programming',
      description: 'Basic programming concepts',
      credits: 3
    });

    testClass = await Class.create({
      name: '2024T1',
      year: 2024,
      trimester: '1',
      intake_period: 'HT1'
    });

    testCohort = await Cohort.create({
      name: '2024 January Intake',
      description: 'Students starting in January 2024',
      start_date: new Date('2024-01-15'),
      end_date: new Date('2024-12-15')
    });

    testMode = await Mode.create({
      name: 'online',
      description: 'Online delivery mode'
    });
  });

  describe('CourseOffering Creation', () => {
    test('should create a valid course offering', async () => {
      const courseOfferingData = {
        module_id: testModule.id,
        class_id: testClass.id,
        cohort_id: testCohort.id,
        mode_id: testMode.id,
        facilitator_id: testFacilitator.id,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 30
      };

      const courseOffering = await CourseOffering.create(courseOfferingData);

      expect(courseOffering.module_id).toBe(testModule.id);
      expect(courseOffering.class_id).toBe(testClass.id);
      expect(courseOffering.cohort_id).toBe(testCohort.id);
      expect(courseOffering.mode_id).toBe(testMode.id);
      expect(courseOffering.facilitator_id).toBe(testFacilitator.id);
      expect(courseOffering.max_students).toBe(30);
      expect(courseOffering.is_active).toBe(true);
    });

    test('should create course offering without facilitator', async () => {
      const courseOfferingData = {
        module_id: testModule.id,
        class_id: testClass.id,
        cohort_id: testCohort.id,
        mode_id: testMode.id,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 30
      };

      const courseOffering = await CourseOffering.create(courseOfferingData);

      expect(courseOffering.facilitator_id).toBeNull();
      expect(courseOffering.is_active).toBe(true);
    });

    test('should fail validation with end_date before start_date', async () => {
      const courseOfferingData = {
        module_id: testModule.id,
        class_id: testClass.id,
        cohort_id: testCohort.id,
        mode_id: testMode.id,
        facilitator_id: testFacilitator.id,
        start_date: new Date('2024-04-15'),
        end_date: new Date('2024-01-15'),
        max_students: 30
      };

      await expect(CourseOffering.create(courseOfferingData)).rejects.toThrow();
    });

    test('should not allow duplicate course offerings', async () => {
      const courseOfferingData = {
        module_id: testModule.id,
        class_id: testClass.id,
        cohort_id: testCohort.id,
        mode_id: testMode.id,
        facilitator_id: testFacilitator.id,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 30
      };

      await CourseOffering.create(courseOfferingData);
      await expect(CourseOffering.create(courseOfferingData)).rejects.toThrow();
    });
  });

  describe('CourseOffering Associations', () => {
    test('should include related models', async () => {
      const courseOffering = await CourseOffering.create({
        module_id: testModule.id,
        class_id: testClass.id,
        cohort_id: testCohort.id,
        mode_id: testMode.id,
        facilitator_id: testFacilitator.id,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 30
      });

      const courseOfferingWithAssociations = await CourseOffering.findByPk(courseOffering.id, {
        include: [
          { model: Module, as: 'module' },
          { model: Class, as: 'class' },
          { model: Cohort, as: 'cohort' },
          { model: Mode, as: 'mode' },
          { model: Facilitator, as: 'facilitator' }
        ]
      });

      expect(courseOfferingWithAssociations.module.code).toBe('CS101');
      expect(courseOfferingWithAssociations.class.name).toBe('2024T1');
      expect(courseOfferingWithAssociations.cohort.name).toBe('2024 January Intake');
      expect(courseOfferingWithAssociations.mode.name).toBe('online');
      expect(courseOfferingWithAssociations.facilitator.id).toBe(testFacilitator.id);
    });
  });

  describe('CourseOffering Updates', () => {
    test('should update course offering successfully', async () => {
      const courseOffering = await CourseOffering.create({
        module_id: testModule.id,
        class_id: testClass.id,
        cohort_id: testCohort.id,
        mode_id: testMode.id,
        facilitator_id: testFacilitator.id,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 30
      });

      await courseOffering.update({
        max_students: 25,
        facilitator_id: null
      });

      expect(courseOffering.max_students).toBe(25);
      expect(courseOffering.facilitator_id).toBeNull();
    });

    test('should soft delete course offering', async () => {
      const courseOffering = await CourseOffering.create({
        module_id: testModule.id,
        class_id: testClass.id,
        cohort_id: testCohort.id,
        mode_id: testMode.id,
        facilitator_id: testFacilitator.id,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 30
      });

      await courseOffering.update({ is_active: false });

      expect(courseOffering.is_active).toBe(false);
    });
  });
});
