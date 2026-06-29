import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser, deleteUser } from '../api/usersService';
import { enqueueNotification } from '@/store/notificationsSlice';
import { useAppDispatch } from '@/store';
import type { CreateUserPayload, UpdateUserPayload } from '../types/user.types';

export function useCreateUser() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      dispatch(enqueueNotification({ message: 'User created successfully.', severity: 'success' }));
    },
    onError: () => {
      dispatch(enqueueNotification({ message: 'Failed to create user.', severity: 'error' }));
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      dispatch(enqueueNotification({ message: 'User updated.', severity: 'success' }));
    },
    onError: () => {
      dispatch(enqueueNotification({ message: 'Failed to update user.', severity: 'error' }));
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      dispatch(enqueueNotification({ message: 'User removed.', severity: 'success' }));
    },
    onError: () => {
      dispatch(enqueueNotification({ message: 'Failed to delete user.', severity: 'error' }));
    },
  });
}
