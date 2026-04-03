import type { JSX } from "preact";
import { Button, Field, Textarea } from "@kamod-ui/core";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const TextareaCounterPreview = () => {
  const maxLength = 240;
  const [value, setValue] = useState("");

  return (
    <div class="docs-form-surface w-full max-w-xl">
      <Field label="Message" description="Keep it concise and actionable.">
        <Textarea
          value={value}
          maxLength={maxLength}
          placeholder="What should we improve next?"
          onInput={(event) => setValue((event.currentTarget as HTMLTextAreaElement).value)}
        />
      </Field>
      <div class="mt-2 text-right text-xs text-muted-foreground">
        {value.length}/{maxLength}
      </div>
    </div>
  );
};

const TextareaAutosizePreview = () => {
  const [value, setValue] = useState("");

  const handleInput = (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    const element = event.currentTarget;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 240)}px`;
    setValue(element.value);
  };

  return (
    <div class="docs-form-surface w-full max-w-xl">
      <Field
        label="Auto-resize Message"
        description="This textarea grows with content until it reaches a comfortable max height."
      >
        <Textarea
          value={value}
          style={{ minHeight: "92px", maxHeight: "240px", overflowY: "auto" }}
          placeholder="Start typing a longer message..."
          onInput={handleInput}
        />
      </Field>
    </div>
  );
};

const TextareaProductionFieldPreview = () => {
  const maxLength = 180;
  const [value, setValue] = useState("");
  const isTooShort = value.length > 0 && value.trim().length < 20;

  return (
    <div class="docs-form-surface w-full max-w-xl">
      <Field
        label="Release note"
        required
        description="Describe the change in at least 20 characters."
        error={isTooShort ? "Please add more detail so the update is clear to users." : undefined}
      >
        <Textarea
          value={value}
          maxLength={maxLength}
          aria-invalid={isTooShort ? "true" : undefined}
          placeholder="What changed, and why does it matter?"
          onInput={(event) => setValue((event.currentTarget as HTMLTextAreaElement).value)}
        />
      </Field>
      <div class="mt-2 flex items-center justify-between gap-2 text-xs">
        <span class={isTooShort ? "text-destructive" : "text-muted-foreground"}>
          {isTooShort ? "Minimum 20 characters required." : "Looks good."}
        </span>
        <span class={value.length >= maxLength ? "text-destructive" : "text-muted-foreground"}>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export const textareaDocPage = createGenericDocPage({
  slug: "textarea",
  title: "Textarea",
  usageLabel: "Textarea captures longer multi-line user input.",
  installationText: "Import Textarea from `@/components/kamod-ui/textarea`.",
  usageText: "Use Textarea with Field for labels, descriptions, errors, and more modern form layouts.",
  exampleSections: [
    {
      id: "basic-textarea",
      title: "Basic Textarea",
      text: "A clean default surface for short notes and feedback.",
      code: `import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => <Textarea placeholder="Write your feedback..." class="max-w-lg" />;`,
      renderPreview: () => (
        <div class="docs-form-surface w-full max-w-xl">
          <div class="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Quick Feedback</div>
          <Textarea placeholder="Write your feedback..." class="w-full" />
        </div>
      )
    },
    {
      id: "textarea-field",
      title: "Field + Description",
      text: "Wrap Textarea with Field for semantic labels and helper text.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => (
  <Field
    class="w-full max-w-lg"
    label="Message"
    description="Enter your message below."
    required
  >
    <Textarea placeholder="Type your message..." />
  </Field>
);`,
      renderPreview: () => (
        <div class="docs-form-surface w-full max-w-xl">
          <Field
            class="w-full"
            label="Message"
            description="Enter your message below."
            required
          >
            <Textarea placeholder="Type your message..." />
          </Field>
        </div>
      )
    },
    {
      id: "textarea-disabled-invalid",
      title: "Disabled + Invalid",
      text: "Support disabled and invalid states with clear visual feedback.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => (
  <div class="grid gap-4 w-full max-w-lg">
    <Field label="Disabled message">
      <Textarea disabled value="This textarea is disabled." />
    </Field>
    <Field label="Message" error="Please enter a valid message.">
      <Textarea aria-invalid="true" placeholder="Message with validation error..." />
    </Field>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-form-surface w-full max-w-xl">
          <div class="grid w-full gap-4">
            <Field label="Disabled message">
              <Textarea disabled value="This textarea is disabled." />
            </Field>
            <Field label="Message" error="Please enter a valid message.">
              <Textarea aria-invalid="true" placeholder="Message with validation error..." />
            </Field>
          </div>
        </div>
      )
    },
    {
      id: "textarea-sizes",
      title: "Textarea Sizes",
      text: "Render size variants for compact and roomy layouts.",
      code: `import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => (
  <div class="grid gap-3 w-full max-w-lg">
    <Textarea size="sm" placeholder="Small textarea" />
    <Textarea size="lg" placeholder="Large textarea" />
  </div>
);`,
      renderPreview: () => (
        <div class="docs-form-surface w-full max-w-xl">
          <div class="grid w-full gap-3">
            <Textarea size="sm" placeholder="Small textarea" />
            <Textarea size="lg" placeholder="Large textarea" />
          </div>
        </div>
      )
    },
    {
      id: "textarea-counter",
      title: "Character Counter",
      text: "Track input length in real time for message limits and form guidance.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Textarea } from "@/components/kamod-ui/textarea";
import { useState } from "preact/hooks";

export const Example = () => {
  const maxLength = 240;
  const [value, setValue] = useState("");

  return (
    <Field label="Message" description="Keep it concise and actionable.">
      <Textarea
        value={value}
        maxLength={maxLength}
        onInput={(event) => setValue((event.currentTarget as HTMLTextAreaElement).value)}
      />
      <p class="text-xs text-muted-foreground text-right">{value.length}/{maxLength}</p>
    </Field>
  );
};`,
      renderPreview: () => <TextareaCounterPreview />
    },
    {
      id: "textarea-autoresize",
      title: "Auto-resize",
      text: "Auto-grow textarea height on input for longer, distraction-free writing.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Textarea } from "@/components/kamod-ui/textarea";
import type { JSX } from "preact";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState("");

  const handleInput = (event: JSX.TargetedEvent<HTMLTextAreaElement, Event>) => {
    const element = event.currentTarget;
    element.style.height = "auto";
    element.style.height = \`\${Math.min(element.scrollHeight, 240)}px\`;
    setValue(element.value);
  };

  return (
    <Field label="Auto-resize Message">
      <Textarea value={value} style={{ minHeight: "92px", maxHeight: "240px", overflowY: "auto" }} onInput={handleInput} />
    </Field>
  );
};`,
      renderPreview: () => <TextareaAutosizePreview />
    },
    {
      id: "textarea-production-field",
      title: "Production Field Pattern",
      text: "Combine label, hint, validation error and live character count in one practical form pattern.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Textarea } from "@/components/kamod-ui/textarea";
import { useState } from "preact/hooks";

export const Example = () => {
  const maxLength = 180;
  const [value, setValue] = useState("");
  const isTooShort = value.length > 0 && value.trim().length < 20;

  return (
    <Field
      label="Release note"
      required
      description="Describe the change in at least 20 characters."
      error={isTooShort ? "Please add more detail so the update is clear to users." : undefined}
    >
      <Textarea
        value={value}
        maxLength={maxLength}
        aria-invalid={isTooShort ? "true" : undefined}
        onInput={(event) => setValue((event.currentTarget as HTMLTextAreaElement).value)}
      />
      <div class="flex items-center justify-between text-xs">
        <span>{isTooShort ? "Minimum 20 characters required." : "Looks good."}</span>
        <span>{value.length}/{maxLength}</span>
      </div>
    </Field>
  );
};`,
      renderPreview: () => <TextareaProductionFieldPreview />
    },
    {
      id: "textarea-with-action",
      title: "Textarea + Action",
      text: "Pair the input with a trailing action for modern message flows.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => (
  <div class="grid gap-3 w-full max-w-lg">
    <Textarea placeholder="Send message..." />
    <div class="flex justify-end">
      <Button size="sm">Send message</Button>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-form-surface w-full max-w-xl">
          <div class="grid w-full gap-3">
            <Textarea placeholder="Send message..." />
            <div class="flex justify-end">
              <Button size="sm">Send message</Button>
            </div>
          </div>
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"' },
    { prop: "aria-invalid", type: '"true" | "false"', defaultValue: "undefined" },
    { prop: "placeholder", type: "string", defaultValue: "undefined" },
    { prop: "disabled", type: "boolean", defaultValue: "false" }
  ],
  accessibilityText:
    "Pair Textarea with a visible label (for example via Field), expose validation through aria-invalid, and keep placeholder text supplementary rather than instructional."
});
