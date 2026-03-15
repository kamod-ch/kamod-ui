import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const typography = tv({
  base: "text-foreground",
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      table: "my-6 w-full overflow-y-auto",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      muted: "text-sm text-muted-foreground",
      small: "text-sm font-medium leading-none"
    }
  },
  defaultVariants: {
    variant: "p"
  }
});

export type TypographyVariants = VariantProps<typeof typography>;

export type TypographyProps = JSX.HTMLAttributes<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]> &
  TypographyVariants & {
    as?: keyof HTMLElementTagNameMap;
    children?: ComponentChildren;
  };

export const Typography = ({ as = "p", variant, class: className, children, ...rest }: TypographyProps) => {
  const Tag = as as keyof JSX.IntrinsicElements;
  const props = { "data-slot": "typography", class: cn(typography({ variant }), className), ...rest } as any;
  return <Tag {...props}>{children}</Tag>;
};

