const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};


// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    role: Joi.string().valid('manager', 'facilitator', 'student').required(),
    department: Joi.string().optional(),
    specialization: Joi.string().optional(),
    employee_id: Joi.string().optional(),
    student_id: Joi.string().optional(),
    program: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  module: Joi.object({
    code: Joi.string().min(3).max(20).required(),
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().optional(),
    credits: Joi.number().min(1).max(10).required()
  }),

  courseOffering: Joi.object({
    module_id: Joi.number().required(),
    class_id: Joi.number().required(),
    cohort_id: Joi.number().required(),
    mode_id: Joi.number().required(),
    facilitator_id: Joi.number().optional(),
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref('start_date')).required(),
    max_students: Joi.number().min(1).optional()
  }),

  activityTracker: Joi.object({
    allocation_id: Joi.number().required(),
    week_number: Joi.number().min(1).max(52).required(),
    attendance: Joi.array().items(Joi.boolean()).optional(),
    formative_one_grading: Joi.string().valid('Done', 'Pending', 'Not Started').optional(),
    formative_two_grading: Joi.string().valid('Done', 'Pending', 'Not Started').optional(),
    summative_grading: Joi.string().valid('Done', 'Pending', 'Not Started').optional(),
    course_moderation: Joi.string().valid('Done', 'Pending', 'Not Started').optional(),
    intranet_sync: Joi.string().valid('Done', 'Pending', 'Not Started').optional(),
    grade_book_status: Joi.string().valid('Done', 'Pending', 'Not Started').optional(),
    notes: Joi.string().optional()
  })
};

module.exports = { validate, schemas };