import { setupServer } from 'msw/node';
import { authHandlers, dashboardHandlers, usersHandlers, profileHandlers } from './handlers';

/**
 * MSW node server for Vitest.
 * All handlers are registered here and can be overridden per-test with:
 *   server.use(http.get('/api/users', () => ...))
 */
export const server = setupServer(
  ...authHandlers,
  ...dashboardHandlers,
  ...usersHandlers,
  ...profileHandlers,
);
