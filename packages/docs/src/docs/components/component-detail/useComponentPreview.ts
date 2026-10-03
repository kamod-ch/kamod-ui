import { isThemePresetId } from "@kamod-ch/themes";
import { useLayoutEffect, useState } from "preact/hooks";
import type { PreviewAppearance } from "../../../blocks/preview-appearance";

/** Measure the unconstrained stage so a saved narrow choice never disables its own control. */
export function useComponentPreview() {
  const [node, stage] = useState<HTMLDivElement | null>(null);
  const [canConstrain, setCanConstrain] = useState(false);
  const [appearance, setAppearance] = useState<PreviewAppearance>({
    preset: "kamod",
    scheme: "light",
  });
  useLayoutEffect(() => {
    const root = document.documentElement;
    const preset = root.getAttribute("data-theme") ?? "";
    setAppearance({
      preset: isThemePresetId(preset) ? preset : "kamod",
      scheme: root.classList.contains("dark") ? "dark" : "light",
    });
  }, []);
  useLayoutEffect(() => {
    if (!node) return;
    const observer = new ResizeObserver((entries) =>
      setCanConstrain((entries.at(-1)?.contentRect.width ?? 0) > 360),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return { stage, canConstrain, appearance, setAppearance };
}
