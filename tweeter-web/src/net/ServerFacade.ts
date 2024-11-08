import {
  FollowCountRequest,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  TweeterRequest,
  TweeterResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://f8sj6mgs36.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    return this.sendPagedItemRequest(request, "/followee/list", `No followees found`);
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    return this.sendPagedItemRequest(request, "/follower/list", `No followers found`);
  }

  private async sendPagedItemRequest(
    request: PagedUserItemRequest,
    path: string,
    errorMessage: string
  ): Promise<[User[], boolean]> {
    const res = await this.postAndHandleError<PagedUserItemRequest, PagedUserItemResponse>(request, path);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null = res.success && res.items ? res.items.map((dto) => User.fromDto(dto) as User) : null;

    if (items == null) {
      throw new Error(errorMessage);
    } else {
      return [items, res.hasMore];
    }
  }

  public async getIsFollower(req: IsFollowerRequest): Promise<boolean> {
    const res = await this.postAndHandleError<IsFollowerRequest, IsFollowerResponse>(req, "/follower/status");
    return res.isFollower;
  }

  public async getFolloweeCount(req: FollowCountRequest): Promise<number> {
    return this.getFollowCount(req, "/followee/count");
  }

  public async getFollowerCount(req: FollowCountRequest): Promise<number> {
    return this.getFollowCount(req, "/follower/count");
  }

  private async getFollowCount(req: FollowCountRequest, path: string): Promise<number> {
    const res = await this.postAndHandleError<FollowCountRequest, FollowCountResponse>(req, path);
    return res.count;
  }

  public async follow(req: FollowRequest): Promise<[number, number]> {
    return await this.toggleFollow(req, "/follow");
  }

  public async unfollow(req: FollowRequest): Promise<[number, number]> {
    return await this.toggleFollow(req, "/unfollow");
  }

  private async toggleFollow(req: FollowRequest, path: string): Promise<[number, number]> {
    const res = await this.postAndHandleError<FollowRequest, FollowResponse>(req, path);
    return [res.followerCount, res.followeeCount];
  }

  public async postStatus(req: TweeterRequest): Promise<void> {
    await this.postAndHandleError<TweeterRequest, TweeterResponse>(req, "/status/post");
  }

  private async postAndHandleError<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ,
    path: string
  ): Promise<RES> {
    const response = await this.clientCommunicator.doPost<REQ, RES>(req, path);

    if (response.success) {
      return response;
    } else {
      console.error(response);
      const message = response.message ? response.message : undefined;
      throw new Error(message);
    }
  }
}
