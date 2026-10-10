import { ArrowRightIcon, BookOpenIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../base-path";
import type { DocsSidebarScope } from "./DocsShell";

const chapters = {
  components: ["components", "Choose and Compose Components"],
  blocks: ["blocks", "Bring a Complete Layout into Your App"],
  forms: ["forms", "Connect Fields, Validation and Submission"],
  packages: ["packages", "Choose Your Companion Packages"],
} as const;

/** A contextual route back to the complete guide, without importing its prose. */
export function GettingStartedReference({
  scope,
  slug,
}: {
  scope: DocsSidebarScope;
  slug?: string;
}) {
  if (scope === "getting-started") return null;
  const [chapter, label] = chapters[scope];
  const fragment = slug?.endsWith("-package")
    ? slug.replace(/-package$/, "")
    : slug === "cn" || slug === "theming"
      ? "style-your-interface"
      : chapter;
  return (
    <nav class="getting-started-reference" aria-label="Getting Started guide">
      <div class="getting-started-reference-links">
        <a href={withBasePath("/docs/getting-started")}>
          <BookOpenIcon size={14} aria-hidden="true" />
          Getting Started
        </a>
        <span class="getting-started-reference-separator" aria-hidden="true">
          ·
        </span>
        <a href={withBasePath(`/docs/getting-started#${fragment}`)}>
          {fragment === "style-your-interface" ? "Set Up Styles and Tokens" : label}
          <ArrowRightIcon size={14} aria-hidden="true" />
        </a>
      </div>
      <p>See how this fits into a complete Kamod UI application.</p>
    </nav>
  );
}
