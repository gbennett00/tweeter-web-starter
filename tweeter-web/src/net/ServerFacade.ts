import {
  AuthRequest,
  AuthResponse,
  FollowCountRequest,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";
import { VerifiedRequest } from "tweeter-shared/dist/model/net/request/VerifiedRequest";

export class ServerFacade {
  private SERVER_URL = "https://f8sj6mgs36.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(request: PagedUserItemRequest<UserDto>): Promise<[User[], boolean]> {
    return this.sendPagedItemRequest(request, "/followee/list", `No followees found`, User.fromDto);
  }

  public async getMoreFollowers(request: PagedUserItemRequest<UserDto>): Promise<[User[], boolean]> {
    return this.sendPagedItemRequest(request, "/follower/list", `No followers found`, User.fromDto);
  }

  public async getMoreStoryItems(request: PagedUserItemRequest<StatusDto>): Promise<[Status[], boolean]> {
    return this.sendPagedItemRequest(request, "/status/story", `No story items found`, Status.fromDto);
  }

  public async getMoreFeedItems(request: PagedUserItemRequest<StatusDto>): Promise<[Status[], boolean]> {
    return this.sendPagedItemRequest(request, "/status/feed", `No feed items found`, Status.fromDto);
  }

  private async sendPagedItemRequest<DTO extends UserDto | StatusDto, Item extends User | Status>(
    request: PagedUserItemRequest<DTO>,
    path: string,
    errorMessage: string,
    fromDto: (dto: DTO | null) => Item | null,
  ): Promise<[Item[], boolean]> {
    const res = await this.postAndHandleError<PagedUserItemRequest<DTO>, PagedUserItemResponse<DTO>>(request, path);

    // Convert the Dto array returned by ClientCommunicator to an Item array
    const items: Item[] | null = res.success && res.items ? res.items.map((dto) => fromDto(dto) as Item) : null;

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

  public async login(req: AuthRequest): Promise<AuthResponse> {
    return await this.postAndHandleError<AuthRequest, AuthResponse>(req, "/user/login");
  }

  public async register(req: RegisterRequest): Promise<AuthResponse> {
    return await this.postAndHandleError<AuthRequest, AuthResponse>(req, "/user/register");
  }

  public async logout(req: VerifiedRequest): Promise<void> {
    await this.postAndHandleError<VerifiedRequest, TweeterResponse>(req, "/user/logout");
  }

  public async getUser(req: GetUserRequest): Promise<User | null> {
    const res = await this.postAndHandleError<GetUserRequest, GetUserResponse>(req, "/user/get");
    return User.fromDto(res.user);
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
