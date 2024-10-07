import {
  makeErrorToast,
  makeInfoToast,
  makeSuccessToast,
  makeWarningToast,
  Toast,
  Type,
} from "../components/toaster/Toast";

export interface ToastProviderView {
  displayToast(toast: Toast): void;
  deleteToast(id: string): void;
}

export class ToastProviderPresenter {
  private view: ToastProviderView;

  public constructor(view: ToastProviderView) {
    this.view = view;
  }

  public displaySuccessToast = (
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string => {
    const toast = makeSuccessToast(message, duration, bootstrapClasses);
    this.view.displayToast(toast);
    return toast.id;
  };

  public displayInfoToast(
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string {
    const toast = makeInfoToast(message, duration, bootstrapClasses);
    this.view.displayToast(toast);
    return toast.id;
  }

  public displayErrorToast(
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string {
    const toast = makeErrorToast(message, duration, bootstrapClasses);
    this.view.displayToast(toast);
    return toast.id;
  }

  public displayWarningToast(
    message: string,
    duration: number,
    bootstrapClasses: string = ""
  ): string {
    const toast = makeWarningToast(message, duration, bootstrapClasses);
    this.view.displayToast(toast);
    return toast.id;
  };

  public deleteAllSuccessToasts(toastList: Toast[]) {
    this.deleteAllToastsOfType(Type.Success, toastList);
  };

  public deleteAllErrorToasts(toastList: Toast[]) {
    this.deleteAllToastsOfType(Type.Error, toastList);
  };

  public deleteAllInfoToasts(toastList: Toast[]) {
    this.deleteAllToastsOfType(Type.Info, toastList);
  };

  public deleteAllWarningToasts(toastList: Toast[]) {
    this.deleteAllToastsOfType(Type.Warning, toastList);
  };

  public deleteAllToastsOfType(type: Type, toastList: Toast[]) {
    for (let toast of toastList) {
      if (toast.type === type) {
        this.view.deleteToast(toast.id);
      }
    }
  };

  public deleteLastToast(toastList: Toast[]) {
    if (!!toastList && toastList.length > 0) {
      this.view.deleteToast(toastList[toastList.length - 1].id);
    }
  };

  public deleteLastSuccessToast(toasts: Toast[]) {
    this.deleteLastTypedToast(Type.Success, toasts);
  };

  public deleteLastErrorToast(toasts: Toast[]) {
    this.deleteLastTypedToast(Type.Error, toasts);
  };

  public deleteLastInfoToast(toasts:Toast[]) {
    this.deleteLastTypedToast(Type.Info, toasts);
  };

  public deleteLastWarningToast(toasts: Toast[]) {
    this.deleteLastTypedToast(Type.Warning, toasts);
  };

  public deleteLastTypedToast(type: Type, toasts: Toast[]) {
    const toastList = toasts;

    if (!!toastList && toastList.length > 0) {
      let index = toastList.length - 1;

      do {
        if (toastList[index].type === type) {
          this.view.deleteToast(toastList[index].id);
          break;
        }

        index--;
      } while (index >= 0);
    }
  };
}
