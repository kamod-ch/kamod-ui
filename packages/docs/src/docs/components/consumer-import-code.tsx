import { useMemo, useState } from "preact/hooks";
import {
  type ConsumerImportStyle,
  hasConsumerImport,
  initialConsumerImportStyle,
  presentConsumerImports,
} from "../consumer-import-style";
import { docsPageSlugsLongestFirst } from "../doc-snippet-imports";

export function useConsumerImportCode(source: string) {
  const applicable = hasConsumerImport(source);
  const [style, setStyle] = useState<ConsumerImportStyle>(() => initialConsumerImportStyle(source));
  const code = useMemo(
    () => (applicable ? presentConsumerImports(source, style, docsPageSlugsLongestFirst) : source),
    [applicable, source, style],
  );
  return { applicable, style, setStyle, code };
}

/** Choose the package import readers can paste into an app. */
export function ConsumerImportSwitch({
  value,
  onChange,
}: {
  value: ConsumerImportStyle;
  onChange: (value: ConsumerImportStyle) => void;
}) {
  const options: { value: ConsumerImportStyle; label: string }[] = [
    { value: "barrel", label: "Barrel Import (@kamod-ch/ui)" },
    { value: "subpath", label: "Subpath Import (@kamod-ch/ui/<component>)" },
  ];
  return (
    <div class="component-import-style" role="group" aria-label="Import style">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
