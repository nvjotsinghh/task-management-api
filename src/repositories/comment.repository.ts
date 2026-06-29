import { db } from '../config/firebase';
import { Comment, CreateCommentDto } from '../models/comment.model';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'comments';

/**
 * Retrieves all comments associated with a specific task.
 * Results are ordered by Firestore's natural insertion order.
 * @param taskId - The Firestore document ID of the parent task
 * @returns {Promise<Comment[]>} Array of comments on the task
 */
export const getCommentsByTask = async (taskId: string): Promise<Comment[]> => {
  const snapshot = await db.collection(COLLECTION).where('taskId', '==', taskId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
};

/**
 * Retrieves a single comment by its Firestore document ID.
 * Used primarily for authorization checks before delete operations.
 * @param id - The Firestore document ID of the comment
 * @returns {Promise<Comment | null>} The comment if found, null otherwise
 */
export const getCommentById = async (id: string): Promise<Comment | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Comment;
};

/**
 * Creates a new comment document in Firestore linked to a task and author.
 * @param taskId - The Firestore document ID of the task being commented on
 * @param authorId - The Firebase UID of the user writing the comment
 * @param data - Comment data containing the body text
 * @returns {Promise<Comment>} The newly created comment with its generated ID
 */
export const createComment = async (
  taskId: string,
  authorId: string,
  data: CreateCommentDto
): Promise<Comment> => {
  const commentData = {
    ...data,
    taskId,
    authorId,
    // Comments are immutable after creation — only createdAt is needed
    createdAt: FieldValue.serverTimestamp(),
  };

  const ref = await db.collection(COLLECTION).add(commentData);

  // Re-fetch to get the server-resolved timestamp
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Comment;
};

/**
 * Permanently deletes a comment document from Firestore.
 * Authorization (author check) is handled at the service layer before this is called.
 * @param id - The Firestore document ID of the comment to delete
 * @returns {Promise<void>}
 */
export const deleteComment = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};