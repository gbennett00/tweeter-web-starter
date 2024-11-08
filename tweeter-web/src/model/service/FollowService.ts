import { AuthToken, User, FakeData, PagedUserItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../net/ServerFacade";

export class FollowService {
  private facade: ServerFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const req = this.toPagedUserItemRequest(authToken, userAlias, pageSize, lastItem);
    return this.facade.getMoreFollowers(req);
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const req = this.toPagedUserItemRequest(authToken, userAlias, pageSize, lastItem);
    return this.facade.getMoreFollowees(req);
  };

  private toPagedUserItemRequest(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): PagedUserItemRequest {
    return {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null
    };
  };

  async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.facade.getIsFollower({
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto
    });
  };

  async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.facade.getFolloweeCount({
      token: authToken.token,
      user: user.dto
    });
  };

  async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.facade.getFollowerCount({
      token: authToken.token,
      user: user.dto
    });
  };

  async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };
}