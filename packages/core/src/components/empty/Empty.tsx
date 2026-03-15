import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { emptyRoot } from "./empty-variants";

export type EmptyProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Legacy: render title inside dashed card (use EmptyTitle when composing). */
  title?: ComponentChildren;
  /** Legacy: description line. */
  description?: ComponentChildren;
  children?: ComponentChildren;
};

export const Empty = ({ class: className, title, description, children, ...rest }: EmptyProps) => {
  const legacy = title != null || description != null;

  if (legacy) {
    return (
      <div
        {...rest}
        data-slot="empty"
        class={cn(
          "flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center",
          className
        )}
      >
        {title != null ? (
          <h3 data-slot="empty-title" class="text-base font-semibold">
            {title}
          </h3>
        ) : null}
        {description != null ? (
          <p data-slot="empty-description" class="text-muted-foreground text-sm">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    );
  }

  return (
    <div {...rest} data-slot="empty" class={cn(emptyRoot(), className)}>
      {children}
    </div>
  );
};
