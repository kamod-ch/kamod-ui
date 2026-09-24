/** On-demand source loading: overview and Preview tabs never fetch raw implementation text. */
import { Button } from "@kamod-ch/ui";
import { useEffect, useMemo, useState } from "preact/hooks";
import { CodeBlock } from "../docs/components/CodeBlock";

export type BlockSourceFile = { label: string };
export type BlockSourceLoader = (label: string) => Promise<string>;

/** Keep full labels as keys, even when identical basenames occur in different directories. */
function groupFiles(files: readonly BlockSourceFile[], grouped: boolean) {
  const groups = new Map<string, { label: string; path: string }[]>();
  for (const file of files) {
    const parts = file.label.split("/");
    const dir = grouped && parts.length > 1 ? parts.slice(0, -1).join("/") : ".";
    const entries = groups.get(dir) ?? [];
    entries.push({ label: grouped ? (parts.at(-1) ?? file.label) : file.label, path: file.label });
    groups.set(dir, entries);
  }
  return [...groups].map(([dir, entries]) => ({ dir, entries }));
}

export const BlockSourceFiles = ({
  files,
  loadSource,
  selectedFile,
  onSelect,
  grouped = true,
}: {
  files: readonly BlockSourceFile[];
  loadSource: BlockSourceLoader;
  grouped?: boolean;
  selectedFile: string;
  onSelect: (file: string) => void;
}) => {
  const [attempt, setAttempt] = useState(0);
  const [source, setSource] = useState<{ file: string; code?: string; failed?: boolean }>();
  const groups = useMemo(() => groupFiles(files, grouped), [files, grouped]);

  useEffect(() => {
    let active = true;
    loadSource(selectedFile).then(
      (code) => {
        if (active) setSource({ file: selectedFile, code });
      },
      () => {
        if (active) setSource({ file: selectedFile, failed: true });
      },
    );
    // An earlier selection or unmounted page must not replace the currently displayed source.
    return () => {
      active = false;
    };
  }, [loadSource, selectedFile, attempt]);

  const current = source?.file === selectedFile ? source : undefined;
  return (
    <div class="blocks-code-layout mt-3">
      <aside class="blocks-file-tree" aria-label="Block files">
        <p class="blocks-file-tree-label">Files</p>
        <ul class="blocks-file-tree-list">
          {groups.map(({ dir, entries }) => (
            <li key={dir}>
              {grouped && <div class="blocks-file-tree-dir">{dir}/</div>}
              <ul class="blocks-file-tree-list">
                {entries.map((file) => (
                  <li key={file.path}>
                    <button
                      type="button"
                      class={`blocks-file-tree-btn ${selectedFile === file.path ? "is-active" : ""}`}
                      aria-pressed={selectedFile === file.path}
                      onClick={() => onSelect(file.path)}
                    >
                      {file.label}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </aside>
      <div class="blocks-code-pane">
        {current?.failed ? (
          <div role="alert">
            <p>Could not load the source file.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSource(undefined);
                setAttempt((value) => value + 1);
              }}
            >
              Try again
            </Button>
          </div>
        ) : current?.code !== undefined ? (
          <CodeBlock
            code={current.code}
            language={selectedFile.endsWith(".svg") ? "text" : "tsx"}
            className="docs-tab-code"
          />
        ) : (
          <p role="status">Loading source…</p>
        )}
      </div>
    </div>
  );
};
