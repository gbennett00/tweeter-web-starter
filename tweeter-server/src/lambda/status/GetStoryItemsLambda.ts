import { PagedUserItemRequest, PagedUserItemResponse, StatusDto } from "tweeter-shared";
import { pagedItemHandler } from "../PagedItemHandler";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PagedUserItemRequest<StatusDto>): Promise<PagedUserItemResponse<StatusDto>> => {
  const statusService = new StatusService();
  return pagedItemHandler(request, () =>
    statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, request.lastItem)
  );
};
