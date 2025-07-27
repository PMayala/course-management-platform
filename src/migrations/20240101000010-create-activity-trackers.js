'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('activity_trackers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      allocation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'course_offerings',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      week_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      attendance: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: []
      },
      formative_one_grading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      formative_two_grading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      summative_grading: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      course_moderation: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      intranet_sync: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      grade_book_status: {
        type: Sequelize.ENUM('Done', 'Pending', 'Not Started'),
        allowNull: false,
        defaultValue: 'Not Started'
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add composite unique constraint
    await queryInterface.addConstraint('activity_trackers', {
      fields: ['allocation_id', 'week_number'],
      type: 'unique',
      name: 'unique_activity_tracker_week'
    });

    // Add indexes
    await queryInterface.addIndex('activity_trackers', ['allocation_id']);
    await queryInterface.addIndex('activity_trackers', ['week_number']);
    await queryInterface.addIndex('activity_trackers', ['submitted_at']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('activity_trackers');
  }
};
