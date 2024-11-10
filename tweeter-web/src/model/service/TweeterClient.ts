import { AuthToken, PagedUserItemRequest, Status, StatusDto, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../../net/ServerFacade";

export abstract class TweeterClient {
  protected facade: ServerFacade = new ServerFacade();

  protected toPagedUserItemRequest<DTO extends UserDto | StatusDto, Item extends User | Status>(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Item | null
  ): PagedUserItemRequest<DTO> {
    return {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto as DTO : null
    };
  };
}