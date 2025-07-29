const { DataTypes, Model } = require("sequelize")

class Mode extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isIn: [["Online", "In-person", "Hybrid"]],
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Mode",
        tableName: "modes",
      },
    )
  }

  static associate(models) {
    this.hasMany(models.CourseOffering, { foreignKey: "modeId" })
  }
}

module.exports = Mode
