import { Request, Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as projectController from '../../controllers/project.controller';
import * as projectService from '../../services/project.service';

jest.mock('../../services/project.service');

const mockProject = {
  id: 'proj1',
  name: 'Test Project',
  description: 'A test project',
  ownerId: 'user1',
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
  updatedAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

const mockReq = (overrides = {}): AuthRequest => ({
  user: { uid: 'user1', email: 'test@test.com', role: 'member' },
  params: { id: 'proj1' },
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

describe('Project Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllProjects', () => {
    it('should return 200 with projects', async () => {
      (projectService.getAllProjects as jest.Mock).mockResolvedValue([mockProject]);
      const req = mockReq();
      const res = mockRes();
      await projectController.getAllProjects(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockProject]);
    });

    it('should return 500 on error', async () => {
      (projectService.getAllProjects as jest.Mock).mockRejectedValue({ status: 500, message: 'error' });
      const req = mockReq();
      const res = mockRes();
      await projectController.getAllProjects(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getProjectById', () => {
    it('should return 200 with project', async () => {
      (projectService.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      const req = mockReq();
      const res = mockRes();
      await projectController.getProjectById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });

    it('should return 404 if not found', async () => {
      (projectService.getProjectById as jest.Mock).mockRejectedValue({ status: 404, message: 'Project not found' });
      const req = mockReq();
      const res = mockRes();
      await projectController.getProjectById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createProject', () => {
    it('should return 201 with created project', async () => {
      (projectService.createProject as jest.Mock).mockResolvedValue(mockProject);
      const req = mockReq({ body: { name: 'Test Project', description: 'desc' } });
      const res = mockRes();
      await projectController.createProject(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockProject);
    });
  });

  describe('updateProject', () => {
    it('should return 200 with updated project', async () => {
      (projectService.updateProject as jest.Mock).mockResolvedValue({ ...mockProject, name: 'Updated' });
      const req = mockReq({ body: { name: 'Updated' } });
      const res = mockRes();
      await projectController.updateProject(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 if forbidden', async () => {
      (projectService.updateProject as jest.Mock).mockRejectedValue({ status: 403, message: 'Forbidden' });
      const req = mockReq();
      const res = mockRes();
      await projectController.updateProject(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('deleteProject', () => {
    it('should return 204 on success', async () => {
      (projectService.deleteProject as jest.Mock).mockResolvedValue(undefined);
      const req = mockReq();
      const res = mockRes();
      await projectController.deleteProject(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 404 if not found', async () => {
      (projectService.deleteProject as jest.Mock).mockRejectedValue({ status: 404, message: 'Not found' });
      const req = mockReq();
      const res = mockRes();
      await projectController.deleteProject(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});