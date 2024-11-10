import { Buffer } from "buffer";
import { FakeData, UserDto, AuthTokenDto } from "tweeter-shared";

export class UserService {
  async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const userImageBytes: Uint8Array = Buffer.from(imageStringBase64, "base64");

    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  async logout(token: string): Promise<void> {
    // do logout
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const user = FakeData.instance.findUserByAlias(alias)
    return user ? user.dto : null;
  }
}
