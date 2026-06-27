export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'member';
  createdAt: FirebaseFirestore.Timestamp;
}