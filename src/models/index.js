const sequelize = require('../config/database');

// Import all models
const User = require('./User');
const Manager = require('./Manager');
const Facilitator = require('./Facilitator');
const Student = require('./Student');
const Module = require('./Module');
const Cohort = require('./Cohort');
const Class = require('./Class');
const Mode = require('./Mode');
const CourseOffering = require('./CourseOffering');
const ActivityTracker = require('./ActivityTracker');

// Define associations
User.hasOne(Manager, { foreignKey: 'user_id', as: 'managerProfile' });
User.hasOne(Facilitator, { foreignKey: 'user_id', as: 'facilitatorProfile' });
User.hasOne(Student, { foreignKey: 'user_id', as: 'studentProfile' });

Manager.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Facilitator.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Course offering relationships
CourseOffering.belongsTo(Module, { foreignKey: 'module_id', as: 'module' });
CourseOffering.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
CourseOffering.belongsTo(Cohort, { foreignKey: 'cohort_id', as: 'cohort' });
CourseOffering.belongsTo(Mode, { foreignKey: 'mode_id', as: 'mode' });
CourseOffering.belongsTo(Facilitator, { foreignKey: 'facilitator_id', as: 'facilitator' });

Module.hasMany(CourseOffering, { foreignKey: 'module_id', as: 'courseOfferings' });
Class.hasMany(CourseOffering, { foreignKey: 'class_id', as: 'courseOfferings' });
Cohort.hasMany(CourseOffering, { foreignKey: 'cohort_id', as: 'courseOfferings' });
Mode.hasMany(CourseOffering, { foreignKey: 'mode_id', as: 'courseOfferings' });
Facilitator.hasMany(CourseOffering, { foreignKey: 'facilitator_id', as: 'courseOfferings' });

// Activity tracker relationships
ActivityTracker.belongsTo(CourseOffering, { 
  foreignKey: 'allocation_id', 
  as: 'courseOffering' 
});
CourseOffering.hasMany(ActivityTracker, { 
  foreignKey: 'allocation_id', 
  as: 'activityTrackers' 
});

const models = {
  User,
  Manager,
  Facilitator,
  Student,
  Module,
  Cohort,
  Class,
  Mode,
  CourseOffering,
  ActivityTracker,
  sequelize
};

module.exports = models;