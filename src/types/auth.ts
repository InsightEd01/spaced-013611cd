
export type UserRole = 'admin' | 'teacher' | 'parent' | 'supa_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  school_id?: string;
  student_ids?: string[];
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  studentNumber?: string;
}
