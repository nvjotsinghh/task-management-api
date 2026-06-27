import { Router } from 'express';
import projectRoutes from './project.routes';
import taskRoutes from './task.routes';
import commentRoutes from './comment.routes';
import { verifyToken } from '../middlewares/auth.middleware';
import * as taskController from '../controllers/task.controller';
import * as commentController from '../controllers/comment.controller';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, createCommentSchema } from '../utils/validation';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);

// Nested routes
router.get('/projects/:id/tasks', verifyToken, taskController.getTasksByProject);
router.post('/projects/:id/tasks', verifyToken, validate(createTaskSchema), taskController.createTask);
router.get('/tasks/:id/comments', verifyToken, commentController.getCommentsByTask);
router.post('/tasks/:id/comments', verifyToken, validate(createCommentSchema), commentController.createComment);

export default router;