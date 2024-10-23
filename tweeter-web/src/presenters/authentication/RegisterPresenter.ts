import { Buffer } from "buffer";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";
import { User, AuthToken } from "tweeter-shared";

export class RegisterPresenter extends AuthenticationPresenter {
  private _firstName: string = "";
  private _lastName: string = "";
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageUrl: string = "";
  private _imageFileExtension: string = "";

  public constructor(view: AuthenticationView) {
    super(view);
  }

  protected getOperationDescription(): string {
    return "register user";
  }

  protected async authenticate(): Promise<[User, AuthToken]> {
    return await this.userService.register(
      this._firstName,
      this._lastName,
      this.alias,
      this.password,
      this._imageBytes,
      this._imageFileExtension
    );
  }

  protected doNavigation() {
    this.view.navigate("/");
  }

  public handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  }

  private handleImageFile(file: File | undefined) {
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

  protected getSubmitButtonStatus(): boolean {
    return (
      !this._firstName ||
      !this._lastName ||
      !this.alias ||
      !this.password ||
      !this._imageUrl ||
      !this._imageFileExtension
    );
  }

  public set firstName(value: string) {
    this._firstName = value;
    this.updateSubmitButtonStatus();
  }

  public set lastName(value: string) {
    this._lastName = value;
    this.updateSubmitButtonStatus();
  }

  public get imageUrl() {
    return this._imageUrl;
  }
}
