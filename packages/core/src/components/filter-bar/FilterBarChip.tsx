import type { ComponentChildren, JSX } from "preact";
import { useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useFilterBar } from "./filter-bar-context";
import { filterBarChip, filterBarChipLabel, filterBarChipRemove } from "./filter-bar-variants";

export type FilterBarChipProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
  label: ComponentChildren;
  removeLabel: string;
  onRemove: () => void;
};

const RemoveGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const FilterBarChip = ({
  label,
  removeLabel,
  onRemove,
  class: className,
  ...rest
}: FilterBarChipProps) => {
  const chipRef = useRef<HTMLDivElement | null>(null);
  const { focusFallbackRef } = useFilterBar();

  const handleRemove = () => {
    const chipEl = chipRef.current;
    const container = chipEl?.closest('[data-slot="filter-bar-chips"]');
    const chips = container
      ? Array.from(container.querySelectorAll<HTMLElement>('[data-slot="filter-bar-chip"]'))
      : [];
    const index = chipEl ? chips.indexOf(chipEl) : -1;

    let focusTarget: HTMLElement | null = null;
    const nextChip = index >= 0 ? chips[index + 1] : undefined;
    const prevChip = index >= 0 ? chips[index - 1] : undefined;

    if (nextChip) {
      focusTarget = nextChip.querySelector<HTMLElement>('[data-slot="filter-bar-chip-remove"]');
    } else if (prevChip) {
      focusTarget = prevChip.querySelector<HTMLElement>('[data-slot="filter-bar-chip-remove"]');
    } else {
      focusTarget = focusFallbackRef.current;
    }

    onRemove();

    queueMicrotask(() => focusTarget?.focus());
  };

  return (
    <div
      ref={chipRef}
      data-slot="filter-bar-chip"
      class={cn(filterBarChip(), className)}
      role="listitem"
      {...rest}
    >
      <span data-slot="filter-bar-chip-label" class={filterBarChipLabel()}>
        {label}
      </span>
      <button
        type="button"
        data-slot="filter-bar-chip-remove"
        class={filterBarChipRemove()}
        aria-label={removeLabel}
        onClick={handleRemove}
      >
        <RemoveGlyph />
      </button>
    </div>
  );
};
