export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  status: UserStatus;
  avatarUrl: string | null;
  joinedAt: string; // ISO 8601
  manager: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  role: User['role'];
  department: string;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  status?: UserStatus;
}
