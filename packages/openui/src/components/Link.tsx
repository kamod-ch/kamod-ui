import { Button } from "@kamod-ch/ui/button";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH } from "../constants";
import { validateNavigationTarget } from "../security/navigation";

export const linkComponent = defineComponent({
  name: "Link",
  description:
    "Navigational link. Prefer relative internal paths. External URLs may be blocked by the host.",
  props: z.object({
    label: z.string().min(1).max(MAX_LABEL_LENGTH),
    href: z.string().min(1).max(200),
  }),
  component: ({ props }) => {
    const decision = validateNavigationTarget(props.href);
    if (!decision.allowed) {
      return (
        <span class="text-muted-foreground text-sm" title={decision.reason}>
          {props.label}
        </span>
      );
    }
    return (
      <Button variant="link" href={decision.href}>
        {props.label}
      </Button>
    );
  },
});
