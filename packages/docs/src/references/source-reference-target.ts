import type { CodeReferenceHelpRequest } from "./types";

/** Read only the active source anchor; no source parsing or document-wide token scan. */
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
  };
}
