import { db } from '../config/firebase';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'tasks';

/**
 * Get all tasks for a project
 * @param projectId - The project ID
 * @returns Array of tasks
 */
export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const snapshot = await db.collection(COLLECTION).where('projectId', '==', projectId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
};

/**
 * Get a single task by ID
 * @param id - Task ID
 * @returns Task or null
 */
export const getTaskById = async (id: string): Promise<Task | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Task;
};

/**
 * Create a new task
 * @param projectId - The project ID
 * @param data - Task creation data
 * @returns Created task
 */
export const createTask = async (projectId: string, data: CreateTaskDto): Promise<Task> => {
  const taskData = {
    ...data,
    projectId,
    status: data.status || 'todo',
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const ref = await db.collection(COLLECTION).add(taskData);
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Task;
};

/**
 * Update an existing task
 * @param id - Task ID
 * @param data - Fields to update
 * @returns Updated task
 */
export const updateTask = async (id: string, data: UpdateTaskDto): Promise<Task | null> => {
  const ref = db.collection(COLLECTION).doc(id);
  await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Task;
};

/**
 * Delete a task by ID
 * @param id - Task ID
 */
export const deleteTask = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};