/** @file Expandable source definitions and fragment navigation for the shell API guide. */
import { ChevronDownIcon, CodeIcon } from "@kamod-ch/icons/lucide";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";
import { CodeBlock } from "../docs/components/CodeBlock";
import type { TypeReference } from "./application-shell-api-data";
import {
  type ApplicationShellTypeName,
  applicationShellPropFields,
  applicationShellPropsSignature,
  applicationShellTypeFields,
  applicationShellTypeNames,
  applicationShellTypeSources,
} from "./application-shell-type-source";
import { RequiredIndicator } from "./RequiredIndicator";
import { ShellHeadingLink } from "./ShellHeadingLink";

const typeId = (name: ApplicationShellTypeName) => `application-shell-type-${name}`;

/** The same required fields appear below the summary and beside the code's Copy button. */
const RequiredTypeFields = ({
  typeName,
  fields,
  placement,
}: {
  typeName: ApplicationShellTypeName;
  fields: readonly string[];
  placement: "description" | "code";
}) => {
  const requiredLabel = fields.length === 1 ? "Required Field" : "Required Fields";
  return (
    <div class="blocks-api-type-fields" role="group" aria-label={`Required fields of ${typeName}`}>
      {placement === "description" && (
        <span class="blocks-api-required-label">Required fields</span>
      )}
      <RequiredIndicator
        label={`${requiredLabel}: ${fields.join(", ")}`}
        tooltip={requiredLabel}
        align={placement === "code" ? "start" : "center"}
        side={placement === "code" ? "bottom" : "top"}
      />
      <span class="blocks-api-type-field-list">
        {fields.map((field, index, fields) => (
          <span key={field}>
            <code>{field}</code>
            {index < fields.length - 1 && ", "}
          </span>
        ))}
      </span>
    </div>
  );
};

/**
 * An independently expandable, deep-linkable type definition using the core Collapsible.
 * Data and callback definitions include original JSDoc; the component signature
 * stays compact by omitting comments from both its display and copied source.
 * @param props - Reading guide, disclosure state and the parent-owned toggle callback.
 */
const ShellTypeDefinition = ({
  entry,
  open,
  onOpenChange,
}: {
  entry: TypeReference;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const id = typeId(entry.name);
  const isComponentSignature = entry.name === "ApplicationShell1Props";
  const requiredFields = isComponentSignature
    ? []
    : applicationShellTypeFields[entry.name]
        .filter((field) => field.required)
        .map((field) => field.name);
  const requiredProp = applicationShellPropFields.find(
    (prop) => prop.required && prop.definition === entry.name,
  );
  const renderRequiredFields = (placement: "description" | "code") =>
    requiredFields.length > 0 && (
      <RequiredTypeFields typeName={entry.name} fields={requiredFields} placement={placement} />
    );
  return (
    <Collapsible class="blocks-api-type" open={open} onOpenChange={onOpenChange}>
      <div class="blocks-api-type-intro">
        <div class="blocks-api-type-heading">
          <h4 id={id} tabIndex={-1}>
            <ShellHeadingLink id={id}>{entry.title}</ShellHeadingLink>
          </h4>
          {requiredProp && (
            <div class="blocks-api-type-required">
              <span class="blocks-api-required-label">Required type</span>
              <RequiredIndicator
                label={`Required type: ${entry.name}`}
                tooltip={`Used by required prop: ${requiredProp.name}`}
                align="end"
              />
            </div>
          )}
        </div>
        <code class="blocks-api-type-name">{entry.name}</code>
        <p>{entry.description}</p>
        {renderRequiredFields("description")}
      </div>
      <CollapsibleTrigger
        id={`${id}-trigger`}
        class="blocks-api-type-trigger"
        aria-controls={`${id}-content`}
        aria-label={`${open ? "Hide" : "Show"} ${entry.name} definition${isComponentSignature ? "" : " and field documentation"}`}
      >
        <span>
          <CodeIcon
            size={16}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          {open ? "Hide" : "View"} definition{!isComponentSignature && " and field docs"}
        </span>
        <ChevronDownIcon
          size={16}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent id={`${id}-content`} duration="0ms" class="blocks-api-type-content">
        <CodeBlock
          code={
            isComponentSignature
              ? applicationShellPropsSignature
              : applicationShellTypeSources[entry.name]
          }
          language="tsx"
          toolbarContent={renderRequiredFields("code")}
        />
        {entry.note && <p class="blocks-api-type-note">{entry.note}</p>}
      </CollapsibleContent>
    </Collapsible>
  );
};

/** Independent disclosures that also open when targeted by a URL fragment. */
export const useShellTypeDefinitions = () => {
  const [openTypes, setOpenTypes] = useState<ReadonlySet<ApplicationShellTypeName>>(
    () => new Set(["ApplicationShellNavigationGroup"]),
  );
  const setTypeOpen = (name: ApplicationShellTypeName, open: boolean) => {
    setOpenTypes((current) => {
      if (current.has(name) === open) return current;
      const next = new Set(current);
      if (open) next.add(name);
      else next.delete(name);
      return next;
    });
  };

  useEffect(() => {
    let frame = 0;
    const revealType = (event?: HashChangeEvent) => {
      window.cancelAnimationFrame(frame);
      const name = applicationShellTypeNames.find(
        (key) => window.location.hash === `#${typeId(key)}`,
      );
      if (!name) return;
      setTypeOpen(name, true);
      // PreactPress disables native history scroll restoration. Wait for the
      // disclosure render before restoring direct links and Back/Forward targets.
      frame = window.requestAnimationFrame(() => {
        const heading = document.getElementById(typeId(name));
        heading?.scrollIntoView({ block: "start", behavior: "instant" });
        // Move focus for in-page navigation, while leaving initial document focus to the browser.
        if (event) heading?.focus({ preventScroll: true });
      });
    };
    revealType();
    window.addEventListener("hashchange", revealType);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", revealType);
    };
  }, []);

  const renderTypeLink = (name: ApplicationShellTypeName, label: ComponentChildren = name) => (
    <a href={`#${typeId(name)}`} onClick={() => setTypeOpen(name, true)}>
      {label}
    </a>
  );
  const renderDefinition = (entry: TypeReference) => (
    <ShellTypeDefinition
      key={entry.name}
      entry={entry}
      open={openTypes.has(entry.name)}
      onOpenChange={(open) => setTypeOpen(entry.name, open)}
    />
  );

  return { renderTypeLink, renderDefinition };
};

export type ShellTypeDefinitions = ReturnType<typeof useShellTypeDefinitions>;
