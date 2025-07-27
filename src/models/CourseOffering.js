const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseOffering = sequelize.define('CourseOffering', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  module_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modules',
      key: 'id'
    }
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id'
    }
  },
  cohort_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'cohorts',
      key: 'id'
    }
  },
  mode_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'modes',
      key: 'id'
    }
  },
  facilitator_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'facilitators',
      key: 'id'
    }
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  max_students: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'course_offerings',
  indexes: [
    {
      unique: true,
      fields: ['module_id', 'class_id', 'cohort_id', 'mode_id']
    }
  ]
});

module.exports = CourseOffering;