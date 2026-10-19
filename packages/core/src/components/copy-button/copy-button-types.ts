import type { ButtonHTMLAttributes, ComponentChildren, VNode } from "preact";

export type CopyStatus = "idle" | "copying" | "copied" | "error";

/** Compose the existing button without starting a second clipboard lifecycle. */
export interface CopyButtonContext {
  status: CopyStatus;
  statusId: string;
  copy: () => Promise<void>;
  defaultControl: VNode;
}

export interface CopyButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onCopy" | "value" | "size"
> {
  /** Exact text written to the clipboard, independent of its visible presentation. */
  value: string;
  /** Visible idle label; also the accessible name unless aria-label is supplied. */
  label?: string;
  /** Short description used in success/error announcements, such as "code" or "payment ID". */
  subject?: string;
  /** Hide the visible label while retaining the accessible name and feedback. */
  iconOnly?: boolean;
  /** Called only after a successful write for the current value. */
  onCopy?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  /** Customize placement or semantics; the component retains its live status region. */
  renderControl?: (context: CopyButtonContext) => ComponentChildren;
  /** Optional stable ID for the live region when another control references it. */
  statusId?: string;
}
