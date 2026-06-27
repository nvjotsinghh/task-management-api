import * as commentRepo from '../repositories/comment.repository';
import * as taskRepo from '../repositories/task.repository';
import { Comment, CreateCommentDto } from '../models/comment.model';

/**
 * Get all comments for a task
 * @param taskId - Task ID
 * @returns Array of comments
 */
export const getCommentsByTask = async (taskId: string): Promise<Comment[]> => {
  const task = await taskRepo.getTaskById(taskId);
  if (!task) throw { status: 404, message: 'Task not found' };
  return commentRepo.getCommentsByTask(taskId);
};

/**
 * Create a comment on a task
 * @param taskId - Task ID
 * @param authorId - User ID of author
 * @param data - Comment data
 * @returns Created comment
 */
export const createComment = async (taskId: string, authorId: string, data: CreateCommentDto): Promise<Comment> => {
  const task = await taskRepo.getTaskById(taskId);
  if (!task) throw { status: 404, message: 'Task not found' };
  return commentRepo.createComment(taskId, authorId, data);
};

/**
 * Delete a comment, throws if not author
 * @param id - Comment ID
 * @param authorId - User ID
 */
export const deleteComment = async (id: string, authorId: string): Promise<void> => {
  const comment = await commentRepo.getCommentById(id);
  if (!comment) throw { status: 404, message: 'Comment not found' };
  if (comment.authorId !== authorId) throw { status: 403, message: 'Forbidden: You did not write this comment' };
  await commentRepo.deleteComment(id);
};