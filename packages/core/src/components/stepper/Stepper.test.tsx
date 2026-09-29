import { fireEvent, render, screen } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { Stepper } from "./Stepper";
import type { StepperStepDefinition } from "./stepper-types";
import { getNextStepId, resolveStepStatuses } from "./stepper-utils";

const STEPS: StepperStepDefinition[] = [
  { id: "org", title: "Organization" },
  { id: "team", title: "Team" },
  { id: "review", title: "Review" },
];

describe("stepper utils", () => {
  it("resolves statuses from active step id", () => {
    expect(resolveStepStatuses(STEPS, "team")).toEqual({
      org: "completed",
      team: "current",
      review: "upcoming",
    });
  });

  it("returns the next step id", () => {
    expect(getNextStepId(STEPS, "org")).toBe("team");
    expect(getNextStepId(STEPS, "review")).toBeNull();
  });
});

describe("Stepper", () => {
  it("marks the active step with aria-current", () => {
    render(
      <Stepper steps={STEPS} activeStep="team" aria-label="Setup steps" showPosition={false} />,
    );

    const current = screen.getByRole("button", { name: /Team/i });
    expect(current).toHaveAttribute("aria-current", "step");
  });

  it("navigates only to completed steps when allowStepNavigation is enabled", () => {
    const onStepChange = vi.fn();
    const Stateful = () => {
      const [activeStep, setActiveStep] = useState("review");
      return (
        <Stepper
          steps={STEPS}
          activeStep={activeStep}
          onStepChange={(stepId) => {
            onStepChange(stepId);
            setActiveStep(stepId);
          }}
          allowStepNavigation
          aria-label="Setup steps"
          showPosition={false}
        />
      );
    };

    render(<Stateful />);

    fireEvent.click(screen.getByRole("button", { name: /Organization/i }));
    expect(onStepChange).toHaveBeenCalledWith("org");

    fireEvent.click(screen.getByRole("button", { name: /Review/i }));
    expect(onStepChange).toHaveBeenCalledTimes(1);
  });

  it("shows a compact mobile position indicator by default", () => {
    render(<Stepper steps={STEPS} activeStep="team" aria-label="Setup steps" />);
    expect(screen.getByText("2 / 3")).toBeTruthy();
  });
});
