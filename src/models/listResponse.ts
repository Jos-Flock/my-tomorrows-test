export class ListResponse<T> {
  constructor(
    public items: T[],
    public nextPageToken?: string | null,
  ) {}

  public isLastPage(): boolean {
    return this.nextPageToken === null;
  }
}
