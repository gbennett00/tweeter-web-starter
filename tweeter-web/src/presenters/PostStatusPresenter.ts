import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading(isLoading: boolean): void;
  setPost(post: string): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView>{
  private statusService = new StatusService();

  public constructor(view: PostStatusView) {
      super(view);
  }

  public async submitPost(event: React.MouseEvent, post: string, authToken: AuthToken, currentUser: User) {
    event.preventDefault();

    this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage("Posting status...", 0);
  
        const status = new Status(post, currentUser!, Date.now());
  
        await this.statusService.postStatus(authToken!, status);
  
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      },
      "post the status",
      () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  }
}