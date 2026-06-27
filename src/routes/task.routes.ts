import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';

const router = Router();

router.get('/:id', verifyToken, taskController.getTaskById);
router.put('/:id', verifyToken, validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);

export default router;