import { FollowRequest, FollowResponse, UserDto } from 'tweeter-shared';
import { FollowService } from '../../model/service/FollowService';

export const handleFollow = async (
  request: FollowRequest, 
  doFollowAction: (followService: FollowService, token: string, targetUser: UserDto) => Promise<[number, number]>
): Promise<FollowResponse> => {
  const followService = new FollowService();
  
  const [followerCount, followeeCount] = await doFollowAction(followService, request.token, request.targetUser);

  return {
    success: true,
    message: null,
    followeeCount: followeeCount,
    followerCount: followerCount
  };
};
