export interface Project {
  id?: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface CreateProjectDto {
  name: string;
  description: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}