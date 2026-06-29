import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as taskService from '../services/task.service';
import { TaskFilters } from '../repositories/task.repository';

/**
 * GET /projects/:id/tasks - Get all tasks with optional filters
 * Query params: ?status=todo&assigneeId=xxx&sortBy=dueDate&order=asc
 */
export const getTasksByProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const filters: TaskFilters = {
      status: req.query.status as string | undefined,
      assigneeId: req.query.assigneeId as string | undefined,
      sortBy: req.query.sortBy as 'dueDate' | 'createdAt' | undefined,
      order: req.query.order as 'asc' | 'desc' | undefined,
    };
    const tasks = await taskService.getTasksByProject(id, filters);
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
    const id = req.params['id'] as string;
    const task = await taskService.getTaskById(id);
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
    const id = req.params['id'] as string;
    const task = await taskService.createTask(id, req.body);
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
    const id = req.params['id'] as string;
    const task = await taskService.updateTask(id, req.body);
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
    const id = req.params['id'] as string;
    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};