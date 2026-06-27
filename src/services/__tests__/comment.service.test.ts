import * as commentRepo from '../../repositories/comment.repository';
import * as taskRepo from '../../repositories/task.repository';
import * as commentService from '../comment.service';

jest.mock('../../repositories/comment.repository');
jest.mock('../../repositories/task.repository');

const mockTask = {
  id: 'task1',
  projectId: 'proj1',
  title: 'Test Task',
  description: 'desc',
  status: 'todo' as const,
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
  updatedAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

const mockComment = {
  id: 'comment1',
  taskId: 'task1',
  authorId: 'user1',
  body: 'This is a comment',
  createdAt: new Date() as unknown as FirebaseFirestore.Timestamp,
};

describe('Comment Service', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getCommentsByTask', () => {
    it('should return comments for a task', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      (commentRepo.getCommentsByTask as jest.Mock).mockResolvedValue([mockComment]);
      const result = await commentService.getCommentsByTask('task1');
      expect(result).toEqual([mockComment]);
    });

    it('should throw 404 if task not found', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(commentService.getCommentsByTask('task1')).rejects.toEqual({
        status: 404,
        message: 'Task not found',
      });
    });
  });

  describe('createComment', () => {
    it('should create a comment on a task', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(mockTask);
      (commentRepo.createComment as jest.Mock).mockResolvedValue(mockComment);
      const result = await commentService.createComment('task1', 'user1', { body: 'This is a comment' });
      expect(result).toEqual(mockComment);
    });

    it('should throw 404 if task not found', async () => {
      (taskRepo.getTaskById as jest.Mock).mockResolvedValue(null);
      await expect(commentService.createComment('task1', 'user1', { body: 'test' })).rejects.toEqual({
        status: 404,
        message: 'Task not found',
      });
    });
  });

  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      (commentRepo.getCommentById as jest.Mock).mockResolvedValue(mockComment);
      (commentRepo.deleteComment as jest.Mock).mockResolvedValue(undefined);
      await expect(commentService.deleteComment('comment1', 'user1')).resolves.toBeUndefined();
    });

    it('should throw 404 if comment not found', async () => {
      (commentRepo.getCommentById as jest.Mock).mockResolvedValue(null);
      await expect(commentService.deleteComment('comment1', 'user1')).rejects.toEqual({
        status: 404,
        message: 'Comment not found',
      });
    });

    it('should throw 403 if user is not the author', async () => {
      (commentRepo.getCommentById as jest.Mock).mockResolvedValue(mockComment);
      await expect(commentService.deleteComment('comment1', 'otherUser')).rejects.toEqual({
        status: 403,
        message: 'Forbidden: You did not write this comment',
      });
    });
  });
});