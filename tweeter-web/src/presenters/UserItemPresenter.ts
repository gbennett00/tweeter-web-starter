import { User } from "tweeter-shared";
import { FollowService } from "../model/service/FollowService";
import { PagedItemPresenter } from "./PagedItemPresenter";

export abstract class UserItemPresenter extends PagedItemPresenter<User>{
  private _service: FollowService = new FollowService();

  protected get service(): FollowService {
    return this._service;
  }
}