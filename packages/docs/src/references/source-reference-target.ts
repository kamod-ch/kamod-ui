import type { CodeReferenceHelpRequest } from "./types";

/** Read the active trigger's shared metadata; no source parsing or document-wide scan. */
export function sourceReferenceHelp(target: HTMLElement): CodeReferenceHelpRequest | undefined {
  if (!target.matches(".kamod-code-reference[data-code-module]")) return;
  const href = target.getAttribute("href") ?? target.dataset.codeHref;
  if (!href) return;
  return {
    label: target.textContent?.trim() || "Source reference",
    href,
    module: target.dataset.codeModule ?? "",
    imported: target.dataset.codeImported,
    local: target.dataset.codeLocal,
    filePath: target.dataset.codeFile,
    referenceId: target.dataset.codeReference,
  };
}
