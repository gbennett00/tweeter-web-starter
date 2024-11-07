import { TweeterRequest } from "./TweeterRequest";

export interface VerifiedRequest extends TweeterRequest {
  readonly token: string;
}
