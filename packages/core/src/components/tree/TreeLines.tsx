import { cn } from "../../lib/utils";

const indentCSSValue = (indent: number | string) =>
  typeof indent === "number" ? `${indent}px` : indent;

export type TreeLinesProps = {
  level: number;
  parentPath: boolean[];
  isLast: boolean;
  indent: number | string;
  class?: string;
};

export const TreeLines = ({
  level,
  parentPath,
  isLast,
  indent,
  class: className,
}: TreeLinesProps) => {
  if (level <= 0) return null;
  const indentPx = indentCSSValue(indent);

  return (
    <div
      aria-hidden="true"
      data-slot="tree-lines"
      class={cn("pointer-events-none absolute inset-y-0 start-0", className)}
    >
      {parentPath.map((pathIsLast, pathIndex) => {
        if (pathIsLast) return null;
        return (
          <span
            key={`line-${pathIndex}`}
            class="absolute top-0 bottom-0 w-px bg-border"
            style={{ insetInlineStart: `calc(${pathIndex + 1} * ${indentPx})` }}
          />
        );
      })}
      <span
        class="absolute top-1/2 h-px bg-border"
        style={{
          insetInlineStart: `calc(${level - 1} * ${indentPx} + ${indentPx} / 2)`,
          width: `calc(${indentPx} / 2)`,
        }}
      />
      {!isLast ? (
        <span
          class="absolute top-0 bottom-0 w-px bg-border"
          style={{ insetInlineStart: `calc(${level} * ${indentPx})` }}
        />
      ) : null}
    </div>
  );
};

export { indentCSSValue };
