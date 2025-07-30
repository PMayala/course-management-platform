const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Mode = sequelize.define('Mode', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.ENUM('Online', 'In-person', 'Hybrid'),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    requiresPhysicalPresence: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'requires_physical_presence'
    }
  }, {
    tableName: 'modes',
    timestamps: true,
    underscored: true,
    paranoid: true
  });

  return Mode;
};