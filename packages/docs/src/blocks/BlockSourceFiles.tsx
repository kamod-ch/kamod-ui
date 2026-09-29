/** On-demand source loading: overview and Preview tabs never fetch raw implementation text. */
import { FileCodeIcon, TextWrapIcon } from "@kamod-ch/icons/lucide";
import { BrandTypescriptIcon, TextWrapDisabledIcon } from "@kamod-ch/icons/tabler/outline";
import { Button } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { CodeBlock } from "../docs/components/CodeBlock";
import { BlockSourceExplorer } from "./BlockSourceExplorer";

/** Full source label, including directories, doubles as the stable file identifier. */
export type BlockSourceFile = { label: string; destination?: string };
/** Resolve a registry file label to its raw, copyable source; failures offer a retry. */
export type BlockSourceLoader = (label: string) => Promise<string>;

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
  const [wrapped, setWrapped] = useState(false);
  const extension = selectedFile.split(".").at(-1)?.toLowerCase();
  const language = extension === "md" ? "markdown" : extension === "svg" ? "text" : "tsx";
  const lineCount = current?.status === "ready" ? current.code.trimEnd().split("\n").length : 0;
  const WrapIcon = wrapped ? TextWrapIcon : TextWrapDisabledIcon;
  return (
    <div class="blocks-code-layout">
      <BlockSourceExplorer
        files={files}
        selectedFile={selectedFile}
        onSelect={onSelect}
        grouped={grouped}
      />
      <div class={`blocks-code-pane ${wrapped ? "is-wrapped" : ""}`}>
        <div class="blocks-source-file-heading">
          <FileCodeIcon size={17} strokeWidth={1.75} aria-hidden="true" />
          <code title={selectedFile}>{selectedFile}</code>
          <span class="blocks-source-extension">
            {(extension === "tsx" || extension === "ts") && (
              <BrandTypescriptIcon size={13} aria-hidden="true" />
            )}
            {extension}
          </span>
          {current?.status === "ready" && (
            <span class="blocks-source-lines">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          )}
        </div>
        {current?.status === "error" ? (
          <div class="blocks-source-state" role="alert">
            <p>Could not load the source file.</p>
            <Button size="sm" variant="outline" onClick={retry}>
              Try again
            </Button>
          </div>
        ) : current?.status === "ready" ? (
          <CodeBlock
            key={selectedFile}
            code={current.code}
            language={language}
            filePath={
              files.find((file) => file.label === selectedFile)?.destination ?? selectedFile
            }
            toolbarContent={
              <>
                <button
                  type="button"
                  class="blocks-source-wrap"
                  aria-pressed={wrapped}
                  aria-label="Wrap code lines"
                  title={`Line wrapping ${wrapped ? "on" : "off"}`}
                  onClick={() => setWrapped((value) => !value)}
                >
                  <WrapIcon size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span class="blocks-source-wrap-label">Wrap {wrapped ? "on" : "off"}</span>
                </button>
              </>
            }
            className="docs-tab-code"
          />
        ) : (
          <p class="blocks-source-state" role="status">
            Loading source…
          </p>
        )}
        <div class="blocks-source-footer">
          <span>Read the supporting files before adapting this composition.</span>
          <span>Copy preserves source formatting.</span>
        </div>
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
