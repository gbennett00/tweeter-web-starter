import { NavigateFunction } from "react-router-dom";
import {
  AuthenticationPresenter,
  AuthenticationView,
  UpdateUserInfoFunction,
} from "./AuthenticationPresenter";

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

  protected async authenticate(): Promise<void> {
    const [user, authToken] = await this.userService.login(
      this.alias,
      this.password
    );

    this.updateUserInfo(user, user, authToken, this.rememberMe);

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
