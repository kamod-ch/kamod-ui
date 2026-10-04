/** Full paths remain the file identity even when grouped basenames repeat. */
import { FileCodeIcon, FolderIcon, FolderTreeIcon } from "@kamod-ch/icons/lucide";
import { useMemo } from "preact/hooks";
import { PathDisplay } from "../docs/components/PathDisplay";
import type { BlockSourceFile } from "./BlockSourceFiles";

export function BlockSourceExplorer({
  files,
  selectedFile,
  onSelect,
  grouped,
}: {
  files: readonly BlockSourceFile[];
  selectedFile: string;
  onSelect: (file: string) => void;
  grouped: boolean;
}) {
  const groups = useMemo(() => {
    const result = new Map<string, BlockSourceFile[]>();
    for (const file of files) {
      const separator = file.label.lastIndexOf("/");
      const folder = grouped && separator >= 0 ? file.label.slice(0, separator) : "";
      const entries = result.get(folder) ?? [];
      entries.push(file);
      result.set(folder, entries);
    }
    return [...result];
  }, [files, grouped]);

  return (
    <aside class="blocks-file-tree" aria-label="Block files">
      <div class="blocks-file-tree-heading">
        Files
        <FolderTreeIcon size={14} strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div class="blocks-file-tree-scroll">
        <ul class="blocks-file-tree-list">
          {groups.map(([folder, entries]) => (
            <li key={folder}>
              {grouped && (
                <div class="blocks-file-tree-dir">
                  <FolderIcon size={13} strokeWidth={1.75} aria-hidden="true" />
                  <PathDisplay as="span" path={folder || "Block root"} />
                </div>
              )}
              <ul class="blocks-file-tree-list">
                {entries.map(({ label }) => (
                  <li key={label}>
                    <button
                      type="button"
                      class={`blocks-file-tree-btn ${selectedFile === label ? "is-active" : ""}`}
                      aria-pressed={selectedFile === label}
                      title={label}
                      onClick={() => onSelect(label)}
                    >
                      <FileCodeIcon size={14} strokeWidth={1.75} aria-hidden="true" />
                      <PathDisplay
                        as="span"
                        path={(grouped ? label.split("/").at(-1) : label) ?? label}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <p class="blocks-file-tree-hint">Select a file to explore its source.</p>
    </aside>
  );
}
