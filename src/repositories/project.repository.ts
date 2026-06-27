import { db } from '../config/firebase';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/project.model';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'projects';

/**
 * Get all projects owned by a user
 * @param ownerId - The user ID of the owner
 * @returns Array of projects
 */
export const getAllProjects = async (ownerId: string): Promise<Project[]> => {
  const snapshot = await db.collection(COLLECTION).where('ownerId', '==', ownerId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

/**
 * Get a single project by ID
 * @param id - Project ID
 * @returns Project or null
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Project;
};

/**
 * Create a new project
 * @param ownerId - The user ID of the owner
 * @param data - Project creation data
 * @returns Created project
 */
export const createProject = async (ownerId: string, data: CreateProjectDto): Promise<Project> => {
  const projectData = {
    ...data,
    ownerId,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };
  const ref = await db.collection(COLLECTION).add(projectData);
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Project;
};

/**
 * Update an existing project
 * @param id - Project ID
 * @param data - Fields to update
 * @returns Updated project
 */
export const updateProject = async (id: string, data: UpdateProjectDto): Promise<Project | null> => {
  const ref = db.collection(COLLECTION).doc(id);
  await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Project;
};

/**
 * Delete a project by ID
 * @param id - Project ID
 */
export const deleteProject = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};