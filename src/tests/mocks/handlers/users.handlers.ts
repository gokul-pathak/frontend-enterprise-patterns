import { http, HttpResponse } from 'msw';
import type { User } from '@/features/users/types/user.types';
import type { PaginatedResponse } from '@/types/api.types';

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex.rivera@meridian.io', role: 'admin', department: 'Engineering', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=u1', joinedAt: '2022-03-15T00:00:00Z', manager: null },
  { id: 'u2', name: 'Morgan Chen', email: 'morgan.chen@meridian.io', role: 'manager', department: 'Product', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=u2', joinedAt: '2021-07-20T00:00:00Z', manager: 'Alex Rivera' },
  { id: 'u3', name: 'Gokul Pathak', email: 'gokul-pathak@meridian.io', role: 'employee', department: 'Engineering', status: 'active', avatarUrl: 'https://avatars.githubusercontent.com/gokul-pathak', joinedAt: '2023-01-10T00:00:00Z', manager: 'Morgan Chen' },
  { id: 'u4', name: 'Jordan Liu', email: 'jordan.liu@meridian.io', role: 'employee', department: 'Engineering', status: 'active', avatarUrl: null, joinedAt: '2023-11-05T00:00:00Z', manager: 'Alex Rivera' },
  { id: 'u5', name: 'Casey Kim', email: 'casey.kim@meridian.io', role: 'employee', department: 'Design', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=u5', joinedAt: '2022-08-01T00:00:00Z', manager: 'Morgan Chen' },
  { id: 'u6', name: 'Riley Park', email: 'riley.park@meridian.io', role: 'employee', department: 'Finance', status: 'inactive', avatarUrl: null, joinedAt: '2020-04-12T00:00:00Z', manager: 'Alex Rivera' },
  { id: 'u7', name: 'Drew Martinez', email: 'drew.martinez@meridian.io', role: 'employee', department: 'Engineering', status: 'pending', avatarUrl: 'https://i.pravatar.cc/150?u=u7', joinedAt: '2024-02-20T00:00:00Z', manager: 'Alex Rivera' },
  { id: 'u8', name: 'Quinn Johnson', email: 'quinn.johnson@meridian.io', role: 'manager', department: 'People Ops', status: 'active', avatarUrl: 'https://i.pravatar.cc/150?u=u8', joinedAt: '2021-11-30T00:00:00Z', manager: 'Alex Rivera' },
];

export const usersHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const department = url.searchParams.get('department');
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '10', 10);

    let filtered = MOCK_USERS;

    if (search) {
      filtered = filtered.filter(
        (u) => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search),
      );
    }
    if (department) filtered = filtered.filter((u) => u.department === department);
    if (status) filtered = filtered.filter((u) => u.status === status);

    const total = filtered.length;
    const data = filtered.slice((page - 1) * pageSize, page * pageSize);

    const response: PaginatedResponse<User> = {
      data,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };

    return HttpResponse.json(response);
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = MOCK_USERS.find((u) => u.id === params.id);
    if (!user) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as Partial<User>;
    const newUser: User = {
      id: `u${MOCK_USERS.length + 1}`,
      name: body.name ?? '',
      email: body.email ?? '',
      role: body.role ?? 'employee',
      department: body.department ?? '',
      status: 'pending',
      avatarUrl: null,
      joinedAt: new Date().toISOString(),
      manager: null,
    };
    MOCK_USERS.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  http.patch('/api/users/:id', async ({ params, request }) => {
    const index = MOCK_USERS.findIndex((u) => u.id === params.id);
    if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const body = (await request.json()) as Partial<User>;
    MOCK_USERS[index] = { ...MOCK_USERS[index], ...body };
    return HttpResponse.json(MOCK_USERS[index]);
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const index = MOCK_USERS.findIndex((u) => u.id === params.id);
    if (index !== -1) MOCK_USERS.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
