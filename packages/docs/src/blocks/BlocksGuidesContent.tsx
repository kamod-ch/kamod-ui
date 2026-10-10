import sources from "virtual:kamod-block-guides";
import { withBasePath } from "../base-path";
import { DocsShell } from "../docs/components/DocsShell";
import { GuideArticle } from "../docs/components/GuideArticle";
import { LibraryPageHeader } from "../docs/components/LibraryPageHeader";
import { PageEyebrow } from "../docs/components/PageEyebrow";
import { BlockPageEnding } from "./BlockPageEnding";
import { BlockGuideContents } from "./detail/BlockGuideContents";
import { BlockGuideIntroduction } from "./guides/BlockGuideIntroduction";
import { ContinueBuilding, continueBuildingContents } from "./guides/ContinueBuilding";
import { blockGuides } from "./guides/guide-catalog";
import { parseGuide } from "./guides/guide-markdown";

// This route chunk is loaded only for guides; navigation imports metadata without the prose.
const guides = blockGuides.map((guide) => {
  const sections = parseGuide(sources[guide.slug]);
  return {
    ...guide,
    sections,
    contents: [
      ...sections.map(({ id, title, children }) => ({ id, label: title, children })),
      continueBuildingContents,
    ],
  };
});

/** Shared, server-rendered reading layout with native anchors and mobile contents disclosure. */
export function BlocksGuidesContent({ slug }: { slug?: string }) {
  const guide = guides.find((item) => item.slug === slug);
  if (!guide)
    return (
      <main>
        <PageEyebrow>Block Guides</PageEyebrow>
        <h1>Guide Not Found</h1>
        <a href={withBasePath("/blocks")}>Browse Blocks</a>
      </main>
    );
  return (
    <DocsShell
      sidebarScope="blocks"
      activeDoc={null}
      activeSection=""
      navigationPath={withBasePath(`/blocks/${guide.slug}`)}
      pageContents={
        <BlockGuideContents
          id={`${guide.slug}-contents`}
          sections={guide.contents}
          pageTitle={guide.title}
        />
      }
      mainContent={
        <GuideArticle
          sections={guide.sections}
          header={
            <LibraryPageHeader
              parent={{ label: "Blocks", href: "/blocks" }}
              label={guide.label}
              eyebrow="Block Guides"
              focus={guide.focus}
              title={guide.title}
              description={<BlockGuideIntroduction slug={guide.slug} />}
            />
          }
        >
          <ContinueBuilding slug={guide.slug} />
          <BlockPageEnding page={guide.slug} />
        </GuideArticle>
      }
    />
  );
}
