import { TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { VerifiedRequest } from "tweeter-shared/dist/model/net/request/VerifiedRequest";

export const handler = async (req: VerifiedRequest): Promise<TweeterResponse> => {
  const userService = new UserService();
  userService.logout(req.token);
  return {
    success: true,
    message: null
  }
}
