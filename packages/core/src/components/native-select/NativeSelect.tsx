import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const nativeSelectWrapper = tv({
  base: [
    "group/native-select relative w-fit has-[select:disabled]:opacity-50"
  ]
});

export const nativeSelect = tv({
  base: [
    "border-input dark:bg-input/30 text-foreground ring-offset-background w-full rounded-md border bg-transparent shadow-xs",
    "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground appearance-none bg-none select-none",
    "hover:border-foreground/20 transition-[color,box-shadow,border-color] outline-none",
    "focus-visible:border-outline focus-visible:ring-outline/50 focus-visible:ring-3",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "aria-invalid:border-error aria-invalid:focus-visible:ring-error/40 aria-invalid:focus-visible:ring-3"
  ],
  variants: {
    size: {
      sm: "h-7 pe-8 ps-2.5 text-sm",
      md: "h-8 pe-9 ps-3 text-sm",
      lg: "h-9 pe-10 ps-3.5 text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export const nativeSelectIcon = tv({
  base: ["text-muted-foreground pointer-events-none absolute top-1/2 -translate-y-1/2"],
  variants: {
    size: {
      sm: "end-2 size-3.5",
      md: "end-3 size-4",
      lg: "end-4 size-5"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

export type NativeSelectProps = Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, "size"> &
  VariantProps<typeof nativeSelect> & {
    icon?: ComponentChildren;
    children?: ComponentChildren;
  };

export const NativeSelect = ({ class: className, size, icon, children, ...rest }: NativeSelectProps) => (
  <div class={nativeSelectWrapper()} data-size={size} data-slot="native-select-wrapper">
    <select class={nativeSelect({ size, class: className as string | undefined })} data-slot="native-select" {...rest}>
      {children}
    </select>
    {icon ?? (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        class={nativeSelectIcon({ size })}
        data-slot="native-select-icon"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    )}
  </div>
);

