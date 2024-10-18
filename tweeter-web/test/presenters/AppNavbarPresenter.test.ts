import { AuthToken } from "tweeter-shared";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenters/AppNavbarPresenter";
import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<AppNavbarView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarViewInstance)
    );
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on user service with correct authToken", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });

  it("tells the view to clear the last info message and clear the user info when logout is successful", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();

    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
  });

  it("displays an error message and does not clear the info message or user info when logout fails", async () => {
    const error = new Error("Failed to log out");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayErrorMessage("Failed to log user out because of exception: Failed to log out")).once();

    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
  });
});
