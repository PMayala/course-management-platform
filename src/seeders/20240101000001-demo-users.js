module.exports = {
  up: async (queryInterface, Sequelize) => {
    // For demo purposes, using plain text password
    // In production, you should hash passwords properly
    const demoPassword = "demo123"

    // Insert demo users
    await queryInterface.bulkInsert("users", [
      {
        email: "admin@university.edu",
        password: demoPassword,
        first_name: "Sarah",
        last_name: "Johnson",
        role: "manager",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "john.smith@university.edu",
        password: demoPassword,
        first_name: "John",
        last_name: "Smith",
        role: "facilitator",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "maria.garcia@university.edu",
        password: demoPassword,
        first_name: "Maria",
        last_name: "Garcia",
        role: "facilitator",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "david.wilson@university.edu",
        password: demoPassword,
        first_name: "David",
        last_name: "Wilson",
        role: "facilitator",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "alice.brown@student.university.edu",
        password: demoPassword,
        first_name: "Alice",
        last_name: "Brown",
        role: "student",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "bob.davis@student.university.edu",
        password: demoPassword,
        first_name: "Bob",
        last_name: "Davis",
        role: "student",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "carol.miller@student.university.edu",
        password: demoPassword,
        first_name: "Carol",
        last_name: "Miller",
        role: "student",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "daniel.taylor@student.university.edu",
        password: demoPassword,
        first_name: "Daniel",
        last_name: "Taylor",
        role: "student",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "emma.anderson@student.university.edu",
        password: demoPassword,
        first_name: "Emma",
        last_name: "Anderson",
        role: "student",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "frank.thomas@student.university.edu",
        password: demoPassword,
        first_name: "Frank",
        last_name: "Thomas",
        role: "student",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Insert manager record
    await queryInterface.bulkInsert("managers", [
      {
        user_id: 1, // Sarah Johnson
        department: "Academic Affairs",
        employee_id: "MGR001",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Insert facilitator records
    await queryInterface.bulkInsert("facilitators", [
      {
        user_id: 2, // John Smith
        specialization: "Computer Science",
        employee_id: "FAC001",
        hire_date: new Date("2023-08-15"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3, // Maria Garcia
        specialization: "Web Development",
        employee_id: "FAC002",
        hire_date: new Date("2023-09-01"),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 4, // David Wilson
        specialization: "Database Systems",
        employee_id: "FAC003",
        hire_date: new Date("2023-07-20"),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    // Insert student records
    await queryInterface.bulkInsert("students", [
      {
        user_id: 5, // Alice Brown
        student_id: "STU2024001",
        enrollment_date: new Date("2024-01-15"),
        program: "Computer Science",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 6, // Bob Davis
        student_id: "STU2024002",
        enrollment_date: new Date("2024-01-15"),
        program: "Computer Science",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 7, // Carol Miller
        student_id: "STU2024003",
        enrollment_date: new Date("2024-01-15"),
        program: "Web Development",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 8, // Daniel Taylor
        student_id: "STU2024004",
        enrollment_date: new Date("2024-09-15"),
        program: "Computer Science",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 9, // Emma Anderson
        student_id: "STU2024005",
        enrollment_date: new Date("2024-09-15"),
        program: "Database Systems",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 10, // Frank Thomas
        student_id: "STU2024006",
        enrollment_date: new Date("2024-01-15"),
        program: "Web Development",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    console.log("Demo users created successfully!")
    console.log('Login credentials for all users: password = "demo123"')
    console.log("Manager: admin@university.edu")
    console.log("Facilitators: john.smith@university.edu, maria.garcia@university.edu, david.wilson@university.edu")
    console.log("Students: alice.brown@student.university.edu, bob.davis@student.university.edu, etc.")
  },

  down: async (queryInterface, Sequelize) => {
    // Remove in reverse order due to foreign key constraints
    await queryInterface.bulkDelete("students", null, {})
    await queryInterface.bulkDelete("facilitators", null, {})
    await queryInterface.bulkDelete("managers", null, {})
    await queryInterface.bulkDelete("users", null, {})
  },
}
