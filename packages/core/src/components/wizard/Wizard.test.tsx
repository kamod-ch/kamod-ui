import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import type { StepperStepDefinition } from "../stepper/stepper-types";
import { Wizard } from "./Wizard";
import { WizardStep } from "./WizardStep";

const STEPS: StepperStepDefinition[] = [
  { id: "org", title: "Organization" },
  { id: "team", title: "Team" },
  { id: "review", title: "Review" },
];

const LABELS = {
  back: "Back",
  next: "Continue",
  complete: "Finish",
};

const WizardFixture = ({
  validateStep,
  onComplete,
  initialData = { org: "Acme", team: "ada@example.com" },
}: {
  validateStep?: (
    stepId: string,
  ) =>
    | boolean
    | Promise<boolean | { valid: boolean; errorMessage?: string; focusTargetId?: string }>;
  onComplete?: () => void | Promise<void>;
  initialData?: { org: string; team: string };
}) => {
  const [activeStep, setActiveStep] = useState("org");
  const [data, setData] = useState(initialData);

  return (
    <Wizard
      steps={STEPS}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      validateStep={validateStep}
      onComplete={onComplete}
      labels={LABELS}
      aria-label="Create organization"
    >
      <WizardStep stepId="org" title="Organization details">
        <label for="org-name">
          Name
          <input
            id="org-name"
            value={data.org}
            onInput={(event) =>
              setData((current) => ({
                ...current,
                org: (event.currentTarget as HTMLInputElement).value,
              }))
            }
          />
        </label>
      </WizardStep>
      <WizardStep stepId="team" title="Invite team">
        <label for="team-email">
          Email
          <input
            id="team-email"
            value={data.team}
            onInput={(event) =>
              setData((current) => ({
                ...current,
                team: (event.currentTarget as HTMLInputElement).value,
              }))
            }
          />
        </label>
        <output data-testid="team-value">{data.team}</output>
      </WizardStep>
      <WizardStep stepId="review" title="Review">
        <p data-testid="review-org">{data.org}</p>
        <p data-testid="review-team">{data.team}</p>
      </WizardStep>
    </Wizard>
  );
};

describe("Wizard", () => {
  it("shows a validation error and stays on the current step", async () => {
    render(
      <WizardFixture
        validateStep={(stepId) => {
          if (stepId === "org") {
            return {
              valid: false,
              errorMessage: "Organization name is required.",
              focusTargetId: "org-name",
            };
          }
          return true;
        }}
        initialData={{ org: "", team: "" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Organization name is required.");
      expect(screen.getByRole("heading", { name: "Organization details" })).toBeTruthy();
    });
  });

  it("supports async validation before advancing", async () => {
    const validateStep = vi.fn(async (stepId: string) => {
      await new Promise((resolve) => window.setTimeout(resolve, 20));
      return stepId === "org" ? true : true;
    });

    render(<WizardFixture validateStep={validateStep} />);

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(validateStep).toHaveBeenCalledWith("org");
      expect(screen.getByRole("heading", { name: "Invite team" })).toBeTruthy();
    });
  });

  it("prevents double submission while validation is running", async () => {
    let resolveValidation: (() => void) | undefined;
    const validateStep = vi.fn(
      () =>
        new Promise<boolean>((resolve) => {
          resolveValidation = () => resolve(true);
        }),
    );

    render(<WizardFixture validateStep={validateStep} />);

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    expect(validateStep).toHaveBeenCalledTimes(1);

    resolveValidation?.();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Invite team" })).toBeTruthy();
    });
  });

  it("preserves entered data when navigating back without re-validating", async () => {
    render(
      <WizardFixture
        validateStep={(stepId) => {
          if (stepId === "org") {
            return Boolean(screen.getByLabelText("Name").value.length > 0);
          }
          return true;
        }}
      />,
    );

    fireEvent.input(screen.getByLabelText("Name"), { target: { value: "Northwind Labs" } });
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Invite team" })).toBeTruthy();
    });

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "ops@northwind.dev" } });
    fireEvent.click(screen.getByRole("button", { name: "Back" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Northwind Labs");
    });

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(screen.getByTestId("team-value")).toHaveTextContent("ops@northwind.dev");
    });
  });

  it("shows completion errors without leaving the final step", async () => {
    render(
      <WizardFixture
        validateStep={() => true}
        onComplete={async () => {
          throw new Error("Could not create organization.");
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Invite team" })).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Review" })).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "Finish" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Could not create organization.");
      expect(screen.getByRole("heading", { name: "Review" })).toBeTruthy();
    });
  });

  it("focuses the new step heading after a successful transition", async () => {
    render(<WizardFixture validateStep={() => true} />);

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole("heading", { name: "Invite team" }));
    });
  });

  it("unmounts inactive steps by default", async () => {
    render(<WizardFixture validateStep={() => true} />);

    expect(screen.getByLabelText("Name")).toBeTruthy();
    expect(screen.queryByLabelText("Email")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(screen.queryByLabelText("Name")).toBeNull();
      expect(screen.getByLabelText("Email")).toBeTruthy();
    });
  });
});
