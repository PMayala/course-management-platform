// Test setup file
const { sequelize } = require("../models")
const jest = require("jest")

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = "test"
  process.env.JWT_SECRET = "test_secret_key"
})

// Clean up after all tests
afterAll(async () => {
  if (sequelize) {
    await sequelize.close()
  }
})

// Increase timeout for database operations
jest.setTimeout(30000)
