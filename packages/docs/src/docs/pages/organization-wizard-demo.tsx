import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DescriptionList,
  DescriptionListDetails,
  DescriptionListItem,
  DescriptionListTerm,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  Wizard,
  WizardStep,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import * as v from "valibot";

const WIZARD_STEPS = [
  { id: "organization", title: "Organization", description: "Name your workspace" },
  { id: "team", title: "Team", description: "Invite a teammate" },
  { id: "review", title: "Review", description: "Confirm and create" },
] as const;

type WizardStepId = (typeof WIZARD_STEPS)[number]["id"];

type OrganizationDraft = {
  organizationName: string;
  inviteEmail: string;
};

const OrganizationSchema = v.object({
  organizationName: v.pipe(
    v.string(),
    v.minLength(2, "Organization name must be at least 2 characters."),
    v.maxLength(48, "Organization name must be 48 characters or fewer."),
  ),
});

const TeamSchema = v.object({
  inviteEmail: v.pipe(v.string(), v.email("Enter a valid email address.")),
});

const initialDraft: OrganizationDraft = {
  organizationName: "",
  inviteEmail: "",
};

export const OrganizationWizardDemo = () => {
  const [activeStep, setActiveStep] = useState<WizardStepId>("organization");
  const [draft, setDraft] = useState<OrganizationDraft>(initialDraft);
  const [created, setCreated] = useState<OrganizationDraft | null>(null);

  const validateStep = async (stepId: string) => {
    if (stepId === "organization") {
      const result = v.safeParse(OrganizationSchema, {
        organizationName: draft.organizationName.trim(),
      });
      if (!result.success) {
        return {
          valid: false,
          errorMessage: result.issues[0]?.message ?? "Organization details are invalid.",
          focusTargetId: "wizard-org-name",
        };
      }
      return true;
    }

    if (stepId === "team") {
      if (!draft.inviteEmail.trim()) {
        return true;
      }
      const result = v.safeParse(TeamSchema, { inviteEmail: draft.inviteEmail.trim() });
      if (!result.success) {
        return {
          valid: false,
          errorMessage: result.issues[0]?.message ?? "Team invite is invalid.",
          focusTargetId: "wizard-team-email",
        };
      }
      return true;
    }

    return true;
  };

  const handleComplete = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    if (draft.organizationName.trim().toLowerCase() === "fail") {
      throw new Error("Workspace creation failed. Try a different organization name.");
    }
    setCreated({
      organizationName: draft.organizationName.trim(),
      inviteEmail: draft.inviteEmail.trim(),
    });
  };

  if (created) {
    return (
      <Card class="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Workspace created</CardTitle>
          <CardDescription>
            {created.inviteEmail
              ? "Your organization is ready and the invite was queued."
              : "Your organization is ready."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DescriptionList bordered layout="inline" class="max-w-xl">
            <DescriptionListItem>
              <DescriptionListTerm>Organization</DescriptionListTerm>
              <DescriptionListDetails>{created.organizationName}</DescriptionListDetails>
            </DescriptionListItem>
            {created.inviteEmail ? (
              <DescriptionListItem>
                <DescriptionListTerm>Invite</DescriptionListTerm>
                <DescriptionListDetails>{created.inviteEmail}</DescriptionListDetails>
              </DescriptionListItem>
            ) : null}
          </DescriptionList>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card class="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Create organization</CardTitle>
        <CardDescription>
          Organization → team invite → review → complete. Valibot validates in the consumer; Kamod
          Field/Input render the steps. Inactive steps unmount by default — set{" "}
          <code class="text-xs">keepMounted</code> to preserve heavy form trees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Wizard
          steps={WIZARD_STEPS}
          activeStep={activeStep}
          onStepChange={(stepId) => setActiveStep(stepId as WizardStepId)}
          validateStep={validateStep}
          onComplete={handleComplete}
          allowStepNavigation
          labels={{
            back: "Back",
            next: "Continue",
            complete: "Create organization",
          }}
          formatPosition={(current, total) => `Step ${current} of ${total}`}
          aria-label="Create organization wizard"
        >
          <WizardStep stepId="organization" title="Create your organization">
            <Field>
              <FieldLabel htmlFor="wizard-org-name">Organization name</FieldLabel>
              <Input
                id="wizard-org-name"
                value={draft.organizationName}
                placeholder="Northwind Labs"
                onInput={(event) =>
                  setDraft((current) => ({
                    ...current,
                    organizationName: (event.currentTarget as HTMLInputElement).value,
                  }))
                }
              />
              <FieldDescription>
                2–48 characters. Type “fail” to demo completion errors.
              </FieldDescription>
              <FieldError errors={[]} />
            </Field>
          </WizardStep>

          <WizardStep stepId="team" title="Invite your team">
            <Field>
              <FieldLabel htmlFor="wizard-team-email">Teammate email</FieldLabel>
              <Input
                id="wizard-team-email"
                type="email"
                value={draft.inviteEmail}
                placeholder="ops@example.com"
                onInput={(event) =>
                  setDraft((current) => ({
                    ...current,
                    inviteEmail: (event.currentTarget as HTMLInputElement).value,
                  }))
                }
              />
              <FieldDescription>
                Optional for this demo — leave blank to skip an invite.
              </FieldDescription>
              <FieldError errors={[]} />
            </Field>
          </WizardStep>

          <WizardStep stepId="review" title="Review and complete">
            <DescriptionList bordered layout="inline" class="max-w-xl">
              <DescriptionListItem>
                <DescriptionListTerm>Organization</DescriptionListTerm>
                <DescriptionListDetails>
                  {draft.organizationName.trim() || "—"}
                </DescriptionListDetails>
              </DescriptionListItem>
              <DescriptionListItem>
                <DescriptionListTerm>Invite</DescriptionListTerm>
                <DescriptionListDetails>
                  {draft.inviteEmail.trim() || "No invite"}
                </DescriptionListDetails>
              </DescriptionListItem>
            </DescriptionList>
            <p class="text-muted-foreground mt-4 text-sm">
              Create organization runs <code class="text-xs">onComplete</code> with its own pending
              and error state. Back and Continue never submit forms automatically.
            </p>
          </WizardStep>
        </Wizard>
      </CardContent>
    </Card>
  );
};
