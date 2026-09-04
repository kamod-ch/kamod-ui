import { Button, cn } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import type { DocPageModule } from "../types";
import { createGenericDocPage } from "./create-generic-doc-page";

type PanelProps = {
  class?: string;
  children?: ComponentChildren;
};

const Panel = ({ class: className, children }: PanelProps) => (
  <section class={cn("rounded-lg border bg-background p-4", className)}>{children}</section>
);

const ConditionalPreview = () => {
  const [active, setActive] = useState(false);
  return (
    <div class="flex flex-col gap-3">
      <button
        type="button"
        class={cn(
          "rounded-md border px-3 py-1.5 text-sm transition-colors",
          active && "border-primary bg-primary text-primary-foreground",
        )}
        onClick={() => setActive((value) => !value)}
      >
        {active ? "Active" : "Inactive"}
      </button>
      <p class="text-muted-foreground text-xs">Toggle to see conditional classes apply.</p>
    </div>
  );
};

const ArraysPreview = () => {
  const [visible, setVisible] = useState(true);
  return (
    <div class="flex flex-col gap-3">
      <Button type="button" size="sm" variant="outline" onClick={() => setVisible((v) => !v)}>
        {visible ? "Hide panel" : "Show panel"}
      </Button>
      <div class={cn(["rounded-md border p-3 text-sm", { hidden: !visible }])}>
        Arrays and object maps work like clsx inputs.
      </div>
    </div>
  );
};

export const cnDocPage: DocPageModule = {
  ...createGenericDocPage({
    slug: "cn",
    title: "cn Utility",
    usageLabel:
      "cn combines clsx for conditional class lists with tailwind-merge to resolve conflicting Tailwind utilities.",
    installationText:
      'cn ships with @kamod-ch/ui — no separate package or install step. Add @kamod-ch/ui once and import cn from `@kamod-ch/ui/utils`. You can also import it from the package root: `import { cn } from "@kamod-ch/ui"`.',
    installationExample: {
      code: `import { cn } from "@kamod-ch/ui/utils";`,
      renderPreview: () => (
        <p class="text-muted-foreground text-sm">
          Recommended entry point: <code>@kamod-ch/ui/utils</code>
        </p>
      ),
    },
    usageText:
      "Pass base classes first, then conditional values, arrays, or object maps. Put consumer `class` props last so callers can override defaults. clsx handles falsy values; tailwind-merge keeps the last conflicting utility (for example `px-4` wins over `px-2`).",
    previewCode: `import { cn } from "@kamod-ch/ui/utils";

cn("rounded-lg border bg-background p-4");`,
    exampleSections: [
      {
        id: "basic-classes",
        title: "Basic classes",
        text: "Join static Tailwind classes into one string.",
        code: `import { cn } from "@kamod-ch/ui/utils";

cn("rounded-lg border bg-background p-4");`,
        renderPreview: () => (
          <div class={cn("rounded-lg border bg-background p-4 text-sm")}>
            Simple static classes merged into one class string.
          </div>
        ),
      },
      {
        id: "conditional-classes",
        title: "Conditional classes",
        text: "clsx-style conditionals omit falsy values — booleans, null, and undefined are ignored.",
        code: `import { cn } from "@kamod-ch/ui/utils";

const isActive = true;

cn(
  "rounded-md border px-3 py-1.5 text-sm",
  isActive && "border-primary bg-primary text-primary-foreground",
);`,
        renderPreview: () => <ConditionalPreview />,
      },
      {
        id: "arrays-and-objects",
        title: "Arrays and objects",
        text: "Arrays and object maps follow clsx semantics: object keys are included when their value is truthy.",
        code: `import { cn } from "@kamod-ch/ui/utils";

cn(
  ["rounded-md border p-3 text-sm", "shadow-xs"],
  { hidden: !visible, "opacity-50": disabled },
);`,
        renderPreview: () => <ArraysPreview />,
      },
      {
        id: "override-defaults",
        title: "Overriding defaults",
        text: "tailwind-merge resolves conflicting utilities so later inputs win — useful when defaults meet consumer overrides.",
        code: `import { cn } from "@kamod-ch/ui/utils";

// tailwind-merge keeps px-6, not both px-4 and px-6
cn("rounded-md px-4 py-2", "px-6");`,
        renderPreview: () => (
          <div class="flex flex-wrap items-center gap-4">
            <div class={cn("rounded-md border px-4 py-2 text-sm")}>px-4 (default)</div>
            <div class={cn("rounded-md border px-4 py-2 text-sm", "px-6")}>px-6 wins</div>
          </div>
        ),
      },
      {
        id: "preact-component",
        title: "Preact component",
        text: "Kamod UI components accept `class` (not `className`). Pass consumer classes last in cn() so props override built-in styles.",
        code: `import type { ComponentChildren } from "preact";
import { cn } from "@kamod-ch/ui/utils";

type PanelProps = {
  class?: string;
  children?: ComponentChildren;
};

export function Panel({ class: className, children }: PanelProps) {
  return (
    <section
      class={cn(
        "rounded-lg border bg-background p-4",
        className,
      )}
    >
      {children}
    </section>
  );
}`,
        renderPreview: () => (
          <Panel class="max-w-sm border-dashed shadow-xs">
            Consumer <code>class</code> is merged last.
          </Panel>
        ),
      },
      {
        id: "variant-system",
        title: "With tailwind-variants",
        text: "Library components use cn(variantFn({ ... }), className) so variant classes and consumer overrides compose safely.",
        code: `import { ButtonVariants, cn } from "@kamod-ch/ui";

type SubmitButtonProps = {
  class?: string;
};

export function SubmitButton({ class: className }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      class={cn(ButtonVariants.button({ variant: "default", size: "default" }), className)}
    >
      Save
    </button>
  );
}

// Built-in Button uses the same pattern internally.`,
        renderPreview: () => <Button class="h-7 px-2 text-xs">Consumer height override</Button>,
      },
      {
        id: "clsx-vs-cn",
        title: "clsx vs cn",
        text: "clsx concatenates class names but keeps every token. cn runs clsx first, then tailwind-merge removes conflicting utilities from the result.",
        code: `import { clsx } from "clsx";
import { cn } from "@kamod-ch/ui/utils";

clsx("px-2 py-1", "px-4");
// => "px-2 py-1 px-4"

cn("px-2 py-1", "px-4");
// => "py-1 px-4"`,
        renderPreview: () => (
          <div class="grid max-w-md gap-2 text-sm">
            <p>
              <code>clsx</code>: both <code>px-2</code> and <code>px-4</code> remain — browser order
              decides padding.
            </p>
            <p>
              <code>cn</code>: only <code>px-4</code> remains alongside <code>py-1</code>.
            </p>
          </div>
        ),
      },
    ],
    apiRows: [
      { prop: "...inputs", type: "ClassValue[]", defaultValue: "—" },
      { prop: "returns", type: "string", defaultValue: "merged class string" },
    ],
    accessibilityText:
      "Not applicable — cn is a class-name helper with no DOM surface, focus behavior, or ARIA roles.",
  }),
  packagePath: "@kamod-ch/ui/utils",
  usageImportSnippet: `import { cn } from "@kamod-ch/ui/utils";`,
  usageExampleSnippet: `cn("rounded-lg border bg-background p-4", className)`,
};
