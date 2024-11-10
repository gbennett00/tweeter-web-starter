import { AuthToken, Status, PagedUserItemRequest, StatusDto } from "tweeter-shared";
import { TweeterClient } from "./TweeterClient";

export class StatusService extends TweeterClient {

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const req = this.toPagedUserItemRequest(authToken, userAlias, pageSize, lastItem);
    return this.facade.getMoreFeedItems(req as PagedUserItemRequest<StatusDto>);
  };

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const req = this.toPagedUserItemRequest(authToken, userAlias, pageSize, lastItem);
    return this.facade.getMoreStoryItems(req as PagedUserItemRequest<StatusDto>);
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
