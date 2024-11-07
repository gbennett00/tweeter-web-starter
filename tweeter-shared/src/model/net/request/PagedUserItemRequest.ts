import { UserDto } from "../../dto/UserDto";
import { VerifiedRequest } from "./VerifiedRequest";

export interface PagedUserItemRequest extends VerifiedRequest{
  readonly userAlias: string,
  readonly pageSize: number,
  readonly lastItem: UserDto | null
}
