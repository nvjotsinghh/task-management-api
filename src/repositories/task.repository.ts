import { db } from '../config/firebase';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'tasks';

/**
 * Filter and sort options for task queries.
 */
export interface TaskFilters {
  /** Filter tasks by status: 'todo', 'in-progress', or 'done' */
  status?: string;
  /** Filter tasks by the Firebase UID of the assigned user */
  assigneeId?: string;
  /** Field to sort results by */
  sortBy?: 'dueDate' | 'createdAt';
  /** Sort direction — ascending or descending */
  order?: 'asc' | 'desc';
}

/**
 * Retrieves all tasks for a given project with optional filtering and sorting.
 * Filters are applied at the Firestore query level for efficiency.
 * @param projectId - The Firestore document ID of the parent project
 * @param filters - Optional filters for status, assigneeId, and sort options
 * @returns {Promise<Task[]>} Array of tasks matching the criteria
 */
export const getTasksByProject = async (projectId: string, filters: TaskFilters = {}): Promise<Task[]> => {
  // Start with base query filtered by project
  let query = db.collection(COLLECTION).where('projectId', '==', projectId);

  // Apply optional status filter
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }

  // Apply optional assignee filter
  if (filters.assigneeId) {
    query = query.where('assigneeId', '==', filters.assigneeId);
  }

  // Apply optional sorting — defaults to ascending if order not specified
  if (filters.sortBy) {
    query = query.orderBy(filters.sortBy, filters.order || 'asc');
  }

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

/**
 * Retrieves a single task by its Firestore document ID.
 * @param id - The Firestore document ID of the task
 * @returns {Promise<Task | null>} The task if found, null otherwise
 */
export const getTaskById = async (id: string): Promise<Task | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Task;
};

/**
 * Creates a new task document in Firestore under a given project.
 * Defaults status to 'todo' if not provided in the request.
 * @param projectId - The Firestore document ID of the parent project
 * @param data - Task creation data including title, description, and optional fields
 * @returns {Promise<Task>} The newly created task with its generated ID
 */
export const createTask = async (projectId: string, data: CreateTaskDto): Promise<Task> => {
  const taskData = {
    ...data,
    projectId,
    // Default status to 'todo' if caller did not specify one
    status: data.status || 'todo',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const ref = await db.collection(COLLECTION).add(taskData);

  // Re-fetch to get server-resolved timestamps in the response
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Task;
};

/**
 * Updates an existing task document in Firestore.
 * Supports partial updates — only provided fields are changed.
 * @param id - The Firestore document ID of the task to update
 * @param data - Partial task data containing only fields to update
 * @returns {Promise<Task | null>} The updated task document
 */
export const updateTask = async (id: string, data: UpdateTaskDto): Promise<Task | null> => {
  const ref = db.collection(COLLECTION).doc(id);
  await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Task;
};

/**
 * Permanently deletes a task document from Firestore.
 * Note: Does not cascade delete associated comments.
 * @param id - The Firestore document ID of the task to delete
 * @returns {Promise<void>}
 */
export const deleteTask = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};