import { db } from '../config/firebase';
import { Comment, CreateCommentDto } from '../models/comment.model';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'comments';

/**
 * Get all comments for a task
 * @param taskId - The task ID
 * @returns Array of comments
 */
export const getCommentsByTask = async (taskId: string): Promise<Comment[]> => {
  const snapshot = await db.collection(COLLECTION).where('taskId', '==', taskId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
};

/**
 * Get a single comment by ID
 * @param id - Comment ID
 * @returns Comment or null
 */
export const getCommentById = async (id: string): Promise<Comment | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Comment;
};

/**
 * Create a new comment
 * @param taskId - The task ID
 * @param authorId - The user ID of the author
 * @param data - Comment creation data
 * @returns Created comment
 */
export const createComment = async (taskId: string, authorId: string, data: CreateCommentDto): Promise<Comment> => {
  const commentData = {
    ...data,
    taskId,
    authorId,
    createdAt: FieldValue.serverTimestamp(),
  };
  const ref = await db.collection(COLLECTION).add(commentData);
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Comment;
};

/**
 * Delete a comment by ID
 * @param id - Comment ID
 */
export const deleteComment = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};