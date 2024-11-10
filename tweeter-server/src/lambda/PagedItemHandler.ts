import { PagedUserItemRequest, PagedUserItemResponse, StatusDto, UserDto } from "tweeter-shared";

export const pagedItemHandler = async <I extends UserDto | StatusDto>(
  request: PagedUserItemRequest<I>,
  load: (token: string, userAlias: string, pageSize: number, lastItem: I | null) => Promise<[I[], boolean]>
): Promise<PagedUserItemResponse<I>> => {
  const [items, hasMore] = await load(request.token, request.userAlias, request.pageSize, request.lastItem);

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
