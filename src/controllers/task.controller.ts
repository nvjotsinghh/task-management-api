import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as taskService from '../services/task.service';

/**
 * GET /projects/:id/tasks - Get all tasks in a project
 */
export const getTasksByProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await taskService.getTasksByProject(req.params.id);
    res.status(200).json(tasks);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * GET /tasks/:id - Get a single task
 */
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    res.status(200).json(task);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * POST /projects/:id/tasks - Create a task
 */
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await taskService.createTask(req.params.id, req.body);
    res.status(201).json(task);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * PUT /tasks/:id - Update a task
 */
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.status(200).json(task);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * DELETE /tasks/:id - Delete a task
 */
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};