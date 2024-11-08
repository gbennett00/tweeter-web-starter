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
    return this.facade.follow({
      token: authToken.token,
      targetUser: userToFollow.dto
    });
  };

  async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    return this.facade.unfollow({
      token: authToken.token,
      targetUser: userToUnfollow.dto
    });
  };
}