import { dismissSonner, sonnerToasts } from "./sonner-store";

export const Sonner = () => (
  <div data-slot="sonner" class="fixed right-4 bottom-4 z-[100] grid gap-2">
    {sonnerToasts.value.map((toast) => (
      <div key={toast.id} class="min-w-64 rounded-md border bg-popover p-3 shadow-md">
        <div class="text-sm font-medium">{toast.title}</div>
        {toast.description ? <div class="mt-1 text-xs text-muted-foreground">{toast.description}</div> : null}
        <button type="button" class="mt-2 text-xs underline" onClick={() => dismissSonner(toast.id)}>
          Dismiss
        </button>
      </div>
    ))}
  </div>
);

