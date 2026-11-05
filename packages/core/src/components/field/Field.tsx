import type { ComponentChildren, HTMLAttributes } from "preact";
import { cloneElement, isValidElement } from "preact";
import { useId } from "preact/hooks";
import { cn } from "../../lib/utils";
import { type FieldRootVariants, fieldRoot } from "./field-variants";

export type FieldProps = HTMLAttributes<HTMLDivElement> &
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

const augmentFieldControl = (
  children: ComponentChildren,
  {
    controlId,
    describedBy,
  }: {
    controlId: string;
    describedBy?: string;
  },
): { children: ComponentChildren; labelFor: string } => {
  if (!isValidElement(children)) {
    return { children, labelFor: controlId };
  }

  const childProps = (children.props ?? {}) as Record<string, unknown>;
  const resolvedId = (childProps.id as string | undefined) ?? controlId;
  const existingDescribedBy = childProps["aria-describedby"] as string | undefined;
  const mergedDescribedBy =
    [existingDescribedBy, describedBy].filter(Boolean).join(" ") || undefined;

  return {
    labelFor: resolvedId,
    children: cloneElement(children, {
      ...childProps,
      id: resolvedId,
      ...(mergedDescribedBy ? { "aria-describedby": mergedDescribedBy } : {}),
    }),
  };
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
  const controlId = useId();
  const descriptionId = useId();
  const errorId = useId();
  const describedBy =
    [description != null ? descriptionId : undefined, error != null ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  if (legacy) {
    const isHorizontal = orientation === "horizontal";
    const { children: enhancedChildren, labelFor } = augmentFieldControl(children, {
      controlId,
      describedBy,
    });

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
          className,
        )}
        {...(invalid ? { "data-invalid": "" } : {})}
      >
        {label != null ? (
          <label
            data-slot="field-label"
            class="text-sm leading-none font-medium"
            htmlFor={labelFor}
          >
            {label}
            {resolvedRequired ? (
              <span aria-hidden="true" class="ms-1 text-destructive">
                *
              </span>
            ) : null}
          </label>
        ) : null}
        {isHorizontal && label != null ? (
          <div class="flex min-w-0 flex-row flex-wrap items-center gap-3">{enhancedChildren}</div>
        ) : (
          enhancedChildren
        )}
        {description != null ? (
          <p
            id={descriptionId}
            data-slot="field-description"
            class="text-muted-foreground text-sm leading-normal"
          >
            {description}
          </p>
        ) : null}
        {error != null ? (
          <p id={errorId} data-slot="field-error" role="alert" class="text-destructive text-sm">
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
