import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as projectService from '../services/project.service';

export const getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await projectService.getAllProjects(req.user!.uid);
    res.status(200).json(projects);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const project = await projectService.getProjectById(id);
    res.status(200).json(project);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await projectService.createProject(req.user!.uid, req.body);
    res.status(201).json(project);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    const project = await projectService.updateProject(id, req.user!.uid, req.body);
    res.status(200).json(project);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params['id'] as string;
    await projectService.deleteProject(id, req.user!.uid);
    res.status(204).send();
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    res.status(e.status || 500).json({ error: e.message || 'Internal server error' });
  }
};