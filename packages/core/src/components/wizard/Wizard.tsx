import type { ComponentChildren } from "preact";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { Spinner } from "../spinner/Spinner";
import { Stepper } from "../stepper/Stepper";
import type { StepperStepStatus } from "../stepper/stepper-types";
import {
  getNextStepId,
  getPreviousStepId,
  getStepIndex,
  isCompletedStepReachable,
} from "../stepper/stepper-utils";
import { WizardError } from "./WizardError";
import { WizardFooter } from "./WizardFooter";
import { WizardContext } from "./wizard-context";
import type { WizardProps } from "./wizard-types";
import { focusWizardTarget, normalizeWizardValidation } from "./wizard-utils";

export const Wizard = ({
  steps,
  activeStep,
  onStepChange,
  validateStep,
  onComplete,
  labels,
  orientation = "horizontal",
  allowStepNavigation = true,
  keepMounted = false,
  formatPosition,
  class: className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: WizardProps) => {
  const [validating, setValidating] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [stepError, setStepError] = useState<ComponentChildren | null>(null);
  const [completeError, setCompleteError] = useState<ComponentChildren | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<
    Partial<Record<string, StepperStepStatus>>
  >({});

  const validationSeq = useRef(0);
  const completeSeq = useRef(0);
  const pendingRef = useRef(false);
  const stepHeadingRefs = useRef(new Map<string, HTMLHeadingElement>());
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const pendingFocusStepId = useRef<string | null>(null);

  const activeIndex = getStepIndex(steps, activeStep);
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex === steps.length - 1;
  const pending = validating || completing;

  const registerStepHeading = useCallback((stepId: string, node: HTMLHeadingElement | null) => {
    if (node) {
      stepHeadingRefs.current.set(stepId, node);
      return;
    }
    stepHeadingRefs.current.delete(stepId);
  }, []);

  const focusStepHeading = useCallback((stepId: string) => {
    focusWizardTarget(undefined, stepHeadingRefs.current.get(stepId) ?? null);
  }, []);

  const clearStepErrorState = useCallback(() => {
    setStepError(null);
    setStatusOverrides((current) => {
      if (!current[activeStep]) {
        return current;
      }
      const next = { ...current };
      delete next[activeStep];
      return next;
    });
  }, [activeStep]);

  const navigateToStep = useCallback(
    (stepId: string) => {
      clearStepErrorState();
      pendingFocusStepId.current = stepId;
      onStepChange(stepId);
    },
    [clearStepErrorState, onStepChange],
  );

  useEffect(() => {
    if (!pendingFocusStepId.current) {
      return;
    }
    const stepId = pendingFocusStepId.current;
    pendingFocusStepId.current = null;
    focusStepHeading(stepId);
  }, [activeStep, focusStepHeading]);

  const handleHeaderStepChange = useCallback(
    (stepId: string) => {
      if (!allowStepNavigation || pending) {
        return;
      }
      if (!isCompletedStepReachable(steps, activeStep, stepId)) {
        return;
      }
      navigateToStep(stepId);
    },
    [activeStep, allowStepNavigation, navigateToStep, pending, steps],
  );

  const runValidation = useCallback(
    async (stepId: string) => {
      if (!validateStep) {
        return { valid: true } as const;
      }
      return normalizeWizardValidation(validateStep(stepId));
    },
    [validateStep],
  );

  const handleValidationFailure = useCallback(
    (stepId: string, errorMessage?: ComponentChildren, focusTargetId?: string) => {
      setStepError(errorMessage ?? null);
      setStatusOverrides((current) => ({ ...current, [stepId]: "error" }));
      focusWizardTarget(focusTargetId, errorSummaryRef.current);
    },
    [],
  );

  const handleBack = useCallback(() => {
    if (pending) {
      return;
    }
    const previousStepId = getPreviousStepId(steps, activeStep);
    if (!previousStepId) {
      return;
    }
    navigateToStep(previousStepId);
  }, [activeStep, navigateToStep, pending, steps]);

  const handleNext = useCallback(async () => {
    if (pendingRef.current || pending) {
      return;
    }

    pendingRef.current = true;
    const seq = ++validationSeq.current;
    setValidating(true);
    setStepError(null);
    setCompleteError(null);

    try {
      const validation = await runValidation(activeStep);
      if (seq !== validationSeq.current) {
        return;
      }

      if (!validation.valid) {
        handleValidationFailure(activeStep, validation.errorMessage, validation.focusTargetId);
        return;
      }

      clearStepErrorState();
      const nextStepId = getNextStepId(steps, activeStep);
      if (nextStepId) {
        pendingFocusStepId.current = nextStepId;
        onStepChange(nextStepId);
      }
    } finally {
      if (seq === validationSeq.current) {
        pendingRef.current = false;
        setValidating(false);
      }
    }
  }, [
    activeStep,
    clearStepErrorState,
    focusStepHeading,
    handleValidationFailure,
    onStepChange,
    pending,
    runValidation,
    steps,
  ]);

  const handleComplete = useCallback(async () => {
    if (pendingRef.current || pending) {
      return;
    }

    pendingRef.current = true;
    const validationRun = ++validationSeq.current;
    const completionRun = ++completeSeq.current;
    setValidating(true);
    setStepError(null);
    setCompleteError(null);

    try {
      const validation = await runValidation(activeStep);
      if (validationRun !== validationSeq.current) {
        return;
      }

      if (!validation.valid) {
        handleValidationFailure(activeStep, validation.errorMessage, validation.focusTargetId);
        return;
      }

      clearStepErrorState();
      setCompleting(true);

      await onComplete?.();

      if (completionRun !== completeSeq.current) {
        return;
      }
    } catch (error) {
      if (completionRun !== completeSeq.current) {
        return;
      }
      setCompleteError(error instanceof Error ? error.message : "Completion failed.");
      focusWizardTarget(undefined, errorSummaryRef.current);
    } finally {
      if (validationRun === validationSeq.current) {
        setValidating(false);
      }
      if (completionRun === completeSeq.current) {
        pendingRef.current = false;
        setCompleting(false);
      }
    }
  }, [
    activeStep,
    clearStepErrorState,
    handleValidationFailure,
    onComplete,
    pending,
    runValidation,
  ]);

  const wizardContextValue = useMemo(
    () => ({
      activeStep,
      keepMounted,
      validating,
      completing,
      registerStepHeading,
    }),
    [activeStep, completing, keepMounted, registerStepHeading, validating],
  );

  return (
    <WizardContext.Provider value={wizardContextValue}>
      <div
        data-slot="wizard"
        aria-label={ariaLabel}
        class={cn("flex w-full min-w-0 flex-col gap-4", className)}
        {...rest}
      >
        <Stepper
          steps={steps}
          activeStep={activeStep}
          onStepChange={handleHeaderStepChange}
          stepStatus={statusOverrides}
          orientation={orientation}
          allowStepNavigation={allowStepNavigation && !pending}
          aria-label={ariaLabel}
          formatPosition={formatPosition}
        />

        <div data-slot="wizard-body" class="min-w-0">
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            class="outline-none focus:outline-none"
            data-slot="wizard-error-summary"
          >
            {stepError ? <WizardError>{stepError}</WizardError> : null}
            {completeError ? (
              <WizardError title="Completion failed">{completeError}</WizardError>
            ) : null}
          </div>
          {children}
        </div>

        <WizardFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isFirst || pending}
            onClick={handleBack}
          >
            {labels.back}
          </Button>
          {isLast ? (
            <Button type="button" disabled={pending} onClick={() => void handleComplete()}>
              {completing ? <Spinner size="sm" class="me-2" aria-hidden="true" /> : null}
              {labels.complete}
            </Button>
          ) : (
            <Button type="button" disabled={pending} onClick={() => void handleNext()}>
              {validating ? <Spinner size="sm" class="me-2" aria-hidden="true" /> : null}
              {labels.next}
            </Button>
          )}
        </WizardFooter>
      </div>
    </WizardContext.Provider>
  );
};
