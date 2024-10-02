import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfo from "../../userInfo/UserInfoHook";
import { RegisterPresenter, RegisterView } from "../../../presenters/RegisterPresenter";

const Register = () => {
  const [submitButtonStatus, setSubmitButtonStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !submitButtonStatus) {
      presenter.doRegister();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    presenter.handleImageFile(file);
  };

  const listener: RegisterView = {
    updateSubmitButtonStatus: (status: boolean) =>
      setSubmitButtonStatus(status),
    setLoadingState: (isLoading: boolean) => setIsLoading(isLoading),
    displayErrorMessage: displayErrorMessage,
  }

  const [presenter] = useState(
    () => new RegisterPresenter(listener, navigate, updateUserInfo)
  );

  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => presenter.firstName = event.target.value}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => presenter.lastName = event.target.value}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields 
            authenticateOnEnter={registerOnEnter} 
            setAlias={(event) => (presenter.alias = event.toString())} 
            setPassword={(event) => (presenter.password = event.toString())} />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={presenter.imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Algready registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={(value) => (presenter.rememberMe = value)}
      submitButtonDisabled={() => submitButtonStatus}
      isLoading={isLoading}
      submit={() => presenter.doRegister()}
    />
  );
};

export default Register;
