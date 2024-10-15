import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";

export interface LoginView extends View {
  updateSubmitButtonStatus: (status: boolean) => void;
  setLoadingState: (isLoading: boolean) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
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
    super(view);
    this.navigate = navigate;
    this.updateUserInfo = updateUserInfo;
    this.originalUrl = originalUrl;
  }

  loginOnEnter(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" && !this.getSubmitButtonStatus()) {
      this.doLogin();
    }
  }

  async doLogin() {
    this.doFailureReportingOperation(
      async () => {
        this.view.setLoadingState(true);

        const [user, authToken] = await this.userService.login(
          this._alias,
          this._password
        );

        this.updateUserInfo(user, user, authToken, this._rememberMe);

        if (!!this.originalUrl) {
          this.navigate(this.originalUrl);
        } else {
          this.navigate("/");
        }
      },
      "log user in",
      () => {
        this.view.setLoadingState(false);
      }
    );
  }

  private getSubmitButtonStatus(): boolean {
    return !this._alias || !this._password;
  }

  set alias(value: string) {
    this._alias = value;
    this.view.updateSubmitButtonStatus(this.getSubmitButtonStatus());
  }

  set password(value: string) {
    this._password = value;
    this.view.updateSubmitButtonStatus(this.getSubmitButtonStatus());
  }

  set rememberMe(value: boolean) {
    this._rememberMe = value;
  }
}
