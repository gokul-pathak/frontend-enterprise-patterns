import { apiClient } from '@/lib/axios';
import type { PaginatedResponse } from '@/types/api.types';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types/user.types';

export interface UsersQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  department?: string;
  status?: string;
}

export async function getUsers(params: UsersQueryParams): Promise<PaginatedResponse<User>> {
  const q = params.search ? encodeURIComponent(params.search) : 'type:user';
  // Use apiClient which now automatically injects NextAuth token if available
  const { data } = await apiClient.get(`https://api.github.com/search/users?q=${q}&page=${params.page}&per_page=${params.pageSize}`);
  
  // Map GitHub REST API response to our app's User type
  const items = data.items || [];
  
  return {
    data: items.map((item: any) => ({
      id: String(item.id),
      name: item.login,
      email: `${item.login}@github.com`,
      role: item.type === 'User' ? 'employee' : 'manager',
      department: 'Engineering', // Placeholder for demonstration
      status: 'active',
      avatarUrl: item.avatar_url,
      joinedAt: new Date().toISOString(),
      manager: null,
    })),
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
      total: Math.min(data.total_count || 0, 1000), // GitHub limits search results to 1000
      totalPages: Math.ceil(Math.min(data.total_count || 0, 1000) / params.pageSize),
    },
  };
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await apiClient.get(`https://api.github.com/user/${id}`);
  return {
    id: String(data.id),
    name: data.login,
    email: `${data.login}@github.com`,
    role: 'employee',
    department: 'Engineering',
    status: 'active',
    avatarUrl: data.avatar_url,
    joinedAt: new Date().toISOString(),
    manager: null,
  };
}

// These mutations will just simulate success since we can't actually create/delete GitHub users
export async function createUser(payload: CreateUserPayload): Promise<User> {
  return {
    id: Date.now().toString(),
    ...payload,
    avatarUrl: null,
    joinedAt: new Date().toISOString(),
    manager: null,
    status: 'active',
  };
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const existing = await getUserById(id);
  return { ...existing, ...payload };
}

export async function deleteUser(id: string): Promise<void> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 500));
}
