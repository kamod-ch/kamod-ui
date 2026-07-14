import { Kbd, KbdGroup } from "@kamod-ch/ui/kbd";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const kbdComponent = defineComponent({
  name: "Kbd",
  description:
    "Keyboard shortcut display. Args: keys string[] max 6 (each max 20 chars), optional size sm|md.",
  props: z.object({
    keys: z.array(z.string().min(1).max(20)).min(1).max(6),
    size: z.enum(["sm", "md"]).default("md"),
  }),
  component: ({ props }) => (
    <KbdGroup>
      {props.keys.map((key) => (
        <Kbd key={key} size={props.size}>
          {key}
        </Kbd>
      ))}
    </KbdGroup>
  ),
});
