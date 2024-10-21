import React from "react";
import Login from "../../../../src/components/authentication/login/Login";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/authentication/LoginPresenter";
import { capture, instance, mock, verify } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the login button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign in button when both alias and password have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await enableButton(user, aliasField, passwordField);

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button when either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");

    await enableButton(user, aliasField, passwordField);
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "test");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenters authentication method when the sign in button is pressed", async () => {
    const mockPresenter = mock(LoginPresenter);
    const mockPresenterInstance = instance(mockPresenter);

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/", mockPresenterInstance);

    await user.type(aliasField, "alias");
    await user.type(passwordField, "password");

    expect(signInButton).toBeEnabled();

    await user.click(signInButton);
    verify(mockPresenter.doAuthentication()).once();
  });

  it("updates alias and password in presenter as they are typed", async () => {
    const mockPresenter = mock(LoginPresenter);
    const mockPresenterInstance = instance(mockPresenter);

    const alias = "@some-alias";
    const password = "some-password";

    const { aliasField, passwordField, user } = renderLoginAndGetElements(
      "/",
      mockPresenterInstance
    );

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    const [inputAlias] = capture(mockPresenter.setAlias).last();
    const [inputPassword] = capture(mockPresenter.setPassword).last();

    expect(inputAlias).toBe(alias);
    expect(inputPassword).toBe(password);
  });

  const enableButton = async (
    user: UserEvent,
    aliasField: HTMLElement,
    passwordField: HTMLElement
  ) => {
    await user.type(aliasField, "test");
    await user.type(passwordField, "test");
  };
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);
  const signInButton = screen.getByRole("button", { name: /Sign In/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
