import type { ComponentChildren } from "preact";

/** Host platform used to render modifier labels (Cmd vs Ctrl). */
export type ShortcutPlatform = "mac" | "windows" | "linux";

/** Structured key token; `mod` maps to Command on macOS and Control elsewhere. */
export type ShortcutKeyToken =
  | "mod"
  | "ctrl"
  | "alt"
  | "shift"
  | "meta"
  | "enter"
  | "escape"
  | "space"
  | (string & {});

export type KeyboardShortcutDefinition = {
  /** Stable identifier for analytics, handlers, and list keys. */
  id: string;
  /** Primary action label shown in the help list. */
  label: ComponentChildren;
  /** Group heading (e.g. Navigation, Editing). */
  category: string;
  /** Ordered key combination tokens. */
  keys: ShortcutKeyToken[];
  /** Optional context, e.g. "Table view only". */
  scope?: ComponentChildren;
  /** When true, shown muted and excluded from handler matching when disabled. */
  disabled?: boolean;
  /** Secondary explanation below the action label. */
  description?: ComponentChildren;
};

export type KeyboardShortcutsHelpLabels = {
  title: ComponentChildren;
  description?: ComponentChildren;
  searchPlaceholder?: string;
  /** Shown when the query matches no shortcuts. */
  emptySearch?: ComponentChildren;
  /** Shown when `shortcuts` is empty. */
  empty?: ComponentChildren;
};

export type KeyboardShortcutsHelpProps = {
  shortcuts: KeyboardShortcutDefinition[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Explicit platform for deterministic SSR; defaults to runtime detection. */
  platform?: ShortcutPlatform;
  labels: KeyboardShortcutsHelpLabels;
  /** Search field (default true). */
  showSearch?: boolean;
};

export type KeyboardShortcutHandler = {
  id: string;
  keys: ShortcutKeyToken[];
  onTrigger: (event: KeyboardEvent) => void;
  enabled?: boolean;
};

export type UseKeyboardShortcutsOptions = {
  shortcuts: KeyboardShortcutHandler[];
  platform?: ShortcutPlatform;
  enabled?: boolean;
};
