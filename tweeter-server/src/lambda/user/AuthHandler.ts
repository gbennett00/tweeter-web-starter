import { AuthResponse, AuthTokenDto, UserDto } from "tweeter-shared";

export const authHandler = async (
  authFn: () => Promise<[UserDto, AuthTokenDto]>
): Promise<AuthResponse> => {
  const [user, authToken] = await authFn();
  return {
    success: true,
    message: null,
    user,
    authToken,
  };
};