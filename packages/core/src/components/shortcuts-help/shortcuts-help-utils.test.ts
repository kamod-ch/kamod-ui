import { describe, expect, it } from "vitest";
import type { KeyboardShortcutDefinition } from "./shortcuts-help-types";
import {
  displayKeyToken,
  formatShortcutAccessibleLabel,
  groupShortcutsByCategory,
  isEditableTarget,
  matchesKeyboardShortcut,
  matchesShortcutSearch,
  toAriaKeyshortcuts,
} from "./shortcuts-help-utils";

const SAMPLE: KeyboardShortcutDefinition[] = [
  { id: "a", label: "Alpha", category: "Navigation", keys: ["mod", "k"] },
  { id: "b", label: "Beta", category: "Editing", keys: ["mod", "s"] },
  { id: "c", label: "Gamma", category: "Navigation", keys: ["shift", "/"] },
];

describe("shortcuts-help utils", () => {
  it("groups shortcuts by category preserving first-seen order", () => {
    expect(groupShortcutsByCategory(SAMPLE).map((group) => group.category)).toEqual([
      "Navigation",
      "Editing",
    ]);
    expect(groupShortcutsByCategory(SAMPLE)[0]?.items).toHaveLength(2);
  });

  it("filters shortcuts by label and key display text", () => {
    expect(matchesShortcutSearch(SAMPLE[1]!, "save", "windows")).toBe(false);
    expect(matchesShortcutSearch(SAMPLE[1]!, "beta", "windows")).toBe(true);
    expect(matchesShortcutSearch(SAMPLE[0]!, "ctrl", "windows")).toBe(true);
    expect(matchesShortcutSearch(SAMPLE[2]!, "shift", "mac")).toBe(true);
  });

  it("renders platform-specific modifier labels", () => {
    expect(displayKeyToken("mod", "mac")).toBe("⌘");
    expect(displayKeyToken("mod", "windows")).toBe("Ctrl");
    expect(formatShortcutAccessibleLabel(["mod", "k"], "mac")).toBe("Command, K");
    expect(formatShortcutAccessibleLabel(["mod", "k"], "windows")).toBe("Control, K");
  });

  it("expresses aria-keyshortcuts with modifier names", () => {
    expect(toAriaKeyshortcuts(["mod", "k"], "mac")).toBe("Meta+K");
    expect(toAriaKeyshortcuts(["mod", "k"], "windows")).toBe("Control+K");
  });

  it("matches keyboard events for mod combinations per platform", () => {
    const macEvent = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true });
    const winEvent = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });

    expect(matchesKeyboardShortcut(macEvent, ["mod", "k"], "mac")).toBe(true);
    expect(matchesKeyboardShortcut(winEvent, ["mod", "k"], "windows")).toBe(true);
    expect(matchesKeyboardShortcut(macEvent, ["mod", "k"], "windows")).toBe(false);
  });

  it("treats nested editable targets as excluded", () => {
    const host = document.createElement("div");
    const editable = document.createElement("div");
    editable.setAttribute("contenteditable", "true");
    const nested = document.createElement("span");
    editable.appendChild(nested);
    host.appendChild(editable);
    document.body.appendChild(host);

    expect(isEditableTarget(nested)).toBe(true);
    expect(isEditableTarget(editable)).toBe(true);

    host.remove();
  });

  it("treats inputs and textareas as editable", () => {
    const input = document.createElement("input");
    const textarea = document.createElement("textarea");
    expect(isEditableTarget(input)).toBe(true);
    expect(isEditableTarget(textarea)).toBe(true);
  });
});
