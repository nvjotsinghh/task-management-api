import Joi from 'joi';

export const createProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(500).required(),
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().min(3).max(500),
}).min(1);

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(3).max(1000).required(),
  status: Joi.string().valid('todo', 'in-progress', 'done'),
  assigneeId: Joi.string(),
  dueDate: Joi.string().isoDate(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  description: Joi.string().min(3).max(1000),
  status: Joi.string().valid('todo', 'in-progress', 'done'),
  assigneeId: Joi.string(),
  dueDate: Joi.string().isoDate(),
}).min(1);

export const createCommentSchema = Joi.object({
  body: Joi.string().min(1).max(1000).required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid('admin', 'member'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});