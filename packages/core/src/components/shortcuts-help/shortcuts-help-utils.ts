import type {
  KeyboardShortcutDefinition,
  ShortcutKeyToken,
  ShortcutPlatform,
} from "./shortcuts-help-types";

const MODIFIER_TOKENS = new Set(["mod", "ctrl", "alt", "shift", "meta"]);

export const resolveShortcutPlatform = (platform?: ShortcutPlatform): ShortcutPlatform => {
  if (platform) return platform;
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent ?? "";
    const platformString = navigator.platform ?? "";
    if (/Mac|iPhone|iPad|iPod/.test(platformString) || /Mac OS/.test(ua)) return "mac";
  }
  return "windows";
};

export const displayKeyToken = (token: ShortcutKeyToken, platform: ShortcutPlatform): string => {
  switch (token.toLowerCase()) {
    case "mod":
      return platform === "mac" ? "⌘" : "Ctrl";
    case "ctrl":
      return "Ctrl";
    case "alt":
      return platform === "mac" ? "⌥" : "Alt";
    case "shift":
      return platform === "mac" ? "⇧" : "Shift";
    case "meta":
      return "⌘";
    case "enter":
      return "Enter";
    case "escape":
      return "Esc";
    case "space":
      return "Space";
    default:
      return token.length === 1 ? token.toUpperCase() : token;
  }
};

export const formatShortcutAccessibleLabel = (
  keys: ShortcutKeyToken[],
  platform: ShortcutPlatform,
): string =>
  keys
    .map((token) => {
      switch (token.toLowerCase()) {
        case "mod":
          return platform === "mac" ? "Command" : "Control";
        case "ctrl":
          return "Control";
        case "alt":
          return "Alt";
        case "shift":
          return "Shift";
        case "meta":
          return "Command";
        case "enter":
          return "Enter";
        case "escape":
          return "Escape";
        case "space":
          return "Space";
        default:
          return token.length === 1 ? token.toUpperCase() : token;
      }
    })
    .join(", ");

export const formatShortcutSearchText = (
  keys: ShortcutKeyToken[],
  platform: ShortcutPlatform,
): string => keys.map((token) => displayKeyToken(token, platform)).join(" ");

const childText = (value: unknown): string => (typeof value === "string" ? value : "");

export const buildShortcutSearchValue = (
  shortcut: KeyboardShortcutDefinition,
  platform: ShortcutPlatform,
): string => {
  const parts = [
    childText(shortcut.label),
    shortcut.category,
    childText(shortcut.scope),
    childText(shortcut.description),
    formatShortcutSearchText(shortcut.keys, platform),
    ...shortcut.keys.map((token) => token.toLowerCase()),
  ];
  return parts.filter(Boolean).join(" ");
};

export const matchesShortcutSearch = (
  shortcut: KeyboardShortcutDefinition,
  query: string,
  platform: ShortcutPlatform,
): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return buildShortcutSearchValue(shortcut, platform).toLowerCase().includes(normalized);
};

export const groupShortcutsByCategory = (
  shortcuts: KeyboardShortcutDefinition[],
): Array<{ category: string; items: KeyboardShortcutDefinition[] }> => {
  const map = new Map<string, KeyboardShortcutDefinition[]>();
  for (const shortcut of shortcuts) {
    const items = map.get(shortcut.category) ?? [];
    items.push(shortcut);
    map.set(shortcut.category, items);
  }
  return [...map.entries()].map(([category, items]) => ({ category, items }));
};

export const toAriaKeyshortcuts = (
  keys: ShortcutKeyToken[],
  platform: ShortcutPlatform,
): string | undefined => {
  if (keys.length === 0) return undefined;

  const parts = keys.map((token) => {
    switch (token.toLowerCase()) {
      case "mod":
        return platform === "mac" ? "Meta" : "Control";
      case "ctrl":
        return "Control";
      case "alt":
        return "Alt";
      case "shift":
        return "Shift";
      case "meta":
        return "Meta";
      case "enter":
        return "Enter";
      case "escape":
        return "Escape";
      case "space":
        return "Space";
      default:
        return token.length === 1 ? token.toUpperCase() : token;
    }
  });

  return parts.join("+");
};

const normalizeEventKey = (event: KeyboardEvent): string => {
  if (event.key === "?" || (event.shiftKey && event.key === "/")) return "?";
  if (event.key === " ") return "space";
  return event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();
};

const normalizeTokenKey = (token: string): string => {
  if (token === "/") return "/";
  return token.toLowerCase();
};

export const matchesKeyboardShortcut = (
  event: KeyboardEvent,
  keys: ShortcutKeyToken[],
  platform: ShortcutPlatform,
): boolean => {
  const normalized = keys.map((token) => token.toLowerCase());
  const modifiers = normalized.filter((token) => MODIFIER_TOKENS.has(token));
  const keyParts = normalized.filter((token) => !MODIFIER_TOKENS.has(token));
  if (keyParts.length === 0) return false;

  const wantsMod = modifiers.includes("mod");
  const wantsCtrl = modifiers.includes("ctrl");
  const wantsAlt = modifiers.includes("alt");
  const wantsShift = modifiers.includes("shift");
  const wantsMeta = modifiers.includes("meta");

  if (wantsShift !== event.shiftKey) return false;
  if (wantsAlt !== event.altKey) return false;

  if (platform === "mac") {
    const modActive = event.metaKey;
    const ctrlActive = event.ctrlKey;
    if (wantsMod && !modActive) return false;
    if (wantsCtrl && !ctrlActive) return false;
    if (wantsMeta && !modActive) return false;
    if (!wantsMod && !wantsMeta && modActive) return false;
    if (!wantsCtrl && ctrlActive) return false;
  } else {
    const modActive = event.ctrlKey;
    if (wantsMod && !modActive) return false;
    if (wantsCtrl && !modActive) return false;
    if (wantsMeta && !event.metaKey) return false;
    if (!wantsMod && !wantsCtrl && modActive) return false;
    if (!wantsMeta && event.metaKey) return false;
  }

  const eventKey = normalizeEventKey(event);
  return keyParts.some((part) => normalizeTokenKey(part) === eventKey);
};

const isContentEditableElement = (element: HTMLElement): boolean => {
  if (element.isContentEditable) return true;
  const value = element.getAttribute("contenteditable");
  return value === "" || value === "true" || value === "plaintext-only";
};

const isFormField = (element: Element): boolean => {
  const tag = element.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag !== "INPUT") return false;
  const type = (element as HTMLInputElement).type;
  return !["button", "submit", "reset", "checkbox", "radio"].includes(type);
};

/** True when the event target is inside an editable field (including nested). */
export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) return false;

  let node: Element | null = target;
  while (node) {
    if (node instanceof HTMLElement && isContentEditableElement(node)) return true;
    if (isFormField(node)) return true;
    node = node.parentElement;
  }
  return false;
};
