import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { cn } from "../../lib/utils";

export type ButtonGroupTextProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "size"> & {
  children?: ComponentChildren;
  asChild?: boolean;
};

const textClass =
  "text-muted-foreground flex items-center text-sm font-normal [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export const ButtonGroupText = ({
  class: className,
  children,
  asChild = false,
  ...rest
}: ButtonGroupTextProps) => {
  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      class?: string;
      className?: string;
    };

    return cloneElement(children, {
      ...(childProps ?? {}),
      ...(rest as JSX.HTMLAttributes<HTMLElement>),
      class: cn(childProps.class, childProps.className, textClass, className),
      "data-slot": "button-group-text"
    });
  }

  return (
    <div data-slot="button-group-text" class={cn(textClass, className)} {...rest}>
      {children}
    </div>
  );
};
