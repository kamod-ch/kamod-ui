import { DownloadIcon, LoaderCircleIcon } from "@kamod-ch/icons/lucide";
import { ChecksIcon } from "@kamod-ch/icons/tabler/outline";
import { useId } from "preact/hooks";
import { useFileDownload } from "./useFileDownload";
import "./file-download.css";

/** Private document action sharing Copy's sizing, orbit, rim and confirmation ring. */
export function FileDownloadButton({
  source,
  fileName,
  mimeType = "text/plain;charset=utf-8",
  subject = "code",
  slot = "code-download",
}: {
  source: string;
  fileName: string;
  mimeType?: string;
  subject?: string;
  slot?: string;
}) {
  const { phase, download } = useFileDownload(source, fileName, mimeType);
  // Preserve established Markdown selectors while one generic control owns every state.
  const legacyMarkdown = slot === "markdown-download";
  const statusId = `${useId()}-download-status`;
  const loading = phase === "loading";
  const complete = phase === "complete";
  const failed = phase === "error";
  const idle = phase === "idle" || phase === "resetting" || failed;
  const label = loading
    ? `Downloading ${subject}`
    : complete
      ? `${subject} downloaded`
      : failed
        ? `Retry downloading ${subject}`
        : `Download ${subject}`;
  return (
    <>
      <button
        type="button"
        class={`docs-icon-button docs-code-action docs-file-download${legacyMarkdown ? " docs-markdown-download" : ""} kamod-action-button kamod-action-feedback kamod-action-orbit${complete ? " is-complete" : ""}`}
        data-slot={slot}
        data-download-state={phase}
        aria-label={label}
        aria-busy={loading || undefined}
        aria-disabled={!idle || phase === "resetting" || undefined}
        aria-describedby={failed ? statusId : undefined}
        title={label}
        onClick={download}
      >
        <span class="kamod-action-glyph" aria-hidden="true">
          {/* Persistent SVGs avoid losing paint when feedback changes in Safari. */}
          <DownloadIcon size={16} strokeWidth={2} data-download-visible={idle} />
          <LoaderCircleIcon
            size={16}
            strokeWidth={2}
            data-download-visible={loading}
            class={`docs-file-download-spinner${legacyMarkdown ? " docs-markdown-download-spinner" : ""}${complete ? " kamod-action-outgoing" : ""}`}
          />
          <ChecksIcon
            size={16}
            strokeWidth={2}
            data-download-visible={complete}
            class="kamod-action-confirmation"
          />
        </span>
        <span class="kamod-action-label" aria-hidden="true">
          <span data-download-visible={idle}>{failed ? "Retry" : "Download"}</span>
          <span data-download-visible={loading}>Downloading…</span>
          <span data-download-visible={complete} class="docs-file-download-complete">
            Downloaded
          </span>
        </span>
      </button>
      <span id={statusId} class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {loading
          ? `Preparing ${subject} download.`
          : complete
            ? `${subject} file sent to your browser's downloads.`
            : failed
              ? `Could not start the download. Try again, or copy the ${subject} instead.`
              : ""}
      </span>
    </>
  );
}
