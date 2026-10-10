import source from "virtual:kamod-getting-started";
import { BlockGuideContents } from "../blocks/detail/BlockGuideContents";
import { parseGuide } from "../blocks/guides/guide-markdown";
import { DocsShell } from "./components/DocsShell";
import { renderGettingStartedTable } from "./components/GettingStartedVerification";
import { GuideArticle } from "./components/GuideArticle";
import { LibraryPageHeader } from "./components/LibraryPageHeader";

const title = "Getting Started with Kamod UI";
const sections = parseGuide(source, renderGettingStartedTable);
const contents = sections.map(({ id, title, children }) => ({ id, label: title, children }));

/** The complete library entry point; guide prose loads only on this route. */
export function GettingStartedContent() {
  return (
    <DocsShell
      sidebarScope="getting-started"
      activeDoc={null}
      activeSection=""
      pageContents={
        <BlockGuideContents id="getting-started-contents" pageTitle={title} sections={contents} />
      }
      mainContent={
        <GuideArticle
          sections={sections}
          header={
            <LibraryPageHeader
              parent={{ label: "Home", href: "/" }}
              label="Getting Started"
              eyebrow="Your First Kamod Interface"
              focus="Set Up · Build · Connect · Ship"
              title={title}
              description={
                <>
                  <p>
                    Take a <code>Preact</code> app from its first styled control to a complete,
                    working screen. Connect <code>Tailwind CSS</code> and <code>TypeScript</code>,
                    choose <strong>Components, Blocks, Forms and Companion Packages</strong>, then
                    bring your own routes, data and services into the composition.
                  </p>
                  <p>
                    Follow the setup in order, or use the page contents to find your next step. Each
                    chapter explains the important decisions, includes practical examples and points
                    to the detailed references when you need to go further. Put the setup into
                    practice with your <a href="#your-first-working-screen">First Working Screen</a>
                    .
                  </p>
                </>
              }
            />
          }
        />
      }
    />
  );
}
