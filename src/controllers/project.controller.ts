import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as projectService from '../services/project.service';

/**
 * GET /projects - Get all projects for logged in user
 */
export const getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await projectService.getAllProjects(req.user!.uid);
    res.status(200).json(projects);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * GET /projects/:id - Get a single project
 */
export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.status(200).json(project);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * POST /projects - Create a new project
 */
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await projectService.createProject(req.user!.uid, req.body);
    res.status(201).json(project);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * PUT /projects/:id - Update a project
 */
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await projectService.updateProject(req.params.id, req.user!.uid, req.body);
    res.status(200).json(project);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

/**
 * DELETE /projects/:id - Delete a project
 */
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await projectService.deleteProject(req.params.id, req.user!.uid);
    res.status(204).send();
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};