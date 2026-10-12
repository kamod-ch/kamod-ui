import {
  EyeIcon,
  FileCodeIcon,
  MessageSquareTextIcon,
  PackageIcon,
  PaletteIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  TextWrapIcon,
} from "@kamod-ch/icons/lucide";
import { CopyIcon, LayoutNavbarIcon } from "@kamod-ch/icons/tabler/outline";
import { Button } from "@kamod-ch/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kamod-ch/ui/card";
import { Code } from "@kamod-ch/ui/code";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@kamod-ch/ui/field";
import { Switch } from "@kamod-ch/ui/switch";
import { useId, useState } from "preact/hooks";

const options = {
  toolbar: {
    label: "Header",
    description: "A shared home for the file and actions.",
    Icon: LayoutNavbarIcon,
  },
  file: {
    label: "File label",
    description: "Show the file name above the source.",
    Icon: FileCodeIcon,
  },
  copy: {
    label: "Copy action",
    description: "Copy the full file, including folded imports.",
    Icon: CopyIcon,
  },
  imports: {
    label: "Import folding",
    description: "Tuck setup away; keep the example in focus.",
    Icon: PackageIcon,
  },
  wrap: {
    label: "Wrap control",
    description: "Let readers wrap long lines to fit the panel.",
    Icon: TextWrapIcon,
  },
  highlight: {
    label: "Syntax colors",
    description: "Make keywords and values easier to scan.",
    Icon: PaletteIcon,
  },
  notes: {
    label: "Context before and after source",
    description: "Add a little guidance around the code. Notes stay out of Copy.",
    Icon: MessageSquareTextIcon,
  },
} as const;

type Part = keyof typeof options;
type Parts = Record<Part, boolean>;

const defaultParts: Parts = {
  toolbar: true,
  file: true,
  copy: true,
  imports: true,
  wrap: true,
  highlight: true,
  notes: false,
};
const groups = [
  {
    title: "Header & actions",
    description: "Give the source a little context.",
    parts: ["toolbar", "file", "copy"],
  },
  {
    title: "Reading experience",
    description: "Keep the details easy to explore.",
    parts: ["imports", "wrap", "highlight"],
  },
] as const;

/** A labeled core switch with persistent help, shared by every visibility option. */
function PartControl({
  part,
  checked,
  id,
  previewId,
  onChange,
}: {
  part: Part;
  checked: boolean;
  id: string;
  previewId: string;
  onChange: (part: Part, checked: boolean) => void;
}) {
  const { label, description, Icon } = options[part];
  return (
    <Field orientation="horizontal" class="code-parts-option" data-enabled={checked}>
      <Icon class="code-parts-option-icon" aria-hidden="true" />
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <FieldDescription id={`${id}-help`}>{description}</FieldDescription>
      </FieldContent>
      <Switch
        id={id}
        size="sm"
        checked={checked}
        aria-describedby={`${id}-help`}
        aria-controls={previewId}
        onCheckedChange={(next) => onChange(part, next)}
      />
    </Field>
  );
}

/** Compose a local settings card and its live Code example without changing the source. */
export function CodePartsPlayground({ code }: { code: string }) {
  const id = useId();
  const previewId = `${id}-preview`;
  const [parts, setParts] = useState(defaultParts);
  const isDefault = (Object.keys(defaultParts) as Part[]).every(
    (part) => parts[part] === defaultParts[part],
  );
  const updatePart = (part: Part, checked: boolean) =>
    setParts((current) => ({ ...current, [part]: checked }));
  const renderControl = (part: Part) => (
    <PartControl
      key={part}
      part={part}
      checked={parts[part]}
      id={`${id}-${part}`}
      previewId={previewId}
      onChange={updatePart}
    />
  );

  return (
    <div class="code-parts-playground" data-code-demo="parts">
      <Card size="sm" class="code-parts-card" aria-labelledby={`${id}-title`}>
        <CardHeader class="code-parts-header">
          <CardTitle id={`${id}-title`} class="code-parts-title">
            <SlidersHorizontalIcon aria-hidden="true" />
            Visible parts
          </CardTitle>
          <CardAction>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              class="docs-icon-button code-parts-reset"
              disabled={isDefault}
              onClick={() => setParts(defaultParts)}
              aria-label="Reset visible parts"
            >
              <RotateCcwIcon aria-hidden="true" />
              Reset
            </Button>
          </CardAction>
          <p class="code-parts-intro">
            Your reader, your choices. Switch a part off and see the panel adapt.
          </p>
        </CardHeader>
        <CardContent class="code-parts-content">
          <div class="code-parts-groups">
            {groups.map((group) => (
              <FieldSet key={group.title} class="code-parts-group">
                <FieldLegend>{group.title}</FieldLegend>
                <p class="code-parts-group-hint">{group.description}</p>
                <FieldGroup>{group.parts.map(renderControl)}</FieldGroup>
              </FieldSet>
            ))}
          </div>
          <p class="code-parts-header-hint">
            <strong>One shared header.</strong> File label and Copy appear inside it. Hide the
            header and your choices are kept for when it returns.
          </p>
        </CardContent>
        <CardFooter class="code-parts-footer">{renderControl("notes")}</CardFooter>
      </Card>
      <div id={previewId} class="code-parts-preview" role="region" aria-label="Live code preview">
        <div class="code-parts-preview-label">
          <span>
            <EyeIcon aria-hidden="true" />
            Your code panel
          </span>
          <span>Changes stay in this example</span>
        </div>
        <Code
          code={code}
          language="tsx"
          filePath={parts.file ? "src/Welcome.tsx" : undefined}
          showToolbar={parts.toolbar}
          showCopy={parts.copy}
          showImportControl={parts.imports}
          showWrapControl={parts.wrap}
          highlight={parts.highlight}
          defaultWrapped
          defaultImportsCollapsed
          beforeCode={
            parts.notes && (
              <p class="code-parts-source-note">A reusable action for the workspace header.</p>
            )
          }
          afterCode={
            parts.notes && (
              <p class="code-parts-source-note">
                Copy includes every import. These notes stay on the page.
              </p>
            )
          }
        />
      </div>
    </div>
  );
}
