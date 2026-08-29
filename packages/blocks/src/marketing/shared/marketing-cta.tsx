import { Button } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import type { MarketingAction } from "./types";

export const MarketingCta = ({
  action,
  class: className,
  children,
}: {
  action: MarketingAction;
  class?: string;
  children?: ComponentChildren;
}) => {
  const content = children ?? action.label;
  if (action.href) {
    return (
      <Button
        class={className}
        href={action.href}
        variant={action.variant ?? "default"}
        onClick={action.onClick}
      >
        {content}
      </Button>
    );
  }
  return (
    <Button
      class={className}
      type="button"
      variant={action.variant ?? "default"}
      onClick={action.onClick}
    >
      {content}
    </Button>
  );
};
