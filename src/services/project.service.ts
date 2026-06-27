import * as projectRepo from '../repositories/project.repository';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/project.model';

/**
 * Get all projects for a user
 * @param ownerId - User ID
 * @returns Array of projects
 */
export const getAllProjects = async (ownerId: string): Promise<Project[]> => {
  return projectRepo.getAllProjects(ownerId);
};

/**
 * Get project by ID, throws if not found
 * @param id - Project ID
 * @returns Project
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const project = await projectRepo.getProjectById(id);
  if (!project) throw { status: 404, message: 'Project not found' };
  return project;
};

/**
 * Create a new project
 * @param ownerId - User ID
 * @param data - Project data
 * @returns Created project
 */
export const createProject = async (ownerId: string, data: CreateProjectDto): Promise<Project> => {
  return projectRepo.createProject(ownerId, data);
};

/**
 * Update a project, throws if not found or not owner
 * @param id - Project ID
 * @param ownerId - User ID
 * @param data - Update data
 * @returns Updated project
 */
export const updateProject = async (id: string, ownerId: string, data: UpdateProjectDto): Promise<Project> => {
  const project = await projectRepo.getProjectById(id);
  if (!project) throw { status: 404, message: 'Project not found' };
  if (project.ownerId !== ownerId) throw { status: 403, message: 'Forbidden: You do not own this project' };
  const updated = await projectRepo.updateProject(id, data);
  return updated as Project;
};

/**
 * Delete a project, throws if not found or not owner
 * @param id - Project ID
 * @param ownerId - User ID
 */
export const deleteProject = async (id: string, ownerId: string): Promise<void> => {
  const project = await projectRepo.getProjectById(id);
  if (!project) throw { status: 404, message: 'Project not found' };
  if (project.ownerId !== ownerId) throw { status: 403, message: 'Forbidden: You do not own this project' };
  await projectRepo.deleteProject(id);
};