import type { ComponentChildren } from "preact";
import { linkTitle } from "../../link-title";
import { BrandText } from "./brand/BrandText";
import { ShowcaseGuideLinks } from "./ShowcaseGuideLinks";

/** Shared Code/Prompt header; each showcase supplies its own copy and installation target. */
export function ShowcaseIntro({
  title,
  note,
  setupHref,
  guideLabel = "Example guides",
  children,
}: {
  title: string;
  note: string;
  setupHref: string;
  guideLabel?: string;
  children: ComponentChildren;
}) {
  return (
    <div class="blocks-showcase-intro">
      <div class="blocks-showcase-intro-copy">
        <div class="blocks-showcase-intro-title">
          <h3>{linkTitle(title)}</h3>
          <span class="blocks-showcase-intro-note">
            <span aria-hidden="true">·</span>
            {note}
          </span>
        </div>
        <p>
          <BrandText>{children}</BrandText>
        </p>
      </div>
      <ShowcaseGuideLinks setupHref={setupHref} label={guideLabel} />
    </div>
  );
}
