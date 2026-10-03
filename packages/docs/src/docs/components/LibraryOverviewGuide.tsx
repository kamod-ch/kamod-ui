import type { ComponentChildren, ComponentProps } from "preact";
import { BlockPageEnding } from "../../blocks/BlockPageEnding";
import { BlockGuideContents } from "../../blocks/detail/BlockGuideContents";
import { DocsShell } from "./DocsShell";
import { LibraryJumpLinks } from "./LibraryJumpLinks";
import { LibraryPageHeader } from "./LibraryPageHeader";

type Props = {
  scope: "forms" | "packages";
  label: string;
  title: string;
  focus: string;
  description: ComponentChildren;
  contents: ComponentProps<typeof BlockGuideContents>["sections"];
  jumps: readonly { id: string; label: string }[];
  children: ComponentChildren;
};

/** Overview articles share the block guides' header, contents, reading column and closing links. */
export function LibraryOverviewGuide({
  scope,
  label,
  title,
  focus,
  description,
  contents,
  jumps,
  children,
}: Props) {
  return (
    <DocsShell
      sidebarScope={scope}
      activeDoc={null}
      activeSection=""
      pageContents={
        <BlockGuideContents
          id={`${scope}-overview-contents`}
          sections={contents}
          pageTitle={title}
        />
      }
      mainContent={
        <article
          class={`block-guide library-directory library-overview-guide docs-${scope}-overview`}
          id="top"
        >
          <LibraryPageHeader
            parent={{ label: "Home", href: "/" }}
            label={label}
            eyebrow={`${label} library`}
            focus={focus}
            title={title}
            description={description}
          >
            <LibraryJumpLinks class="block-guide-switcher" label="Directory sections">
              {jumps.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </LibraryJumpLinks>
          </LibraryPageHeader>
          <BlockGuideContents
            id={`${scope}-overview-mobile-contents`}
            sections={contents}
            pageTitle={title}
            mobile
          />
          <div class="block-guide-documentation">
            <div class="blocks-doc-body">
              {children}
              <BlockPageEnding page={scope} />
            </div>
          </div>
        </article>
      }
    />
  );
}
