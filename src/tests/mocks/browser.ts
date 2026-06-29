import { setupWorker } from 'msw/browser';
import {
  authHandlers,
  dashboardHandlers,
  usersHandlers,
  profileHandlers,
} from './handlers';

export const worker = setupWorker(
  ...authHandlers,
  ...dashboardHandlers,
  ...usersHandlers,
  ...profileHandlers
);
