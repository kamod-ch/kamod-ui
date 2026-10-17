import { BookOpenIcon, LayersIcon, PaletteIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../base-path";
import type { DocsSidebarScope } from "./DocsShell";

const chapters = {
  components: ["components", "Choose and Compose Components"],
  blocks: ["blocks", "Bring a Complete Layout into Your App"],
  forms: ["forms", "Connect Fields, Validation and Submission"],
  packages: ["packages", "Choose Your Companion Packages"],
  ecosystem: ["packages", "Connect the Toolkit to Your First Screen"],
} as const;

/** A useful page ending connects this reference to setup, composition and a final review. */
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
    <section class="getting-started-reference" aria-labelledby="continue-building">
      <div class="getting-started-reference-heading">
        <span>
          <BookOpenIcon size={17} aria-hidden="true" />
          <h2 id="continue-building">Take the Next Useful Step</h2>
        </span>
        <a
          class="docs-icon-button"
          href={withBasePath("/docs/getting-started")}
          aria-label="Open the complete Getting Started guide"
          title="Follow the complete application setup"
        >
          <BookOpenIcon size={16} aria-hidden="true" />
        </a>
      </div>
      <p>
        You have the pieces. Put them into <strong>one real interaction</strong>, keep its state in
        one place, and check the result with the content your application will actually show.
      </p>
      <div class="getting-started-reference-paths">
        <div>
          <h3>
            <BookOpenIcon size={14} aria-hidden="true" />
            Connect the Foundation
          </h3>
          <p>
            Return to{" "}
            <a href={withBasePath(`/docs/getting-started#${fragment}`)}>
              {fragment === "style-your-interface" ? "Set Up Styles and Tokens" : label}
            </a>{" "}
            to connect this reference to a working screen. Keep global CSS in one entrypoint and
            import only the components that screen needs.
          </p>
        </div>
        <div>
          <h3>
            <LayersIcon size={14} aria-hidden="true" />
            Build the Surrounding Screen
          </h3>
          <p>
            Find a neighboring interaction in the{" "}
            <a href={withBasePath("/docs/components")}>Component Library</a>, or start with a
            complete <a href={withBasePath("/blocks")}>Block</a>. Replace sample content and
            destinations before refining the layout; a local <code>class</code> change can stay with
            the composition.
          </p>
        </div>
        <div>
          <h3>
            <PaletteIcon size={14} aria-hidden="true" />
            Make the Result Hold Up
          </h3>
          <p>
            Use <a href={withBasePath("/docs/theming/installation")}>shared theme roles</a> for
            changes that belong everywhere. Then{" "}
            <a href={withBasePath("/docs/getting-started#verify-the-whole-journey")}>
              review the whole journey
            </a>
            : keyboard focus, long labels, narrow screens and a clear way to recover when something
            fails.
          </p>
        </div>
      </div>
      <p class="getting-started-reference-note">
        Keep a link to the source and note your intentional changes. Your next edit should begin
        with a clear decision, not another search.
      </p>
    </section>
  );
}
