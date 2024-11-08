import { ServerFacade } from "../../net/ServerFacade";

export abstract class TweeterClient {
  protected facade: ServerFacade = new ServerFacade();
}