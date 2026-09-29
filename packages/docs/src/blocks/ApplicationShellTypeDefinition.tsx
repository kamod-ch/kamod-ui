/** @file Expandable source definitions and fragment navigation for the shell API guide. */
import type { ComponentChildren } from "preact";
import type { TypeReference } from "./application-shell-api-data";
import {
  type ApplicationShellTypeName,
  applicationShellPropFields,
  applicationShellPropsSignature,
  applicationShellTypeFields,
  applicationShellTypeNames,
  applicationShellTypeSources,
} from "./application-shell-type-source";
import { BlockTypeDefinition } from "./detail/BlockTypeDefinition";
import { useTypeDefinitions } from "./detail/useTypeDefinitions";

const typeId = (name: ApplicationShellTypeName) => `application-shell-type-${name}`;

const typeIds = applicationShellTypeNames.map(typeId);

/** Adapts the shell's typed reference to the shared disclosure. */
const ShellTypeDefinition = ({
  entry,
  open,
  onOpenChange,
  onReveal,
}: {
  entry: TypeReference;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReveal: () => void;
}) => {
  const isComponentSignature = entry.name === "ApplicationShell1Props";
  return (
    <BlockTypeDefinition
      id={typeId(entry.name)}
      entry={entry}
      filePath="src/components/application-shell-1/types.ts"
      open={open}
      onOpenChange={onOpenChange}
      onReveal={onReveal}
      showFieldDocs={!isComponentSignature}
      source={
        isComponentSignature
          ? applicationShellPropsSignature
          : applicationShellTypeSources[entry.name]
      }
      requiredFields={
        isComponentSignature
          ? []
          : applicationShellTypeFields[entry.name]
              .filter((field) => field.required)
              .map((field) => field.name)
      }
      requiredProp={applicationShellPropFields.find(
        (prop) => prop.required && prop.definition === entry.name,
      )}
    />
  );
};

/** Independent disclosures that also open when targeted by a URL fragment. */
export const useShellTypeDefinitions = () => {
  const definitions = useTypeDefinitions(typeIds, [typeId("ApplicationShellNavigationGroup")]);

  const renderTypeLink = (name: ApplicationShellTypeName, label: ComponentChildren = name) => (
    <a href={`#${typeId(name)}`} onClick={() => definitions.reveal(typeId(name))}>
      {label}
    </a>
  );
  const renderDefinition = (entry: TypeReference) => (
    <ShellTypeDefinition
      key={entry.name}
      entry={entry}
      open={definitions.isOpen(typeId(entry.name))}
      onOpenChange={(open) => definitions.setOpen(typeId(entry.name), open)}
      onReveal={() => definitions.reveal(typeId(entry.name))}
    />
  );

  return { renderTypeLink, renderDefinition };
};

export type ShellTypeDefinitions = ReturnType<typeof useShellTypeDefinitions>;
