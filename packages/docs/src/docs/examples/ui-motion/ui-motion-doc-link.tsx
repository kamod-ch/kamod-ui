import { withBasePath } from "../../../base-path";

type UiMotionDocLinkProps = {
  /** ui-motion section anchor, e.g. `alert-dialog` */
  section?: string;
};

/** Short optional-add-on link to the central UI Motion docs page. */
export function UiMotionDocLink({ section }: UiMotionDocLinkProps) {
  const href = withBasePath(
    section ? `/docs/ui-motion/${section}` : "/docs/ui-motion/installation",
  );

  return (
    <p class="docs-copy docs-ui-motion-link">
      Exit animations are optional — <a href={href}>see UI Motion</a> to add @kamod-ch/ui-motion
      without changing @kamod-ch/ui.
    </p>
  );
}
