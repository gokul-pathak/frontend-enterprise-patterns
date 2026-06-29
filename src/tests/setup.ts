import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

// Start the MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that were added during individual tests
afterEach(() => server.resetHandlers());

// Stop the server after all tests complete
afterAll(() => server.close());
