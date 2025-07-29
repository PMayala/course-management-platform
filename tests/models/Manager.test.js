const { Manager, sequelize } = require("../../models")

describe("Manager Model", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("Creation", () => {
    it("should create a manager with valid data", async () => {
      const managerData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      }

      const manager = await Manager.create(managerData)

      expect(manager.firstName).toBe("John")
      expect(manager.lastName).toBe("Doe")
      expect(manager.email).toBe("john.doe@example.com")
      expect(manager.role).toBe("manager")
      expect(manager.password).not.toBe("password123") // Should be hashed
    })

    it("should fail to create manager with invalid email", async () => {
      const managerData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        password: "password123",
      }

      await expect(Manager.create(managerData)).rejects.toThrow()
    })

    it("should hash password before saving", async () => {
      const manager = await Manager.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      })

      expect(manager.password).not.toBe("password123")
      expect(await manager.validatePassword("password123")).toBe(true)
    })
  })

  describe("Validation", () => {
    it("should validate password correctly", async () => {
      const manager = await Manager.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      })

      expect(await manager.validatePassword("password123")).toBe(true)
      expect(await manager.validatePassword("wrongpassword")).toBe(false)
    })

    it("should exclude password from JSON output", async () => {
      const manager = await Manager.create({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
      })

      const json = manager.toJSON()
      expect(json.password).toBeUndefined()
      expect(json.firstName).toBe("John")
    })
  })
})
