import { signal } from "@preact/signals";

export type SonnerToast = {
  id: string;
  title: string;
  description?: string;
};

export const sonnerToasts = signal<SonnerToast[]>([]);

const nextId = () => `sonner-${Math.random().toString(36).slice(2, 10)}`;

export const sonner = (args: { title: string; description?: string }) => {
  const toast = { id: nextId(), title: args.title, description: args.description };
  sonnerToasts.value = [...sonnerToasts.value, toast];
  return toast.id;
};

export const dismissSonner = (id: string) => {
  sonnerToasts.value = sonnerToasts.value.filter((toast) => toast.id !== id);
};

