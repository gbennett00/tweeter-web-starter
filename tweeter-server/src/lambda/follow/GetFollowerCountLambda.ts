import { FollowCountRequest, FollowCountResponse } from 'tweeter-shared';
import { handleFollowCount } from './FollowCountHandler';

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse> => {
  return handleFollowCount(request, (followService, token, user) =>
    followService.getFollowerCount(token, user)
  );
}
