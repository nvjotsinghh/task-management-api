export interface Comment {
  id?: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: FirebaseFirestore.Timestamp;
}

export interface CreateCommentDto {
  body: string;
}