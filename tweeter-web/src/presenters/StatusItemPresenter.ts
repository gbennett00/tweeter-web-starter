import { Status } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model/service/StatusService";

export abstract class StatusItemPresenter extends PagedItemPresenter<Status> {
  private _service: StatusService = new StatusService();

  protected get service(): StatusService {
    return this._service;
  }
}