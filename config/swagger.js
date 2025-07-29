const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Course Management Platform API",
      version: "1.0.0",
      description: "Comprehensive API for managing course allocations, facilitator activities, and student progress",
      contact: {
        name: "API Support",
        email: "support@courseplatform.edu",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
      {
        url: "https://api.courseplatform.edu/api",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
            data: {
              type: "object",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and registration",
      },
      {
        name: "Courses",
        description: "Course allocation management",
      },
      {
        name: "Facilitators",
        description: "Facilitator management",
      },
      {
        name: "Activities",
        description: "Activity tracking and logging",
      },
    ],
  },
  apis: ["./routes/*.js"],
}

const specs = swaggerJsdoc(options)

function setupSwagger(app) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Course Management Platform API",
    }),
  )
}

module.exports = { setupSwagger }
