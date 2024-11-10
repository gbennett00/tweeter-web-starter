import { AuthRequest, AuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { authHandler } from "./AuthHandler";

export const handler = async (req: AuthRequest): Promise<AuthResponse> => {
  const userService = new UserService();
  return authHandler(() => userService.login(req.alias, req.password));
};
