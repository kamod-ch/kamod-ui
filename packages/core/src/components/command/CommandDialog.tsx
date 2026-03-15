import type { ComponentChildren, JSX } from "preact";
import { Dialog, DialogContent } from "../dialog";

export type CommandDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ComponentChildren;
  /** Passed to `DialogContent` for width (default command palette sizing). */
  contentClass?: string;
};

export const CommandDialog = ({
  open,
  defaultOpen,
  onOpenChange,
  contentClass,
  children
}: CommandDialogProps) => (
  <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
    <DialogContent
      showCloseButton={false}
      class={contentClass ?? "gap-0 overflow-hidden p-0 sm:max-w-lg"}
      data-slot="command-dialog-content"
    >
      {children}
    </DialogContent>
  </Dialog>
);
