import { UserDto } from "../../dto/UserDto";
import { VerifiedRequest } from "./VerifiedRequest";

export interface GetIsFollowerRequest extends VerifiedRequest {
  readonly user: UserDto,
  readonly selectedUser: UserDto
}
