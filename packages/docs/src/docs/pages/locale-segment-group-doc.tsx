import { LocaleSegmentGroup } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const BasicLocalePreview = () => {
  const [value, setValue] = useState("de");
  return (
    <div class="space-y-2">
      <LocaleSegmentGroup
        value={value}
        onValueChange={setValue}
        aria-label="Documentation preview language"
      />
      <p class="text-xs text-muted-foreground">Current locale: {value}</p>
    </div>
  );
};

const CustomOptionsPreview = () => {
  const [value, setValue] = useState("en");
  return (
    <div class="space-y-2">
      <LocaleSegmentGroup
        value={value}
        onValueChange={setValue}
        options={[
          { value: "en", label: "EN" },
          { value: "fr", label: "FR" },
        ]}
        aria-label="Language"
      />
      <p class="text-xs text-muted-foreground">Current value: {value}</p>
    </div>
  );
};

export const localeSegmentGroupDocPage = createGenericDocPage({
  slug: "locale-segment-group",
  title: "Locale Segment Group",
  usageLabel:
    "Locale Segment Group is a compact two-or-more-option control for switching UI language or similar string codes.",
  installationText: "Import LocaleSegmentGroup from `@/components/kamod-ui/locale-segment-group`.",
  usageText:
    "Control `value` from your app state (for example editor `getLocale` / `setLocale`). Clicking the active segment does nothing; only changes call `onValueChange`.",
  exampleSections: [
    {
      id: "basic-locale-segment-group",
      title: "Basic DE / EN",
      text: "**Make the Active Language Explicit.** Use `LocaleSegmentGroup` for a compact choice between locale values, with German and English as the default options. Pass `value` and `onValueChange` when the application owns the selected language and its translation updates.\n\nDecide whether the preference persists across visits, and test longer translated labels elsewhere in the interface after switching between the available languages.",
      code: `import { LocaleSegmentGroup } from "@/components/kamod-ui/locale-segment-group";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState("de");
  return <LocaleSegmentGroup value={value} onValueChange={setValue} />;
};`,
      renderPreview: () => <BasicLocalePreview />,
    },
    {
      id: "custom-options",
      title: "Custom Options",
      text: "**Use Labels Your Audience Recognizes.** Supply `options` to choose your own locale codes and visible labels. The active segment stays selected when clicked again, making the control represent one current locale rather than an independently toggleable set of languages.\n\nInclude a meaningful accessible name for the group, keep the active value valid when options change, and avoid using flags as the sole representation of language.",
      code: `import { LocaleSegmentGroup } from "@/components/kamod-ui/locale-segment-group";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState("en");
  return (
    <LocaleSegmentGroup
      value={value}
      onValueChange={setValue}
      options={[
        { value: "en", label: "EN" },
        { value: "fr", label: "FR" }
      ]}
    />
  );
};`,
      renderPreview: () => <CustomOptionsPreview />,
    },
  ],
  apiRows: [
    { prop: "value", type: "string", defaultValue: "required" },
    { prop: "onValueChange", type: "(next: string) => void", defaultValue: "required" },
    {
      prop: "options",
      type: "{ value: string; label: string }[]",
      defaultValue: "DE / EN",
    },
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "aria-label", type: "string", defaultValue: '"Language"' },
  ],
  accessibilityText:
    'The root uses role="group" with a clear `aria-label`. Each segment is a button with `aria-pressed` reflecting selection.',
});
