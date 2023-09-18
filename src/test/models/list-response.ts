import {ListResponse} from "../../models/listResponse";

export function createTestListResponse<T>(items: T[]): ListResponse<T> {
  return new ListResponse<T>('nextPageToken', items);
}
