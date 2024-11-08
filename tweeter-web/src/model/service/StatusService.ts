import { AuthToken, Status, FakeData } from "tweeter-shared";
import { TweeterClient } from "./TweeterClient";
import { tokenToString } from "typescript";

export class StatusService extends TweeterClient {

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
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    return this.facade.postStatus({
      token: authToken.token,
      status: newStatus.dto
    });
  }
}
