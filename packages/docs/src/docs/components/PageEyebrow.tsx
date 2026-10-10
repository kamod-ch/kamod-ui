import { BookOpenIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { linkTitleChildren } from "../../link-title";

/** One quiet icon-and-label treatment above every documentation page title. */
export function PageEyebrow({
  children,
  icon = <BookOpenIcon size={16} aria-hidden="true" />,
  focus,
}: {
  children: ComponentChildren;
  icon?: ComponentChildren;
  focus?: ComponentChildren;
}) {
  return (
    <p class="block-guide-eyebrow">
      <span class="block-guide-eyebrow-label">
        {icon}
        <span>{linkTitleChildren(children)}</span>
      </span>
      {focus && <span class="block-guide-eyebrow-focus">{focus}</span>}
    </p>
  );
}
