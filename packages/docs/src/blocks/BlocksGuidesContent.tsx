import sources from "virtual:kamod-block-guides";
import { withBasePath } from "../base-path";
import { CodeBlock } from "../docs/components/CodeBlock";
import { DocsShell } from "../docs/components/DocsShell";
import { LibraryJumpLinks } from "../docs/components/LibraryJumpLinks";
import { LibraryPageHeader } from "../docs/components/LibraryPageHeader";
import { BlockHeadingLink } from "./BlockHeadingLink";
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
        <h1>Guide not found</h1>
        <a href={withBasePath("/blocks")}>Browse blocks</a>
      </main>
    );
  return (
    <DocsShell
      sidebarScope="blocks"
      activeDoc={null}
      activeSection=""
      navigationPath={withBasePath(`/blocks/${guide.slug}`)}
      pageContents={<BlockGuideContents id={`${guide.slug}-contents`} sections={guide.contents} />}
      mainContent={
        <article class="block-guide" id="top">
          <LibraryPageHeader
            parent={{ label: "Blocks", href: "/blocks" }}
            label={guide.label}
            eyebrow="Block guides"
            focus={guide.focus}
            title={guide.title}
            description={<BlockGuideIntroduction slug={guide.slug} />}
          >
            <LibraryJumpLinks class="block-guide-switcher" label="Block guides">
              {blockGuides.map((item) => (
                <li key={item.slug}>
                  <a
                    href={withBasePath(`/blocks/${item.slug}`)}
                    aria-current={item.slug === slug ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </LibraryJumpLinks>
          </LibraryPageHeader>
          <BlockGuideContents
            id={`${guide.slug}-mobile-contents`}
            sections={guide.contents}
            mobile
          />
          <div class="block-guide-documentation">
            <div class="blocks-doc-body">
              {guide.sections.map((section) => (
                <section
                  key={section.id}
                  class="blocks-doc-section block-guide-section"
                  aria-labelledby={section.id}
                >
                  <h2 id={section.id} tabIndex={-1}>
                    <BlockHeadingLink id={section.id}>{section.title}</BlockHeadingLink>
                  </h2>
                  {section.parts.map((part, index) =>
                    part.kind === "html" ? (
                      <div
                        key={index}
                        class="block-guide-prose"
                        dangerouslySetInnerHTML={{ __html: part.html }}
                      />
                    ) : part.kind === "heading" ? (
                      <h3 key={part.id} id={part.id} tabIndex={-1}>
                        <BlockHeadingLink id={part.id}>{part.title}</BlockHeadingLink>
                      </h3>
                    ) : (
                      <CodeBlock
                        key={index}
                        code={part.code}
                        language={part.language}
                        filePath={part.filePath}
                      />
                    ),
                  )}
                </section>
              ))}
              <ContinueBuilding slug={guide.slug} />
              <BlockPageEnding page={guide.slug} />
            </div>
          </div>
        </article>
      }
    />
  );
}
