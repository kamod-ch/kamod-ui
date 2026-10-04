import type { ComponentChildren } from "preact";
import { ShowcaseGuideLinks } from "./ShowcaseGuideLinks";

/** Shared Code/Prompt header; each showcase supplies its own copy and installation target. */
export function ShowcaseIntro({
  title,
  note,
  setupHref,
  guideLabel = "Example guides",
  metadata,
  children,
}: {
  title: string;
  note: string;
  setupHref: string;
  guideLabel?: string;
  /** Optional compact context above the heading, such as a block's import path. */
  metadata?: ComponentChildren;
  children: ComponentChildren;
}) {
  return (
    <div class="blocks-showcase-intro">
      <div class="blocks-showcase-intro-copy">
        {metadata}
        <div class="blocks-showcase-intro-title">
          <h3>{title}</h3>
          <span class="blocks-showcase-intro-note">
            <span aria-hidden="true">·</span>
            {note}
          </span>
        </div>
        <p>{children}</p>
      </div>
      <ShowcaseGuideLinks setupHref={setupHref} label={guideLabel} />
    </div>
  );
}
