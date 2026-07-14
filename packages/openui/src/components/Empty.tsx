import { Button } from "@kamod-ch/ui/button";
import { Empty } from "@kamod-ch/ui/empty";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";
import { optionalActionSchema } from "../security/action";

export const emptyComponent = defineComponent({
  name: "Empty",
  description:
    "Empty-state placeholder. Args: title, optional description and action button (label + action).",
  props: z.object({
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    actionLabel: z.string().min(1).max(MAX_LABEL_LENGTH).optional(),
    action: optionalActionSchema,
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <Empty title={props.title} description={props.description}>
        {props.actionLabel ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            class="mt-2"
            onClick={() => {
              if (!props.action) {
                triggerAction(props.actionLabel!);
                return;
              }
              if (props.action.type === "navigate") {
                triggerAction(props.actionLabel!, undefined, {
                  type: "open_url",
                  params: { url: props.action.target },
                });
                return;
              }
              if (props.action.type === "submit") {
                triggerAction(props.actionLabel!, props.action.name, {
                  type: "submit",
                  params: { name: props.action.name },
                });
                return;
              }
              triggerAction(props.actionLabel!, undefined, {
                type: props.action.name,
                params:
                  props.action.payload && typeof props.action.payload === "object"
                    ? (props.action.payload as Record<string, unknown>)
                    : {},
              });
            }}
          >
            {props.actionLabel}
          </Button>
        ) : null}
      </Empty>
    );
  },
});
