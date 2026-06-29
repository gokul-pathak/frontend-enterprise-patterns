/**
 * Shared API response envelope types.
 * These match the shape returned by our MSW mock handlers.
 */

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
