import { StatusDto } from "../../dto/StatusDto";
import { UserDto } from "../../dto/UserDto";
import { VerifiedRequest } from "./VerifiedRequest";

export interface PagedUserItemRequest<I extends UserDto | StatusDto> extends VerifiedRequest {
  readonly userAlias: string,
  readonly pageSize: number,
  readonly lastItem: I | null
}
