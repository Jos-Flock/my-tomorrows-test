import { ListResponse } from '../../models/listResponse';

export function createTestListResponse<T>(items: T[], nextPageToken: string | null = 'nextPageToken'): ListResponse<T> {
  return new ListResponse<T>(items, nextPageToken);
}
