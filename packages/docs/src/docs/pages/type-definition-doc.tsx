import { Badge, Button, TypeDefinition } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../components/CodeBlock";
import { createGenericDocPage } from "./create-generic-doc-page";

const source = `type NavigationItem = {
  label: string;
  href: string;
  disabled?: boolean;
};`;

/** Preview-only highlighting; the copied examples keep their native pre/code composition. */
const DefinitionCode = ({ code = source }: { code?: string }) => (
  <CodeBlock code={code} renderToolbar={() => null} showWrapControl={false} />
);

const ControlledDefinition = () => {
  const [open, setOpen] = useState(false);
  return (
    <div class="w-full max-w-2xl space-y-4">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Inspect navigation contract
      </Button>
      <TypeDefinition
        title="Navigation Item"
        typeName="NavigationItem"
        open={open}
        onOpenChange={setOpen}
        description="The external action and the disclosure share one owner. Close the card, then reopen it from the action above."
      >
        <DefinitionCode />
      </TypeDefinition>
    </div>
  );
};

export const typeDefinitionDocPage = createGenericDocPage({
  slug: "type-definition",
  title: "Type Definition",
  usageLabel:
    "Keep the purpose of a contract visible while its implementation stays one click away. Type Definition brings a readable heading, exact identifier, contextual metadata and an accessible disclosure into one compact reference card. Use it for component props, configuration shapes and event payloads without coupling your interface to a syntax highlighter or documentation router.",
  installationText:
    "Import TypeDefinition from `@kamod-ch/ui` or `@kamod-ch/ui/type-definition`. It composes Kamod’s existing Collapsible behavior and uses semantic theme tokens. No parser, clipboard library or router is required. Keep the shared stylesheet configured using the Theming & Tailwind guide before rendering the examples.",
  usageText:
    "Give `title` a human-readable purpose and `typeName` the exact identifier readers will find in source. Put a short explanation in `description`, optional field context in `metadata`, and the complete definition in `children`. The card starts collapsed; use `defaultOpen` for an initially visible definition or pair `open` with `onOpenChange` when a prop table, search result or permalink needs to reveal it. Expansion does not update the URL or move focus automatically.",
  sectionExtras: {
    usage: () => (
      <p>
        <strong>Choose the Right Boundary.</strong> Use{" "}
        <a href={withBasePath("/docs/collapsible/installation")}>Collapsible</a> for a general
        disclosure, <a href={withBasePath("/docs/accordion/installation")}>Accordion</a> for a
        coordinated question-and-answer list, and this component when the summary belongs to a named
        contract. Preview source uses the documentation highlighter; the copied examples use native{" "}
        <code>pre</code> and <code>code</code> elements so you can choose your own renderer. See the{" "}
        <a
          href={withBasePath(
            "/blocks/application-shell/application-shell-1#application-shell-type-ApplicationShellBrand",
          )}
        >
          Application Shell Brand Reference
        </a>{" "}
        for a complete integration with source links and required-field documentation.
      </p>
    ),
    "rich-definition": () => (
      <p>
        <strong>Keep Metadata Factual.</strong> A required-field list describes your contract; the
        card does not inspect TypeScript or validate inputs. Supply <code>headerAction</code> for a
        badge or source link beside the heading. Add <code>titleMetadata</code> for a short field
        count and <code>triggerHint</code> for the source language beside the disclosure label; both
        receive a subtle dot separator. Put longer explanations in the definition content. Follow
        the <a href="#component-data-types">Source Declarations</a> to see the exact slot types.
      </p>
    ),
    "controlled-definition": () => (
      <p>
        <strong>Link, Reveal, Then Navigate.</strong> Keep a stable <code>headingId</code> when
        linking from a props table. Your application can set <code>open</code> before scrolling to
        that anchor. If you close a card from an external control while focus is inside it, return
        focus to its trigger. Read the <a href="#accessibility">Accessibility Guidance</a> before
        adding custom navigation or asynchronous content.
      </p>
    ),
    "compact-definition": () => (
      <p>
        <strong>Use Density Consistently.</strong> Compact cards work well for several small
        contracts in a vertical list. The disclosure keeps a minimum height of <code>2.75rem</code>{" "}
        in both densities. Prefer the default spacing for longer summaries and richly documented
        definitions; use{" "}
        <a href={withBasePath("/docs/theming/installation")}>Semantic Theme Colors</a> for any local
        adjustments.
      </p>
    ),
  },
  exampleSections: [
    {
      id: "basic-definition",
      title: "Summary and Source",
      text: "**Make the Closed Card Useful on Its Own.** Use a concise visible description to introduce the type before its source is expanded. The disclosure bar communicates that more detail is available, with distinct hover and keyboard-focus treatments for discovering the interaction.\n\nKeep detailed declarations in the expanded region and link related concepts in the summary where helpful, so users can decide whether opening the definition answers their question.",
      code: `import { TypeDefinition } from "@kamod-ch/ui";

export const Example = () => (
  <TypeDefinition title="Navigation item" typeName="NavigationItem"
    description="A label and destination for one navigation entry.">
    <pre><code>{\`type NavigationItem = { label: string; href: string; disabled?: boolean };\`}</code></pre>
  </TypeDefinition>
);`,
      renderPreview: () => (
        <TypeDefinition
          class="w-full max-w-2xl"
          title="Navigation Item"
          typeName="NavigationItem"
          description="A label and destination for one navigation entry. Optional disabled state belongs to the consuming navigation control."
        >
          <DefinitionCode />
        </TypeDefinition>
      ),
    },
    {
      id: "rich-definition",
      title: "Metadata and Field Documentation",
      text: "**Separate the Summary from the Detailed Contract.** Keep the required fields and essential contract summary visible, then place source, detailed explanations and related links in the expanded region. A separate header action can expose a reference without nesting another button inside the disclosure trigger.\n\nUse inline `code` for identifiers and ordinary prose for their meaning, with links to related contracts where they help. Expand the definition with the keyboard, then verify that its separate reference action can be reached without also toggling the content.",
      code: `import { Badge, TypeDefinition } from "@kamod-ch/ui";

export const Example = () => (
  <TypeDefinition title="Navigation item" typeName="NavigationItem" defaultOpen
    headerAction={<Badge variant="outline">Configuration</Badge>}
    description="Supply destinations from your application's routes."
    metadata={<span>Required fields: <code>label</code>, <code>href</code></span>}
    expandLabel="View Definition and Field Docs" collapseLabel="Hide Definition and Field Docs">
    <pre><code>{\`type NavigationItem = { label: string; href: string; disabled?: boolean };\`}</code></pre>
    <p><strong>label</strong> names the destination. <strong>href</strong> points to the route your application owns.</p>
  </TypeDefinition>
);`,
      renderPreview: () => (
        <TypeDefinition
          class="w-full max-w-2xl"
          title="Navigation Item"
          typeName="NavigationItem"
          defaultOpen
          headerAction={<Badge variant="outline">Configuration</Badge>}
          description="Supply destinations from your application's routes."
          metadata={
            <span>
              Required fields: <code>label</code>, <code>href</code>
            </span>
          }
          expandLabel="View Definition and Field Docs"
          collapseLabel="Hide Definition and Field Docs"
        >
          <DefinitionCode />
          <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
            <strong class="text-foreground">label</strong> names the destination.{" "}
            <strong class="text-foreground">href</strong> points to the route your application owns.
            Omit <code>disabled</code> when the item is available; decide how your navigation
            communicates an unavailable destination.
          </p>
        </TypeDefinition>
      ),
    },
    {
      id: "controlled-definition",
      title: "Reveal from Another Control",
      text: "**Reveal the Same Content from Several Entry Points.** Drive the definition's open state from one parent when external controls also need to reveal it. Keep the disclosure label and `aria-expanded` synchronized with that value; `defaultOpen` is only an initial-state option.\n\nDecide whether navigation should move focus or only reveal content, and verify that closing from either control leaves the accessible expanded state accurate.",
      code: `import { Button, TypeDefinition } from "@kamod-ch/ui";
import { useState } from "preact/hooks";

export function Example() {
  const [open, setOpen] = useState(false);
  return <div class="space-y-4">
    <Button variant="outline" onClick={() => setOpen(true)}>Inspect navigation contract</Button>
    <TypeDefinition title="Navigation item" typeName="NavigationItem"
      open={open} onOpenChange={setOpen}>
      <pre><code>{\`type NavigationItem = { label: string; href: string; disabled?: boolean };\`}</code></pre>
    </TypeDefinition>
  </div>;
}`,
      renderPreview: () => <ControlledDefinition />,
    },
    {
      id: "compact-definition",
      title: "Compact Contract List",
      text: "**Keep a Collection Readable without Flattening Its Structure.** Use compact density for a group of short declarations while keeping each definition independently expandable. Choose `headingLevel` to fit the surrounding article, and retain meaningful type names even when the source itself occupies only a few lines.\n\nUse the surrounding heading hierarchy deliberately and keep independent disclosure state so comparing two definitions does not require repeatedly reopening them.",
      code: `import { TypeDefinition } from "@kamod-ch/ui";

export const Example = () => <div class="space-y-3">
  <TypeDefinition density="compact" title="Display mode" typeName="DisplayMode">
    <pre><code>{\`type DisplayMode = "list" | "grid";\`}</code></pre>
  </TypeDefinition>
  <TypeDefinition density="compact" title="Sort direction" typeName="SortDirection">
    <pre><code>{\`type SortDirection = "asc" | "desc";\`}</code></pre>
  </TypeDefinition>
</div>;`,
      renderPreview: () => (
        <div class="w-full max-w-2xl space-y-3">
          <TypeDefinition density="compact" title="Display Mode" typeName="DisplayMode">
            <DefinitionCode code={'type DisplayMode = "list" | "grid";'} />
          </TypeDefinition>
          <TypeDefinition density="compact" title="Sort Direction" typeName="SortDirection">
            <DefinitionCode code={'type SortDirection = "asc" | "desc";'} />
          </TypeDefinition>
        </div>
      ),
    },
  ],
  apiRows: [
    {
      prop: "title",
      type: "ComponentChildren",
      defaultValue: "Required",
      description:
        "Readable heading describing the contract. May include an application-owned permalink.",
    },
    {
      prop: "typeName",
      type: "string",
      defaultValue: "Required",
      description:
        "Exact source identifier; shown in monospace and appended to the disclosure's accessible name.",
    },
    {
      prop: "description",
      type: "ComponentChildren",
      defaultValue: "undefined",
      description: "Summary below the type name. Remains visible in both disclosure states.",
    },
    {
      prop: "titleMetadata / triggerHint",
      type: "string",
      defaultValue: "undefined",
      description:
        "Optional secondary text beside the heading and disclosure label, separated by a dot. Supply factual context such as declared field counts or source language. Hints do not change the disclosure’s accessible name or add another focus target.",
    },
    {
      prop: "metadata / headerAction",
      type: "ComponentChildren",
      defaultValue: "undefined",
      description:
        "Optional summary slots: metadata follows the description; headerAction sits beside the heading and wraps when necessary.",
    },
    {
      prop: "children",
      type: "ComponentChildren",
      defaultValue: "undefined",
      description:
        "Expanded definition content. Plain code, highlighted source, field docs and copy actions are supplied by the caller. Children unmount on collapse, so keep persistent editor state outside the card.",
    },
    {
      prop: "open / onOpenChange",
      type: "boolean / (open: boolean) => void",
      defaultValue: "undefined",
      description:
        "Controlled disclosure. The callback reports user toggles; your parent must update open. Programmatic changes to open do not invoke the callback.",
    },
    {
      prop: "defaultOpen",
      type: "boolean",
      defaultValue: "false",
      description: "Initial uncontrolled state. Ignored when open is supplied.",
    },
    {
      prop: "headingId / headingLevel",
      type: "string / 2 | 3 | 4 | 5 | 6",
      defaultValue: "generated ID / 3",
      description:
        "Heading anchor and semantic level. Explicit heading IDs must be unique; the trigger and panel derive their IDs from it.",
    },
    {
      prop: "density",
      type: '"default" | "compact"',
      defaultValue: '"default"',
      description:
        "Reduces summary, trigger and content padding without shrinking the minimum disclosure target height.",
    },
    {
      prop: "expandLabel / collapseLabel",
      type: "string",
      defaultValue: '"View Definition" / "Hide Definition"',
      description:
        "Visible disclosure labels. Translate both together; the exact type name is appended to their accessible name.",
    },
    {
      prop: "class / triggerClass / contentClass",
      type: "string",
      defaultValue: "undefined",
      description:
        "Utility overrides for the root card, disclosure button and inner content respectively. Preserve focus visibility, contrast and minimum target size.",
    },
  ],
  accessibilityText:
    "Type Definition uses a real button with synchronized aria-expanded and aria-controls, unique generated IDs and an explicit heading level. Activate with Enter or Space. Hidden content is unmounted; use a stable headingId for external links and keep any persistent child state in a parent. Labels, summaries and field metadata should explain the contract without depending on color or icons.",
});
