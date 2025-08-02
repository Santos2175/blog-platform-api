// Response structure for paginated response
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Utility function to generate paginated empty result
export function getEmptyPaginatedResult<T>(
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data: [],
    page,
    limit,
    total: 0,
    totalPages: 0,
  };
}
