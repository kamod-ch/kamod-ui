import { Alert, AlertDescription, AlertTitle } from "@kamod-ch/ui/alert";
import { Button } from "@kamod-ch/ui/button";
import { sonner } from "@kamod-ch/ui/sonner";
import { defineComponent } from "@openuidev/react-lang";
import { useEffect, useState } from "preact/hooks";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";

export const sonnerComponent = defineComponent({
  name: "Sonner",
  description:
    "Lightweight inline notification. Args: title, optional description. Renders a dismissible banner; also attempts sonner() when safe. Prefer for non-blocking feedback.",
  props: z.object({
    title: z.string().min(1).max(MAX_LABEL_LENGTH),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  }),
  component: ({ props }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      try {
        sonner({ title: props.title, description: props.description });
      } catch {
        // Store API is safe without a mounted Sonner host; inline UI is the fallback.
      }
    }, []);

    if (!visible) return null;

    return (
      <Alert variant="default" data-slot="openui-sonner">
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
