const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivityTracker = sequelize.define('ActivityTracker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  allocation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'course_offerings',
      key: 'id'
    }
  },
  week_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 52
    }
  },
  attendance: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  formative_one_grading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  formative_two_grading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  summative_grading: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  course_moderation: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  intranet_sync: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  grade_book_status: {
    type: DataTypes.ENUM('Done', 'Pending', 'Not Started'),
    allowNull: false,
    defaultValue: 'Not Started'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'activity_trackers',
  indexes: [
    {
      unique: true,
      fields: ['allocation_id', 'week_number']
    }
  ]
});

module.exports = ActivityTracker;