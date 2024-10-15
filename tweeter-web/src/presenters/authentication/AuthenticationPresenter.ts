import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "../Presenter";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export interface AuthenticationView extends View {
  updateSubmitButtonStatus: (status: boolean) => void;
  setLoadingState: (isLoading: boolean) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
  private _userService = new UserService();

  private _navigate: NavigateFunction;
  private _updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  
  private _alias: string = "";
  private _password: string = "";
  private _rememberMe: boolean = false;

  protected constructor(
    view: AuthenticationView,
    navigate: NavigateFunction,
    updateUserInfo: (
      user: User,
      displayedUser: User,
      authToken: AuthToken,
      rememberMe: boolean
    ) => void
  ) {
    super(view);
    this._navigate = navigate;
    this._updateUserInfo = updateUserInfo;
  }

  protected get userService(): UserService {
    return this._userService;
  }

  protected get navigate(): NavigateFunction {
    return this._navigate;
  }

  protected get updateUserInfo(): (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void {
    return this._updateUserInfo;
  }

  public authenticateOnEnter(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" && !this.getSubmitButtonStatus()) {
      this.doAuthentication();
    }
  }

  public doAuthentication() {
    this.doFailureReportingOperation(
      async () => {
        this.view.setLoadingState(true);

        await this.authenticate();
      },
      this.getOperationDescription(),
      () => this.view.setLoadingState(false)
    );
  }

  protected abstract getOperationDescription(): string;

  protected abstract authenticate(): Promise<void>;

  protected updateSubmitButtonStatus() {
    this.view.updateSubmitButtonStatus(this.getSubmitButtonStatus());
  }

  protected abstract getSubmitButtonStatus(): boolean;

  public get alias(): string {
    return this._alias;
  }

  public set alias(value: string) {
    this._alias = value;
    this.updateSubmitButtonStatus();
  }

  public get password(): string {
    return this._password;
  }

  public set password(value: string) {
    this._password = value;
    this.updateSubmitButtonStatus();
  }

  public get rememberMe(): boolean {
    return this._rememberMe;
  }

  public set rememberMe(value: boolean) {
    this._rememberMe = value;
  }
}
