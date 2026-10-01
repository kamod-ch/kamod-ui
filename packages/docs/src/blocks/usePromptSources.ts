import { useEffect, useState } from "preact/hooks";
import type { ShowcaseBlock } from "./BlockShowcase";
import type { BlockSourceLoader } from "./BlockSourceFiles";
import { type PromptSource, promptDestination } from "./block-prompts";

/** Load only inside the mounted Prompt panel; never offer a partially assembled prompt. */
export function usePromptSources(block: ShowcaseBlock, loadSource: BlockSourceLoader) {
  const { category, id, files } = block;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{
    files: ShowcaseBlock["files"];
    loader: BlockSourceLoader;
    category: string;
    id: string;
    attempt: number;
    result: { sources: PromptSource[]; error?: never } | { error: true; sources?: never };
  }>();
  useEffect(() => {
    let active = true;
    const collect = async () => {
      try {
        const sources = await Promise.all(
          files.map(async (file) => {
            const code = await loadSource(file.label);
            if (!code.trim()) throw new Error(`Empty block source: ${file.label}`);
            return { destination: promptDestination({ category, id }, file), code };
          }),
        );
        if (active)
          setState({ files, loader: loadSource, category, id, attempt, result: { sources } });
      } catch {
        if (active)
          setState({ files, loader: loadSource, category, id, attempt, result: { error: true } });
      }
    };
    void collect();
    return () => {
      active = false;
    };
  }, [category, id, files, loadSource, attempt]);
  const result =
    state?.files === files &&
    state.loader === loadSource &&
    state.category === category &&
    state.id === id &&
    state.attempt === attempt
      ? state.result
      : undefined;
  return { result, retry: () => setAttempt((value) => value + 1) };
}
