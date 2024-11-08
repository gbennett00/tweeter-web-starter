import { PostStatusRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (req: PostStatusRequest): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  await statusService.postStatus(req.token, req.newStatus);
  return {
    success: true,
    message: null,
  };
};
