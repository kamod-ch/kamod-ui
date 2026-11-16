import { useTabs } from "@kamod-ch/ui/tabs";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import type { BlockSourceFile } from "./BlockSourceFiles";
import { getShowcaseCodeTarget } from "./ShowcaseCodeLink";
import type { ShowcasePreferences } from "./useShowcasePreferences";

/** Restore after hydration; explicit source links take precedence over the remembered view. */
export function ShowcaseTabMemory({
  blockId,
  files,
  ready,
  view,
  onChange,
}: {
  blockId: string;
  files: readonly BlockSourceFile[];
  ready: boolean;
  view: ShowcasePreferences["view"];
  onChange: (view: ShowcasePreferences["view"]) => void;
}) {
  const { value, setValue } = useTabs();
  const selected = value.value;
  const [restored, setRestored] = useState(false);
  const selectedEarly = useRef(false);
  // A user's first selection wins over saved controls that arrive after hydration.
  useLayoutEffect(() => {
    if (!restored && selected !== "preview") selectedEarly.current = true;
  }, [selected, restored]);
  useEffect(() => {
    if (!ready || restored) return;
    if (!selectedEarly.current)
      setValue(getShowcaseCodeTarget(blockId, files, window.location.hash) ? "code" : view);
    setRestored(true);
  }, [ready, restored, blockId, files, view, setValue]);
  useEffect(() => {
    if (
      restored &&
      selected !== view &&
      (selected === "preview" || selected === "code" || selected === "prompt")
    ) {
      onChange(selected);
    }
  }, [restored, selected, view, onChange]);
  return null;
}
