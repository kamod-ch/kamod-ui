import { withBasePath } from "../../../base-path";
import type { DocPageModule } from "../../types";
import { LibraryJumpLinks } from "../LibraryJumpLinks";
import { LibraryPageHeader } from "../LibraryPageHeader";
import { PathDisplay } from "../PathDisplay";
import { componentGuidance } from "./component-guidance";

export function ComponentDetailHeader({
  doc,
  sourcePath,
}: {
  doc: DocPageModule;
  sourcePath: string;
}) {
  const guidance = componentGuidance(doc.slug);
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
        title={doc.headline ?? doc.title}
        description={
          <>
            <p>
              <strong>{doc.usageLabel}</strong> {guidance.purpose} Explore the live examples,
              inspect their source and choose the composition that fits your interface before
              connecting it to your application's data.
            </p>
            <p>
              The examples use <PathDisplay path={sourcePath} /> in a <code>Preact</code> project.
              Follow the live result and its source together: compare supported options in the{" "}
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
    </>
  );
}
