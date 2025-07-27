const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [4, 20]
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2020,
      max: 2030
    }
  },
  trimester: {
    type: DataTypes.ENUM('1', '2', '3'),
    allowNull: false
  },
  intake_period: {
    type: DataTypes.ENUM('HT1', 'HT2', 'FT'),
    allowNull: false
  }
}, {
  tableName: 'classes'
});

module.exports = Class;