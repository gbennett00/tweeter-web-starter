import { UserDto } from "../../dto/UserDto";
import { VerifiedRequest } from "./VerifiedRequest";

export interface FollowRequest extends VerifiedRequest {
  targetUser: UserDto;
}
