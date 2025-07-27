'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert modes
    await queryInterface.bulkInsert('modes', [
      {
        name: 'online',
        description: 'Online delivery mode',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'in-person',
        description: 'In-person delivery mode',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'hybrid',
        description: 'Hybrid delivery mode',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert modules
    await queryInterface.bulkInsert('modules', [
      {
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts and fundamentals',
        credits: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CS201',
        name: 'Web Development',
        description: 'Frontend and backend web development',
        credits: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        code: 'CS301',
        name: 'Database Systems',
        description: 'Database design and management',
        credits: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert cohorts
    await queryInterface.bulkInsert('cohorts', [
      {
        name: '2024 January Intake',
        description: 'Students starting in January 2024',
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-12-15'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '2024 September Intake',
        description: 'Students starting in September 2024',
        start_date: new Date('2024-09-15'),
        end_date: new Date('2025-08-15'),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert classes
    await queryInterface.bulkInsert('classes', [
      {
        name: '2024T1',
        year: 2024,
        trimester: '1',
        intake_period: 'HT1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '2024T2',
        year: 2024,
        trimester: '2',
        intake_period: 'HT2',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '2024T3',
        year: 2024,
        trimester: '3',
        intake_period: 'FT',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert course offerings
    await queryInterface.bulkInsert('course_offerings', [
      {
        module_id: 1,
        class_id: 1,
        cohort_id: 1,
        mode_id: 1,
        facilitator_id: 1,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 25,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 2,
        class_id: 1,
        cohort_id: 1,
        mode_id: 2,
        facilitator_id: 2,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-04-15'),
        max_students: 30,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        module_id: 3,
        class_id: 2,
        cohort_id: 2,
        mode_id: 3,
        facilitator_id: 1,
        start_date: new Date('2024-05-15'),
        end_date: new Date('2024-08-15'),
        max_students: 20,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Insert sample activity trackers
    await queryInterface.bulkInsert('activity_trackers', [
      {
        allocation_id: 1,
        week_number: 1,
        attendance: JSON.stringify([true, true, false, true, true]),
        formative_one_grading: 'Done',
        formative_two_grading: 'Pending',
        summative_grading: 'Not Started',
        course_moderation: 'Done',
        intranet_sync: 'Done',
        grade_book_status: 'Pending',
        notes: 'Good start to the semester',
        submitted_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        allocation_id: 1,
        week_number: 2,
        attendance: JSON.stringify([true, true, true, false, true]),
        formative_one_grading: 'Done',
        formative_two_grading: 'Done',
        summative_grading: 'Not Started',
        course_moderation: 'Pending',
        intranet_sync: 'Done',
        grade_book_status: 'Done',
        notes: 'Students showing good progress',
        submitted_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('activity_trackers', null, {});
    await queryInterface.bulkDelete('course_offerings', null, {});
    await queryInterface.bulkDelete('classes', null, {});
    await queryInterface.bulkDelete('cohorts', null, {});
    await queryInterface.bulkDelete('modules', null, {});
    await queryInterface.bulkDelete('modes', null, {});
  }
};
