const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Facilitator = sequelize.define('Facilitator', {
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
  specialization: {
    type: DataTypes.STRING,
    allowNull: true
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  hire_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'facilitators'
});

module.exports = Facilitator;