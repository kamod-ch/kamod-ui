import { LocaleSegmentGroup } from "@kamod-ch/ui/locale-segment-group";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { useState } from "preact/hooks";
import { z } from "zod";
import { MAX_LABEL_LENGTH, MAX_NAME_LENGTH } from "../constants";

const localeOptionSchema = z.object({
  value: z.string().min(1).max(MAX_NAME_LENGTH),
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
});

export const localeSegmentGroupComponent = defineComponent({
  name: "LocaleSegmentGroup",
  description:
    "Locale switcher. Args: value (required), optional options [{value,label}]. Change fires host action locale_change with payload {value}. Controlled locally from initial value; host owns real locale.",
  props: z.object({
    value: z.string().min(1).max(MAX_NAME_LENGTH),
    options: z.array(localeOptionSchema).min(1).max(12).optional(),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    const [value, setValue] = useState(props.value);
    return (
      <LocaleSegmentGroup
        value={value}
        options={props.options}
        onValueChange={(next) => {
          setValue(next);
          triggerAction("locale_change", undefined, {
            type: "locale_change",
            params: { value: next },
          });
        }}
      />
    );
  },
});
