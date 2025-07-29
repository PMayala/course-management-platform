const { DataTypes, Model } = require("sequelize")

class CourseOffering extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        moduleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        classId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        trimester: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [["T1", "T2", "T3"]],
          },
        },
        cohortId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        intakePeriod: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [["HT1", "HT2", "FT"]],
          },
        },
        modeId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        facilitatorId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        maxCapacity: {
          type: DataTypes.INTEGER,
          defaultValue: 30,
          validate: {
            min: 1,
            max: 100,
          },
        },
        currentEnrollment: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          validate: {
            min: 0,
          },
        },
      },
      {
        sequelize,
        modelName: "CourseOffering",
        tableName: "course_offerings",
        indexes: [
          {
            unique: true,
            name: "unique_course_allocation", // Shorter custom name
            fields: ["moduleId", "classId", "trimester", "cohortId", "intakePeriod"],
          },
        ],
      },
    )
  }

  static associate(models) {
    this.belongsTo(models.Module, { foreignKey: "moduleId" })
    this.belongsTo(models.Class, { foreignKey: "classId" })
    this.belongsTo(models.Cohort, { foreignKey: "cohortId" })
    this.belongsTo(models.Mode, { foreignKey: "modeId" })
    this.belongsTo(models.Facilitator, { foreignKey: "facilitatorId" })
    this.belongsTo(models.Manager, { foreignKey: "createdBy" })
    this.hasMany(models.ActivityTracker, { foreignKey: "allocationId" })
  }
}

module.exports = CourseOffering
