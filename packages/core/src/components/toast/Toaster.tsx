import { toasts, removeToast } from "./toast-store";

type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const POSITION_CLASS: Record<ToasterPosition, string> = {
  "top-left": "top-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  "bottom-right": "bottom-4 right-4"
};

const ENTER_CLASS: Record<ToasterPosition, string> = {
  "top-left": "slide-in-from-top-2",
  "top-center": "slide-in-from-top-2",
  "top-right": "slide-in-from-top-2",
  "bottom-left": "slide-in-from-bottom-2",
  "bottom-center": "slide-in-from-bottom-2",
  "bottom-right": "slide-in-from-bottom-2"
};

const EXIT_CLASS: Record<ToasterPosition, string> = {
  "top-left": "slide-out-to-top-2",
  "top-center": "slide-out-to-top-2",
  "top-right": "slide-out-to-top-2",
  "bottom-left": "slide-out-to-bottom-2",
  "bottom-center": "slide-out-to-bottom-2",
  "bottom-right": "slide-out-to-bottom-2"
};

const TONE_CLASS: Record<string, string> = {
  default: "border-border",
  success: "border-emerald-500/35",
  info: "border-sky-500/35",
  warning: "border-amber-500/35",
  error: "border-destructive/40",
  destructive: "border-destructive/40"
};

const BADGE_CLASS: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-500",
  info: "bg-sky-500/15 text-sky-500",
  warning: "bg-amber-500/15 text-amber-500",
  error: "bg-destructive/15 text-destructive",
  destructive: "bg-destructive/15 text-destructive"
};

const LABEL: Record<string, string> = {
  default: "Info",
  success: "Success",
  info: "Info",
  warning: "Warning",
  error: "Error",
  destructive: "Error"
};

type ToasterProps = {
  position?: ToasterPosition;
};

export const Toaster = ({ position = "bottom-right" }: ToasterProps) => {
  return (
    <div
      data-slot="toaster"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      class={["pointer-events-none fixed z-[120] grid w-[calc(100%-2rem)] max-w-sm gap-2", POSITION_CLASS[position]].join(" ")}
    >
      {toasts.value.map((toast) => (
        <div
          key={toast.id}
          data-slot="toast-item"
          class={[
            "pointer-events-auto grid gap-3 rounded-xl border bg-popover/95 p-4 shadow-lg backdrop-blur-sm",
            toast.closing ? "animate-out fade-out duration-150" : "animate-in fade-in duration-200",
            toast.closing ? EXIT_CLASS[position] : ENTER_CLASS[position],
            TONE_CLASS[toast.variant ?? "default"] ?? TONE_CLASS.default
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div class="flex items-start gap-3">
            <div
              aria-hidden="true"
              class={[
                "inline-flex h-6 min-h-6 w-6 min-w-6 items-center justify-center rounded-md text-[11px] font-semibold uppercase",
                BADGE_CLASS[toast.variant ?? "default"] ?? BADGE_CLASS.default
              ].join(" ")}
            >
              {(LABEL[toast.variant ?? "default"] ?? LABEL.default).slice(0, 1)}
            </div>
            <div class="grid min-w-0 flex-1 gap-1">
              <div class="flex items-start justify-between gap-2">
                <div
                  data-slot="toast-title"
                  class={[
                    "text-sm font-semibold",
                    toast.variant === "destructive" || toast.variant === "error" ? "text-destructive" : "text-foreground"
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {toast.title}
                </div>
                <button
                  type="button"
                  data-slot="toast-close"
                  aria-label="Dismiss notification"
                  class="inline-flex h-6 min-h-6 items-center rounded-md px-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => removeToast(toast.id)}
                >
                  Close
                </button>
              </div>
              {toast.description ? (
                <div data-slot="toast-description" class="text-xs leading-relaxed text-muted-foreground">
                  {toast.description}
                </div>
              ) : null}
              {toast.actionLabel ? (
                <div class="pt-0.5">
                  <button
                    type="button"
                    data-slot="toast-action"
                    class="inline-flex h-8 items-center rounded-md border border-border bg-background px-2.5 text-xs font-medium transition-colors hover:bg-accent"
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                  >
                    {toast.actionLabel}
                  </button>
                </div>
              ) : null}
              <div class="text-[10px] uppercase tracking-wide text-muted-foreground/90">{LABEL[toast.variant ?? "default"] ?? LABEL.default}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
