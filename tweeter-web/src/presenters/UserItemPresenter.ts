import { AuthToken, User } from "tweeter-shared";

export interface UserItemView {
  addItems: (newItems: User[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class UserItemPresenter {
  private _hasMoreItems = true;
  private _lastItem: User | null = null;
  private _firstPageLoaded = false;

  private _view: UserItemView;

  protected constructor(view: UserItemView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: User | null) {
    this._lastItem = value;
  }

  protected set firstPageLoaded(value: boolean) {
    this._firstPageLoaded = value;
  }

  public get firstPageLoaded() {
    return this._firstPageLoaded;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
    this._firstPageLoaded = false;
  }

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}