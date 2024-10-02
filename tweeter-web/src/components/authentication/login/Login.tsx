import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter, LoginView } from "../../../presenters/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [submitButtonStatus, setSubmitButtonStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();
  
  const view: LoginView = {
    updateSubmitButtonStatus: (status: boolean) =>
      setSubmitButtonStatus(status),
    setLoadingState: (isLoading: boolean) => setIsLoading(isLoading),
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter] = useState(
    () => new LoginPresenter(view, navigate, updateUserInfo, props.originalUrl)
  );

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !submitButtonStatus) {
      presenter.doLogin();
    }
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          authenticateOnEnter={loginOnEnter}
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
      submit={() => presenter.doLogin()}
    />
  );
};

export default Login;
