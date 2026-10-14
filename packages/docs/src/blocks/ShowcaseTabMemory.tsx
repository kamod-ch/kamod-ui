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
  const [restored, setRestored] = useState(false);
  const selectedEarly = useRef(false);
  // A user's first selection wins over saved controls that arrive after hydration.
  useLayoutEffect(() => {
    if (!restored && value !== "preview") selectedEarly.current = true;
  }, [value, restored]);
  useEffect(() => {
    if (!ready || restored) return;
    if (!selectedEarly.current)
      setValue(getShowcaseCodeTarget(blockId, files, window.location.hash) ? "code" : view);
    setRestored(true);
  }, [ready, restored, blockId, files, view, setValue]);
  useEffect(() => {
    if (
      restored &&
      value !== view &&
      (value === "preview" || value === "code" || value === "prompt")
    ) {
      onChange(value);
    }
  }, [restored, value, view, onChange]);
  return null;
}
