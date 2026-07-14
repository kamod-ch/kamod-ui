import { Alert, AlertDescription, AlertTitle } from "@kamod-ch/ui/alert";
import { Button } from "@kamod-ch/ui/button";
import { useToast } from "@kamod-ch/ui/toast";
import { defineComponent } from "@openuidev/react-lang";
import { useEffect, useState } from "preact/hooks";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";

const toastVariantSchema = z.enum([
  "default",
  "success",
  "info",
  "warning",
  "error",
  "destructive",
]);

const variantToAlert: Record<
  z.infer<typeof toastVariantSchema>,
  "default" | "info" | "success" | "warning" | "error"
> = {
  default: "default",
  success: "success",
  info: "info",
  warning: "warning",
  error: "error",
  destructive: "error",
};

export const toastComponent = defineComponent({
  name: "Toast",
  description:
    "Declarative toast-style feedback banner. Args: title, optional description and variant. Renders inline (SSR-safe); also attempts host toaster when available. Host may mirror via onAction.",
  props: z.object({
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    variant: toastVariantSchema.default("default"),
  }),
  component: ({ props }) => {
    const [visible, setVisible] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
      try {
        toast({
          title: props.title,
          description: props.description,
          variant: props.variant === "destructive" ? "destructive" : props.variant,
        });
      } catch {
        // useToast is store-based and should not throw; keep inline banner either way.
      }
    }, []);

    if (!visible) return null;

    return (
      <Alert variant={variantToAlert[props.variant]} data-slot="openui-toast">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <AlertTitle>{props.title}</AlertTitle>
            {props.description ? <AlertDescription>{props.description}</AlertDescription> : null}
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setVisible(false)}>
            Dismiss
          </Button>
        </div>
      </Alert>
    );
  },
});
