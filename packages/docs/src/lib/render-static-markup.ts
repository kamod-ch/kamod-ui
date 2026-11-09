import { untracked } from "@preact/signals";
import type { ComponentChildren } from "preact";
import renderToString from "preact-render-to-string";

/** Sync markup helpers (Markdown, tables) must not join the active Signals render graph. */
export function renderStaticMarkup(children: ComponentChildren) {
  return untracked(() => renderToString(children));
}
