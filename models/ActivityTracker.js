const { DataTypes, Model } = require("sequelize")

class ActivityTracker extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        allocationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        facilitatorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        weekNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 52,
          },
        },
        attendance: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: [],
        },
        formativeOneGrading: {
          type: DataTypes.ENUM("Done", "Pending", "Not Started"),
          defaultValue: "Not Started",
        },
        formativeTwoGrading: {
          type: DataTypes.ENUM("Done", "Pending", "Not Started"),
          defaultValue: "Not Started",
        },
        summativeGrading: {
          type: DataTypes.ENUM("Done", "Pending", "Not Started"),
          defaultValue: "Not Started",
        },
        courseModeration: {
          type: DataTypes.ENUM("Done", "Pending", "Not Started"),
          defaultValue: "Not Started",
        },
        intranetSync: {
          type: DataTypes.ENUM("Done", "Pending", "Not Started"),
          defaultValue: "Not Started",
        },
        gradeBookStatus: {
          type: DataTypes.ENUM("Done", "Pending", "Not Started"),
          defaultValue: "Not Started",
        },
        submittedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "ActivityTracker",
        tableName: "activity_trackers",
        indexes: [
          {
            unique: true,
            fields: ["allocationId", "weekNumber"],
          },
        ],
      },
    )
  }

  static associate(models) {
    this.belongsTo(models.CourseOffering, { foreignKey: "allocationId" })
    this.belongsTo(models.Facilitator, { foreignKey: "facilitatorId" })
  }
}

module.exports = ActivityTracker
