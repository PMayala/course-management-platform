'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('course_offerings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      module_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      class_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'classes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cohort_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cohorts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      mode_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'modes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      facilitator_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'facilitators',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      max_students: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.addConstraint('course_offerings', {
      fields: ['module_id', 'class_id', 'cohort_id', 'mode_id'],
      type: 'unique',
      name: 'unique_course_offering'
    });

    // Add indexes
    await queryInterface.addIndex('course_offerings', ['module_id']);
    await queryInterface.addIndex('course_offerings', ['class_id']);
    await queryInterface.addIndex('course_offerings', ['cohort_id']);
    await queryInterface.addIndex('course_offerings', ['mode_id']);
    await queryInterface.addIndex('course_offerings', ['facilitator_id']);
    await queryInterface.addIndex('course_offerings', ['is_active']);
    await queryInterface.addIndex('course_offerings', ['start_date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('course_offerings');
  }
};
