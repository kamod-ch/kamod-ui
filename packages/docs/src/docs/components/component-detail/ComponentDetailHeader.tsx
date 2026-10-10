import { withBasePath } from "../../../base-path";
import type { DocPageModule } from "../../types";
import { BrandText } from "../brand/BrandText";
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
              <BrandText>
                The examples use <PathDisplay path={sourcePath} /> in a <code>Preact</code> project.
                Follow the live result and its source together: compare supported options in the{" "}
                <a href="#api-reference">API Reference</a>, refine presentation with the{" "}
                <a href={withBasePath("/blocks/styles")}>Component Styles Guide</a>, and use{" "}
                <a href={withBasePath("/docs/theming/installation")}>Shared Theme Tokens</a> for
                consistent colors and surfaces.{" "}
                <strong>Preserve Keyboard Behavior and Meaningful Labels</strong> as you replace the
                sample content. See the{" "}
                <a href={withBasePath("/docs/theming/installation")}>Theming Guide</a> for setup and
                customization.
              </BrandText>
            </p>
          </>
        }
      />
    </>
  );
}
