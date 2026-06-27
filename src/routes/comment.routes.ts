import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCommentSchema } from '../utils/validation';

const router = Router();

router.delete('/:id', verifyToken, commentController.deleteComment);

export default router;