import { Status, FakeData, StatusDto } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    return [items.map((status) => status.dto), hasMore];
  };

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    return [items.map((status) => status.dto), hasMore];
  };

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    await new Promise((f) => setTimeout(f, 2000));
  }
}
