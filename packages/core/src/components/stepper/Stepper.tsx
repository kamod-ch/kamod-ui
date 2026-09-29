import type { ComponentChildren, JSX } from "preact";
import { useMemo } from "preact/hooks";
import { cn } from "../../lib/utils";
import { StepperDescription } from "./StepperDescription";
import { StepperIndicator } from "./StepperIndicator";
import { StepperItem } from "./StepperItem";
import { StepperList } from "./StepperList";
import { StepperPosition } from "./StepperPosition";
import { StepperSeparator } from "./StepperSeparator";
import { StepperTitle } from "./StepperTitle";
import { StepperTrigger } from "./StepperTrigger";
import { createStepperContextValue, StepperContext } from "./stepper-context";
import type {
  StepperOrientation,
  StepperSize,
  StepperStepDefinition,
  StepperStepStatus,
} from "./stepper-types";
import { resolveStepStatuses } from "./stepper-utils";
import { stepper } from "./stepper-variants";

export type StepperProps = Omit<JSX.HTMLAttributes<HTMLElement>, "aria-label"> & {
  steps: readonly StepperStepDefinition[];
  activeStep: string;
  onStepChange?: (stepId: string) => void;
  stepStatus?: Partial<Record<string, StepperStepStatus>>;
  orientation?: StepperOrientation;
  size?: StepperSize;
  /** When true, completed steps become navigable via StepperTrigger. */
  allowStepNavigation?: boolean;
  /** Override default reachability checks for explicit step navigation. */
  isStepReachable?: (stepId: string) => boolean;
  /** Required accessible name for the step navigation region. */
  "aria-label": string;
  /** Show compact mobile position indicator. @default true */
  showPosition?: boolean;
  formatPosition?: (current: number, total: number) => ComponentChildren;
  children?: ComponentChildren;
};

export const Stepper = ({
  steps,
  activeStep,
  onStepChange,
  stepStatus: stepStatusOverrides,
  orientation = "horizontal",
  size = "default",
  allowStepNavigation = false,
  isStepReachable,
  showPosition = true,
  formatPosition,
  class: className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: StepperProps) => {
  const stepStatus = useMemo(
    () => resolveStepStatuses(steps, activeStep, stepStatusOverrides),
    [steps, activeStep, stepStatusOverrides],
  );

  const contextValue = useMemo(
    () =>
      createStepperContextValue({
        steps,
        activeStep,
        orientation,
        size,
        allowStepNavigation,
        stepStatus,
        onStepChange,
        isStepReachable,
      }),
    [
      steps,
      activeStep,
      orientation,
      size,
      allowStepNavigation,
      stepStatus,
      onStepChange,
      isStepReachable,
    ],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <nav
        data-slot="stepper"
        data-orientation={orientation}
        aria-label={ariaLabel}
        class={cn(stepper(), className)}
        {...rest}
      >
        {showPosition ? <StepperPosition formatPosition={formatPosition} /> : null}
        <StepperList>
          {steps.map((step, index) => (
            <StepperItem key={step.id} stepId={step.id}>
              <div class="flex min-w-0 flex-1 items-center gap-2">
                <StepperTrigger stepId={step.id}>
                  <StepperIndicator stepId={step.id} />
                  <span class="min-w-0">
                    <StepperTitle stepId={step.id}>{step.title}</StepperTitle>
                    {step.description ? (
                      <StepperDescription>{step.description}</StepperDescription>
                    ) : null}
                  </span>
                </StepperTrigger>
                {index < steps.length - 1 ? (
                  <StepperSeparator class="hidden flex-1 sm:block" />
                ) : null}
              </div>
            </StepperItem>
          ))}
        </StepperList>
        {children}
      </nav>
    </StepperContext.Provider>
  );
};
