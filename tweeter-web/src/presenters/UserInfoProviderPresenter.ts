import { User, AuthToken } from "tweeter-shared";

export interface UserInfoProviderView {
  updateUserInfo: (
    value: React.SetStateAction<{
      currentUser?: User | null;
      displayedUser?: User | null;
      authToken?: AuthToken | null;
      updateUserInfo?: (
        currentUser: User,
        displayedUser: User | null,
        authToken: AuthToken,
        remember: boolean
      ) => void;
      clearUserInfo?: () => void;
      setDisplayedUser?: (user: User) => void;
    }>
  ) => void;
}

const CURRENT_USER_KEY: string = "CurrentUserKey";
const AUTH_TOKEN_KEY: string = "AuthTokenKey";

export class UserInfoProviderPresenter {
  private view: UserInfoProviderView;

  constructor(view: UserInfoProviderView) {
    this.view = view;
  }

  public updateUserInfo(
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) {
    this.view.updateUserInfo({
      currentUser: currentUser,
      displayedUser: displayedUser,
      authToken: authToken,
    });

    if (remember) {
      UserInfoProviderPresenter.saveToLocalStorage(currentUser, authToken);
    }
  }

  public clearUserInfo() {
    this.view.updateUserInfo({
      currentUser: null,
      displayedUser: null,
      authToken: null,
    });
    UserInfoProviderPresenter.clearLocalStorage();
  }

  public setDisplayedUser(user: User) {
    this.view.updateUserInfo({ displayedUser: user });
  };

  public static saveToLocalStorage(
    currentUser: User,
    authToken: AuthToken
  ): void {
    localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
    localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
  }

  public static retrieveFromLocalStorage(): {
    currentUser: User | null;
    displayedUser: User | null;
    authToken: AuthToken | null;
  } {
    const loggedInUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
    const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));

    if (!!loggedInUser && !!authToken) {
      return {
        currentUser: loggedInUser,
        displayedUser: loggedInUser,
        authToken: authToken,
      };
    } else {
      return { currentUser: null, displayedUser: null, authToken: null };
    }
  }

  public static clearLocalStorage(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
