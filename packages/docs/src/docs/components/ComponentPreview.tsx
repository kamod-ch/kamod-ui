import type { ComponentChildren } from "preact";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { applyPreviewAppearance, type PreviewAppearance } from "../../blocks/preview-appearance";
import { ConsumerImportSwitch, useConsumerImportCode } from "./consumer-import-code";
import { ShowcaseCodePane } from "./ShowcaseCodePane";

/**
 * Render a demo and the same module's source.
 * Pass the module text from a Vite `?raw` import so the copy block cannot drift from the live component.
 * The switch rewrites that source to `@kamod-ch/ui` or `@kamod-ch/ui/<component>`.
 * Theme, direction and reset stay on this container and do not change the site.
 */
export function ComponentPreview({
  source,
  filePath = "Example.tsx",
  children,
  appearance: appearanceProp,
}: {
  source: string;
  filePath?: string;
  children: ComponentChildren;
  appearance?: PreviewAppearance;
}) {
  const presentation = useConsumerImportCode(source);
  const live = useRef<HTMLDivElement>(null);
  const [appearance, setAppearance] = useState<PreviewAppearance>({
    preset: "kamod",
    scheme: "light",
    dir: "ltr",
  });
  const [revision, setRevision] = useState(0);
  const active = appearanceProp ?? appearance;
  useLayoutEffect(() => {
    if (live.current) applyPreviewAppearance(live.current, active);
  }, [active]);
  return (
    <div class="component-preview" data-slot="component-preview">
      <div class="component-preview-toolbar" role="toolbar" aria-label="Preview playground">
        <button
          type="button"
          class="docs-icon-button"
          aria-pressed={active.scheme === "dark"}
          aria-label="Dark preview"
          title={`Switch preview to ${active.scheme === "dark" ? "light" : "dark"} mode`}
          onClick={() =>
            setAppearance({
              ...active,
              scheme: active.scheme === "dark" ? "light" : "dark",
            })
          }
        >
          <span class="blocks-showcase-control-label">
            {active.scheme === "dark" ? "Dark" : "Light"}
          </span>
        </button>
        <div role="group" aria-label="Preview reading direction">
          <button
            type="button"
            class="docs-icon-button"
            aria-pressed={(active.dir ?? "ltr") === "ltr"}
            aria-label="Left to right"
            onClick={() => setAppearance({ ...active, dir: "ltr" })}
          >
            <span class="blocks-showcase-control-label">LTR</span>
          </button>
          <button
            type="button"
            class="docs-icon-button"
            aria-pressed={active.dir === "rtl"}
            aria-label="Right to left"
            onClick={() => setAppearance({ ...active, dir: "rtl" })}
          >
            <span class="blocks-showcase-control-label">RTL</span>
          </button>
        </div>
        <button
          type="button"
          class="docs-icon-button"
          aria-label="Reset preview"
          title="Remount the demo and clear its local state"
          onClick={() => setRevision((value) => value + 1)}
        >
          <span class="blocks-showcase-control-label">Reset</span>
        </button>
      </div>
      <div key={revision} ref={live} class="component-preview-live" dir={active.dir ?? "ltr"}>
        {children}
      </div>
      {presentation.applicable ? (
        <ConsumerImportSwitch value={presentation.style} onChange={presentation.setStyle} />
      ) : null}
      <ShowcaseCodePane
        appearance={active}
        code={presentation.code}
        filePath={filePath}
        filename={filePath.split("/").at(-1) ?? filePath}
        consumerImports={false}
      />
    </div>
  );
}
