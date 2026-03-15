import { signal } from "@preact/signals";

export type ToastItemData = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "info" | "warning" | "error" | "destructive";
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  closing?: boolean;
};

export const toasts = signal<ToastItemData[]>([]);
const EXIT_ANIMATION_MS = 180;

export const addToast = (toast: Omit<ToastItemData, "id">) => {
  const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const nextToast: ToastItemData = {
    id,
    variant: toast.variant ?? "default",
    duration: toast.duration ?? 5000,
    ...toast
  };
  toasts.value = [...toasts.value, nextToast];

  if (typeof window !== "undefined" && (nextToast.duration ?? 0) > 0) {
    window.setTimeout(() => {
      removeToast(id);
    }, nextToast.duration);
  }

  return id;
};

export const removeToast = (id: string) => {
  const item = toasts.value.find((toast) => toast.id === id);
  if (!item) return;
  if (item.closing) return;

  toasts.value = toasts.value.map((toast) => (toast.id === id ? { ...toast, closing: true } : toast));

  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }, EXIT_ANIMATION_MS);
    return;
  }

  toasts.value = toasts.value.filter((toast) => toast.id !== id);
};
