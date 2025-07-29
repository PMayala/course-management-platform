const {
  ActivityTracker,
  CourseOffering,
  Module,
  Cohort,
  Class,
  Mode,
  Manager,
  Facilitator,
  sequelize,
} = require("../../models")

describe("ActivityTracker Model", () => {
  let courseOffering, facilitator

  beforeEach(async () => {
    await sequelize.sync({ force: true })

    // Create test data
    const module = await Module.create({
      name: "Test Module",
      code: "TEST101",
      description: "Test module",
      credits: 3,
    })

    const cohort = await Cohort.create({
      name: "Test Cohort",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      program: "Test Program",
    })

    const classEntity = await Class.create({
      name: "2024S",
      year: 2024,
      semester: "S",
    })

    const mode = await Mode.create({
      name: "Online",
    })

    const manager = await Manager.create({
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

    courseOffering = await CourseOffering.create({
      moduleId: module.id,
      classId: classEntity.id,
      trimester: "T1",
      cohortId: cohort.id,
      intakePeriod: "HT1",
      modeId: mode.id,
      facilitatorId: facilitator.id,
      createdBy: manager.id,
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("Creation", () => {
    it("should create activity tracker with valid data", async () => {
      const activityData = {
        allocationId: courseOffering.id,
        facilitatorId: facilitator.id,
        weekNumber: 1,
        attendance: [true, false, true],
        formativeOneGrading: "Done",
        formativeTwoGrading: "Pending",
        summativeGrading: "Not Started",
        courseModeration: "Done",
        intranetSync: "Done",
        gradeBookStatus: "Pending",
        notes: "Week 1 activities completed",
      }

      const activity = await ActivityTracker.create(activityData)

      expect(activity.allocationId).toBe(courseOffering.id)
      expect(activity.weekNumber).toBe(1)
      expect(activity.formativeOneGrading).toBe("Done")
      expect(activity.attendance).toEqual([true, false, true])
    })

    it("should enforce unique constraint on allocationId and weekNumber", async () => {
      await ActivityTracker.create({
        allocationId: courseOffering.id,
        facilitatorId: facilitator.id,
        weekNumber: 1,
      })

      await expect(
        ActivityTracker.create({
          allocationId: courseOffering.id,
          facilitatorId: facilitator.id,
          weekNumber: 1,
        }),
      ).rejects.toThrow()
    })

    it("should validate status enum values", async () => {
      await expect(
        ActivityTracker.create({
          allocationId: courseOffering.id,
          facilitatorId: facilitator.id,
          weekNumber: 1,
          formativeOneGrading: "Invalid Status",
        }),
      ).rejects.toThrow()
    })

    it("should validate week number range", async () => {
      await expect(
        ActivityTracker.create({
          allocationId: courseOffering.id,
          facilitatorId: facilitator.id,
          weekNumber: 0, // Invalid
        }),
      ).rejects.toThrow()

      await expect(
        ActivityTracker.create({
          allocationId: courseOffering.id,
          facilitatorId: facilitator.id,
          weekNumber: 53, // Invalid
        }),
      ).rejects.toThrow()
    })
  })
})
