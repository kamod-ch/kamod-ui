import { ArrowUpRightIcon, CodeIcon, PaletteIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { repositoryUrl } from "../../../blocks/block-links";
import type { DocPageModule } from "../../types";
import { DocsCallout } from "../DocsCallout";
import { InlineCodeLink } from "../InlineCodeLink";
import { PathDisplay } from "../PathDisplay";
import { CnReferences } from "./CnReferences";
import { ComponentDocSection } from "./ComponentDocSection";
import { componentDesignReference, componentSourceUrl } from "./component-guidance";
import { FormischReferences } from "./FormischReferences";
import { ReferenceAdaptation } from "./ReferenceAdaptation";
import { ReferenceReadingGuide } from "./ReferenceReadingGuide";

/** A consistent reading order for implementation sources and independent design references. */
function ReferencePanel({
  id,
  label,
  title,
  children,
  footer,
  action,
}: {
  id: string;
  label: string;
  title: string;
  children: ComponentChildren;
  footer: ComponentChildren;
  action: ComponentChildren;
}) {
  return (
    <DocsCallout
      headingId={id}
      class="component-reference-panel"
      title={
        <span class="component-reference-heading">
          <BlockHeadingLink id={id}>{title}</BlockHeadingLink>
          <span class="component-reference-category">
            <span class="component-reference-dot" aria-hidden="true">
              ·
            </span>
            {label}
          </span>
        </span>
      }
      meta={action}
      icon={id === "component-source" ? <CodeIcon /> : <PaletteIcon />}
      footer={footer}
    >
      {children}
    </DocsCallout>
  );
}

/** Separate source ownership from visual inspiration, then connect both to the local guides. */
export function ComponentReferences({ doc }: { doc: DocPageModule }) {
  if (doc.slug === "cn") return <CnReferences />;
  if (doc.slug === "formisch") return <FormischReferences />;
  const source = componentSourceUrl(doc.slug, doc.navGroup === "motion");
  const reference = componentDesignReference(doc.slug);
  const sourcePath = source.split("/main/")[1];
  return (
    <ComponentDocSection
      section={{
        id: "component-references",
        title: "Sources & Design References",
        text: `**Read the Code, Understand the Choices, Then Make It Yours.** Follow ${doc.title} from its [working examples](#component-preview) to its [props and data](#api-reference), then compare the visual references below. The source explains what the component does; a design reference helps you decide how it should feel in your screen.`,
      }}
    >
      <div class="component-references">
        <ReferenceReadingGuide stage="start" />
        <ReferencePanel
          id="component-source"
          label="Implementation · Preact"
          title="Kamod UI Implementation"
          action={
            <Button
              class="docs-icon-button component-reference-open"
              variant="ghost"
              size="sm"
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${doc.title} source on GitHub`}
            >
              <BrandGithubIcon size={14} aria-hidden="true" /> Source
            </Button>
          }
          footer={
            <nav
              class="component-reference-actions"
              aria-label={`${doc.title} implementation resources`}
            >
              <a
                href={`${repositoryUrl}/blob/main/LICENSE.md`}
                target="_blank"
                rel="noopener noreferrer"
              >
                License <ArrowUpRightIcon size={13} aria-hidden="true" />
              </a>
              <a href="#component-preview">
                Try the Examples <ArrowUpRightIcon size={13} aria-hidden="true" />
              </a>
            </nav>
          }
        >
          <p>
            <strong>Start with the Implementation You Are Actually Using.</strong> The{" "}
            <InlineCodeLink href={source}>{`${doc.title} Source`}</InlineCodeLink> is the place to
            follow exported components, default values and event handling. Keep the{" "}
            <InlineCodeLink href="#api-reference">Props and Data</InlineCodeLink> beside it: a
            preview shows one composition, while the reference explains which parts you can change.
          </p>
          <p class="component-reference-location">
            <span>Source location</span>
            <a href={source} class="docs-inline-code-link inline-flex min-w-0 max-w-full">
              <code class="docs-reference-code min-w-0">
                <CodeIcon class="docs-reference-icon shrink-0" size="1em" aria-hidden="true" />
                <PathDisplay as="span" link={false} path={sourcePath} />
                <ArrowUpRightIcon
                  class="docs-reference-arrow shrink-0"
                  size="1em"
                  aria-hidden="true"
                />
              </code>
            </a>
          </p>
          <p>
            <strong>Match the Version Before Comparing the Details.</strong> The repository’s{" "}
            <code>main</code> branch can be newer than your installed package. Check the version in{" "}
            <code>package.json</code> and the version resolved by your lockfile, then follow{" "}
            <InlineCodeLink href="/docs/packages#package-installation">
              Versions and Peer Dependencies
            </InlineCodeLink>
            . If you copied source into your project, compare that local file too; updating a
            package does not update your copied implementation.
          </p>
          <p>
            <strong>Follow the Import All the Way In.</strong> Use this page’s{" "}
            <InlineCodeLink href="#installation">Installation Guide</InlineCodeLink> to choose the
            supported entry. An example path such as <code>@/components/kamod-ui/…</code> describes
            files in an application; it is not automatically an installed package export. For
            package usage, check the exports of{" "}
            <InlineCodeLink href={`${repositoryUrl}/blob/main/packages/core/package.json`}>
              @kamod-ch/ui
            </InlineCodeLink>{" "}
            before changing the import. For motion components, check{" "}
            <InlineCodeLink href={`${repositoryUrl}/blob/main/packages/ui-motion/package.json`}>
              @kamod-ch/ui-motion
            </InlineCodeLink>{" "}
            instead.
          </p>
          <p>
            <strong>Read Types as a Map.</strong> Follow required fields and callback signatures in{" "}
            <InlineCodeLink href="#component-data-types">Data Types</InlineCodeLink>, then use your
            editor’s “Go to Definition” on the installed export to confirm the contract. The{" "}
            <InlineCodeLink href="https://preactjs.com/guide/v11/typescript/">
              Preact TypeScript Guide
            </InlineCodeLink>{" "}
            explains component, children and event types. Retain the applicable{" "}
            <InlineCodeLink href={`${repositoryUrl}/blob/main/LICENSE.md`}>
              Repository License
            </InlineCodeLink>{" "}
            when adapting source.
          </p>
        </ReferencePanel>

        <ReferenceReadingGuide stage="design" />
        <ReferencePanel
          id="component-design-reference"
          label={
            reference
              ? "Visual reference · Independently maintained"
              : "Design direction · Shared foundations"
          }
          title={
            reference ? "Explore the visual possibilities" : "Build on a shared design language"
          }
          action={
            <Button
              class="docs-icon-button component-reference-open"
              variant="ghost"
              size="sm"
              href={reference ?? withBasePath("/blocks/styles")}
              {...(reference ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={`Explore ${doc.title} design references`}
            >
              <PaletteIcon size={14} aria-hidden="true" /> Ideas
            </Button>
          }
          footer={
            <nav class="component-reference-actions" aria-label={`${doc.title} design resources`}>
              <a href="#integration-review">
                Check the Interaction <ArrowUpRightIcon size={13} aria-hidden="true" />
              </a>
              <a href={withBasePath("/docs/theming/token-overrides")}>
                Make It Yours <ArrowUpRightIcon size={13} aria-hidden="true" />
              </a>
            </nav>
          }
        >
          {reference ? (
            <>
              <p>
                <strong>Borrow a Useful Idea, Then Test It with Your Content.</strong> Browse the{" "}
                <InlineCodeLink href={reference}>{`${doc.title} on Shadcnblocks`}</InlineCodeLink>{" "}
                to compare hierarchy, density and composition. Pick one detail to investigate:
                perhaps the space around a label, the weight of a heading or the position of an
                action. Bring that decision back to the{" "}
                <InlineCodeLink href="#component-preview">Live Preview</InlineCodeLink> before
                changing several things at once.
              </p>
              <p>
                <strong>A Screenshot Is Only One State.</strong> Try the same composition with your
                longest label, translated content and a narrow viewport. For interactive components,
                also check focus, unavailable actions and any open or selected states listed in the{" "}
                <InlineCodeLink href="#api-reference">API Reference</InlineCodeLink>. Use the{" "}
                <InlineCodeLink href="#accessibility">Accessibility Guide</InlineCodeLink> to
                evaluate the interaction as well as the appearance.
              </p>
              <p>
                <strong>Reference Credit: Shadcnblocks.</strong> The linked collection is
                independently maintained and provides visual inspiration; it does not establish
                authorship of Kamod’s implementation. React examples may use different imports,
                primitives and callback contracts. Keep the Kamod composition from this page and
                consult{" "}
                <InlineCodeLink href="https://preactjs.com/guide/v11/typescript/">
                  Preact’s TypeScript Guide
                </InlineCodeLink>{" "}
                when adapting types. Check the original example’s license before reusing its code or
                assets.
              </p>
            </>
          ) : (
            <>
              {doc.slug === "type-definition" && (
                <p>
                  <strong>Developed for Kamod’s API Documentation.</strong> This card extracts the
                  shared reference presentation used by the{" "}
                  <a
                    href={withBasePath(
                      "/blocks/application-shell/application-shell-1#application-shell-type-ApplicationShellBrand",
                    )}
                  >
                    Application Shell Guide
                  </a>
                  . It composes{" "}
                  <InlineCodeLink href="/docs/collapsible/installation">Collapsible</InlineCodeLink>{" "}
                  with named summary slots; source parsing and permalink behavior stay in the
                  documentation layer.
                </p>
              )}
              <p>
                Start with the{" "}
                <InlineCodeLink href="/blocks/styles">Component Styles Guide</InlineCodeLink> to
                choose a clear hierarchy and consistent spacing. Keep the same treatment for similar
                actions, and let <strong>Content and Behavior</strong> determine which details
                deserve emphasis.
              </p>
              <p>
                <strong>Let the Local Examples Set the Baseline.</strong> This page does not
                identify a matching external design collection. Use the local examples as your
                starting point and the{" "}
                <InlineCodeLink href="/docs/components">Component Library</InlineCodeLink> to find
                neighboring patterns. Shared <code>bg-card</code>, <code>text-card-foreground</code>{" "}
                and <code>border-border</code> utilities help those pieces feel related.
              </p>
            </>
          )}
          <p>
            <strong>Translate the Colors into Shared Roles.</strong> Pair <code>bg-card</code> with{" "}
            <code>text-card-foreground</code>, and use <code>border-border</code> for the boundary.
            Start with{" "}
            <InlineCodeLink href="/docs/theming/token-overrides">Theme Tokens</InlineCodeLink> for
            shared changes, or{" "}
            <InlineCodeLink href="/blocks/styles">Component Styles</InlineCodeLink> for one
            composition. The official{" "}
            <InlineCodeLink href="https://tailwindcss.com/docs/theme">
              Tailwind CSS Theme Guide
            </InlineCodeLink>{" "}
            explains how theme variables relate to utilities. Keep the colors connected when
            checking light and dark schemes.
          </p>
        </ReferencePanel>

        <ReferenceReadingGuide stage="adapt" />
        <ReferenceAdaptation title={doc.title} />
      </div>
    </ComponentDocSection>
  );
}
