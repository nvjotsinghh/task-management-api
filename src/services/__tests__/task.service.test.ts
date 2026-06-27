import * as taskRepo from '../../repositories/task.repository';
import * as projectRepo from '../../repositories/project.repository';
import * as taskService from '../task.service';

jest.mock('../../repositories/task.repository');
jest.mock('../../repositories/project.repository');

const mockProject = {
  id: 'proj1',
  name: 'Test Project',
  description: 'desc',
  ownerId: 'user1',
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
  updatedAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

const mockTask = {
  id: 'task1',
  projectId: 'proj1',
  title: 'Test Task',
  description: 'A test task',
  status: 'todo' as const,
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
  updatedAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

describe('Task Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getTasksByProject', () => {
    it('should return tasks for a project', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      (taskRepo.getTasksByProject as jest.Mock).mockResolvedValue([mockTask]);
      const result = await taskService.getTasksByProject('proj1');
      expect(result).toEqual([mockTask]);
    });

    it('should throw 404 if project not found', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(null);
      await expect(taskService.getTasksByProject('proj1')).rejects.toEqual({
        status: 404,
        message: 'Project not found',
      });
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('task1');
      expect(result).toEqual(mockTask);
    });

    it('should throw 404 if task not found', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(taskService.getTaskById('task1')).rejects.toEqual({
        status: 404,
        message: 'Task not found',
      });
    });
  });

  describe('createTask', () => {
    it('should create a task in a project', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      (taskRepo.createTask as jest.Mock).mockResolvedValue(mockTask);
      const result = await taskService.createTask('proj1', {
        title: 'Test Task',
        description: 'A test task',
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw 404 if project not found', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(null);
      await expect(taskService.createTask('proj1', { title: 'T', description: 'D' })).rejects.toEqual({
        status: 404,
        message: 'Project not found',
      });
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepo.updateTask as jest.Mock).mockResolvedValue({ ...mockTask, title: 'Updated' });
      const result = await taskService.updateTask('task1', { title: 'Updated' });
      expect(result.title).toBe('Updated');
    });

    it('should throw 404 if task not found', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(taskService.updateTask('task1', {})).rejects.toEqual({
        status: 404,
        message: 'Task not found',
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepo.deleteTask as jest.Mock).mockResolvedValue(undefined);
      await expect(taskService.deleteTask('task1')).resolves.toBeUndefined();
    });

    it('should throw 404 if task not found', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(taskService.deleteTask('task1')).rejects.toEqual({
        status: 404,
        message: 'Task not found',
      });
    });
  });
});