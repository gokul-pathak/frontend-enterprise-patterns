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
  const { data } = await apiClient.get<PaginatedResponse<User>>('/users', { params });
  return data;
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post<User>('/users', payload);
  return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiClient.patch<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
