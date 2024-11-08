import { FollowRequest, FollowResponse } from "tweeter-shared";
import { handleFollow } from "./FollowHandler";

export const handler = async (
  request: FollowRequest
): Promise<FollowResponse> => {
  return handleFollow(request, (followService, token, targetUser) =>
    followService.follow(token, targetUser)
  );
};
