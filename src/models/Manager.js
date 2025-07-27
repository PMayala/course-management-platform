const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manager = sequelize.define('Manager', {
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
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  }
}, {
  tableName: 'managers'
});

module.exports = Manager;