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
    originalUrl?: string
  ) {
    super(view);
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
      this.view.navigate(this.originalUrl);
    } else {
      this.view.navigate("/");
    }
  }

  protected getSubmitButtonStatus(): boolean {
    return !this.alias || !this.password;
  }
}
