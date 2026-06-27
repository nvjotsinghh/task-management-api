import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as commentService from '../services/comment.service';

/**
 * GET /tasks/:id/comments - Get all comments on a task
 */
export const getCommentsByTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comments = await commentService.getCommentsByTask(req.params.id);
    res.status(200).json(comments);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * POST /tasks/:id/comments - Add a comment to a task
 */
export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const comment = await commentService.createComment(req.params.id, req.user!.uid, req.body);
    res.status(201).json(comment);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * DELETE /comments/:id - Delete a comment
 */
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await commentService.deleteComment(req.params.id, req.user!.uid);
    res.status(204).send();
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};