import { PagedUserItemRequest, PagedUserItemResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { pagedItemHandler } from "../PagedItemHandler";

export const handler = async (request: PagedUserItemRequest<UserDto>): Promise<PagedUserItemResponse<UserDto>> => {
  const followService = new FollowService();
  return pagedItemHandler(request, () =>
    followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem)
  );
};
