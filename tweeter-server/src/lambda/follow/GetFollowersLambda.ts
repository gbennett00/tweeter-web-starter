import { PagedUserItemRequest, PagedUserItemResponse } from 'tweeter-shared';
import { getUsersHandler } from './GetUsersLambda';
import { FollowService } from '../../model/service/FollowService';

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const followService = new FollowService();
  return getUsersHandler(request, () => followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem));
}
