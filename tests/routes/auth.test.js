const request = require("supertest")
const express = require("express")
const { sequelize } = require("../../models")
const authRoutes = require("../../routes/auth")

const app = express()
app.use(express.json())
app.use("/api/auth", authRoutes)

describe("Auth Routes", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("POST /api/auth/register/manager", () => {
    it("should register a new manager", async () => {
      const managerData = {
        firstName: "Test",
        lastName: "Manager",
        email: "test@example.com",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/register/manager").send(managerData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.user.email).toBe("test@example.com")
      expect(response.body.data.token).toBeDefined()
    })

    it("should fail with invalid email", async () => {
      const managerData = {
        firstName: "Test",
        lastName: "Manager",
        email: "invalid-email",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/register/manager").send(managerData).expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test manager
      await request(app).post("/api/auth/register/manager").send({
        firstName: "Test",
        lastName: "Manager",
        email: "test@example.com",
        password: "password123",
      })
    })

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
          role: "manager",
        })
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.token).toBeDefined()
    })

    it("should fail with invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
          role: "manager",
        })
        .expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})
