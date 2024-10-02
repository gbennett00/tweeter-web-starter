import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  updateSubmitButtonStatus: (status: boolean) => void;
  setLoadingState: (isLoading: boolean) => void;
  displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
  private _view: LoginView;
  private userService = new UserService();

  private navigate: NavigateFunction;
  private updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  private originalUrl?: string;

  private _alias: string = "";
  private _password: string = "";
  private _rememberMe: boolean = false;

  public constructor(
    view: LoginView,
    navigate: NavigateFunction,
    updateUserInfo: (
      user: User,
      displayedUser: User,
      authToken: AuthToken,
      rememberMe: boolean
    ) => void,
    originalUrl?: string
  ) {
    this._view = view;
    this.navigate = navigate;
    this.updateUserInfo = updateUserInfo;
    this.originalUrl = originalUrl;
  }

  async doLogin() {
    try {
      this._view.setLoadingState(true);

      const [user, authToken] = await this.userService.login(this._alias, this._password);

      this.updateUserInfo(user, user, authToken, this._rememberMe);

      if (!!this.originalUrl) {
        this.navigate(this.originalUrl);
      } else {
        this.navigate("/");
      }
    } catch (error) {
      this._view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this._view.setLoadingState(false);
    }
  }

  private submitButtonStatus(): boolean {
    return !this._alias || !this._password;
  }

  set alias(value: string) {
    this._alias = value;
    this._view.updateSubmitButtonStatus(this.submitButtonStatus());
  }

  set password(value: string) {
    this._password = value;
    this._view.updateSubmitButtonStatus(this.submitButtonStatus());
  }

  set rememberMe(value: boolean) {
    this._rememberMe = value;
  }
}
