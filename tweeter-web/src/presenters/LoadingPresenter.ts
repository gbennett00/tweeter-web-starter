import { MessageView, Presenter } from "./Presenter";

export interface LoadingView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
}

export abstract class LoadingPresenter<V extends LoadingView> extends Presenter<V> {
  protected async doFailureReportingLoadingOperation(
    operation: () => Promise<void>,
    loadingMessage: string,
    operationDescription: string
  ): Promise<void> {
    await this.doFailureReportingOperation(
      async () => {
        this.view.setIsLoading(true);
        this.view.displayInfoMessage(loadingMessage, 0);

        await operation();
      },
      operationDescription,
      () => {
        this.view.clearLastInfoMessage();
        this.view.setIsLoading(false);
      }
    );
  }
}