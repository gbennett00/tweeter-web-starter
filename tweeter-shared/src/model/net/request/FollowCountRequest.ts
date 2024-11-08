import { UserDto } from "../../dto/UserDto";
import { VerifiedRequest } from "./VerifiedRequest";

export interface FollowCountRequest extends VerifiedRequest {
  user: UserDto;
}
