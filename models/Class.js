const { DataTypes, Model } = require("sequelize")

class Class extends Model {
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
            notEmpty: true,
            len: [2, 20],
          },
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 2020,
            max: 2030,
          },
        },
        semester: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [["S", "J"]], // S for Summer, J for January
          },
        },
      },
      {
        sequelize,
        modelName: "Class",
        tableName: "classes",
      },
    )
  }

  static associate(models) {
    this.hasMany(models.Student, { foreignKey: "classId" })
    this.hasMany(models.CourseOffering, { foreignKey: "classId" })
  }
}

module.exports = Class
