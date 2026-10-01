import { useTabs } from "@kamod-ch/ui/tabs";
import { useEffect, useState } from "preact/hooks";
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
  useEffect(() => {
    if (!ready || restored) return;
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
