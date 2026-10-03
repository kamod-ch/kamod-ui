/** On-demand source loading: overview and Preview tabs never fetch raw implementation text. */
import { Button } from "@kamod-ch/ui";
import { useEffect, useState } from "preact/hooks";
import { ShowcaseCodePane } from "../docs/components/ShowcaseCodePane";
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
  return (
    <div class="blocks-code-layout">
      <BlockSourceExplorer
        files={files}
        selectedFile={selectedFile}
        onSelect={onSelect}
        grouped={grouped}
      />
      <ShowcaseCodePane
        filename={selectedFile}
        filePath={files.find((file) => file.label === selectedFile)?.destination ?? selectedFile}
        code={current?.status === "ready" ? current.code : undefined}
        footer="Read the supporting files before adapting this composition."
      >
        {current?.status === "error" ? (
          <div class="blocks-source-state" role="alert">
            <p>Could not load the source file.</p>
            <Button size="sm" variant="outline" onClick={retry}>
              Try again
            </Button>
          </div>
        ) : (
          <p class="blocks-source-state" role="status">
            Loading source…
          </p>
        )}
      </ShowcaseCodePane>
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
