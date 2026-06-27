import { Router } from 'express';
import * as projectController from '../controllers/project.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createProjectSchema, updateProjectSchema } from '../utils/validation';

const router = Router();

router.get('/', verifyToken, projectController.getAllProjects);
router.get('/:id', verifyToken, projectController.getProjectById);
router.post('/', verifyToken, validate(createProjectSchema), projectController.createProject);
router.put('/:id', verifyToken, validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', verifyToken, projectController.deleteProject);

export default router;