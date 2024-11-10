import { VerifiedRequest } from "./VerifiedRequest";

export interface GetUserRequest extends VerifiedRequest {
  readonly alias: string;
}
