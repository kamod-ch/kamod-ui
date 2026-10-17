import { CodeIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { linkTitle } from "../../link-title";
import { BrandText } from "./brand/BrandText";

/** Shared full-width introduction for source and prompt views. */
export function ShowcaseIntro({
  view,
  title,
  note,
  children,
}: {
  view: "code" | "prompt";
  title: string;
  note: string;
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
            <span class="blocks-showcase-intro-separator" aria-hidden="true">
              ·
            </span>
            {note}
          </span>
        </div>
        <p>
          <BrandText>{children}</BrandText>
        </p>
      </div>
    </div>
  );
}
