const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mode = sequelize.define('Mode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.ENUM('online', 'in-person', 'hybrid'),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'modes'
});

module.exports = Mode;