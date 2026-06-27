import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as commentController from '../../controllers/comment.controller';
import * as commentService from '../../services/comment.service';

jest.mock('../../services/comment.service');

const mockComment = {
  id: 'comment1',
  taskId: 'task1',
  authorId: 'user1',
  body: 'A comment',
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

const mockReq = (overrides = {}): AuthRequest => ({
  user: { uid: 'user1', email: 'test@test.com', role: 'member' },
  params: { id: 'task1' },
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

describe('Comment Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getCommentsByTask', () => {
    it('should return 200 with comments', async () => {
      (commentService.getCommentsByTask as jest.Mock).mockResolvedValue([mockComment]);
      const req = mockReq();
      const res = mockRes();
      await commentController.getCommentsByTask(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockComment]);
    });

    it('should return 404 if task not found', async () => {
      (commentService.getCommentsByTask as jest.Mock).mockRejectedValue({ status: 404, message: 'Task not found' });
      const req = mockReq();
      const res = mockRes();
      await commentController.getCommentsByTask(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createComment', () => {
    it('should return 201 with created comment', async () => {
      (commentService.createComment as jest.Mock).mockResolvedValue(mockComment);
      const req = mockReq({ body: { body: 'A comment' } });
      const res = mockRes();
      await commentController.createComment(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 on error', async () => {
      (commentService.createComment as jest.Mock).mockRejectedValue({ status: 500, message: 'error' });
      const req = mockReq();
      const res = mockRes();
      await commentController.createComment(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteComment', () => {
    it('should return 204 on success', async () => {
      (commentService.deleteComment as jest.Mock).mockResolvedValue(undefined);
      const req = mockReq();
      const res = mockRes();
      await commentController.deleteComment(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it('should return 403 if forbidden', async () => {
      (commentService.deleteComment as jest.Mock).mockRejectedValue({ status: 403, message: 'Forbidden' });
      const req = mockReq();
      const res = mockRes();
      await commentController.deleteComment(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});