import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as taskController from '../../controllers/task.controller';
import * as taskService from '../../services/task.service';

jest.mock('../../services/task.service');

const mockTask = {
  id: 'task1',
  projectId: 'proj1',
  title: 'Test Task',
  description: 'desc',
  status: 'todo' as const,
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
  updatedAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

const mockReq = (overrides = {}): AuthRequest => ({
  user: { uid: 'user1', email: 'test@test.com', role: 'member' },
  params: { id: 'task1' },
  query: {},
  body: {},
  ...overrides,
} as unknown as AuthRequest);

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Task Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getTasksByProject', () => {
    it('should return 200 with tasks', async () => {
      (taskService.getTasksByProject as jest.Mock).mockResolvedValue([mockTask]);
      const req = mockReq({ query: {} });
      const res = mockRes();
      await taskController.getTasksByProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockTask]);
    });

    it('should return 404 if project not found', async () => {
      (taskService.getTasksByProject as jest.Mock).mockRejectedValue({ status: 404, message: 'Project not found' });
      const req = mockReq({ query: {} });
      const res = mockRes();
      await taskController.getTasksByProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should pass filters from query params', async () => {
      (taskService.getTasksByProject as jest.Mock).mockResolvedValue([mockTask]);
      const req = mockReq({ query: { status: 'todo', sortBy: 'dueDate', order: 'asc' } });
      const res = mockRes();
      await taskController.getTasksByProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getTaskById', () => {
    it('should return 200 with task', async () => {
      (taskService.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      const req = mockReq();
      const res = mockRes();
      await taskController.getTaskById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if not found', async () => {
      (taskService.getTaskById as jest.Mock).mockRejectedValue({ status: 404, message: 'Task not found' });
      const req = mockReq();
      const res = mockRes();
      await taskController.getTaskById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createTask', () => {
    it('should return 201 with created task', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);
      const req = mockReq({ body: { title: 'Test Task', description: 'desc' } });
      const res = mockRes();
      await taskController.createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateTask', () => {
    it('should return 200 with updated task', async () => {
      (taskService.updateTask as jest.Mock).mockResolvedValue({ ...mockTask, title: 'Updated' });
      const req = mockReq({ body: { title: 'Updated' } });
      const res = mockRes();
      await taskController.updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if not found', async () => {
      (taskService.updateTask as jest.Mock).mockRejectedValue({ status: 404, message: 'Not found' });
      const req = mockReq();
      const res = mockRes();
      await taskController.updateTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deleteTask', () => {
    it('should return 204 on success', async () => {
      (taskService.deleteTask as jest.Mock).mockResolvedValue(undefined);
      const req = mockReq();
      const res = mockRes();
      await taskController.deleteTask(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});