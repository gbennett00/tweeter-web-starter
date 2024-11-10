import { AuthResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { authHandler } from "./AuthHandler";

export const handler = async (req: RegisterRequest): Promise<AuthResponse> => {
  const userService = new UserService();
  return authHandler(() => userService.register(
    req.firstName,
    req.lastName,
    req.alias,
    req.password,
    req.imageStringBase64,
    req.imageFileExtension
  ));
}
