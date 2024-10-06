export interface ToasterView {
  deleteToast(id: string): void;
}

export class ToasterPresenter {
  private view: ToasterView;

  public constructor(view: ToasterView) {
    this.view = view;
  }

  public deleteExpiredToasts(toastList: any[]): void {
    const now = Date.now();

    for (let toast of toastList) {
      if (
        toast.expirationMillisecond > 0 &&
        toast.expirationMillisecond < now
      ) {
        this.view.deleteToast(toast.id);
      }
    }
  }
}