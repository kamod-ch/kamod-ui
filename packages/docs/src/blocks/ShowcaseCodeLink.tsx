/** Native source permalinks with explicit activation for repeated same-fragment clicks. */
import { useTabs } from "@kamod-ch/ui/tabs";
import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import type { BlockSourceFile } from "./BlockSourceFiles";

const openCodeEvent = "blocks:open-showcase-code";

export function ShowcaseCodeLink({
  blockId,
  children,
  file,
}: {
  blockId: string;
  file?: string;
  children: ComponentChildren;
}) {
  return (
    <a
      class="blocks-showcase-code-link"
      href={`#${blockId}-code${file ? `/${encodeURIComponent(file)}` : ""}`}
      aria-label={file ? `View ${file} source` : undefined}
      onClick={(event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        // A repeated fragment does not emit hashchange after switching back to Preview.
        window.dispatchEvent(new CustomEvent(openCodeEvent, { detail: { blockId, file } }));
      }}
    >
      {children}
    </a>
  );
}

/** Sync a source permalink with the core tabs and the existing file selection. */
export function useShowcaseCodeNavigation(
  blockId: string,
  files: readonly BlockSourceFile[],
  onSelectFile: (file: string) => void,
) {
  const { setValue } = useTabs();
  const handlers = useRef({ setValue, onSelectFile });
  handlers.current = { setValue, onSelectFile };

  useEffect(() => {
    const anchor = `${blockId}-code`;
    const reveal = (file?: string) => {
      // Only registry labels can select a source; fragments never become arbitrary paths.
      if (file !== undefined) {
        if (!files.some((entry) => entry.label === file)) return;
        handlers.current.onSelectFile(file);
      }
      handlers.current.setValue("code");
      document.getElementById(anchor)?.scrollIntoView({ block: "start", behavior: "instant" });
    };
    const restoreHash = () => {
      const hash = window.location.hash;
      if (hash === `#${anchor}`) reveal();
      else if (hash.startsWith(`#${anchor}/`)) {
        const encodedFile = hash.slice(anchor.length + 2);
        let file: string;
        try {
          file = decodeURIComponent(encodedFile);
        } catch {
          return;
        }
        reveal(file);
      }
    };
    const openCode = (event: Event) => {
      const request = (event as CustomEvent<{ blockId: string; file?: string }>).detail;
      if (request?.blockId === blockId) reveal(request.file);
    };
    restoreHash();
    window.addEventListener("hashchange", restoreHash);
    window.addEventListener(openCodeEvent, openCode);
    return () => {
      window.removeEventListener("hashchange", restoreHash);
      window.removeEventListener(openCodeEvent, openCode);
    };
  }, [blockId, files]);
}
