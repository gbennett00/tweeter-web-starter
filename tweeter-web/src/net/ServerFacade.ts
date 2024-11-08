import {
  FollowCountRequest,
  FollowCountResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://f8sj6mgs36.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.sendPagedItemRequest(request, "/followee/list", `No followees found`);
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    return this.sendPagedItemRequest(request, "/follower/list", `No followers found`);
  }

  private async sendPagedItemRequest(
    request: PagedUserItemRequest,
    path: string,
    errorMessage: string
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, path);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors    
    if (response.success) {
      if (items == null) {
        throw new Error(errorMessage);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      const message = response.message ? response.message : undefined;
      throw new Error(message);
    }
  }

  public async getIsFollower(req: IsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<IsFollowerRequest, IsFollowerResponse>(req, "/follower/status");
    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      const message = response.message ? response.message : undefined;
      throw new Error(message);
    }
  }

  public async getFolloweeCount(req: FollowCountRequest): Promise<number> {
    return this.getFollowCount(req, "/followee/count");
  }

  public async getFollowerCount(req: FollowCountRequest): Promise<number> {
    return this.getFollowCount(req, "/follower/count");
  }

  private async getFollowCount(req: FollowCountRequest, path: string): Promise<number> {
    const response = await this.clientCommunicator.doPost<FollowCountRequest, FollowCountResponse>(req, path);
    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      const message = response.message ? response.message : undefined;
      throw new Error(message);
    }
  }
}