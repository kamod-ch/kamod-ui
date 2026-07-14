import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@kamod-ch/ui/command";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";

const commandItemSchema = z.object({
  value: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  group: z.string().max(MAX_LABEL_LENGTH).optional(),
});

function renderCommandBody(
  items: z.infer<typeof commandItemSchema>[],
  placeholder: string | undefined,
  emptyText: string,
  onSelect: (value: string) => void,
) {
  const groups = new Map<string | undefined, z.infer<typeof commandItemSchema>[]>();
  for (const item of items) {
    const key = item.group;
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return (
    <Command autoHighlight>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        {[...groups.entries()].map(([group, groupItems]) => {
          const nodes = groupItems.map((item) => (
            <CommandItem key={item.value} value={item.value} onSelect={() => onSelect(item.value)}>
              {item.label}
            </CommandItem>
          ));
          if (group) {
            return (
              <CommandGroup key={group} heading={group}>
                {nodes}
              </CommandGroup>
            );
          }
          return <CommandGroup key="__ungrouped">{nodes}</CommandGroup>;
        })}
      </CommandList>
    </Command>
  );
}

export const commandComponent = defineComponent({
  name: "Command",
  description:
    "Searchable command list. Args: items [{value, label, group?}] max 50, optional placeholder, emptyText, dialog. onSelect fires host action with event name = item value.",
  props: z.object({
    items: z.array(commandItemSchema).min(1).max(50),
    placeholder: z.string().max(MAX_LABEL_LENGTH).optional(),
    emptyText: z.string().max(MAX_LABEL_LENGTH).default("No results"),
    dialog: z.boolean().default(false),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    const onSelect = (value: string) => {
      triggerAction(value, undefined, { type: value, params: { value } });
    };
    const body = renderCommandBody(props.items, props.placeholder, props.emptyText, onSelect);
    if (props.dialog) {
      return <CommandDialog defaultOpen>{body}</CommandDialog>;
    }
    return body;
  },
});
