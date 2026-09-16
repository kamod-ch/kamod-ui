import { tv } from "tailwind-variants";

export const fileUploadManager = tv({
  base: "flex flex-col gap-4",
});

export const fileUploadList = tv({
  base: "grid gap-2",
});

export const fileUploadItem = tv({
  base: "border-border bg-card flex flex-col gap-2 rounded-lg border p-3",
  variants: {
    status: {
      queued: "",
      uploading: "",
      success: "border-success/40",
      error: "border-destructive/40",
      canceled: "opacity-80",
    },
  },
  defaultVariants: {
    status: "queued",
  },
});
