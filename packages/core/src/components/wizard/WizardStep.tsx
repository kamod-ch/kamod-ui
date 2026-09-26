import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useWizard } from "./wizard-context";

export type WizardStepProps = JSX.HTMLAttributes<HTMLDivElement> & {
  stepId: string;
  title?: ComponentChildren;
  titleId?: string;
  children?: ComponentChildren;
};

export const WizardStep = ({
  stepId,
  title,
  titleId,
  class: className,
  children,
  ...rest
}: WizardStepProps) => {
  const { activeStep, keepMounted, registerStepHeading } = useWizard();
  const isActive = activeStep === stepId;

  if (!keepMounted && !isActive) {
    return null;
  }

  const resolvedTitleId = titleId ?? `${stepId}-step-title`;

  return (
    <div
      data-slot="wizard-step"
      data-step-id={stepId}
      hidden={keepMounted ? !isActive : undefined}
      class={cn("min-w-0", className)}
      {...rest}
    >
      {title ? (
        <h2
          id={resolvedTitleId}
          tabIndex={-1}
          data-slot="wizard-step-title"
          class="mb-4 text-lg font-semibold outline-none focus:outline-none"
          ref={(node) => registerStepHeading(stepId, node)}
        >
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
};
