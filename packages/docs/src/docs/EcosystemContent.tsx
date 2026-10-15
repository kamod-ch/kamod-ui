import source from "virtual:kamod-ecosystem";
import { BlockGuideContents } from "../blocks/detail/BlockGuideContents";
import { parseGuide } from "../blocks/guides/guide-markdown";
import { DocsShell } from "./components/DocsShell";
import { GuideArticle } from "./components/GuideArticle";
import { InlineCodeLink } from "./components/InlineCodeLink";
import { LibraryPageHeader } from "./components/LibraryPageHeader";
import { EcosystemNextSteps } from "./ecosystem/EcosystemNextSteps";
import { renderEcosystemTable } from "./ecosystem/EcosystemReferences";

const title = "The Kamod Ecosystem";
const sections = parseGuide(source, renderEcosystemTable);
const contents = [
  ...sections.map(({ id, title, children }) => ({ id, label: title, children })),
  { id: "your-next-step", label: "Put the Toolkit to Work" },
];

/** One route owns the ecosystem prose and catalog; other pages keep only its entry link. */
export function EcosystemContent() {
  return (
    <DocsShell
      sidebarScope="ecosystem"
      activeDoc={null}
      activeSection=""
      contentFooter={<EcosystemNextSteps />}
      pageContents={
        <BlockGuideContents id="ecosystem-contents" pageTitle={title} sections={contents} />
      }
      mainContent={
        <div class="ecosystem-guide">
          <GuideArticle
            sections={sections}
            header={
              <LibraryPageHeader
                parent={{ label: "Home", href: "/" }}
                label="Kamod Ecosystem"
                eyebrow="Tools That Work Together"
                title={title}
                description={
                  <>
                    <p>
                      Build a complete <code>Preact</code> interface with a small, deliberate
                      toolkit. Start with <strong>Components and Shared Styles</strong>, then add
                      icons, reusable behavior, persistence or translations where your feature needs
                      them. Each project has a clear responsibility and a source you can inspect.
                    </p>
                    <p>
                      This is your map from{" "}
                      <strong>A Working Screen to a Well Connected App</strong>. Compare the{" "}
                      <a href="#choose-a-starting-point">Starting Points</a>, explore the project
                      cards, and follow a <a href="#build-one-small-feature">Small Integration</a>.
                      The <InlineCodeLink href="/docs/packages">Package Guides</InlineCodeLink>{" "}
                      carry the detailed installation steps and APIs.
                    </p>
                  </>
                }
              />
            }
          />
        </div>
      }
    />
  );
}
