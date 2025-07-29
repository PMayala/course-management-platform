const request = require("supertest")
const express = require("express")
const { sequelize, Manager, Module, Cohort, Class, Mode } = require("../../models")
const courseRoutes = require("../../routes/courses")
const { authenticate } = require("../../middleware/auth")

const app = express()
app.use(express.json())
app.use("/api/courses", courseRoutes)

describe("Course Routes", () => {
  let managerToken
  const testData = {}

  beforeEach(async () => {
    await sequelize.sync({ force: true })

    // Create test manager and get token
    const manager = await Manager.create({
      firstName: "Test",
      lastName: "Manager",
      email: "manager@test.com",
      password: "password123",
    })

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "manager@test.com",
      password: "password123",
      role: "manager",
    })

    managerToken = loginResponse.body.data.token

    // Create test data
    testData.module = await Module.create({
      name: "Test Module",
      code: "TEST101",
      description: "Test module",
      credits: 3,
    })

    testData.cohort = await Cohort.create({
      name: "Test Cohort",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      program: "Test Program",
    })

    testData.class = await Class.create({
      name: "2024S",
      year: 2024,
      semester: "S",
    })

    testData.mode = await Mode.create({
      name: "Online",
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("GET /api/courses", () => {
    it("should return courses for authenticated manager", async () => {
      const response = await request(app).get("/api/courses").set("Authorization", `Bearer ${managerToken}`).expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it("should fail without authentication", async () => {
      const response = await request(app).get("/api/courses").expect(401)

      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/courses", () => {
    it("should create course offering for manager", async () => {
      const courseData = {
        moduleId: testData.module.id,
        classId: testData.class.id,
        trimester: "T1",
        cohortId: testData.cohort.id,
        intakePeriod: "HT1",
        modeId: testData.mode.id,
        maxCapacity: 30,
      }

      const response = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${managerToken}`)
        .send(courseData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.trimester).toBe("T1")
    })
  })
})
