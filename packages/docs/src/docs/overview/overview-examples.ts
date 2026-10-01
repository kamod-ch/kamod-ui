import type { OverviewExample } from "../components/OverviewExamples";

export const formExamples: readonly OverviewExample[] = [
  {
    id: "native",
    label: "Native",
    title: "Start with the browser’s form semantics",
    description:
      "A visible label, a named field and a submit button are enough for a small form. Native required and email validation run before the submit handler. The callback below belongs to your application; the live demo only checks the form locally.",
    filePath: "src/components/EmailForm.tsx",
    language: "tsx",
    code: `import { Button, Input, Label } from "@kamod-ch/ui";

export function EmailForm({ onSave }: { onSave: (email: string) => void }) {
  return (
    <form class="grid gap-3" onSubmit={(event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      onSave(String(data.get("email") ?? ""));
    }}>
      <Label htmlFor="contact-email">Email address</Label>
      <Input id="contact-email" name="email" type="email"
        autoComplete="email" required aria-describedby="email-help" />
      <p id="email-help">Use the address where we can reach you.</p>
      <Button type="submit">Save email</Button>
    </form>
  );
}`,
    check:
      "Try an empty value, an invalid address and Enter from the input. Give repeated form instances unique IDs. Add explicit pending and error handling when onSave calls a service.",
  },
  {
    id: "schema",
    label: "Schema",
    title: "Describe the input you are willing to accept",
    description:
      "Use a schema when validation rules need a single, typed definition. This Valibot example trims the email and validates it. Parse untrusted input again on the server; client validation helps users but does not establish trust.",
    filePath: "src/forms/contact-schema.ts",
    language: "tsx",
    code: `import * as v from "valibot";

export const ContactSchema = v.object({
  email: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty("Enter your email address."),
    v.email("Enter a valid email address."),
  ),
});

export type Contact = v.InferOutput<typeof ContactSchema>;

export function parseContact(input: unknown) {
  return v.safeParse(ContactSchema, input);
}`,
    check:
      "Check empty input, surrounding whitespace and malformed addresses. Use the parsed output after a successful result; a TypeScript type alone does not validate incoming data.",
  },
  {
    id: "formisch",
    label: "Formisch",
    title: "Connect a schema to a Kamod input",
    description:
      "Formisch owns values, validation and submission; Kamod supplies the controls. This self-contained example validates on submit and revalidates while editing. The async save callback lets your application provide the service boundary.",
    filePath: "src/forms/ContactForm.tsx",
    language: "tsx",
    code: `import { Field, Form, useForm } from "@formisch/preact";
import { Button, Input, Label } from "@kamod-ch/ui";
import * as v from "valibot";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Enter a valid email address.")),
});

export function ContactForm({ onSave }: {
  onSave: (data: v.InferOutput<typeof schema>) => Promise<void>;
}) {
  const form = useForm({ schema, initialInput: { email: "" },
    validate: "submit", revalidate: "input" });
  return (
    <Form of={form} onSubmit={onSave} class="grid gap-3">
      <Field of={form} path={["email"]}>{(field) => <>
        <Label htmlFor="schema-email">Email address</Label>
        <Input {...field.props} id="schema-email" type="email"
          value={typeof field.input.value === "string" ? field.input.value : ""}
          aria-invalid={!!field.errors.value?.length}
          aria-describedby="schema-email-error" />
        <p id="schema-email-error">{field.errors.value?.[0]}</p>
      </>}</Field>
      <Button type="submit" disabled={form.isSubmitting.value}>
        {form.isSubmitting.value ? "Saving…" : "Save email"}
      </Button>
    </Form>
  );
}`,
    check:
      "Return the save promise so the form can track submission. Handle service failures in your application and keep input available for retry. See the full guide for server errors, custom controls and field arrays.",
  },
];

export const packageExamples: readonly OverviewExample[] = [
  {
    id: "hooks",
    label: "Hooks",
    title: "Pair reusable behavior with a semantic control",
    description:
      "useToggle keeps the state transition small. A core Button still provides the control, while aria-expanded and aria-controls explain which content it reveals. The live example stays local and resets on reload.",
    filePath: "src/components/DetailsToggle.tsx",
    language: "tsx",
    code: `import { useToggle } from "@kamod-ch/hooks";
import { Button } from "@kamod-ch/ui";

export function DetailsToggle() {
  const [open, { toggle }] = useToggle(false);
  return (
    <div class="space-y-3">
      <Button type="button" variant="outline" onClick={toggle}
        aria-expanded={open} aria-controls="package-details">
        {open ? "Hide details" : "Show details"}
      </Button>
      <p id="package-details" hidden={!open}>
        A hook owns behavior; a component presents the interaction.
      </p>
    </div>
  );
}`,
    check:
      "Try Enter and Space on the button. Use unique IDs if this example appears more than once. A single boolean may also be handled with Preact’s useState; choose the abstraction that helps your project.",
  },
  {
    id: "icons",
    label: "Icons",
    title: "Make an icon action understandable",
    description:
      "Import a named icon from a documented family. Let the icon inherit the theme color and put the accessible name on the button. Keep the callback explicit so the component works with any router or service.",
    filePath: "src/components/OpenSearch.tsx",
    language: "tsx",
    code: `import { SearchIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";

export function OpenSearch({ onOpen }: { onOpen: () => void }) {
  return (
    <Button type="button" variant="ghost" size="icon"
      aria-label="Open search" onClick={onOpen}>
      <SearchIcon size={18} aria-hidden="true" />
    </Button>
  );
}`,
    check:
      "Keep the visible icon and accessible action consistent. If search opens a dialog, use the documented dialog composition so focus moves into it and returns to the trigger after closing.",
  },
  {
    id: "signals",
    label: "Signals",
    title: "Persist a small, non-sensitive preference",
    description:
      "For a client-rendered preference, usePersistedSignal connects a scoped signal to local storage and disposes its controller on unmount. For SSR, follow the package’s initialization and cookie guidance so the server and first client render agree.",
    filePath: "src/components/DensityPreference.tsx",
    language: "tsx",
    code: `import { usePersistedSignal } from "@kamod-ch/signals";
import { Button } from "@kamod-ch/ui";

export function DensityPreference() {
  const compact = usePersistedSignal("app:density:compact", false, {
    storage: "local",
  });
  return (
    <Button type="button" variant="outline"
      aria-pressed={compact.value}
      onClick={() => { compact.value = !compact.value; }}>
      {compact.value ? "Compact rows" : "Comfortable rows"}
    </Button>
  );
}`,
    check:
      "Try a reload and blocked storage. Use a namespaced key, define reset behavior and treat restored data as untrusted. This example labels a preference; apply the value to your own row layout.",
  },
];
