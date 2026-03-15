import type { ComponentChildren, JSX } from "preact";
import { useMemo } from "preact/hooks";
import { cn } from "../../lib/utils";

export type FieldErrorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  errors?: Array<{ message?: string } | undefined>;
  children?: ComponentChildren;
};

export const FieldError = ({ class: className, children, errors, ...rest }: FieldErrorProps) => {
  const content = useMemo(() => {
    if (children) return children;
    if (!errors?.length) return null;

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()].filter(Boolean);

    if (uniqueErrors.length === 0) return null;
    if (uniqueErrors.length === 1) {
      return uniqueErrors[0]?.message ?? null;
    }

    return (
      <ul class="ml-4 list-disc space-y-0.5">
        {uniqueErrors.map((error, index) =>
          error?.message ? (
            <li key={`${error.message}-${index}`}>{error.message}</li>
          ) : null
        )}
      </ul>
    );
  }, [children, errors]);

  if (content == null) return null;

  return (
    <div
      role="alert"
      class={cn("text-destructive text-sm font-normal", className)}
      data-slot="field-error"
      {...rest}
    >
      {content}
    </div>
  );
};
