import { User, Status, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

type Item = User | Status;

export interface PagedItemView<T extends Item> extends View {
  addItems: (newItems: T[]) => void;
}

export const PAGE_SIZE = 10;

export abstract class PagedItemPresenter<T extends Item> extends Presenter {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private _firstPageLoaded = false;

  public constructor(view: PagedItemView<T>) {
    super(view);
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  private set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public get lastItem() {
    return this._lastItem;
  }

  private set lastItem(value: T | null) {
    this._lastItem = value;
  }

  public get firstPageLoaded() {
    return this._firstPageLoaded;
  }

  private set firstPageLoaded(value: boolean) {
    this._firstPageLoaded = value;
  }

  protected get view(): PagedItemView<T> {
    return this.view as PagedItemView<T>;
  }

  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
    this._firstPageLoaded = false;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      this.firstPageLoaded = true;
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
