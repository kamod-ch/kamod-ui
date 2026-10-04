import type { ComponentChildren } from "preact";
import type { SidebarBlockId } from "../../../../blocks/src/sidebar/sidebar-data";
import { withBasePath } from "../../base-path";
import { PathDisplay } from "../../docs/components/PathDisplay";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { type SidebarAboutContent, sidebarAboutContent } from "./sidebar-about-content";
import type { VariantGuide } from "./VariantDocumentation";

type AboutProps = { guide: VariantGuide; content: SidebarAboutContent };

function AboutSection({
  guide,
  section,
  children,
}: {
  guide: VariantGuide;
  section: string;
  children: ComponentChildren;
}) {
  const id = guide.anchor(section);
  return (
    <section aria-labelledby={id}>
      <BlockGuideHeading id={id} />
      {children}
    </section>
  );
}

function SidebarSuitability({ guide, content }: AboutProps) {
  return (
    <>
      <AboutSection guide={guide} section="suitability">
        <dl class="blocks-doc-callouts">
          <div>
            <dt>Where this layout adds value</dt>
            <dd>{content.value}</dd>
          </div>
          <div>
            <dt>The tradeoff to consider</dt>
            <dd>{content.tradeoff}</dd>
          </div>
        </dl>
      </AboutSection>
      <AboutSection guide={guide} section="alternatives">
        <p>
          Choose by the way people move through your app, not only by the preview’s appearance.
          These nearby variants change a specific part of that experience; they are alternatives,
          not files you need to install alongside this block.
        </p>
        <dl class="blocks-doc-callouts">
          {content.alternatives.map(({ id, reason }) => (
            <div key={id}>
              <dt>
                <a href={withBasePath(`/blocks/sidebar/${id}#${id}-about`)}>
                  Sidebar {Number(id.slice(-2))} <span aria-hidden="true">→</span>
                </a>
              </dt>
              <dd>{reason}</dd>
            </div>
          ))}
        </dl>
      </AboutSection>
    </>
  );
}

function SidebarComposition({ guide, content }: AboutProps) {
  const { block, anchor, component } = guide;
  return (
    <>
      <AboutSection guide={guide} section="structure">
        <p>{content.composition}</p>
        <p>
          In the downloaded folder, <code>index.ts</code> exports <code>{component}</code>. Its{" "}
          <ShowcaseCodeLink blockId={block.id} file={`${block.id}.tsx`}>
            <code>{block.id}.tsx</code>
          </ShowcaseCodeLink>{" "}
          owns the arrangement. Any included helpers live in <PathDisplay path={"components/"} />,
          fixtures in <PathDisplay path={"data/"} />, and any included brand artwork in{" "}
          <PathDisplay path={"branding/"} />. These paths describe your installation folder, which
          is generated from the actual implementation with its relative imports rewritten together.
        </p>
        <p>
          <strong>Edit the composition where it is assembled.</strong> The exported wrapper does not
          accept a navigation configuration or forward <code>children</code>. Its inner components
          still have their own inputs. Replace data at their call sites and insert your content in
          the existing page area; the <a href={`#${anchor("usage")}`}>Usage guide</a> shows the
          appropriate insertion point for this variant. You can introduce a typed wrapper API later
          if multiple routes need to reuse your adapted layout.
        </p>
      </AboutSection>
      <AboutSection guide={guide} section="interaction">
        <p>{content.interaction}</p>
        <dl class="blocks-doc-callouts">
          <div>
            <dt>Presentation state belongs to the layout</dt>
            <dd>
              An open menu, expanded branch or selected demo value describes the interface at that
              moment. It does not automatically load data, authorize access or change the URL.
              Preserve useful local UI state while letting your application own the current page and
              real records.
            </dd>
          </div>
          <div>
            <dt>Route state belongs to your application</dt>
            <dd>
              Derive active destinations, page content and breadcrumbs from one route or selection
              model. An <code>isActive</code> flag supplies styling; it is not a router. Where a
              helper initializes a disclosure with <code>defaultOpen</code>, decide whether later
              route changes should also update that disclosure.
            </dd>
          </div>
        </dl>
        <p class="blocks-doc-note">
          Inspect <a href={`#${anchor("prop-reference")}`}>Local props and data</a> before wiring a
          callback. Only the inputs documented for the copied helper are available; introducing
          another callback also requires updating its implementation.
        </p>
      </AboutSection>
    </>
  );
}

function SidebarAdaptation({ guide, content }: AboutProps) {
  const { anchor, block, sidebar } = guide;
  return (
    <>
      <AboutSection guide={guide} section="responsive">
        <p>{sidebar?.mobile}</p>
        <p>
          {block.id === "sidebar-13" ? (
            <>
              This dialog composition uses a non-collapsible sidebar. The small-screen behavior
              comes from its visibility classes, not a separate navigation sheet. Keep the dialog
              opener mounted and the content scrollable while adding an alternative settings
              selector for narrower screens.
            </>
          ) : (
            <>
              Below <code>768px</code>, collapsible core sidebars use the mobile sheet. Desktop{" "}
              <code>open</code> and mobile <code>openMobile</code> are separate states in{" "}
              <code>SidebarProvider</code>; restoring a desktop preference does not open the sheet.
              Static regions using <code>collapsible="none"</code> follow their own layout and
              visibility classes instead.
            </>
          )}
        </p>
        <p>
          Test the space left for your actual content, not just the empty panels. Long navigation
          labels, a wide data table and a short viewport can expose different constraints. Let text
          wrap where it carries meaning, keep any necessary scrolling local to its content, and
          offer another way to reach essential controls when a secondary pane is hidden.
        </p>
      </AboutSection>
      <AboutSection guide={guide} section="accessibility">
        <p>{content.accessibility}</p>
        <dl class="blocks-doc-callouts">
          <div>
            <dt>Current location and meaningful names</dt>
            <dd>
              Use real links for destinations and buttons for actions. Set{" "}
              <code>aria-current="page"</code> on the current destination; visible selection alone
              is insufficient. Give icon-only controls meaningful names, and make breadcrumbs agree
              with the page being shown rather than leaving their sample labels unchanged.
            </dd>
          </div>
          <div>
            <dt>Keyboard, focus and content landmarks</dt>
            <dd>
              Retain core disclosure, menu and overlay behavior. Check Tab, Shift+Tab, Enter, Space
              and Escape where applicable, including focus return after dismissal. The existing page
              area already provides a main landmark; insert content within it rather than adding
              nested <code>main</code> elements. Give distinct navigation regions meaningful labels
              when your adaptation contains more than one. The core provider also registers{" "}
              <code>Ctrl/Cmd+B</code> to toggle navigation; check this shortcut against your
              application’s editor or other global shortcuts, and avoid mounting duplicate providers
              for the same layout.
            </dd>
          </div>
        </dl>
        <p class="blocks-doc-note">
          Validate your finished integration at <code>320px</code>, <code>768px</code>,{" "}
          <code>1024px</code> and <code>1440px</code>, with keyboard-only input, 200% zoom, both
          color modes and long real content. Check short screens and the on-screen keyboard as well.
          Reusing the primitives helps preserve behavior, but cannot guarantee accessibility after
          your content or structure changes.
        </p>
      </AboutSection>
      <AboutSection guide={guide} section="production">
        <p>{content.adaptation}</p>
        <ol class="blocks-doc-integration-notes blocks-sidebar-about-checklist">
          <li>
            <strong>Replace demo navigation.</strong> Supply real URLs: the shared{" "}
            <code>stopNavigation</code> helper only cancels links whose destination is{" "}
            <code>#</code>. Add your router’s link handling if needed. Connect actions to your
            services and show useful pending, empty or failure states where they apply. Hiding a
            link does not replace authorization in your application.
          </li>
          <li>
            <strong>Make state ownership deliberate.</strong> Keep the layout mounted if its UI
            state should survive route changes.{" "}
            {block.id === "sidebar-13" ? (
              <>
                Keep settings values in application state if they must survive closing the dialog.
                Define whether reopening restores a draft or reloads saved values; an open dialog is
                not a persistence mechanism.
              </>
            ) : (
              <>
                If desktop collapse must survive a reload, restore an initial or controlled value
                through <code>SidebarProvider</code>. Its cookie write alone does not read and
                restore that preference for your app.
              </>
            )}
          </li>
          <li>
            <strong>Replace placeholders before tuning the layout.</strong> Test your real pages and
            theme first, then adjust widths, spacing and overflow. Use semantic tokens so borders,
            backgrounds and interactive states continue to follow light and dark mode.
          </li>
        </ol>
        <p>
          Start with <a href={`#${anchor("connect-app")}`}>Connect your application</a> for the
          integration point, then use the{" "}
          <a href={`#${anchor("data-types")}`}>data type reference</a> to shape your inputs. Keep
          the copied folder together while changing its internals; there is no dependency on another
          sidebar variant’s installation.
        </p>
      </AboutSection>
    </>
  );
}

/** A shared reading structure with source-specific guidance for every sidebar variant. */
export function SidebarAbout({ guide }: { guide: VariantGuide }) {
  const content = sidebarAboutContent[guide.block.id as SidebarBlockId];
  return (
    <BlockDocSection
      id={guide.anchor("about")}
      className="blocks-doc-explanation blocks-sidebar-about"
      introduction={<p>{content.summary}</p>}
    >
      <SidebarSuitability guide={guide} content={content} />
      <SidebarComposition guide={guide} content={content} />
      <SidebarAdaptation guide={guide} content={content} />
    </BlockDocSection>
  );
}
