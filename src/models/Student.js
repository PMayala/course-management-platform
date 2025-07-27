const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  enrollment_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  program: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'students'
});

module.exports = Student;