import {
  FieldArray,
  Field as FormischField,
  Form as FormischForm,
  insert,
  remove,
  reset,
  useForm,
  validate,
} from "@formisch/preact";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@kamod-ch/ui";
import { X } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import * as v from "valibot";
import {
  arrayInput,
  booleanInput,
  errorsToFieldErrors,
  invalid,
  ResultCard,
  stringInput,
} from "./formisch-utils";

type ExampleProps = { idPrefix: string };

const cardClass = "w-full max-w-xl";
const actionsClass = "flex flex-wrap gap-2";
const initialBugReport = { title: "", description: "" };
const BugReportSchema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(5, "Use at least 5 characters."),
    v.maxLength(32, "Use at most 32 characters."),
  ),
  description: v.pipe(
    v.string(),
    v.minLength(20, "Describe the problem in at least 20 characters."),
    v.maxLength(100, "Keep the description under 100 characters."),
  ),
});
export type BugReportOutput = v.InferOutput<typeof BugReportSchema>;

export const BugReportForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: BugReportSchema,
    initialInput: initialBugReport,
    validate: "submit",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<BugReportOutput | null>(null);
  const [showSubmitErrors, setShowSubmitErrors] = useState(false);
  const formId = `${idPrefix}-bug-form`;
  return (
    <Card class={cardClass}>
      <CardHeader>
        <CardTitle>Bug report</CardTitle>
        <CardDescription>Share a concise title and a reproducible description.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormischForm
          id={formId}
          of={form}
          onSubmit={(output) => setSubmitted(output)}
          class="grid gap-5"
        >
          <FieldSet>
            <FieldGroup>
              <FormischField of={form} path={["title"]}>
                {(field) => {
                  const fieldId = `${idPrefix}-bug-title`;
                  return (
                    <Field invalid={invalid(field)}>
                      <FieldLabel htmlFor={fieldId}>Bug Title</FieldLabel>
                      <Input
                        {...field.props}
                        id={fieldId}
                        value={stringInput(field.input.value)}
                        aria-invalid={invalid(field)}
                        placeholder="Dropdown closes too early"
                      />
                      <FieldDescription>5–32 characters.</FieldDescription>
                      <FieldError
                        errors={errorsToFieldErrors(
                          field.errors.value ??
                            (showSubmitErrors && stringInput(field.input.value).length < 5
                              ? ["Use at least 5 characters."]
                              : null),
                        )}
                      />
                    </Field>
                  );
                }}
              </FormischField>
              <FormischField of={form} path={["description"]}>
                {(field) => {
                  const fieldId = `${idPrefix}-bug-description`;
                  const value = stringInput(field.input.value);
                  return (
                    <Field invalid={invalid(field)}>
                      <FieldLabel htmlFor={fieldId}>Description</FieldLabel>
                      <Textarea
                        {...field.props}
                        id={fieldId}
                        value={value}
                        aria-invalid={invalid(field)}
                        rows={4}
                        placeholder="Tell us what happened and how to reproduce it."
                      />
                      <FieldDescription>
                        <span class="tabular-nums">{value.length}/100</span> characters. Minimum 20.
                      </FieldDescription>
                      <FieldError
                        errors={errorsToFieldErrors(
                          field.errors.value ??
                            (showSubmitErrors && value.length < 20
                              ? ["Describe the problem in at least 20 characters."]
                              : null),
                        )}
                      />
                    </Field>
                  );
                }}
              </FormischField>
            </FieldGroup>
          </FieldSet>
          <div class={actionsClass}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(form);
                setSubmitted(null);
                setShowSubmitErrors(false);
              }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setShowSubmitErrors(true);
                void validate(form);
              }}
            >
              Submit
            </Button>
          </div>
          {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
        </FormischForm>
      </CardContent>
    </Card>
  );
};

const ProfileSchema = v.object({
  username: v.pipe(
    v.string(),
    v.regex(/^[a-z0-9_-]+$/, "Use lowercase letters, numbers, underscores or dashes."),
    v.minLength(3, "Use at least 3 characters."),
    v.maxLength(20, "Use at most 20 characters."),
  ),
});
export const ProfileSettingsForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: ProfileSchema,
    initialInput: { username: "kamod_user" },
    validate: "blur",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof ProfileSchema> | null>(null);
  return (
    <ExampleCard title="Profile settings" description="A native input bound to a Formisch field.">
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FormischField of={form} path={["username"]}>
          {(field) => (
            <Field invalid={invalid(field)}>
              <FieldLabel htmlFor={`${idPrefix}-username`}>Username</FieldLabel>
              <Input
                {...field.props}
                id={`${idPrefix}-username`}
                value={stringInput(field.input.value)}
                aria-invalid={invalid(field)}
                autoComplete="username"
              />
              <FieldDescription>
                Only lowercase letters, numbers, underscores and dashes. 3–20 characters.
              </FieldDescription>
              <FieldError errors={errorsToFieldErrors(field.errors.value)} />
            </Field>
          )}
        </FormischField>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const AboutSchema = v.object({
  about: v.pipe(
    v.string(),
    v.minLength(24, "Write at least 24 characters."),
    v.maxLength(160, "Keep it below 160 characters."),
  ),
});
export const PersonalizationForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: AboutSchema,
    initialInput: { about: "" },
    validate: "submit",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof AboutSchema> | null>(null);
  return (
    <ExampleCard
      title="Personalization"
      description="Textarea fields use the same Formisch props as native inputs."
    >
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FormischField of={form} path={["about"]}>
          {(field) => {
            const value = stringInput(field.input.value);
            return (
              <Field invalid={invalid(field)}>
                <FieldLabel htmlFor={`${idPrefix}-about`}>More about you</FieldLabel>
                <Textarea
                  {...field.props}
                  id={`${idPrefix}-about`}
                  value={value}
                  aria-invalid={invalid(field)}
                  rows={5}
                  placeholder="I build accessible interfaces with Preact…"
                />
                <FieldDescription>
                  <span class="tabular-nums">{value.length}/160</span> characters. Minimum 24.
                </FieldDescription>
                <FieldError errors={errorsToFieldErrors(field.errors.value)} />
              </Field>
            );
          }}
        </FormischField>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const LanguageSchema = v.object({
  language: v.pipe(
    v.string(),
    v.minLength(1, "Choose a spoken language."),
    v.picklist(["en", "de", "fr", "it", "rm"], "Choose a spoken language."),
  ),
});
const languages = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "it", label: "Italian" },
  { value: "rm", label: "Romansh" },
];
export const LanguagePreferencesForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: LanguageSchema,
    initialInput: { language: "" },
    validate: "submit",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof LanguageSchema> | null>(null);
  return (
    <ExampleCard
      title="Language preferences"
      description="Component controls call field.onInput with their selected value."
    >
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FormischField of={form} path={["language"]}>
          {(field) => {
            const value = stringInput(field.input.value);
            return (
              <Field invalid={invalid(field)}>
                <FieldLabel id={`${idPrefix}-language-label`}>Spoken Language</FieldLabel>
                <Select value={value} onValueChange={field.onInput}>
                  <SelectTrigger
                    aria-labelledby={`${idPrefix}-language-label`}
                    aria-invalid={invalid(field)}
                  >
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>Used for examples and localized content.</FieldDescription>
                <FieldError errors={errorsToFieldErrors(field.errors.value)} />
              </Field>
            );
          }}
        </FormischField>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const channels = ["product", "security", "billing"] as const;
type Channel = (typeof channels)[number];
const NotificationsSchema = v.object({
  channels: v.pipe(
    v.array(v.picklist(channels)),
    v.minLength(1, "Choose at least one notification type."),
  ),
});
export const NotificationPreferencesForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: NotificationsSchema,
    initialInput: { channels: ["security"] },
    validate: "submit",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof NotificationsSchema> | null>(
    null,
  );
  return (
    <ExampleCard
      title="Notifications"
      description="Checkbox groups update array values without mutation."
    >
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FormischField of={form} path={["channels"]}>
          {(field) => {
            const selected = arrayInput<Channel>(field.input.value);
            return (
              <FieldSet>
                <FieldLegend>Notification channels</FieldLegend>
                <FieldDescription>Select at least one category.</FieldDescription>
                <FieldGroup>
                  {channels.map((channel) => (
                    <Field orientation="horizontal" invalid={invalid(field)} key={channel}>
                      <Checkbox
                        id={`${idPrefix}-channel-${channel}`}
                        checked={selected.includes(channel)}
                        aria-invalid={invalid(field)}
                        onCheckedChange={(checked) =>
                          field.onInput(
                            checked === true
                              ? [...selected, channel]
                              : selected.filter((item) => item !== channel),
                          )
                        }
                      />
                      <FieldLabel htmlFor={`${idPrefix}-channel-${channel}`} class="capitalize">
                        {channel}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                <FieldError errors={errorsToFieldErrors(field.errors.value)} />
              </FieldSet>
            );
          }}
        </FormischField>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const PlanSchema = v.object({
  plan: v.pipe(
    v.string(),
    v.minLength(1, "Choose a subscription plan."),
    v.picklist(["starter", "pro", "enterprise"], "Choose a subscription plan."),
  ),
});
const plans = [
  { value: "starter", title: "Starter", description: "Essentials for small projects." },
  { value: "pro", title: "Pro", description: "Advanced features for teams." },
  { value: "enterprise", title: "Enterprise", description: "Dedicated support and controls." },
];
export const SubscriptionPlanForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: PlanSchema,
    initialInput: { plan: "" },
    validate: "submit",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof PlanSchema> | null>(null);
  return (
    <ExampleCard
      title="Subscription plan"
      description="RadioGroup keeps the selected value in Formisch state."
    >
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FormischField of={form} path={["plan"]}>
          {(field) => (
            <FieldSet>
              <FieldLegend>Plan</FieldLegend>
              <RadioGroup
                aria-invalid={invalid(field)}
                value={stringInput(field.input.value)}
                onValueChange={field.onInput}
                name={`${idPrefix}-plan`}
              >
                {plans.map((plan) => (
                  <RadioGroupItem key={plan.value} value={plan.value} aria-invalid={invalid(field)}>
                    <FieldContent>
                      <FieldTitle>{plan.title}</FieldTitle>
                      <FieldDescription>{plan.description}</FieldDescription>
                    </FieldContent>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
              <FieldError errors={errorsToFieldErrors(field.errors.value)} />
            </FieldSet>
          )}
        </FormischField>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const SecuritySchema = v.object({ mfa: v.boolean() });
export const SecuritySettingsForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({ schema: SecuritySchema, initialInput: { mfa: false }, validate: "input" });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof SecuritySchema> | null>(null);
  return (
    <ExampleCard title="Security settings" description="Switch controls pass booleans to Formisch.">
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FormischField of={form} path={["mfa"]}>
          {(field) => (
            <Field orientation="horizontal" invalid={invalid(field)}>
              <Switch
                id={`${idPrefix}-mfa`}
                checked={booleanInput(field.input.value)}
                onCheckedChange={field.onInput}
                aria-invalid={invalid(field)}
              />
              <FieldContent>
                <FieldLabel htmlFor={`${idPrefix}-mfa`}>Multi-factor authentication</FieldLabel>
                <FieldDescription>Require a second factor for sign-in.</FieldDescription>
                <FieldError errors={errorsToFieldErrors(field.errors.value)} />
              </FieldContent>
            </Field>
          )}
        </FormischField>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const addOns = ["analytics", "support", "audit"] as const;
type AddOn = (typeof addOns)[number];
const ComplexSchema = v.object({
  plan: v.pipe(v.string(), v.picklist(["starter", "pro", "enterprise"])),
  billing: v.pipe(v.string(), v.picklist(["monthly", "yearly"])),
  addons: v.array(v.picklist(addOns)),
  email: v.boolean(),
});
export const SubscriptionPreferencesForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: ComplexSchema,
    initialInput: { plan: "pro", billing: "yearly", addons: ["analytics"], email: true },
    validate: "submit",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof ComplexSchema> | null>(null);
  return (
    <ExampleCard
      title="Complex subscription form"
      description="A larger form combines radio groups, select, checkbox arrays, and switches."
    >
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FormischField of={form} path={["plan"]}>
          {(field) => (
            <FieldSet>
              <FieldLegend>Subscription Plan</FieldLegend>
              <RadioGroup
                name={`${idPrefix}-complex-plan`}
                value={stringInput(field.input.value)}
                onValueChange={field.onInput}
              >
                {plans.map((plan) => (
                  <RadioGroupItem key={plan.value} value={plan.value}>
                    {plan.title}
                  </RadioGroupItem>
                ))}
              </RadioGroup>
              <FieldError errors={errorsToFieldErrors(field.errors.value)} />
            </FieldSet>
          )}
        </FormischField>
        <FormischField of={form} path={["billing"]}>
          {(field) => (
            <Field>
              <FieldLabel id={`${idPrefix}-billing-label`}>Billing Period</FieldLabel>
              <Select value={stringInput(field.input.value)} onValueChange={field.onInput}>
                <SelectTrigger aria-labelledby={`${idPrefix}-billing-label`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        </FormischField>
        <FormischField of={form} path={["addons"]}>
          {(field) => {
            const selected = arrayInput<AddOn>(field.input.value);
            return (
              <FieldSet>
                <FieldLegend>Add-ons</FieldLegend>
                {addOns.map((addon) => (
                  <Field orientation="horizontal" key={addon}>
                    <Checkbox
                      id={`${idPrefix}-addon-${addon}`}
                      checked={selected.includes(addon)}
                      onCheckedChange={(checked) =>
                        field.onInput(
                          checked === true
                            ? [...selected, addon]
                            : selected.filter((item) => item !== addon),
                        )
                      }
                    />
                    <FieldLabel htmlFor={`${idPrefix}-addon-${addon}`} class="capitalize">
                      {addon}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldSet>
            );
          }}
        </FormischField>
        <FormischField of={form} path={["email"]}>
          {(field) => (
            <Field orientation="horizontal">
              <Switch
                id={`${idPrefix}-email`}
                checked={booleanInput(field.input.value)}
                onCheckedChange={field.onInput}
              />
              <FieldLabel htmlFor={`${idPrefix}-email`}>Email Notifications</FieldLabel>
            </Field>
          )}
        </FormischField>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save Preferences"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const EmailsSchema = v.object({
  emails: v.pipe(
    v.array(v.pipe(v.string(), v.email("Enter a valid email address."))),
    v.minLength(1, "Keep at least one email address."),
    v.maxLength(5, "Use no more than five email addresses."),
  ),
});
export const ContactEmailsForm = ({ idPrefix }: ExampleProps) => {
  const form = useForm({
    schema: EmailsSchema,
    initialInput: { emails: ["hello@kamod.ch"] },
    validate: "submit",
    revalidate: "input",
  });
  const [submitted, setSubmitted] = useState<v.InferOutput<typeof EmailsSchema> | null>(null);
  return (
    <ExampleCard
      title="Contact emails"
      description="FieldArray supplies stable item keys while insert and remove update the array."
    >
      <FormischForm of={form} onSubmit={(output) => setSubmitted(output)} class="grid gap-5">
        <FieldArray of={form} path={["emails"]}>
          {(array) => (
            <FieldSet>
              <FieldLegend>Contact Emails</FieldLegend>
              <FieldDescription>Add up to five addresses.</FieldDescription>
              <FieldGroup>
                {array.items.value.map((itemId, index) => (
                  <FormischField key={itemId} of={form} path={["emails", index]}>
                    {(field) => (
                      <Field invalid={invalid(field)}>
                        <FieldLabel htmlFor={`${idPrefix}-email-${itemId}`}>
                          Email {index + 1}
                        </FieldLabel>
                        <div class="flex gap-2">
                          <Input
                            {...field.props}
                            id={`${idPrefix}-email-${itemId}`}
                            value={stringInput(field.input.value)}
                            type="email"
                            aria-invalid={invalid(field)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-label={`Remove email ${index + 1}`}
                            disabled={array.items.value.length <= 1}
                            onClick={() => remove(form, { path: ["emails"], at: index })}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                        <FieldError errors={errorsToFieldErrors(field.errors.value)} />
                      </Field>
                    )}
                  </FormischField>
                ))}
              </FieldGroup>
              <FieldError errors={errorsToFieldErrors(array.errors.value)} />
              <Button
                type="button"
                variant="outline"
                disabled={array.items.value.length >= 5}
                onClick={() =>
                  insert(form, { path: ["emails"], at: array.items.value.length, initialInput: "" })
                }
              >
                Add email
              </Button>
            </FieldSet>
          )}
        </FieldArray>
        <Actions
          onReset={() => {
            reset(form);
            setSubmitted(null);
          }}
          submit="Save"
        />
        {submitted ? <ResultCard>{JSON.stringify(submitted, null, 2)}</ResultCard> : null}
      </FormischForm>
    </ExampleCard>
  );
};

const ExampleCard = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ComponentChildren;
}) => (
  <Card class={cardClass}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);
const Actions = ({ onReset, submit }: { onReset: () => void; submit: string }) => (
  <div class={actionsClass}>
    <Button type="button" variant="outline" onClick={onReset}>
      Reset
    </Button>
    <Button type="submit">{submit}</Button>
  </div>
);
