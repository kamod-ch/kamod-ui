import { useEffect } from "preact/hooks";

/** Preserve literal path text when browsers insert layout line breaks between selected grid cells. */
export function PathCopySupport() {
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      if (event.defaultPrevented || !event.clipboardData) return;
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount !== 1) return;
      const range = selection.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const element = node instanceof Element ? node : node.parentElement;
      // Only normalize a selection wholly inside one path; prose and multi-file selections stay native.
      if (!element?.closest(".path-display")) return;
      event.clipboardData.setData("text/plain", range.toString());
      event.preventDefault();
    };
    document.addEventListener("copy", copy);
    return () => document.removeEventListener("copy", copy);
  }, []);
  return null;
}
