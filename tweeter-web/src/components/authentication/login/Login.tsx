import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenters/authentication/LoginPresenter";
import { AuthenticationView } from "../../../presenters/authentication/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [submitButtonStatus, setSubmitButtonStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const view: AuthenticationView = {
    updateSubmitButtonStatus: (status: boolean) =>
      setSubmitButtonStatus(status),
    setLoadingState: (isLoading: boolean) => setIsLoading(isLoading),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(
    () => new LoginPresenter(view, navigate, updateUserInfo, props.originalUrl)
  );

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          authenticateOnEnter={(event) => presenter.authenticateOnEnter(event)}
          setAlias={(event) => (presenter.alias = event.toString())}
          setPassword={(event) => (presenter.password = event.toString())}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={(value) => (presenter.rememberMe = value)}
      submitButtonDisabled={() => submitButtonStatus}
      isLoading={isLoading}
      submit={() => presenter.doAuthentication()}
    />
  );
};

export default Login;
