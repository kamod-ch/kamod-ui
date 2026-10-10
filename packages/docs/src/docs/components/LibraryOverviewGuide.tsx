import type { ComponentChildren, ComponentProps } from "preact";
import { withBasePath } from "../../base-path";
import { BlockPageEnding } from "../../blocks/BlockPageEnding";
import { BlockGuideContents } from "../../blocks/detail/BlockGuideContents";
import { DocsShell } from "./DocsShell";
import { LibraryPageHeader } from "./LibraryPageHeader";

type Props = {
  scope: "forms" | "packages";
  label: string;
  title: string;
  focus: string;
  description: ComponentChildren;
  contents: ComponentProps<typeof BlockGuideContents>["sections"];
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
            description={
              <>
                {description}
                <p>
                  New to the library? The{" "}
                  <a href={withBasePath(`/docs/getting-started#${scope}`)}>Getting Started Guide</a>{" "}
                  connects {label.toLowerCase()} to the shared setup and your first working screen.
                  For stylesheet setup, see the{" "}
                  <a href={withBasePath("/docs/theming/css-setup")}>CSS Guide</a>.
                </p>
              </>
            }
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
