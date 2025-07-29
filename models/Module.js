const { DataTypes, Model } = require("sequelize")

class Module extends Model {
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
          validate: {
            notEmpty: true,
            len: [2, 100],
          },
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
            len: [2, 20],
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        credits: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 10,
          },
        },
      },
      {
        sequelize,
        modelName: "Module",
        tableName: "modules",
      },
    )
  }

  static associate(models) {
    this.hasMany(models.CourseOffering, { foreignKey: "moduleId" })
  }
}

module.exports = Module
