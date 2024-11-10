import { Buffer } from "buffer";
import { User, AuthToken, FakeData } from "tweeter-shared";
import { TweeterClient } from "./TweeterClient";

export class UserService extends TweeterClient{
  async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const response = await this.facade.login({alias, password});

    if (response.user === null) {
      throw new Error("Invalid alias or password");
    }

    return [User.fromDto(response.user)!, AuthToken.fromDto(response.authToken)];
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const response = await this.facade.register({
      firstName,
      lastName,
      alias,
      password,
      imageStringBase64,
      imageFileExtension,
    });

    if (response.user === null) {
      throw new Error("Invalid registration");
    }

    return [User.fromDto(response.user)!, AuthToken.fromDto(response.authToken)];
  }

  async logout(authToken: AuthToken): Promise<void> {
    await this.facade.logout({ token: authToken.token });
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.facade.getUser({
      token: authToken.token,
      alias,
    });
  }
}
