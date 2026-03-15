import { tv, type VariantProps } from "tailwind-variants";

/** Root layout for composable Field (shadcn fieldVariants). */
export const fieldRoot = tv({
  base: [
    "group/field flex w-full gap-3",
    "data-[invalid]:text-destructive"
  ],
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [.sr-only]:w-auto",
      horizontal: [
        "flex-row flex-wrap items-center",
        "[&>[data-slot=field-label]]:flex-1",
        "has-[>[data-slot=field-content]]:items-start",
        "has-[>[data-slot=field-content]]:[&>[data-slot=checkbox],[role=checkbox],[role=radio]]:mt-px"
      ],
      responsive: [
        "flex-col *:w-full [.sr-only]:w-auto",
        "@md/field-group:flex-row @md/field-group:flex-wrap @md/field-group:items-center",
        "@md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-1",
        "@md/field-group:has-[>[data-slot=field-content]]:items-start",
        "@md/field-group:has-[>[data-slot=field-content]]:[&>[data-slot=checkbox],[role=checkbox],[role=radio]]:mt-px"
      ]
    }
  },
  defaultVariants: {
    orientation: "vertical"
  }
});

export type FieldRootVariants = VariantProps<typeof fieldRoot>;
