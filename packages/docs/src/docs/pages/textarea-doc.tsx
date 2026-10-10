import { Button, Field, Textarea } from "@kamod-ch/ui";
import type { TargetedEvent } from "preact";
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

  const handleInput = (event: TargetedEvent<HTMLTextAreaElement, Event>) => {
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
  usageText:
    "Use Textarea with Field for labels, descriptions, errors, and more modern form layouts.",
  exampleSections: [
    {
      id: "basic-textarea",
      title: "Basic Textarea",
      text: "**Give Longer Input a Clear Purpose.** Use `Textarea` for a short note, comment or feedback response that may span several lines. Its default surface provides the editable area, while a persistent label should explain what kind of answer the field expects.\n\nChoose an initial height that fits the expected answer and keep instructions outside the editable value so they remain available as the user writes.",
      code: `import { Textarea } from "@/components/kamod-ui/textarea";

export const Example = () => <Textarea placeholder="Write your feedback..." class="max-w-lg" />;`,
      renderPreview: () => (
        <div class="docs-form-surface w-full max-w-xl">
          <div class="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Quick Feedback
          </div>
          <Textarea placeholder="Write your feedback..." class="w-full" />
        </div>
      ),
    },
    {
      id: "textarea-field",
      title: "Field + Description",
      text: "**Keep Help Close to the Writing Area.** Compose `Textarea` with `Field` to keep the label and helper text close to the multiline value. The wrapper organizes the explanation, while the textarea remains the actual editable control associated with that label.\n\nPreserve those associations when adjusting the layout, and explain length or content expectations before users invest time in a long answer.",
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
          <Field class="w-full" label="Message" description="Enter your message below." required>
            <Textarea placeholder="Type your message..." />
          </Field>
        </div>
      ),
    },
    {
      id: "textarea-disabled-invalid",
      title: "Disabled + Invalid",
      text: "**Distinguish Unavailable Editing from a Correctable Error.** Show disabled state when editing is unavailable and invalid state when the current answer needs correction. Keep the entered text visible in both cases, pairing validation styling with a message that explains how to fix the value.\n\nKeep the entered text available for review and avoid discarding a long response when validation or submission fails.",
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
      ),
    },
    {
      id: "textarea-sizes",
      title: "Textarea Sizes",
      text: "**Choose a Comfortable Starting Area.** Compare the textarea size options using the same content and surrounding field layout. A compact setting may suit short notes, while a roomier one can give longer responses enough visible space for review.\n\nTest multiline content and error messages at narrow widths, and avoid using a small initial height as an arbitrary limit on the answer.",
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
      ),
    },
    {
      id: "textarea-counter",
      title: "Character Counter",
      text: "**Derive the Count from the Submitted Value.** Derive a character count from the textarea's current value and display it beside the relevant limit. This gives immediate guidance as the user types, while the form's validation decides how an over-limit answer is handled.\n\nExplain how much text is allowed, decide what happens at the boundary and avoid announcing every keystroke in a way that overwhelms assistive-technology users.",
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
      renderPreview: () => <TextareaCounterPreview />,
    },
    {
      id: "textarea-autoresize",
      title: "Auto-Resize",
      text: "**Let the Field Grow without Losing Page Context.** Resize the textarea in response to input when the field should grow with the answer. The example illustrates that behavior around an ordinary multiline control; choose sensible bounds so a long response does not consume the entire screen.\n\nRecalculate after programmatic changes as well as typing, and avoid repeated layout work that makes editing feel sluggish.",
      code: `import { Field } from "@/components/kamod-ui/field"
import { Textarea } from "@/components/kamod-ui/textarea";
import type { TargetedEvent } from "preact";
import { useState } from "preact/hooks";

export const Example = () => {
  const [value, setValue] = useState("");

  const handleInput = (event: TargetedEvent<HTMLTextAreaElement, Event>) => {
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
      renderPreview: () => <TextareaAutosizePreview />,
    },
    {
      id: "textarea-production-field",
      title: "Production Field Pattern",
      text: "**Coordinate Label, Help, Count and Error Around One Value.** Combine a label, hint, validation message and live character count around one textarea value. Each element answers a different question: what to write, how to format it, what needs correction and how much space remains.\n\nKeep validation associated with the textarea, preserve the user's text after failure and ensure the character count agrees with the actual accepted limit.",
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
      renderPreview: () => <TextareaProductionFieldPreview />,
    },
    {
      id: "textarea-with-action",
      title: "Textarea + Action",
      text: "**Make Sending Distinct from Editing.** Place a send or submit action beside the textarea when composing a message is one focused task. Keep the editable content prominent and make the action's pending and error behavior part of the same message workflow.\n\nKeep pending and error states clear, prevent accidental duplicate sends and decide deliberately whether Enter inserts a line break or performs an application shortcut.",
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
      ),
    },
  ],
  apiRows: [
    { prop: "size", type: '"sm" | "md" | "lg"', defaultValue: '"md"' },
    { prop: "aria-invalid", type: '"true" | "false"', defaultValue: "undefined" },
    { prop: "placeholder", type: "string", defaultValue: "undefined" },
    { prop: "disabled", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    "Pair Textarea with a visible label (for example via Field), expose validation through aria-invalid, and keep placeholder text supplementary rather than instructional.",
});
