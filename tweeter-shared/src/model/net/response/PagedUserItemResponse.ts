import { StatusDto } from '../../dto/StatusDto';
import { UserDto } from '../../dto/UserDto';
import { TweeterResponse } from './TweeterResponse';

export interface PagedUserItemResponse<I extends UserDto | StatusDto> extends TweeterResponse {
  readonly items: I[] | null;
  readonly hasMore: boolean;
}