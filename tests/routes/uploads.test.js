const request = require("supertest")
const express = require("express")
const path = require("path")
const fs = require("fs")
const { sequelize, Manager } = require("../../models")
const uploadRoutes = require("../../routes/uploads")
const authRoutes = require("../../routes/auth")

const app = express()
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/uploads", uploadRoutes)

describe("Upload Routes", () => {
  let managerToken
  const testFilePath = path.join(__dirname, "test-file.txt")

  beforeAll(async () => {
    await sequelize.sync({ force: true })

    // Create test file
    fs.writeFileSync(testFilePath, "This is a test file for upload testing")

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
  })

  afterAll(async () => {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath)
    }

    // Clean up uploaded files
    const uploadsDir = "uploads"
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir)
      files.forEach((file) => {
        if (file.startsWith("document-") || file.startsWith("picture-")) {
          fs.unlinkSync(path.join(uploadsDir, file))
        }
      })
    }

    await sequelize.close()
  })

  describe("POST /api/uploads/activity-document", () => {
    it("should upload a document successfully", async () => {
      const response = await request(app)
        .post("/api/uploads/activity-document")
        .set("Authorization", `Bearer ${managerToken}`)
        .attach("document", testFilePath)
        .field("activityId", "1")
        .field("description", "Test document upload")
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.originalName).toBe("test-file.txt")
      expect(response.body.data.activityId).toBe("1")
      expect(response.body.data.description).toBe("Test document upload")
    })

    it("should fail without authentication", async () => {
      const response = await request(app)
        .post("/api/uploads/activity-document")
        .attach("document", testFilePath)
        .expect(401)

      expect(response.body.success).toBe(false)
    })

    it("should fail without file", async () => {
      const response = await request(app)
        .post("/api/uploads/activity-document")
        .set("Authorization", `Bearer ${managerToken}`)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe("No file uploaded")
    })
  })

  describe("POST /api/uploads/profile-picture", () => {
    it("should upload profile picture successfully", async () => {
      const response = await request(app)
        .post("/api/uploads/profile-picture")
        .set("Authorization", `Bearer ${managerToken}`)
        .attach("picture", testFilePath)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.originalName).toBe("test-file.txt")
      expect(response.body.data.url).toMatch(/\/uploads\//)
    })
  })

  describe("POST /api/uploads/bulk-upload", () => {
    it("should upload multiple files successfully", async () => {
      const response = await request(app)
        .post("/api/uploads/bulk-upload")
        .set("Authorization", `Bearer ${managerToken}`)
        .attach("files", testFilePath)
        .attach("files", testFilePath)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.files).toHaveLength(2)
      expect(response.body.message).toBe("2 files uploaded successfully")
    })
  })
})
