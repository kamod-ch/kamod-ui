import { withBasePath } from "../../../base-path";
import type { DocPageModule } from "../../types";
import { LibraryPageHeader } from "../LibraryPageHeader";
import { PathDisplay } from "../PathDisplay";
import {
  componentDesignReference,
  componentGuidance,
  componentSourceUrl,
} from "./component-guidance";

export function ComponentDetailHeader({
  doc,
  sourcePath,
}: {
  doc: DocPageModule;
  sourcePath: string;
}) {
  const guidance = componentGuidance(doc.slug);
  const source = componentSourceUrl(doc.slug, doc.navGroup === "motion");
  const reference = componentDesignReference(doc.slug);
  return (
    <LibraryPageHeader
      parent={
        doc.navGroup === "forms"
          ? { label: "Forms", href: "/docs/forms" }
          : { label: "Components", href: "/docs/components" }
      }
      label={doc.title}
      eyebrow={guidance.family}
      title={doc.headline ?? doc.title}
      description={
        <p>
          <strong>{doc.usageLabel}</strong> {guidance.purpose} Import it from{" "}
          <PathDisplay path={sourcePath} />.
        </p>
      }
    >
      <p class="docs-copy">
        <a href={source}>Source</a>
        {reference ? (
          <>
            {" · "}
            <a href={reference} target="_blank" rel="noopener noreferrer">
              Design reference
            </a>
          </>
        ) : null}
        {" · "}
        <a href="#api-reference">API reference</a>
        {" · "}
        <a href={withBasePath("/docs/theming/installation")}>Theming</a>
        {" · "}
        <a href={withBasePath("/blocks/styles")}>Styles</a>
      </p>
    </LibraryPageHeader>
  );
}
