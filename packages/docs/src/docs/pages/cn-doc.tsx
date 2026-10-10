import { Button, cn } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { CodeBlock } from "../components/CodeBlock";
import { PathDisplay } from "../components/PathDisplay";
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
        aria-pressed={active}
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
      "**One Existing Dependency.** `cn` ships with `@kamod-ch/ui` — no separate package or install step. Add @kamod-ch/ui once and import cn from `@kamod-ch/ui/utils`. If utilities do not appear in your app, check the [CSS Setup Guide](/docs/theming/css-setup).",
    sectionExtras: {
      installation: () => (
        <div class="grid gap-3 my-5">
          <p class="docs-copy">
            <strong>Package Root Alternative.</strong> You can also import <code>cn</code> from{" "}
            <PathDisplay path="@kamod-ch/ui" />. Both paths provide the same helper; choose one
            import style for your file.
          </p>
          <CodeBlock code={'import { cn } from "@kamod-ch/ui";'} language="typescript" />
        </div>
      ),
    },
    installationExample: {
      code: `import { cn } from "@kamod-ch/ui/utils";

const spacing = "px-3 py-2";
const className = cn("rounded-md border", spacing, "px-6");
// => "rounded-md border py-2 px-6"`,
      renderPreview: () => (
        <p class="text-muted-foreground text-sm">
          Recommended entry point: <PathDisplay path={"@kamod-ch/ui/utils"} />
        </p>
      ),
    },
    usageText:
      "**Base, State, Consumer.** Pass base classes first, then conditional values, arrays, or object maps. Put consumer `class` props last so callers can override defaults. `clsx` handles falsy values; `tailwind-merge` keeps the last recognized conflicting utility (for example `px-4` wins over `px-2`).",
    previewCode: `import { cn } from "@kamod-ch/ui/utils";

const surface = "rounded-lg border bg-background";
const spacing = "p-4";

export const panelClass = cn(surface, spacing, "text-sm");
// => "rounded-lg border bg-background p-4 text-sm"`,
    exampleSections: [
      {
        id: "basic-classes",
        title: "Basic Classes",
        text: "**Keep Simple Class Composition Readable.** Pass static class strings to `cn()` when you want to assemble a reusable styling value from named pieces. The returned string can be assigned to `class`, keeping the composition close to the component that uses it.\n\nIt returns a class string rather than applying styles itself, so the resulting utilities still need to be available in your Tailwind build.",
        code: `import { cn } from "@kamod-ch/ui/utils";

const surface = "rounded-lg border bg-background";
const spacing = "p-4";

export const panelClass = cn(surface, spacing, "text-sm");
// => "rounded-lg border bg-background p-4 text-sm"`,
        renderPreview: () => (
          <div class={cn("rounded-lg border bg-background p-4 text-sm")}>
            Simple static classes merged into one class string.
          </div>
        ),
      },
      {
        id: "conditional-classes",
        title: "Conditional Classes",
        text: "**Express Visual State Next to Its Condition.** Use boolean expressions to include classes only when their state applies, such as `selected && 'border-primary'`. `cn()` ignores falsy inputs, allowing the condition and the visual change to remain together in one readable expression.\n\nKeep unrelated behavior out of class composition, and inspect the final result when multiple states can be true together.",
        code: `import { cn } from "@kamod-ch/ui/utils";
import { useState } from "preact/hooks";

export function SelectionButton() {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={active}
      class={cn(
        "rounded-md border px-3 py-1.5 text-sm transition-colors",
        active && "border-primary bg-primary text-primary-foreground",
      )}
      onClick={() => setActive((value) => !value)}
    >
      {active ? "Active" : "Inactive"}
    </button>
  );
}`,
        renderPreview: () => <ConditionalPreview />,
      },
      {
        id: "arrays-and-objects",
        title: "Arrays and Objects",
        text: "**Group Classes According to Their Purpose.** Pass arrays for related fragments or object maps whose keys are included when their values are truthy. These forms let `cn()` collect styles from structured inputs without manually flattening every combination before rendering.\n\nAvoid overly deep structures that obscure which styles win; a short named fragment is often clearer than a large inline map inside JSX.",
        code: `import { Button, cn } from "@kamod-ch/ui";
import { useState } from "preact/hooks";

export function CollapsiblePanel() {
  const [visible, setVisible] = useState(true);
  const base = ["rounded-md border p-3 text-sm", "shadow-xs"];
  return (
    <div class="grid gap-3">
      <Button type="button" onClick={() => setVisible((value) => !value)}>
        {visible ? "Hide panel" : "Show panel"}
      </Button>
      <div class={cn(base, { hidden: !visible })}>
        Arrays group reusable classes; object keys describe a condition.
      </div>
    </div>
  );
}`,
        renderPreview: () => <ArraysPreview />,
      },
      {
        id: "override-defaults",
        title: "Overriding Defaults",
        text: "**Let Callers Make Intentional Overrides.** Place defaults before consumer overrides when calling `cn()`, for example `cn('px-2', 'px-4')`. Its merge step resolves recognized Tailwind conflicts so the later padding utility can replace the earlier value predictably.\n\nCheck the generated result for unusual utilities or custom class systems; merging class names cannot resolve every cascade rule defined elsewhere in your stylesheets.",
        code: `import { cn } from "@kamod-ch/ui/utils";

// tailwind-merge keeps px-6, not both px-4 and px-6
cn("rounded-md px-4 py-2", "px-6");
// => "rounded-md py-2 px-6"

// Breakpoint-prefixed utilities form separate conflicts.
cn("px-2 md:px-4", "px-6 md:px-8");
// => "px-6 md:px-8"

// Keep p-4: it still supplies vertical padding.
cn("p-4", "px-6");
// => "p-4 px-6"`,
        renderPreview: () => (
          <div class="flex flex-wrap items-center gap-4">
            <div class={cn("rounded-md border px-4 py-2 text-sm")}>px-4 (default)</div>
            <div class={cn("rounded-md border px-4 py-2 text-sm", "px-6")}>px-6 wins</div>
          </div>
        ),
      },
      {
        id: "preact-component",
        title: "Preact Component",
        text: "**Keep the Public Styling Hook Predictable.** Expose a `class` prop on a reusable Preact component and pass it last to `cn()` after the built-in styles. The caller then has a deliberate override point without replacing the component's entire styling contract.\n\nForward the remaining attributes carefully, and document when a component has multiple surfaces so consumers do not assume one class changes every internal part.",
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
        title: "With Tailwind-Variants",
        text: "**Separate Supported Variants from One-Off Overrides.** Generate supported variant classes first, then merge the consumer's `class` through `cn()`. A composition such as `cn(variantFn(options), className)` keeps the named design choices separate from a caller's local layout adjustments.\n\nKeep variant names meaningful and avoid encoding application logic into an ever-growing collection of conditional utility strings.",
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
        title: "Clsx vs cn",
        text: "**Choose Merging When Defaults Can Conflict.** `clsx` joins conditional classes, while `cn()` also runs the result through `tailwind-merge`. Compare their outputs when defaults and overrides contain conflicting utilities; plain concatenation preserves both tokens rather than resolving that conflict.\n\nCompare the output in this example before changing helpers; removing a conflicting utility can alter the result even when both inputs look valid individually.",
        code: `import { clsx } from "clsx";
import { cn } from "@kamod-ch/ui/utils";

clsx("px-2 py-1", "px-4");
// => "px-2 py-1 px-4"

cn("px-2 py-1", "px-4");
// => "py-1 px-4"`,
        renderPreview: () => (
          <div class="grid max-w-md gap-2 text-sm">
            <p>
              <code>clsx</code>: both <code>px-2</code> and <code>px-4</code> remain — the CSS
              cascade decides padding, not their order in the class attribute.
            </p>
            <p>
              <code>cn</code>: only <code>px-4</code> remains alongside <code>py-1</code>.
            </p>
          </div>
        ),
      },
    ],
    apiRows: [
      {
        prop: "...inputs",
        type: "ClassValue[]",
        defaultValue: "—",
        description:
          "Class strings, arrays, conditional values and object maps accepted by clsx. Order inputs from defaults to intended overrides.",
      },
      {
        prop: "returns",
        type: "string",
        defaultValue: "merged class string",
        description:
          "A class string with recognized Tailwind conflicts resolved. The function does not modify the DOM or generate CSS.",
      },
    ],
    accessibilityText:
      "Not applicable — cn is a class-name helper with no DOM surface, focus behavior, or ARIA roles.",
  }),
  packagePath: "@kamod-ch/ui/utils",
  usageImportSnippet: `import { cn } from "@kamod-ch/ui/utils";`,
  usageExampleSnippet: `export function panelClasses(selected: boolean, className?: string) {
  return cn(
    "rounded-lg border bg-background p-4",
    selected && "border-primary",
    className,
  );
}

panelClasses(true, "p-6");`,
};
