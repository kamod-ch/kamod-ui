import { Fragment } from "preact";
import { useState } from "preact/hooks";
import {
  Button,
  Combobox,
  ComboboxCommand,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSelect,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle
} from "@kamod-ui/core";
import { Check, ChevronDown } from "lucide-preact";
import { createGenericDocPage } from "./create-generic-doc-page";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"] as const;

const frameworkOptions = [
  { label: "Next.js", value: "next" },
  { label: "Nuxt", value: "nuxt" },
  { label: "SvelteKit", value: "sveltekit" }
];

const timezones = [
  {
    value: "Americas",
    items: ["(GMT-5) New York", "(GMT-8) Los Angeles", "(GMT-6) Chicago", "(GMT-5) Toronto", "(GMT-8) Vancouver", "(GMT-3) São Paulo"]
  },
  {
    value: "Europe",
    items: ["(GMT+0) London", "(GMT+1) Paris", "(GMT+1) Berlin", "(GMT+1) Rome", "(GMT+1) Madrid", "(GMT+1) Amsterdam"]
  },
  {
    value: "Asia/Pacific",
    items: ["(GMT+9) Tokyo", "(GMT+8) Shanghai", "(GMT+8) Singapore", "(GMT+4) Dubai", "(GMT+11) Sydney", "(GMT+9) Seoul"]
  }
] as const;

type Country = {
  code: string;
  value: string;
  continent: string;
  label: string;
};

const countries: Country[] = [
  { code: "ar", value: "argentina", label: "Argentina", continent: "South America" },
  { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
  { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
  { code: "ca", value: "canada", label: "Canada", continent: "North America" },
  { code: "cn", value: "china", label: "China", continent: "Asia" },
  { code: "de", value: "germany", label: "Germany", continent: "Europe" },
  { code: "fr", value: "france", label: "France", continent: "Europe" },
  { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
  { code: "us", value: "united-states", label: "United States", continent: "North America" }
];

const ComboboxBasicPreview = () => (
  <Combobox items={[...frameworks]} defaultValue={frameworks[0]} placeholder="Select framework">
    <ComboboxTrigger>
      <ComboboxValue placeholder="Select framework" />
      <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search framework…" />
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(item)} item={item}>
              {String(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);

const ComboboxSelectPresetPreview = () => (
  <ComboboxSelect options={frameworkOptions} value="next" placeholder="Select framework" searchPlaceholder="Search…" />
);

const ComboboxAutoHighlightPreview = () => (
  <Combobox items={[...frameworks]} defaultValue={frameworks[0]} autoHighlight placeholder="Framework">
    <ComboboxTrigger>
      <ComboboxValue placeholder="Select framework" />
      <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search… ArrowUp/Down, Enter to pick" />
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(item)} item={item}>
              {String(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);

const ComboboxClearPresetPreview = () => (
  <ComboboxSelect
    options={frameworkOptions}
    defaultValue="next"
    showClear
    placeholder="Framework"
    searchPlaceholder="Search…"
  />
);

const ComboboxInlineInputPresetPreview = () => (
  <ComboboxSelect
    options={frameworkOptions}
    defaultValue="next"
    liftedFilter
    autoHighlight
    showClear
    placeholder="Framework"
    searchPlaceholder="Filter frameworks…"
  />
);

const ComboboxMultiChipsPreview = () => {
  const [v, setV] = useState<string[]>(["next"]);
  return (
    <div class="flex max-w-md flex-col gap-2">
      <ComboboxSelect
        multiple
        options={frameworkOptions}
        value={v}
        onValueChange={(x) => setV(Array.isArray(x) ? x : [x])}
        autoHighlight
        searchPlaceholder="Add…"
        placeholder="Frameworks"
      />
      <span class="text-muted-foreground text-xs">value: {JSON.stringify(v)}</span>
    </div>
  );
};

const ComboboxControlledPreview = () => {
  const [value, setValue] = useState("en");
  const langs = [
    { label: "English", value: "en" },
    { label: "German", value: "de" },
    { label: "French", value: "fr" }
  ];
  return (
    <div class="flex flex-col gap-2">
      <Combobox
        items={langs}
        itemKey={(x) => (x as (typeof langs)[number]).value}
        itemToStringValue={(x) => (x as (typeof langs)[number]).label}
        value={value}
        onValueChange={(v) => setValue(typeof v === "string" ? v : "")}
        placeholder="Language"
      >
        <ComboboxTrigger>
          <ComboboxValue placeholder="Language" />
          <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxCommand autoHighlight>
            <ComboboxInput placeholder="Search language…" />
            <ComboboxEmpty>No language found.</ComboboxEmpty>
            <ComboboxList>
              {(opt) => {
                const o = opt as (typeof langs)[number];
                return (
                  <ComboboxItem key={o.value} item={o}>
                    <Check class={value === o.value ? "size-4 opacity-100" : "size-4 opacity-0"} aria-hidden />
                    {o.label}
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </ComboboxCommand>
        </ComboboxContent>
      </Combobox>
      <span class="text-muted-foreground text-xs">value: {value}</span>
    </div>
  );
};

const ComboboxPopupPreview = () => (
  <Combobox
    items={countries}
    itemKey={(c) => (c as Country).value}
    itemToStringValue={(c) => (c as Country).label}
    defaultValue={countries[0]!.value}
    placeholder="Select country"
  >
    <ComboboxTrigger asChild>
      <Button variant="outline" class="h-9 w-64 justify-between font-normal">
        <ComboboxValue placeholder="Select country" />
        <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
      </Button>
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search country…" />
        <ComboboxEmpty>No country found.</ComboboxEmpty>
        <ComboboxList>
          {(c) => {
            const country = c as Country;
            return (
              <ComboboxItem key={country.code} item={country}>
                {country.label}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);

const ComboboxCustomItemsPreview = () => (
  <Combobox
    items={countries}
    itemKey={(c) => (c as Country).value}
    itemToStringValue={(c) => (c as Country).label}
    defaultValue={countries[0]!.value}
    placeholder="Select country"
  >
    <ComboboxTrigger>
      <ComboboxValue placeholder="Select country" />
      <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search countries…" />
        <ComboboxEmpty>No countries found.</ComboboxEmpty>
        <ComboboxList>
          {(c) => {
            const country = c as Country;
            return (
              <ComboboxItem key={country.code} item={country}>
                <Item size="xs" variant="default" class="border-0 p-0 shadow-none hover:bg-transparent">
                  <ItemContent>
                    <ItemTitle class="whitespace-nowrap">{country.label}</ItemTitle>
                    <ItemDescription>
                      {country.continent} ({country.code})
                    </ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);

const ComboboxGroupsPreview = () => (
  <Combobox
    items={[...timezones]}
    defaultValue={timezones[0]!.items[0]}
    itemToStringValue={(item) => String(item)}
    itemKey={(item) => String(item)}
    placeholder="Select timezone"
  >
    <ComboboxTrigger>
      <ComboboxValue placeholder="Select timezone" />
      <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search timezone…" />
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList class="max-h-72">
          {(group, index) => {
            const g = group as (typeof timezones)[number];
            return (
              <Fragment key={g.value}>
                <ComboboxGroup heading={g.value}>
                  {g.items.map((tz) => (
                    <ComboboxItem key={tz} item={tz}>
                      {tz}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
                {index < timezones.length - 1 ? <ComboboxSeparator /> : null}
              </Fragment>
            );
          }}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);

const ComboboxInvalidPreview = () => (
  <Combobox items={[...frameworks]} defaultValue={frameworks[0]} placeholder="Framework">
    <ComboboxTrigger aria-invalid={true}>
      <ComboboxValue placeholder="Framework" />
      <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search…" />
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(item)} item={item}>
              {String(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);

const ComboboxDisabledPreview = () => (
  <Combobox items={[...frameworks]} defaultValue={frameworks[0]} disabled placeholder="Framework">
    <ComboboxTrigger>
      <ComboboxValue />
      <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search…" />
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(item)} item={item}>
              {String(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);

const rtlCopy = {
  en: {
    dir: "ltr" as const,
    placeholder: "Select framework",
    search: "Search…",
    empty: "No results.",
    next: "Next.js",
    svelte: "SvelteKit",
    nuxt: "Nuxt.js"
  },
  ar: {
    dir: "rtl" as const,
    placeholder: "اختر إطار العمل",
    search: "بحث…",
    empty: "لا توجد نتائج.",
    next: "Next.js",
    svelte: "SvelteKit",
    nuxt: "Nuxt.js"
  },
  he: {
    dir: "rtl" as const,
    placeholder: "בחר מסגרת",
    search: "חיפוש…",
    empty: "אין תוצאות.",
    next: "Next.js",
    svelte: "SvelteKit",
    nuxt: "Nuxt.js"
  }
};

const ComboboxRtlPreview = () => {
  const [lang, setLang] = useState<"en" | "ar" | "he">("en");
  const t = rtlCopy[lang];
  const items = [
    { label: t.next, value: "next" },
    { label: t.svelte, value: "svelte" },
    { label: t.nuxt, value: "nuxt" }
  ];
  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} size="sm" variant={lang === key ? "default" : "outline"} onClick={() => setLang(key)}>
            {key.toUpperCase()}
          </Button>
        ))}
      </div>
      <Combobox
        class="max-w-xs"
        dir={t.dir}
        items={items}
        itemKey={(o) => (o as (typeof items)[number]).value}
        itemToStringValue={(o) => (o as (typeof items)[number]).label}
        defaultValue="next"
        placeholder={t.placeholder}
      >
        <ComboboxTrigger>
          <ComboboxValue placeholder={t.placeholder} />
          <ChevronDown class="size-4 shrink-0 opacity-50" aria-hidden />
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxCommand>
            <ComboboxInput placeholder={t.search} dir={t.dir} />
            <ComboboxEmpty>{t.empty}</ComboboxEmpty>
            <ComboboxList>
              {(opt) => {
                const o = opt as (typeof items)[number];
                return (
                  <ComboboxItem key={o.value} item={o}>
                    {o.label}
                  </ComboboxItem>
                );
              }}
            </ComboboxList>
          </ComboboxCommand>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export const comboboxDocPage = createGenericDocPage({
  slug: "combobox",
  title: "Combobox",
  previewCode: `import { Combobox, ComboboxCommand, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger, ComboboxValue } from "@/components/kamod-ui/combobox";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js"];

export const Example = () => (
  <Combobox items={frameworks} defaultValue={frameworks[0]} placeholder="Pick one">
    <ComboboxTrigger>
      <ComboboxValue placeholder="Pick one" />
    </ComboboxTrigger>
    <ComboboxContent>
      <ComboboxCommand>
        <ComboboxInput placeholder="Search…" />
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={String(item)} item={item}>
              {String(item)}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxCommand>
    </ComboboxContent>
  </Combobox>
);`,
  usageLabel:
    "Searchable select built from `Popover` + `Command` — API shaped like the shadcn combobox docs, without `@base-ui/react`. Use composable primitives or the `ComboboxSelect` preset for `{ label, value }[]`.",
  installationText: "Import combobox primitives (and optionally `ComboboxSelect`) from `@/components/kamod-ui/combobox`.",
  usageText:
    "`Combobox` supports single or `multiple` selection (`value` / `onValueChange` as `string` or `string[]`). `liftedFilter` shares the filter string between `ComboboxInlineInput` or `ComboboxChipsInput` and the list (`Command` stays mounted via `forceMount` on content). Set `autoHighlight` on the root (or `ComboboxCommand`) for first-match highlight plus ArrowUp/Down and Enter — works in `ComboboxInput`, `ComboboxInlineInput`, and `ComboboxChipsInput` via `commandNavRef`. `showClear` + `ComboboxClear` clears selection and filter. Multi-select: `ComboboxChips` + `ComboboxChip` + `ComboboxChipsInput` (implies `liftedFilter`). `ComboboxSelect` maps props to these patterns (`liftedFilter`, `multiple`, `showClear`, `autoHighlight`).",
  exampleSections: [
    {
      id: "basic",
      title: "Basic",
      text: "String list, default selection, chevron on the trigger.",
      code: "// combobox-doc.tsx — ComboboxBasicPreview",
      renderPreview: () => <ComboboxBasicPreview />
    },
    {
      id: "preset-select",
      title: "Preset: ComboboxSelect",
      text: "Shortcut for `options: { label, value }[]` — replaces the legacy single-file combobox.",
      code: "// ComboboxSelect with options + searchPlaceholder",
      renderPreview: () => <ComboboxSelectPresetPreview />
    },
    {
      id: "controlled",
      title: "Controlled",
      text: "`value` + `onValueChange`; optional checkmark for the active row.",
      code: "// ComboboxControlledPreview",
      renderPreview: () => <ComboboxControlledPreview />
    },
    {
      id: "popup-button",
      title: "Popup (Button trigger)",
      text: "`ComboboxTrigger asChild` with `Button variant=\"outline\"` — search field lives in the content panel (shadcn popup pattern).",
      code: "// ComboboxPopupPreview",
      renderPreview: () => <ComboboxPopupPreview />
    },
    {
      id: "custom-items",
      title: "Custom row content",
      text: "`Item` + `ItemTitle` / `ItemDescription` inside `ComboboxItem` (shadcn custom items).",
      code: "// ComboboxCustomItemsPreview",
      renderPreview: () => <ComboboxCustomItemsPreview />
    },
    {
      id: "groups",
      title: "Groups + separator",
      text: "Grouped timezones with `ComboboxGroup` and `ComboboxSeparator` between sections.",
      code: "// ComboboxGroupsPreview",
      renderPreview: () => <ComboboxGroupsPreview />
    },
    {
      id: "invalid",
      title: "Invalid",
      text: "`aria-invalid` on the trigger for error styling (pairs with Field invalid state).",
      code: "// ComboboxInvalidPreview",
      renderPreview: () => <ComboboxInvalidPreview />
    },
    {
      id: "disabled",
      title: "Disabled",
      text: "`disabled` on `Combobox` disables the trigger.",
      code: "// ComboboxDisabledPreview",
      renderPreview: () => <ComboboxDisabledPreview />
    },
    {
      id: "auto-highlight",
      title: "Auto-highlight + keyboard",
      text: "`autoHighlight` on `Combobox`: first visible row is highlighted on filter; ArrowUp/Down moves; Enter activates (via `Command`).",
      code: "// ComboboxAutoHighlightPreview",
      renderPreview: () => <ComboboxAutoHighlightPreview />
    },
    {
      id: "clear-button",
      title: "Clear button (preset)",
      text: "`ComboboxSelect` with `showClear` — `ComboboxClear` resets selection (and filter when lifted).",
      code: "// ComboboxSelect showClear",
      renderPreview: () => <ComboboxClearPresetPreview />
    },
    {
      id: "inline-input",
      title: "Inline input trigger (Base UI style)",
      text: "`ComboboxSelect` with `liftedFilter` + `autoHighlight`: visible field is the filter; list opens below; optional `showClear`.",
      code: "// ComboboxSelect liftedFilter",
      renderPreview: () => <ComboboxInlineInputPresetPreview />
    },
    {
      id: "multi-chips",
      title: "Multi-select + chips",
      text: "`ComboboxSelect` with `multiple`: chip row + `ComboboxChipsInput`; `onValueChange` receives `string[]`.",
      code: "// ComboboxMultiChipsPreview",
      renderPreview: () => <ComboboxMultiChipsPreview />
    },
    {
      id: "rtl",
      title: "RTL",
      text: "`dir` on `Combobox` and `ComboboxInput`; EN / AR / HE toggles.",
      code: "// ComboboxRtlPreview",
      renderPreview: () => <ComboboxRtlPreview />
    }
  ],
  apiRows: [
    { prop: "Combobox items", type: "readonly unknown[]", defaultValue: "[]" },
    { prop: "Combobox multiple / liftedFilter / autoHighlight / showClear", type: "boolean", defaultValue: "false" },
    { prop: "Combobox value / defaultValue / onValueChange", type: "string | string[]", defaultValue: "—" },
    { prop: "ComboboxItem item", type: "unknown (row payload)", defaultValue: "required" },
    { prop: "ComboboxList children", type: "(item, index) => vnode", defaultValue: "—" },
    { prop: "ComboboxSelect", type: "liftedFilter, multiple, showClear, autoHighlight", defaultValue: "—" },
    { prop: "Command autoHighlight", type: "boolean", defaultValue: "false" }
  ],
  accessibilityText:
    "Associate a visible `Label` with the trigger id when used in forms. The filter input inside the popover should have a clear placeholder; announce errors via `aria-invalid` on the trigger when validation fails."
});
