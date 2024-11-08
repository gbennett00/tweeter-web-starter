import { AuthToken, User, PagedUserItemRequest, FollowRequest, FollowCountRequest } from "tweeter-shared";
import { TweeterClient } from "./TweeterClient";

export class FollowService extends TweeterClient {

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
    const req = this.toFollowCountRequest(authToken, user);
    return this.facade.getFolloweeCount(req);
  };

  async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const req = this.toFollowCountRequest(authToken, user);
    return this.facade.getFollowerCount(req);
  };

  private toFollowCountRequest(token: AuthToken, user: User): FollowCountRequest {
    return {
      token: token.token,
      user: user.dto
    };
  }

  async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const req = this.toFollowRequest(authToken, userToFollow);
    return this.facade.follow(req);
  };

  async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const req = this.toFollowRequest(authToken, userToUnfollow);
    return this.facade.unfollow(req);
  };

  private toFollowRequest(token: AuthToken, targetUser: User): FollowRequest {
    return {
      token: token.token,
      targetUser: targetUser.dto
    };
  }
}