import { http, HttpResponse } from 'msw';

const USERS_DB: Record<string, { id: string; name: string; email: string; role: string; avatarUrl: string | null; department: string }> = {
  'admin@meridian.io': {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'admin@meridian.io',
    role: 'admin',
    department: 'Engineering',
    avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  },
  'manager@meridian.io': {
    id: 'user-2',
    name: 'Morgan Chen',
    email: 'manager@meridian.io',
    role: 'manager',
    department: 'Product',
    avatarUrl: 'https://i.pravatar.cc/150?u=manager',
  },
  'gokul-pathak@meridian.io': {
    id: 'u3',
    name: 'Gokul Pathak',
    email: 'gokul-pathak@meridian.io',
    role: 'employee',
    department: 'Engineering',
    avatarUrl: 'https://avatars.githubusercontent.com/gokul-pathak',
  },
};

function createMockJwt(user: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      ...user,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 min expiry
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  return `${header}.${payload}.mock-signature`;
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = USERS_DB[body.email];

    if (!user || body.password !== 'password123') {
      return HttpResponse.json({ message: 'Invalid credentials', code: 'AUTH_INVALID' }, { status: 401 });
    }

    return HttpResponse.json({
      user,
      tokens: {
        accessToken: createMockJwt(user),
        refreshToken: `mock-refresh|${user.id}|${Date.now()}`,
      },
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };
    const userId = body.refreshToken.split('|')[1];
    const user = Object.values(USERS_DB).find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
    }

    return HttpResponse.json({ accessToken: createMockJwt(user) });
  }),

  http.get('/api/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization');
    if (!auth) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return HttpResponse.json(Object.values(USERS_DB)[0]);
  }),
];
