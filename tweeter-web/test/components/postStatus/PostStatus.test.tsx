import { User } from "../../../../tweeter-shared/dist/model/domain/User";
import { AuthToken } from "../../../../tweeter-shared/dist/model/domain/AuthToken";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { anything, instance, mock, verify } from "ts-mockito";
import { PostStatusPresenter } from "../../../src/presenters/PostStatusPresenter";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
})); 

describe("PostStatus", () => {

  const mockUser = mock<User>();
  const mockUserInstance = instance(mockUser);

  const mockAuthToken = mock<AuthToken>();
  const mockAuthTokenInstance = instance(mockAuthToken);
  
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });        
  });

  it("starts with post and clear buttons disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables both buttons when text field has text", async () => {
    const { postButton, clearButton, postField, user } = renderPostStatusAndGetElements();

    await user.type(postField, "test");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables both buttons when text field is cleared", async () => {
    const { postButton, clearButton, postField, user } = renderPostStatusAndGetElements();

    await user.type(postField, "test");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postField);

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenter's post method when the post button is pressed", async () => {
    const mockPresenter = mock(PostStatusPresenter);
    const mockPresenterInstance = instance(mockPresenter);

    const { postButton, postField, user } = renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(postField, "test");

    expect(postButton).toBeEnabled();

    await user.click(postButton);

    verify(mockPresenter.submitPost(anything(), "test", mockAuthTokenInstance, mockUserInstance)).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter}/> : <PostStatus />}
    </MemoryRouter>
  )
}

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByLabelText("post-status-text");

  return { postButton, clearButton, postField, user };
}
