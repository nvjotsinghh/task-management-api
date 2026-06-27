export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id?: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status?: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
}