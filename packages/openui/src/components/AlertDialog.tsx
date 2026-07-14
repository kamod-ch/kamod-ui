import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@kamod-ch/ui/alert-dialog";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";
import { type KamodOpenUIAction, optionalActionSchema } from "../security/action";

function fireAction(
  triggerAction: ReturnType<typeof useTriggerAction>,
  label: string,
  action: KamodOpenUIAction | undefined,
) {
  if (!action) {
    triggerAction(label);
    return;
  }
  if (action.type === "navigate") {
    triggerAction(label, undefined, {
      type: "open_url",
      params: { url: action.target },
    });
    return;
  }
  if (action.type === "submit") {
    triggerAction(label, action.name, {
      type: "submit",
      params: { name: action.name },
    });
    return;
  }
  triggerAction(label, undefined, {
    type: action.name,
    params:
      action.payload && typeof action.payload === "object"
        ? (action.payload as Record<string, unknown>)
        : {},
  });
}

export const alertDialogComponent = defineComponent({
  name: "AlertDialog",
  description:
    "Confirmation dialog. Args: triggerLabel, title, confirmLabel, optional description/cancelLabel/action. Confirm fires the declarative action.",
  props: z.object({
    triggerLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    confirmLabel: z.string().min(1).max(MAX_LABEL_LENGTH),
    cancelLabel: z.string().min(1).max(MAX_LABEL_LENGTH).default("Cancel"),
    action: optionalActionSchema,
    defaultOpen: z.boolean().default(false),
    size: z.enum(["default", "sm"]).default("default"),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <AlertDialog defaultOpen={props.defaultOpen}>
        <AlertDialogTrigger>{props.triggerLabel}</AlertDialogTrigger>
        <AlertDialogContent size={props.size}>
          <AlertDialogHeader>
            <AlertDialogTitle>{props.title}</AlertDialogTitle>
            {props.description ? (
              <AlertDialogDescription>{props.description}</AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{props.cancelLabel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => fireAction(triggerAction, props.confirmLabel, props.action)}
            >
              {props.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
});
