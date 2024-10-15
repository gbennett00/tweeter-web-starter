import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { LoadingPresenter, LoadingView } from "./LoadingPresenter";

export interface PostStatusView extends LoadingView {
  setPost(post: string): void;
}

export class PostStatusPresenter extends LoadingPresenter<PostStatusView>{
  private statusService = new StatusService();

  public constructor(view: PostStatusView) {
      super(view);
  }

  public async submitPost(event: React.MouseEvent, post: string, authToken: AuthToken, currentUser: User) {
    event.preventDefault();

    this.doFailureReportingLoadingOperation(
      async () => {
        const status = new Status(post, currentUser!, Date.now());
  
        await this.statusService.postStatus(authToken!, status);
  
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
      }, 
      "Posting status...",
      "post the status"
    );
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this.view.setPost("");
  }
}