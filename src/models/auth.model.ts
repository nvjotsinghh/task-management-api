export interface RegisterDto {
  email: string;
  password: string;
  role?: 'admin' | 'member';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  uid: string;
  email: string;
  token: string;
  role: string;
}