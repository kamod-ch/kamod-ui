import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Alert } from "../alert/Alert";
import { AlertDescription } from "../alert/AlertDescription";
import { AlertTitle } from "../alert/AlertTitle";

export type WizardErrorProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "title"> & {
  title?: ComponentChildren;
  children?: ComponentChildren;
};

export const WizardError = ({ title, class: className, children, ...rest }: WizardErrorProps) => {
  if (!children && !title) {
    return null;
  }

  return (
    <Alert
      variant="destructive"
      role="alert"
      data-slot="wizard-error"
      class={cn("mb-4", className)}
      {...rest}
    >
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {children ? <AlertDescription>{children}</AlertDescription> : null}
    </Alert>
  );
};
