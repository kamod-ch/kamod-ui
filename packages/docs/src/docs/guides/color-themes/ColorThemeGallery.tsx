import { setThemePreset } from "@kamod-ch/themes";
import { useLayoutEffect, useState } from "preact/hooks";
import { useSiteThemePreset } from "../../../theme/useSiteThemePreset";
import { presetStudies } from "./preset-studies";
import { ThemeGalleryGuide, ThemeGalleryIntroduction } from "./ThemeGalleryGuide";
import { ThemePresetStudy } from "./ThemePresetStudy";
import "./color-themes.css";

/** One page preference owner; all comparison colors remain static, local CSS scopes. */
export function ColorThemeGallery() {
  const current = useSiteThemePreset();
  const [ready, setReady] = useState(false);
  // Match server attributes before resolving a saved page preference.
  useLayoutEffect(() => setReady(true), []);
  return (
    <div class="theme-studies">
      <ThemeGalleryIntroduction />
      {presetStudies.map((study, index) => (
        <ThemePresetStudy
          key={study.id}
          study={study}
          index={index}
          selected={ready && study.id === current}
          onApply={() => setThemePreset(study.id)}
        />
      ))}
      <ThemeGalleryGuide />
    </div>
  );
}
