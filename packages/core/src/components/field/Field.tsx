import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { fieldRoot, type FieldRootVariants } from "./field-variants";

export type FieldProps = JSX.HTMLAttributes<HTMLDivElement> &
  FieldRootVariants & {
    /** Legacy: label text/node (composition: use FieldLabel instead). */
    label?: ComponentChildren;
    /** Legacy: helper below control. */
    description?: ComponentChildren;
    /** Legacy: error below control. */
    error?: ComponentChildren;
    required?: boolean;
    orientation?: "vertical" | "horizontal" | "responsive";
    disabled?: boolean;
    invalid?: boolean;
    children?: ComponentChildren;
  };

export const Field = ({
  class: className,
  label,
  description,
  error,
  required = false,
  orientation = "vertical",
  disabled = false,
  invalid = false,
  children,
  ...rest
}: FieldProps) => {
  const legacy = label != null || description != null || error != null;
  const resolvedRequired = required && label != null;

  if (legacy) {
    const isHorizontal = orientation === "horizontal";

    return (
      <div
        {...rest}
        data-slot="field"
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        class={cn(
          "group/field",
          !isHorizontal && "grid gap-2",
          isHorizontal && label != null && "flex flex-col gap-2",
          isHorizontal && label == null && fieldRoot({ orientation: "horizontal" }),
          disabled ? "opacity-80" : null,
          className
        )}
        {...(invalid ? { "data-invalid": "" } : {})}
      >
        {label != null ? (
          <label data-slot="field-label" class="text-sm leading-none font-medium">
            {label}
            {resolvedRequired ? <span aria-hidden="true" class="ms-1 text-destructive">*</span> : null}
          </label>
        ) : null}
        {isHorizontal && label != null ? (
          <div class="flex min-w-0 flex-row flex-wrap items-center gap-3">{children}</div>
        ) : (
          children
        )}
        {description != null ? (
          <p data-slot="field-description" class="text-muted-foreground text-sm leading-normal">
            {description}
          </p>
        ) : null}
        {error != null ? (
          <p data-slot="field-error" role="alert" class="text-destructive text-sm">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  const orient = orientation === "responsive" ? "responsive" : orientation;

  return (
    <div
      {...rest}
      data-slot="field"
      data-orientation={orientation}
      data-disabled={disabled ? "" : undefined}
      class={cn(fieldRoot({ orientation: orient }), disabled ? "opacity-80" : null, className)}
      {...(invalid ? { "data-invalid": "" } : {})}
    >
      {children}
    </div>
  );
};
