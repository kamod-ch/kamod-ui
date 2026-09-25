/** On-demand source loading: overview and Preview tabs never fetch raw implementation text. */
import { Button } from "@kamod-ch/ui";
import { useEffect, useMemo, useState } from "preact/hooks";
import { CodeBlock } from "../docs/components/CodeBlock";

/** Full source label, including directories, doubles as the stable file identifier. */
export type BlockSourceFile = { label: string };
/** Resolve a registry file label to its raw, copyable source; failures offer a retry. */
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
  const { current, retry } = useBlockSource(selectedFile, loadSource);
  const groups = useMemo(() => groupFiles(files, grouped), [files, grouped]);
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
        {current?.status === "error" ? (
          <div role="alert">
            <p>Could not load the source file.</p>
            <Button size="sm" variant="outline" onClick={retry}>
              Try again
            </Button>
          </div>
        ) : current?.status === "ready" ? (
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

/** Bind results to both loader and filename: different blocks can share a filename. */
function useBlockSource(file: string, loadSource: BlockSourceLoader) {
  const [attempt, setAttempt] = useState(0);
  const [source, setSource] = useState<{
    file: string;
    loader: BlockSourceLoader;
    attempt: number;
    result: { status: "ready"; code: string } | { status: "error" };
  }>();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const code = await loadSource(file);
        if (active)
          setSource({ file, loader: loadSource, attempt, result: { status: "ready", code } });
      } catch {
        if (active) setSource({ file, loader: loadSource, attempt, result: { status: "error" } });
      }
    };
    void load();
    // Ignore late results from an earlier selection, loader or unmounted page.
    return () => {
      active = false;
    };
  }, [loadSource, file, attempt]);

  return {
    current:
      source?.file === file && source.loader === loadSource && source.attempt === attempt
        ? source.result
        : undefined,
    retry: () => setAttempt((value) => value + 1),
  };
}
