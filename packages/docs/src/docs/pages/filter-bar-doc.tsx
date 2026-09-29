import { FilterBarDemo } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

const USAGE_SNIPPET = `import {
  FilterBar,
  FilterBarChip,
  FilterBarChips,
  FilterBarControls,
  FilterBarMeta,
  FilterBarReset,
  FilterBarResultCount,
  FilterBarSearch,
} from "@/components/kamod-ui/filter-bar";

export const Example = ({ filters, results, onSearch, onReset, chips }) => (
  <FilterBar>
    <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
      <FilterBarSearch
        label="Search projects"
        placeholder="Search by title"
        value={filters.search}
        onValueChange={onSearch}
      />
      <FilterBarControls>{/* Select, DateRangePicker, … */}</FilterBarControls>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <FilterBarChips>
        {chips.map((chip) => (
          <FilterBarChip key={chip.id} {...chip} />
        ))}
      </FilterBarChips>
      <FilterBarMeta>
        <FilterBarResultCount>{results.length} results</FilterBarResultCount>
        <FilterBarReset onReset={onReset}>Reset filters</FilterBarReset>
      </FilterBarMeta>
    </div>
  </FilterBar>
);`;

const InteractivePreview = () => <FilterBarDemo debounceMs={250} />;

const INTERACTIVE_CODE = `import { FilterBarDemo } from "@/components/kamod-ui/filter-bar";

// FilterBarDemo shows local list filtering with optional debounced search.
// Replace it with your own state wiring — values always live in the consumer.

export const Example = () => <FilterBarDemo debounceMs={250} />;`;

const DebouncePreview = () => <FilterBarDemo debounceMs={300} />;

const DEBOUNCE_CODE = `import { useEffect, useState } from "preact/hooks";
import { FilterBar, FilterBarSearch } from "@/components/kamod-ui/filter-bar";

export const Example = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  return (
    <FilterBar>
      <FilterBarSearch label="Search" value={search} onValueChange={setSearch} />
      {/* Filter your data with debouncedSearch */}
    </FilterBar>
  );
};`;

export const filterBarDocPage = createGenericDocPage({
  title: "Filter Bar",
  slug: "filter-bar",
  usageLabel: "Filter Bar",
  previewCode: USAGE_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/filter-bar`. The components provide layout and accessible interactions while leaving filter state in the consumer.",
  usageText:
    "Compose search, arbitrary controls, active chips, result count, and reset without a schema engine. Fetching, routing, persistence, and debouncing remain application concerns.",
  installationExample: {
    code: INTERACTIVE_CODE,
    renderPreview: InteractivePreview,
  },
  exampleSections: [
    {
      id: "interactive-demo",
      title: "Local list with search, selects, and date range",
      text: "FilterBarDemo composes NativeSelect and DateRangePicker inside FilterBarControls. Chips, result count, and reset are driven entirely by consumer state.",
      code: INTERACTIVE_CODE,
      renderPreview: InteractivePreview,
    },
    {
      id: "debounced-search",
      title: "Debounced search in the consumer",
      text: "FilterBarSearch forwards input immediately. Debouncing belongs in application code, as shown here and in FilterBarDemo.",
      code: DEBOUNCE_CODE,
      renderPreview: DebouncePreview,
    },
  ],
  apiRows: [
    { prop: "FilterBar", type: "container", defaultValue: "flex column, no toolbar role" },
    { prop: "FilterBarSearch.label", type: "string", defaultValue: "required visible label" },
    {
      prop: "FilterBarSearch.value / onValueChange",
      type: "string / fn",
      defaultValue: "controlled",
    },
    {
      prop: "FilterBarControls",
      type: "wrap row for Select, DateRangePicker, …",
      defaultValue: "registers focus fallback",
    },
    { prop: "FilterBarChip.label", type: "ComponentChildren", defaultValue: "required" },
    { prop: "FilterBarChip.removeLabel", type: "string", defaultValue: "required aria-label" },
    { prop: "FilterBarChip.onRemove", type: "() => void", defaultValue: "required" },
    {
      prop: "FilterBarResultCount.live",
      type: '"polite" | "assertive" | "off"',
      defaultValue: '"polite"',
    },
    { prop: "FilterBarReset.onReset", type: "() => void", defaultValue: "keeps focus on reset" },
  ],
  accessibilityText:
    'FilterBar deliberately avoids role="toolbar" because arrow-key toolbar semantics are not implemented. FilterBarSearch pairs a visible Label with the input. Chip remove buttons require explicit removeLabel values. After removing a chip, focus moves to the next chip, the previous chip, or the first focusable control in FilterBarControls. Reset keeps focus on the reset button. Result count uses aria-live="polite" by default.',
});
