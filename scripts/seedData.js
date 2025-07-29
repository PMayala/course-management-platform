// Load environment variables at the very top
require("dotenv").config()

const { sequelize, Manager, Facilitator, Module, Cohort, Class, Mode, CourseOffering } = require("../models")

async function seedDatabase() {
  try {
    console.log("🔧 Environment check:")
    console.log(`   DB_HOST: ${process.env.DB_HOST}`)
    console.log(`   DB_USER: ${process.env.DB_USER}`)
    console.log(`   DB_NAME: ${process.env.DB_NAME}`)
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? "[SET]" : "[NOT SET]"}`)

    // Test database connection first
    await sequelize.authenticate()
    console.log("✅ Database connection successful")

    // Sync database
    await sequelize.sync({ force: true })
    console.log("🗄️  Database synced")

    // Create Managers
    const manager1 = await Manager.create({
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.johnson@university.edu",
      password: "Manager123!",
    })

    const manager2 = await Manager.create({
      firstName: "Bob",
      lastName: "Smith",
      email: "bob.smith@university.edu",
      password: "Manager123!",
    })

    console.log("👨‍💼 Managers created")

    // Create Facilitators
    const facilitators = await Promise.all([
      Facilitator.create({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@university.edu",
        password: "Facilitator123!",
        specialization: "JavaScript & Node.js",
      }),
      Facilitator.create({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@university.edu",
        password: "Facilitator123!",
        specialization: "React & Frontend",
      }),
      Facilitator.create({
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@university.edu",
        password: "Facilitator123!",
        specialization: "Database & Backend",
      }),
      Facilitator.create({
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah.wilson@university.edu",
        password: "Facilitator123!",
        specialization: "Full Stack Development",
      }),
    ])

    console.log("👨‍🏫 Facilitators created")

    // Create Modules
    const modules = await Promise.all([
      Module.create({
        name: "JavaScript Fundamentals",
        code: "JS101",
        description: "Introduction to JavaScript programming language",
        credits: 4,
      }),
      Module.create({
        name: "React Development",
        code: "REACT201",
        description: "Building user interfaces with React",
        credits: 5,
      }),
      Module.create({
        name: "Node.js & Express",
        code: "NODE301",
        description: "Server-side development with Node.js",
        credits: 5,
      }),
      Module.create({
        name: "Database Design",
        code: "DB201",
        description: "Relational database design and SQL",
        credits: 4,
      }),
      Module.create({
        name: "Full Stack Project",
        code: "PROJ401",
        description: "Capstone full stack development project",
        credits: 6,
      }),
    ])

    console.log("📚 Modules created")

    // Create Cohorts
    const cohorts = await Promise.all([
      Cohort.create({
        name: "Full Stack 2024A",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-12-15"),
        program: "Full Stack Web Development",
      }),
      Cohort.create({
        name: "Full Stack 2024B",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-05-31"),
        program: "Full Stack Web Development",
      }),
      Cohort.create({
        name: "Frontend 2024A",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-11-30"),
        program: "Frontend Development",
      }),
    ])

    console.log("👥 Cohorts created")

    // Create Classes
    const classes = await Promise.all([
      Class.create({
        name: "2024S",
        year: 2024,
        semester: "S",
      }),
      Class.create({
        name: "2024J",
        year: 2024,
        semester: "J",
      }),
      Class.create({
        name: "2025S",
        year: 2025,
        semester: "S",
      }),
    ])

    console.log("🏫 Classes created")

    // Create Modes
    const modes = await Promise.all([
      Mode.create({
        name: "Online",
        description: "Fully online learning experience",
      }),
      Mode.create({
        name: "In-person",
        description: "Traditional classroom learning",
      }),
      Mode.create({
        name: "Hybrid",
        description: "Combination of online and in-person learning",
      }),
    ])

    console.log("📖 Learning modes created")

    // Create Course Offerings
    const courseOfferings = await Promise.all([
      // JavaScript Fundamentals offerings
      CourseOffering.create({
        moduleId: modules[0].id, // JS101
        classId: classes[0].id, // 2024S
        trimester: "T1",
        cohortId: cohorts[0].id, // Full Stack 2024A
        intakePeriod: "HT1",
        modeId: modes[0].id, // Online
        facilitatorId: facilitators[0].id, // John Doe
        createdBy: manager1.id,
        maxCapacity: 25,
        currentEnrollment: 20,
      }),

      // React Development offerings
      CourseOffering.create({
        moduleId: modules[1].id, // REACT201
        classId: classes[0].id, // 2024S
        trimester: "T2",
        cohortId: cohorts[0].id, // Full Stack 2024A
        intakePeriod: "HT1",
        modeId: modes[2].id, // Hybrid
        facilitatorId: facilitators[1].id, // Jane Smith
        createdBy: manager1.id,
        maxCapacity: 25,
        currentEnrollment: 18,
      }),

      // Node.js & Express offerings
      CourseOffering.create({
        moduleId: modules[2].id, // NODE301
        classId: classes[0].id, // 2024S
        trimester: "T3",
        cohortId: cohorts[0].id, // Full Stack 2024A
        intakePeriod: "HT1",
        modeId: modes[0].id, // Online
        facilitatorId: facilitators[2].id, // Mike Johnson
        createdBy: manager1.id,
        maxCapacity: 25,
        currentEnrollment: 22,
      }),

      // Database Design offerings
      CourseOffering.create({
        moduleId: modules[3].id, // DB201
        classId: classes[1].id, // 2024J
        trimester: "T1",
        cohortId: cohorts[1].id, // Full Stack 2024B
        intakePeriod: "HT2",
        modeId: modes[1].id, // In-person
        facilitatorId: facilitators[2].id, // Mike Johnson
        createdBy: manager2.id,
        maxCapacity: 30,
        currentEnrollment: 15,
      }),

      // Full Stack Project offerings
      CourseOffering.create({
        moduleId: modules[4].id, // PROJ401
        classId: classes[0].id, // 2024S
        trimester: "T3",
        cohortId: cohorts[0].id, // Full Stack 2024A
        intakePeriod: "FT",
        modeId: modes[2].id, // Hybrid
        facilitatorId: facilitators[3].id, // Sarah Wilson
        createdBy: manager1.id,
        maxCapacity: 20,
        currentEnrollment: 16,
      }),

      // Frontend specific course
      CourseOffering.create({
        moduleId: modules[1].id, // REACT201
        classId: classes[0].id, // 2024S
        trimester: "T2",
        cohortId: cohorts[2].id, // Frontend 2024A
        intakePeriod: "HT1",
        modeId: modes[0].id, // Online
        facilitatorId: facilitators[1].id, // Jane Smith
        createdBy: manager2.id,
        maxCapacity: 20,
        currentEnrollment: 12,
      }),
    ])

    console.log("📋 Course offerings created")

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n📊 Summary:")
    console.log(`   Managers: ${await Manager.count()}`)
    console.log(`   Facilitators: ${await Facilitator.count()}`)
    console.log(`   Modules: ${await Module.count()}`)
    console.log(`   Cohorts: ${await Cohort.count()}`)
    console.log(`   Classes: ${await Class.count()}`)
    console.log(`   Modes: ${await Mode.count()}`)
    console.log(`   Course Offerings: ${await CourseOffering.count()}`)

    console.log("\n🔑 Test Credentials:")
    console.log("   Manager: alice.johnson@university.edu / Manager123!")
    console.log("   Facilitator: john.doe@university.edu / Facilitator123!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await sequelize.close()
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase
