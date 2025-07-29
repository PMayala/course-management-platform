const sequelize = require("../config/database")
const Manager = require("./Manager")
const Facilitator = require("./Facilitator")
const Student = require("./Student")
const Module = require("./Module")
const Cohort = require("./Cohort")
const Class = require("./Class")
const Mode = require("./Mode")
const CourseOffering = require("./CourseOffering")
const ActivityTracker = require("./ActivityTracker")

// Initialize models
Manager.init(sequelize)
Facilitator.init(sequelize)
Student.init(sequelize)
Module.init(sequelize)
Cohort.init(sequelize)
Class.init(sequelize)
Mode.init(sequelize)
CourseOffering.init(sequelize)
ActivityTracker.init(sequelize)

// Define associations
Manager.associate({ Manager, Facilitator, Student, Module, Cohort, Class, Mode, CourseOffering, ActivityTracker })
Facilitator.associate({ Manager, Facilitator, Student, Module, Cohort, Class, Mode, CourseOffering, ActivityTracker })
Student.associate({ Manager, Facilitator, Student, Module, Cohort, Class, Mode, CourseOffering, ActivityTracker })
Module.associate({ Manager, Facilitator, Student, Module, Cohort, Class, Mode, CourseOffering, ActivityTracker })
Cohort.associate({ Manager, Facilitator, Student, Module, Cohort, Class, Mode, CourseOffering, ActivityTracker })
Class.associate({ Manager, Facilitator, Student, Module, Cohort, Class, Mode, CourseOffering, ActivityTracker })
Mode.associate({ Manager, Facilitator, Student, Module, Cohort, Class, Mode, CourseOffering, ActivityTracker })
CourseOffering.associate({
  Manager,
  Facilitator,
  Student,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityTracker,
})
ActivityTracker.associate({
  Manager,
  Facilitator,
  Student,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityTracker,
})

module.exports = {
  sequelize,
  Manager,
  Facilitator,
  Student,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityTracker,
}
