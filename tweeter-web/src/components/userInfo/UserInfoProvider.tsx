import { Context, createContext, useState } from "react";
import { User, AuthToken } from "tweeter-shared";
import {
  UserInfoProviderPresenter,
  UserInfoProviderView,
} from "../../presenters/UserInfoProviderPresenter";

interface UserInfo {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
}

export const defaultUserInfo: UserInfo = {
  currentUser: null,
  displayedUser: null,
  authToken: null,
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean = false
  ) => null,
  clearUserInfo: () => null,
  setDisplayedUser: (user) => null,
};

export const UserInfoContext: Context<UserInfo> =
  createContext<UserInfo>(defaultUserInfo);

interface Props {
  children: React.ReactNode;
}

const UserInfoProvider: React.FC<Props> = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    ...defaultUserInfo,
    ...UserInfoProviderPresenter.retrieveFromLocalStorage(),
  });

  const listener: UserInfoProviderView = {
    updateUserInfo: (newInfo) =>
      setUserInfo((prevInfo) => ({ ...prevInfo, ...newInfo })),
  };

  const [presenter] = useState(new UserInfoProviderPresenter(listener));

  return (
    <UserInfoContext.Provider
      value={{
        ...userInfo,
        updateUserInfo: (currentUser, displayedUser, authToken, remember) =>
          presenter.updateUserInfo(
            currentUser,
            displayedUser,
            authToken,
            remember
          ),
        clearUserInfo: () => presenter.clearUserInfo(),
        setDisplayedUser: (user) => presenter.setDisplayedUser(user),
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;
