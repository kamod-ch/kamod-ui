import type { ComponentChildren, HTMLAttributes } from "preact";
import { createContext } from "preact";
import { useContext, useMemo, useRef, useState } from "preact/hooks";
import { tv, type VariantProps } from "tailwind-variants";
import { useFormReset } from "../../lib/form-control";
import { cn } from "../../lib/utils";

type ToggleGroupType = "single" | "multiple";

type ToggleGroupContextValue = {
  type: ToggleGroupType;
  values: string[];
  resetValues: string[];
  toggle: (value: string) => void;
  disabled: boolean;
  name?: string;
  required: boolean;
  itemVariant?: ToggleGroupItemVariants["variant"];
  itemSize?: ToggleGroupItemVariants["size"];
};

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

export const useToggleGroup = () => {
  const context = useContext(ToggleGroupContext);
  if (!context) throw new Error("ToggleGroupItem must be used within ToggleGroup");
  return context;
};

const toggleGroup = tv({
  base: "inline-flex items-center justify-center",
  variants: {
    orientation: {
      horizontal: "flex-row items-center",
      vertical: "flex-col items-start",
    },
    spacing: {
      none: "gap-0",
      sm: "gap-0.5",
      default: "gap-1",
      lg: "gap-1.5",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    spacing: "sm",
  },
});

// Used for `typeof toggleGroupItem` type extraction below — runtime usage is intentional.
// oxlint-disable-next-line typescript/no-unused-vars
const toggleGroupItem = tv({
  variants: {
    variant: {
      default: undefined,
      outline: undefined,
      pill: undefined,
    },
    size: {
      sm: undefined,
      default: undefined,
      lg: undefined,
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ToggleGroupItemVariants = VariantProps<typeof toggleGroupItem>;

type ToggleGroupBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "class"> &
  VariantProps<typeof toggleGroup> &
  ToggleGroupItemVariants & {
    class?: string;
    type?: ToggleGroupType;
    defaultValue?: string | string[];
    value?: string | string[];
    onValueChange?: (value: string | string[]) => void;
    disabled?: boolean;
    name?: string;
    required?: boolean;
    children?: ComponentChildren;
  };

type SingleToggleGroupProps = ToggleGroupBaseProps & {
  type?: "single";
  onValueChange?: (value: string) => void;
};

type MultipleToggleGroupProps = ToggleGroupBaseProps & {
  type: "multiple";
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps = SingleToggleGroupProps | MultipleToggleGroupProps;

const toValueArray = (input?: string | string[]) => {
  if (Array.isArray(input)) return input;
  if (typeof input === "string") return [input];
  return [];
};

export const ToggleGroup = ({
  class: className,
  type = "single",
  defaultValue,
  value,
  onValueChange,
  disabled = false,
  name,
  required = false,
  orientation,
  spacing,
  variant,
  size,
  children,
  ...rest
}: ToggleGroupProps) => {
  const initial = useMemo(() => {
    if (Array.isArray(defaultValue)) return defaultValue;
    if (typeof defaultValue === "string") return [defaultValue];
    return [];
  }, [defaultValue]);
  const [internalValues, setInternalValues] = useState<string[]>(initial);
  const resetValuesRef = useRef(initial);
  const rootRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const values = isControlled ? toValueArray(value) : internalValues;

  useFormReset(rootRef, () => {
    const next = resetValuesRef.current;
    if (!isControlled) {
      setInternalValues(next);
      return;
    }
    const current = toValueArray(value);
    const same =
      current.length === next.length && current.every((entry, index) => entry === next[index]);
    if (same || !onValueChange) return;
    if (type === "multiple") {
      (onValueChange as (value: string[]) => void)(next);
    } else {
      (onValueChange as (value: string) => void)(next[0] ?? "");
    }
  });

  const toggle = (value: string) => {
    const exists = values.includes(value);
    const nextValues =
      type === "single"
        ? exists
          ? []
          : [value]
        : exists
          ? values.filter((entry) => entry !== value)
          : [...values, value];

    if (!isControlled) {
      setInternalValues(nextValues);
    }

    if (onValueChange) {
      if (type === "multiple") {
        (onValueChange as (value: string[]) => void)(nextValues);
      } else {
        (onValueChange as (value: string) => void)(nextValues[0] ?? "");
      }
    }
  };

  const resolvedVariant = variant ?? "default";
  const resolvedSize = size ?? "default";

  return (
    <ToggleGroupContext.Provider
      value={{
        type,
        values,
        resetValues: resetValuesRef.current,
        toggle,
        disabled,
        name,
        required,
        itemVariant: resolvedVariant,
        itemSize: resolvedSize,
      }}
    >
      <div
        ref={rootRef}
        data-slot="toggle-group"
        data-orientation={orientation ?? "horizontal"}
        data-variant={resolvedVariant}
        data-size={resolvedSize}
        role="group"
        class={cn(toggleGroup({ orientation, spacing }), className)}
        {...rest}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
};
