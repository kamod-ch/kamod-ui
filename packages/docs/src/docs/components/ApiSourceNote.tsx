import { BracesIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { BrandLink } from "./brand/BrandText";
import { DocsCallout } from "./DocsCallout";

/** Shared source guidance for component, form and block API references. */
export function ApiSourceNote({ children }: { children: ComponentChildren }) {
  return (
    <DocsCallout
      class="blocks-api-source-note"
      title="Your API, from source"
      eyebrow="API reference"
      icon={<BracesIcon />}
      meta={<BrandLink>TypeScript</BrandLink>}
    >
      <p>{children}</p>
    </DocsCallout>
  );
}
