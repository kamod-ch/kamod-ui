import { addToast, removeToast, toasts } from "./toast-store";

export const useToast = () => {
  return {
    toasts,
    toast: addToast,
    dismiss: removeToast
  };
};

