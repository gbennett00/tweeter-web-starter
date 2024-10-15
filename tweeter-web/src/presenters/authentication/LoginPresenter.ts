import { NavigateFunction } from "react-router-dom";
import {
  AuthenticationPresenter,
  AuthenticationView,
  UpdateUserInfoFunction,
} from "./AuthenticationPresenter";
import { AuthToken, User } from "tweeter-shared";

export class LoginPresenter extends AuthenticationPresenter {
  private originalUrl?: string;

  public constructor(
    view: AuthenticationView,
    navigate: NavigateFunction,
    updateUserInfo: UpdateUserInfoFunction,
    originalUrl?: string
  ) {
    super(view, navigate, updateUserInfo);
    this.originalUrl = originalUrl;
  }

  protected getOperationDescription(): string {
    return "log user in";
  }

  protected async authenticate(): Promise<[User, AuthToken]> {
    return await this.userService.login(this.alias, this.password);
  }

  protected doNavigation() {
    if (!!this.originalUrl) {
      this.navigate(this.originalUrl);
    } else {
      this.navigate("/");
    }
  }

  protected getSubmitButtonStatus(): boolean {
    return !this.alias || !this.password;
  }
}
