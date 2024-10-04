import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

const useUserNavigation = () => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const listener: UserNavigationView = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  }

  const [presenter] = useState(() => new UserNavigationPresenter(listener));

  return (event: React.MouseEvent) => presenter.navigateToUser(event, authToken!, currentUser!);
}

export default useUserNavigation;
