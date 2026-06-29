import { db } from '../config/firebase';
import { Project, CreateProjectDto, UpdateProjectDto } from '../models/project.model';
import { FieldValue } from 'firebase-admin/firestore';

const COLLECTION = 'projects';

/**
 * Retrieves all projects owned by a specific user from Firestore.
 * Filters by ownerId to ensure users only see their own projects.
 * @param ownerId - The Firebase UID of the project owner
 * @returns {Promise<Project[]>} Array of projects belonging to the user
 */
export const getAllProjects = async (ownerId: string): Promise<Project[]> => {
  const snapshot = await db.collection(COLLECTION).where('ownerId', '==', ownerId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};

/**
 * Retrieves a single project by its Firestore document ID.
 * @param id - The Firestore document ID of the project
 * @returns {Promise<Project | null>} The project if found, null otherwise
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  const doc = await db.collection(COLLECTION).doc(id).get();

  // Return null if the document doesn't exist instead of throwing
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() } as Project;
};

/**
 * Creates a new project document in Firestore with server-generated timestamps.
 * @param ownerId - The Firebase UID of the user creating the project
 * @param data - Project creation data including name and description
 * @returns {Promise<Project>} The newly created project with its generated ID
 */
export const createProject = async (ownerId: string, data: CreateProjectDto): Promise<Project> => {
  const projectData = {
    ...data,
    ownerId,
    // Use server timestamps to ensure consistency across time zones
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const ref = await db.collection(COLLECTION).add(projectData);

  // Re-fetch the document to get the server-resolved timestamps
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Project;
};

/**
 * Updates an existing project document in Firestore.
 * Only updates provided fields and refreshes the updatedAt timestamp.
 * @param id - The Firestore document ID of the project to update
 * @param data - Partial project data containing only fields to update
 * @returns {Promise<Project | null>} The updated project document
 */
export const updateProject = async (id: string, data: UpdateProjectDto): Promise<Project | null> => {
  const ref = db.collection(COLLECTION).doc(id);

  // Merge update data with a fresh server timestamp
  await ref.update({ ...data, updatedAt: FieldValue.serverTimestamp() });

  const doc = await ref.get();
  return { id: doc.id, ...doc.data() } as Project;
};

/**
 * Permanently deletes a project document from Firestore.
 * Note: Does not cascade delete associated tasks or comments.
 * @param id - The Firestore document ID of the project to delete
 * @returns {Promise<void>}
 */
export const deleteProject = async (id: string): Promise<void> => {
  await db.collection(COLLECTION).doc(id).delete();
};