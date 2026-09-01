import { useCollapsible } from "@kamod-ch/ui/collapsible";
import type { JSX } from "preact";
import { MotionDisclosureContent } from "../lib/MotionDisclosureContent.js";

export type MotionCollapsibleContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
};

/** Drop-in replacement for `CollapsibleContent` with measured height and opacity motion. */
export function MotionCollapsibleContent({
  forceMount = false,
  children,
  class: className,
  ...rest
}: MotionCollapsibleContentProps) {
  const { open } = useCollapsible();

  return (
    <MotionDisclosureContent
      open={open}
      forceMount={forceMount}
      outerDataSlot="collapsible-content"
      innerDataSlot="collapsible-content-inner"
      class={className}
      {...rest}
    >
      {children}
    </MotionDisclosureContent>
  );
}
