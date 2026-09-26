import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { useStepper } from "./stepper-context";
import type { StepperStepStatus } from "./stepper-types";
import { stepperIndicator } from "./stepper-variants";

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="size-4"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ErrorIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    aria-hidden="true"
    class="size-4"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export type StepperIndicatorProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> & {
  stepId: string;
  stepNumber?: number;
  status?: StepperStepStatus;
};

export const StepperIndicator = ({
  stepId,
  stepNumber,
  status: statusProp,
  class: className,
  ...rest
}: StepperIndicatorProps) => {
  const { getStatus, size, steps } = useStepper();
  const status = statusProp ?? getStatus(stepId);
  const index = steps.findIndex((step) => step.id === stepId);
  const label = stepNumber ?? (index >= 0 ? index + 1 : undefined);

  return (
    <span
      data-slot="stepper-indicator"
      data-status={status}
      class={cn(stepperIndicator({ size }), className)}
      {...rest}
    >
      {status === "completed" ? <CheckIcon /> : status === "error" ? <ErrorIcon /> : label}
    </span>
  );
};
