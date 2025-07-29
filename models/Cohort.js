const { DataTypes, Model } = require("sequelize")

class Cohort extends Model {
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
            len: [2, 50],
          },
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isAfterStartDate(value) {
              if (value <= this.startDate) {
                throw new Error("End date must be after start date")
              }
            },
          },
        },
        program: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Cohort",
        tableName: "cohorts",
      },
    )
  }

  static associate(models) {
    this.hasMany(models.Student, { foreignKey: "cohortId" })
    this.hasMany(models.CourseOffering, { foreignKey: "cohortId" })
  }
}

module.exports = Cohort
