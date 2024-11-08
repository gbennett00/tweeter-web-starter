import { FollowCountRequest, FollowCountResponse, UserDto } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handleFollowCount = async (
  request: FollowCountRequest, 
  getCount: (followService: FollowService, token: string, user: UserDto) => Promise<number>
): Promise<FollowCountResponse> => {
  const followService = new FollowService();
  const count = await getCount(followService, request.token, request.user);

  return {
    success: true,
    message: null,
    count
  };
};
