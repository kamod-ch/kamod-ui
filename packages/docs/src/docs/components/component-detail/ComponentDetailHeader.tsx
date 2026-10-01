import { ArrowRightIcon, BugIcon, CodeIcon } from "@kamod-ch/icons/lucide";
import { Badge, Button } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../../base-path";
import type { DocPageModule, DocSection } from "../../types";
import { LibraryJumpLinks } from "../LibraryJumpLinks";
import { LibraryPageHeader } from "../LibraryPageHeader";
import { componentGuidance, componentSourceUrl } from "./component-guidance";

const referenceSections = new Set(["installation", "usage", "api-reference", "accessibility"]);
export const componentExamples = (sections: DocSection[]) =>
  sections.filter(({ id }) => !referenceSections.has(id));

export function ComponentDetailHeader({
  doc,
  sections,
  sourcePath,
  markdownAction,
}: {
  doc: DocPageModule;
  sections: DocSection[];
  sourcePath: string;
  markdownAction: ComponentChildren;
}) {
  const guidance = componentGuidance(doc.slug);
  const examples = doc.exampleSectionIds
    ? sections.filter(({ id }) => doc.exampleSectionIds!.includes(id))
    : componentExamples(sections);
  return (
    <>
      <LibraryPageHeader
        special={false}
        parent={
          doc.navGroup === "forms"
            ? { label: "Forms", href: "/docs/forms" }
            : { label: "Components", href: "/docs/components" }
        }
        label={doc.title}
        eyebrow={guidance.family}
        focus="Explore · Adapt · Compose"
        title={doc.title}
        description={
          <>
            <p>
              <strong>{doc.usageLabel}</strong> {guidance.purpose} Explore the live examples,
              inspect their source and choose the composition that fits your interface before
              connecting it to your application's data.
            </p>
            <p>
              The examples use <code>{sourcePath}</code> in a <code>Preact</code> project. Follow
              the live result and its source together: compare supported options in the{" "}
              <a href="#api-reference">API reference</a>, refine presentation with the{" "}
              <a href={withBasePath("/blocks/styles")}>component styles guide</a>, and use{" "}
              <a href={withBasePath("/docs/theming/installation")}>shared theme tokens</a> for
              consistent colors and surfaces.{" "}
              <strong>Preserve keyboard behavior and meaningful labels</strong> as you replace the
              sample content.
            </p>
          </>
        }
      >
        <div class="component-detail-actions">
          <div class="component-detail-actions-primary">
            <Button asChild size="sm" variant="secondary">
              <a href="#installation">
                Installation <ArrowRightIcon size={14} aria-hidden="true" />
              </a>
            </Button>
            {markdownAction}
            <Badge variant="secondary">
              {examples.length} documented {examples.length === 1 ? "pattern" : "patterns"}
            </Badge>
          </div>
          <div class="component-detail-resource-links">
            <Button asChild size="icon" variant="ghost">
              <a
                href={componentSourceUrl(doc.slug, doc.navGroup === "motion")}
                aria-label="Browse component source on GitHub"
                title="Component source"
              >
                <CodeIcon size={16} aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="icon" variant="ghost">
              <a
                href={`https://github.com/kamod-ch/kamod-ui/issues/new?title=${encodeURIComponent(`${doc.title}: `)}`}
                aria-label={`Report an issue with ${doc.title}`}
                title="Report an issue"
              >
                <BugIcon size={16} aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
        <LibraryJumpLinks
          class="block-guide-switcher"
          label={`${doc.title} documentation`}
          reference={{ label: "Theming guide", href: withBasePath("/docs/theming/installation") }}
        >
          <li>
            <a href="#component-preview">Live preview</a>
          </li>
          <li>
            <a href="#usage">Usage</a>
          </li>
          <li>
            <a href="#api-reference">API reference</a>
          </li>
        </LibraryJumpLinks>
      </LibraryPageHeader>
      {examples.length > 0 && (
        <details class="component-example-directory">
          <summary>
            Explore the examples <span>{examples.length} patterns</span>
          </summary>
          <p>
            Choose a pattern to jump to its explanation and implementation. Each live example has
            its own Preview, Code and Reset controls.
          </p>
          <nav aria-label={`${doc.title} examples`}>
            <ul>
              {examples.map((example, index) => (
                <li key={example.id}>
                  <a href={`#${example.id}`}>
                    <span class="component-example-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{example.title}</span>
                    <ArrowRightIcon size={13} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      )}
      <div id="component-preview" class="component-preview-intro" tabIndex={-1}>
        <span>Interactive preview</span>
        <span>Try it before you copy it</span>
      </div>
    </>
  );
}
