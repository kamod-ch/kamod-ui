import { useAccordionItem } from "@kamod-ch/ui/accordion";
import type { HTMLAttributes } from "preact";
import { MotionDisclosureContent } from "../lib/MotionDisclosureContent.js";

export type MotionAccordionContentProps = HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
};

/**
 * Drop-in replacement for `AccordionContent` using measured height and opacity
 * from `@kamod-ch/motion` instead of CSS height transitions.
 */
export function MotionAccordionContent({
  forceMount = false,
  children,
  class: className,
  ...rest
}: MotionAccordionContentProps) {
  const { isOpen } = useAccordionItem();

  return (
    <MotionDisclosureContent
      open={isOpen}
      forceMount={forceMount}
      outerDataSlot="accordion-content"
      innerDataSlot="accordion-content-inner"
      class={className}
      {...rest}
    >
      {children}
    </MotionDisclosureContent>
  );
}
