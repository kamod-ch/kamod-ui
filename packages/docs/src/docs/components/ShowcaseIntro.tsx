import { CodeIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { linkTitle } from "../../link-title";
import { BrandText } from "./brand/BrandText";
import { ShowcaseGuideLinks } from "./ShowcaseGuideLinks";

/** Shared introduction with full-width prompt guidance and Code-only guide shortcuts. */
export function ShowcaseIntro({
  view,
  title,
  note,
  setupHref,
  guideLabel = "Example guides",
  children,
}: {
  view: "code" | "prompt";
  title: string;
  note: string;
  setupHref: string;
  guideLabel?: string;
  children: ComponentChildren;
}) {
  const Icon = view === "code" ? CodeIcon : SparklesIcon;
  return (
    <div class="blocks-showcase-intro" data-view={view}>
      <div class="blocks-showcase-intro-copy">
        <div class="blocks-showcase-intro-title">
          <h3>
            <Icon class="blocks-showcase-intro-icon" aria-hidden="true" />
            <span class="blocks-showcase-intro-label">{linkTitle(title)}</span>
          </h3>
          <span class="blocks-showcase-intro-note">
            <span aria-hidden="true">·</span>
            {note}
          </span>
        </div>
        <p>
          <BrandText>{children}</BrandText>
        </p>
      </div>
      {view === "code" && <ShowcaseGuideLinks setupHref={setupHref} label={guideLabel} />}
    </div>
  );
}
