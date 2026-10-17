import { ApiBookIcon } from "@kamod-ch/icons/tabler/outline";
import type { ComponentChildren } from "preact";
import { linkTitleChildren } from "../../link-title";

/** One quiet icon-and-label treatment above every documentation page title. */
export function PageEyebrow({ children }: { children: ComponentChildren }) {
  return (
    <p class="block-guide-eyebrow">
      <span class="block-guide-eyebrow-label">
        <ApiBookIcon size={14} aria-hidden="true" />
        <span>{linkTitleChildren(children)}</span>
      </span>
    </p>
  );
}
