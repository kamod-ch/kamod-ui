import { AlertCallout, type AlertCalloutProps } from "@kamod-ch/ui";
import { cn } from "@kamod-ch/ui/utils";
import { BrandText } from "./brand/BrandText";

/** The core callout with the documentation's inline references and prose rhythm. */
export function DocsCallout({ children, class: className, ...props }: AlertCalloutProps) {
  return (
    <AlertCallout class={cn("docs-callout", className)} {...props}>
      <BrandText>{children}</BrandText>
    </AlertCallout>
  );
}
