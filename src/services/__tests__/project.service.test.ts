import * as projectRepo from '../../repositories/project.repository';
import * as projectService from '../project.service';

jest.mock('../../repositories/project.repository');

const mockProject = {
  id: 'proj1',
  name: 'Test Project',
  description: 'A test project',
  ownerId: 'user1',
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
  updatedAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

describe('Project Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllProjects', () => {
    it('should return all projects for a user', async () => {
      (projectRepo.getAllProjects as jest.Mock).mockResolvedValue([mockProject]);
      const result = await projectService.getAllProjects('user1');
      expect(result).toEqual([mockProject]);
      expect(projectRepo.getAllProjects).toHaveBeenCalledWith('user1');
    });

    it('should return empty array when no projects exist', async () => {
      (projectRepo.getAllProjects as jest.Mock).mockResolvedValue([]);
      const result = await projectService.getAllProjects('user1');
      expect(result).toEqual([]);
    });
  });

  describe('getProjectById', () => {
    it('should return a project by ID', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      const result = await projectService.getProjectById('proj1');
      expect(result).toEqual(mockProject);
    });

    it('should throw 404 if project not found', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(null);
      await expect(projectService.getProjectById('proj1')).rejects.toEqual({
        status: 404,
        message: 'Project not found',
      });
    });
  });

  describe('createProject', () => {
    it('should create and return a project', async () => {
      (projectRepo.createProject as jest.Mock).mockResolvedValue(mockProject);
      const result = await projectService.createProject('user1', {
        name: 'Test Project',
        description: 'A test project',
      });
      expect(result).toEqual(mockProject);
    });
  });

  describe('updateProject', () => {
    it('should update and return the project', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      (projectRepo.updateProject as jest.Mock).mockResolvedValue({ ...mockProject, name: 'Updated' });
      const result = await projectService.updateProject('proj1', 'user1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw 404 if project not found', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(null);
      await expect(projectService.updateProject('proj1', 'user1', {})).rejects.toEqual({
        status: 404,
        message: 'Project not found',
      });
    });

    it('should throw 403 if user is not owner', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      await expect(projectService.updateProject('proj1', 'otherUser', {})).rejects.toEqual({
        status: 403,
        message: 'Forbidden: You do not own this project',
      });
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      (projectRepo.deleteProject as jest.Mock).mockResolvedValue(undefined);
      await expect(projectService.deleteProject('proj1', 'user1')).resolves.toBeUndefined();
    });

    it('should throw 404 if project not found', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(null);
      await expect(projectService.deleteProject('proj1', 'user1')).rejects.toEqual({
        status: 404,
        message: 'Project not found',
      });
    });

    it('should throw 403 if user is not owner', async () => {
      (projectRepo.getProjectById as jest.Mock).mockResolvedValue(mockProject);
      await expect(projectService.deleteProject('proj1', 'otherUser')).rejects.toEqual({
        status: 403,
        message: 'Forbidden: You do not own this project',
      });
    });
  });
});