const { DataTypes, Model } = require("sequelize")

class Student extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 50],
          },
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 50],
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        studentId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        cohortId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        classId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Student",
        tableName: "students",
      },
    )
  }

  static associate(models) {
    this.belongsTo(models.Cohort, { foreignKey: "cohortId" })
    this.belongsTo(models.Class, { foreignKey: "classId" })
  }
}

module.exports = Student
