import * as taskRepo from '../repositories/task.repository';
import * as projectRepo from '../repositories/project.repository';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';

/**
 * Get all tasks for a project
 * @param projectId - Project ID
 * @returns Array of tasks
 */
export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const project = await projectRepo.getProjectById(projectId);
  if (!project) throw { status: 404, message: 'Project not found' };
  return taskRepo.getTasksByProject(projectId);
};

/**
 * Get task by ID
 * @param id - Task ID
 * @returns Task
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const task = await taskRepo.getTaskById(id);
  if (!task) throw { status: 404, message: 'Task not found' };
  return task;
};

/**
 * Create a task inside a project
 * @param projectId - Project ID
 * @param data - Task data
 * @returns Created task
 */
export const createTask = async (projectId: string, data: CreateTaskDto): Promise<Task> => {
  const project = await projectRepo.getProjectById(projectId);
  if (!project) throw { status: 404, message: 'Project not found' };
  return taskRepo.createTask(projectId, data);
};

/**
 * Update a task
 * @param id - Task ID
 * @param data - Update data
 * @returns Updated task
 */
export const updateTask = async (id: string, data: UpdateTaskDto): Promise<Task> => {
  const task = await taskRepo.getTaskById(id);
  if (!task) throw { status: 404, message: 'Task not found' };
  const updated = await taskRepo.updateTask(id, data);
  return updated as Task;
};

/**
 * Delete a task
 * @param id - Task ID
 */
export const deleteTask = async (id: string): Promise<void> => {
  const task = await taskRepo.getTaskById(id);
  if (!task) throw { status: 404, message: 'Task not found' };
  await taskRepo.deleteTask(id);
};