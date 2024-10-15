import { Context, createContext, useState } from "react";
import { Toast } from "./Toast";
import {
  ToastProviderPresenter,
  ToastProviderView,
} from "../../presenters/context/ToastProviderPresenter";

interface ToastInfo {
  toastList: Toast[];
  displaySuccessToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  displayErrorToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  displayInfoToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  displayWarningToast: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  deleteToast: (id: string) => void;
  deleteAllToasts: () => void;
  deleteAllSuccessToasts: () => void;
  deleteAllErrorToasts: () => void;
  deleteAllInfoToasts: () => void;
  deleteAllWarningToasts: () => void;
  deleteLastToast: () => void;
  deleteLastSuccessToast: () => void;
  deleteLastErrorToast: () => void;
  deleteLastInfoToast: () => void;
  deleteLastWarningToast: () => void;
}

const defaultToastInfo: ToastInfo = {
  toastList: [],
  displaySuccessToast: (message: string, duration: number) => null,
  displayErrorToast: (message: string, duration: number) => null,
  displayInfoToast: (message: string, duration: number) => null,
  displayWarningToast: (message: string, duration: number) => null,
  deleteToast: (toast: string) => null,
  deleteAllToasts: () => null,
  deleteAllSuccessToasts: () => null,
  deleteAllErrorToasts: () => null,
  deleteAllInfoToasts: () => null,
  deleteAllWarningToasts: () => null,
  deleteLastToast: () => null,
  deleteLastSuccessToast: () => null,
  deleteLastErrorToast: () => null,
  deleteLastInfoToast: () => null,
  deleteLastWarningToast: () => null,
};

export const ToastInfoContext: Context<ToastInfo> =
  createContext<ToastInfo>(defaultToastInfo);

interface Props {
  children: React.ReactNode;
}

const ToastProvider: React.FC<Props> = ({ children }) => {
  const [toastInfo, setToastInfo] = useState(defaultToastInfo);

  const listener: ToastProviderView = {
    displayToast: (toast: Toast) => displayToast(toast),
    deleteToast: (id: string) => deleteToast(id),
  };

  const [presenter] = useState(() => new ToastProviderPresenter(listener));

  const displayToast = (toast: Toast) => {
    const { toastList } = toastInfo;
    toastList.push(toast);

    setToastInfo({ ...toastInfo, ...toastList });
  };

  const deleteToast = (id: string) => {
    const { toastList } = toastInfo;
    const listItemIndex = toastList.findIndex((x) => x.id === id);

    toastList.splice(listItemIndex, 1);
    setToastInfo({ ...toastInfo, ...toastList });
  };

  const deleteAllToasts = () => {
    setToastInfo({ ...toastInfo, ...{ toastList: [] } });
  };

  return (
    <ToastInfoContext.Provider
      value={{
        ...toastInfo,
        displaySuccessToast: (message, duration, bootstrapClasses) =>
          presenter.displaySuccessToast(message, duration, bootstrapClasses),
        displayErrorToast: (message, duration, bootstrapClasses) =>
          presenter.displayErrorToast(message, duration, bootstrapClasses),
        displayInfoToast: (message, duration, bootstrapClasses) =>
          presenter.displayInfoToast(message, duration, bootstrapClasses),
        displayWarningToast: (message, duration, bootstrapClasses) =>
          presenter.displayWarningToast(message, duration, bootstrapClasses),
        deleteToast: deleteToast,
        deleteAllToasts: deleteAllToasts,
        deleteAllSuccessToasts: () =>
          presenter.deleteAllSuccessToasts(toastInfo.toastList),
        deleteAllErrorToasts: () =>
          presenter.deleteAllErrorToasts(toastInfo.toastList),
        deleteAllInfoToasts: () =>
          presenter.deleteAllInfoToasts(toastInfo.toastList),
        deleteAllWarningToasts: () =>
          presenter.deleteAllWarningToasts(toastInfo.toastList),
        deleteLastToast: () => presenter.deleteLastToast(toastInfo.toastList),
        deleteLastSuccessToast: () =>
          presenter.deleteLastSuccessToast(toastInfo.toastList),
        deleteLastErrorToast: () =>
          presenter.deleteLastErrorToast(toastInfo.toastList),
        deleteLastInfoToast: () =>
          presenter.deleteLastInfoToast(toastInfo.toastList),
        deleteLastWarningToast: () =>
          presenter.deleteLastWarningToast(toastInfo.toastList),
      }}
    >
      {children}
    </ToastInfoContext.Provider>
  );
};

export default ToastProvider;
