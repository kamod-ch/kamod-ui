import type { MultiSelectOption } from "@kamod-ch/ui/multi-select";
import { MultiSelect } from "@kamod-ch/ui/multi-select";
import { useMemo, useState } from "preact/hooks";

const TEAM: MultiSelectOption[] = [
  { value: "maya", label: "Maya Chen" },
  { value: "tom", label: "Tomoko Sato" },
  { value: "leo", label: "Leo Müller" },
  { value: "sam", label: "Sam Rivera (away)", disabled: true },
];

const CATEGORIES: MultiSelectOption[] = [
  { value: "ops", label: "Operations" },
  { value: "design", label: "Design" },
  { value: "eng", label: "Engineering" },
  { value: "legal", label: "Legal & compliance" },
];

const LONG_LABELS: MultiSelectOption[] = [
  {
    value: "eu-dpa",
    label: "European data processing agreement — version 2026.3 with annexes",
  },
  { value: "msa", label: "Master services agreement (global rollout)" },
];

export const TeamMultiSelectDemo = () => {
  const [value, setValue] = useState<string[]>(["maya"]);
  return (
    <MultiSelect
      class="max-w-md"
      options={TEAM}
      value={value}
      onValueChange={setValue}
      labels={{
        placeholder: "Add team members…",
        searchPlaceholder: "Search team…",
        removeOption: (label) => `Remove ${label}`,
      }}
    />
  );
};

export const CategoriesMultiSelectDemo = () => {
  const [value, setValue] = useState<string[]>(["design", "eng"]);
  return (
    <MultiSelect
      class="max-w-md"
      options={CATEGORIES}
      value={value}
      onValueChange={setValue}
      maxVisible={2}
      showClear
      labels={{ placeholder: "Categories…", searchPlaceholder: "Filter categories…" }}
    />
  );
};

export const LongLabelsMultiSelectDemo = () => {
  const [value, setValue] = useState<string[]>(["eu-dpa"]);
  return (
    <MultiSelect
      class="max-w-lg"
      options={LONG_LABELS}
      value={value}
      onValueChange={setValue}
      labels={{ placeholder: "Documents…", searchPlaceholder: "Search documents…" }}
    />
  );
};

/** Consumer filters options — MultiSelect does not fetch. */
export const ExternalSearchMultiSelectDemo = () => {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<string[]>(["legacy"]);

  const options = useMemo(
    () => TEAM.filter((member) => member.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <MultiSelect
      class="max-w-md"
      options={options}
      value={value}
      onValueChange={setValue}
      onSearchChange={setQuery}
      selectedLabels={{ legacy: "Legacy member (off-list)" }}
      labels={{
        placeholder: "Team members…",
        searchPlaceholder: "Type to filter…",
        empty: "No matches — try another name.",
      }}
    />
  );
};
