const { CourseOffering, Module, Cohort, Class, Mode, Manager, Facilitator, sequelize } = require("../../models")

describe("CourseOffering Model", () => {
  let module, cohort, classEntity, mode, manager, facilitator

  beforeEach(async () => {
    await sequelize.sync({ force: true })

    // Create test data
    module = await Module.create({
      name: "JavaScript Fundamentals",
      code: "JS101",
      description: "Introduction to JavaScript",
      credits: 3,
    })

    cohort = await Cohort.create({
      name: "Cohort 2024A",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      program: "Full Stack Development",
    })

    classEntity = await Class.create({
      name: "2024S",
      year: 2024,
      semester: "S",
    })

    mode = await Mode.create({
      name: "Online",
      description: "Online learning mode",
    })

    manager = await Manager.create({
      firstName: "Manager",
      lastName: "User",
      email: "manager@example.com",
      password: "password123",
    })

    facilitator = await Facilitator.create({
      firstName: "Facilitator",
      lastName: "User",
      email: "facilitator@example.com",
      password: "password123",
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("Creation", () => {
    it("should create a course offering with valid data", async () => {
      const courseData = {
        moduleId: module.id,
        classId: classEntity.id,
        trimester: "T1",
        cohortId: cohort.id,
        intakePeriod: "HT1",
        modeId: mode.id,
        facilitatorId: facilitator.id,
        createdBy: manager.id,
        maxCapacity: 30,
      }

      const course = await CourseOffering.create(courseData)

      expect(course.moduleId).toBe(module.id)
      expect(course.trimester).toBe("T1")
      expect(course.intakePeriod).toBe("HT1")
      expect(course.maxCapacity).toBe(30)
      expect(course.currentEnrollment).toBe(0)
    })

    it("should fail with invalid trimester", async () => {
      const courseData = {
        moduleId: module.id,
        classId: classEntity.id,
        trimester: "T4", // Invalid
        cohortId: cohort.id,
        intakePeriod: "HT1",
        modeId: mode.id,
        createdBy: manager.id,
      }

      await expect(CourseOffering.create(courseData)).rejects.toThrow()
    })

    it("should fail with invalid intake period", async () => {
      const courseData = {
        moduleId: module.id,
        classId: classEntity.id,
        trimester: "T1",
        cohortId: cohort.id,
        intakePeriod: "INVALID", // Invalid
        modeId: mode.id,
        createdBy: manager.id,
      }

      await expect(CourseOffering.create(courseData)).rejects.toThrow()
    })
  })

  describe("Associations", () => {
    it("should load associated models correctly", async () => {
      const course = await CourseOffering.create({
        moduleId: module.id,
        classId: classEntity.id,
        trimester: "T1",
        cohortId: cohort.id,
        intakePeriod: "HT1",
        modeId: mode.id,
        facilitatorId: facilitator.id,
        createdBy: manager.id,
      })

      const courseWithAssociations = await CourseOffering.findByPk(course.id, {
        include: [Module, Cohort, Class, Mode, Facilitator, Manager],
      })

      expect(courseWithAssociations.Module.name).toBe("JavaScript Fundamentals")
      expect(courseWithAssociations.Cohort.name).toBe("Cohort 2024A")
      expect(courseWithAssociations.Facilitator.firstName).toBe("Facilitator")
    })
  })
})
