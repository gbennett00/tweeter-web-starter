import { NavigateFunction } from "react-router-dom";
import { UserService } from "../../model/service/UserService";
import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { Presenter, View } from "../Presenter";

export interface RegisterView extends View {
  updateSubmitButtonStatus: (status: boolean) => void;
  setLoadingState: (isLoading: boolean) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  private userService = new UserService();

  private navigate: NavigateFunction;
  private updateUserInfo: (
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;

  private _firstName: string = "";
  private _lastName: string = "";
  private _alias: string = "";
  private _password: string = "";
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageUrl: string = "";
  private _imageFileExtension: string = "";
  private _rememberMe: boolean = false;

  constructor(
    view: RegisterView,
    navigate: NavigateFunction,
    updateUserInfo: (
      user: User,
      displayedUser: User,
      authToken: AuthToken,
      rememberMe: boolean
    ) => void
  ) {
    super(view);
    this.navigate = navigate;
    this.updateUserInfo = updateUserInfo;
  }

  registerOnEnter(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" && !this.getSubmitButtonStatus()) {
      this.doRegister();
    }
  }

  handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  }

  async doRegister() {
    this.doFailureReportingOperation(
      async () => {
        this.view.setLoadingState(true);

        const [user, authToken] = await this.userService.register(
          this._firstName,
          this._lastName,
          this._alias,
          this._password,
          this._imageBytes,
          this._imageFileExtension
        );

        this.updateUserInfo(user, user, authToken, this._rememberMe);
        this.navigate("/");
      },
      "register user",
      () => this.view.setLoadingState(false)
    );
  }

  handleImageFile(file: File | undefined) {
    if (file) {
      this._imageUrl = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._imageFileExtension = fileExtension;
      }
    } else {
      this._imageUrl = "";
      this._imageBytes = new Uint8Array();
    }
    this.updateSubmitButtonStatus();
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  private getSubmitButtonStatus(): boolean {
    return (
      !this._firstName ||
      !this._lastName ||
      !this._alias ||
      !this._password ||
      !this._imageUrl ||
      !this._imageFileExtension
    );
  }

  private updateSubmitButtonStatus() {
    this.view.updateSubmitButtonStatus(this.getSubmitButtonStatus());
  }

  set firstName(value: string) {
    this._firstName = value;
    this.updateSubmitButtonStatus();
  }

  set lastName(value: string) {
    this._lastName = value;
    this.updateSubmitButtonStatus();
  }

  set alias(value: string) {
    this._alias = value;
    this.updateSubmitButtonStatus();
  }

  set password(value: string) {
    this._password = value;
    this.updateSubmitButtonStatus();
  }

  get imageUrl() {
    return this._imageUrl;
  }

  set rememberMe(value: boolean) {
    this._rememberMe = value;
  }
}