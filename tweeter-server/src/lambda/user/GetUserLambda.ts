import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (req: GetUserRequest): Promise<GetUserResponse> => {
  const userService = new UserService();
  const user = await userService.getUser(req.token, req.alias);
  return { 
    success: true,
    message: null,
    user: user
  };
}
