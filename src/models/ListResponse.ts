
export class ListResponse<T> {
  constructor(
    public nextPageToken: string,
    public items: T[]
  ) {
  }
}
