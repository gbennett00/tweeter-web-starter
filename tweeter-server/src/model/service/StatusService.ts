import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";

export class StatusService {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    console.log("Loading more feed items");
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    console.log("Loading more story items");
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    // TODO: Call the server to post the status
  }
}
