import { InfoIcon } from "@kamod-ch/icons/lucide";
import { type ComponentChildren, createContext } from "preact";
import { useMemo } from "preact/hooks";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { BlockTypeDefinition } from "../../../blocks/detail/BlockTypeDefinition";
import { useTypeDefinitions } from "../../../blocks/detail/useTypeDefinitions";
import { RequiredIndicator } from "../../../blocks/RequiredIndicator";
import type { DocPageModule } from "../../types";
import { ApiSourceNote } from "../ApiSourceNote";
import { BrandText } from "../brand/BrandText";
import { DocsCallout } from "../DocsCallout";
import { PathDisplay } from "../PathDisplay";
import { componentApiTypes, componentTypeId } from "./component-api";
import { componentSourceUrl } from "./component-guidance";

export const ComponentTypeRevealContext = createContext<((id: string) => void) | null>(null);

/** Component API content uses the same table, type cards and disclosure state as block guides. */
export function ComponentApiSection({
  doc,
  introduction,
  children,
}: {
  doc: DocPageModule;
  introduction: string;
  children: ComponentChildren;
}) {
  const entries = componentApiTypes(doc.slug);
  const ids = useMemo(() => entries.map(componentTypeId), [entries]);
  const definitions = useTypeDefinitions(ids);
  return (
    <section
      id="api-reference"
      class="docs-section blocks-doc-section component-doc-section blocks-api"
      aria-labelledby="api-reference-title"
    >
      <span class="component-reference-label">API reference</span>
      <h2 id="api-reference-title" tabIndex={-1}>
        <BlockHeadingLink id="api-reference">Props and Data</BlockHeadingLink>
      </h2>
      <p>
        Configure <strong>{doc.title}</strong> using the contracts below. Read the documented
        options alongside the <a href="#component-data-types">Source Definitions</a> to understand
        which values your application supplies and which details the component owns. Start with a
        prop or helper, then follow its type link to inspect the declaration without leaving the
        page.
      </p>
      {introduction && <p>{introduction}</p>}
      <ApiSourceNote>
        Type cards are extracted from this checkout’s{" "}
        <BrandText>
          <code>TypeScript</code>
        </BrandText>{" "}
        source <strong>at build time</strong>. Props inherited through <code>HTMLAttributes</code>,{" "}
        <code>Omit</code> or variant helpers remain references in those declarations; their fields
        are not flattened here. Match the reference to your installed version, and check a package’s
        exports before writing an <code>import type</code>. A type exported by a source file is not
        necessarily re-exported by <PathDisplay path={"@kamod-ch/ui"} />.
      </ApiSourceNote>
      <section class="blocks-api-section" aria-labelledby="component-props">
        <h3 id="component-props" tabIndex={-1}>
          <BlockHeadingLink id="component-props">
            {doc.navGroup === "forms" ? "Form Props and Contracts" : "Component Props"}
          </BlockHeadingLink>
        </h3>
        <div role="paragraph">
          Read each option with its owning component. The{" "}
          <RequiredIndicator label="Required Field Indicator" tooltip="Required field" /> marker
          identifies required fields verified in that declaration. A <code>?</code> means a field
          can be omitted; it does not promise a fallback value. Existing documented defaults remain
          alongside the descriptions. For callbacks, check the argument and return types before
          connecting your own state or services.
        </div>
        <ComponentTypeRevealContext.Provider value={definitions.reveal}>
          {children}
        </ComponentTypeRevealContext.Provider>
      </section>
      <section class="blocks-api-section" aria-labelledby="component-data-types">
        <h3 id="component-data-types" tabIndex={-1}>
          <BlockHeadingLink id="component-data-types">Data Type Reference</BlockHeadingLink>
        </h3>
        <p>
          Expand a card to inspect and copy the exact declaration. The code header identifies its
          repository file; follow imported or inherited types in the{" "}
          <a href={componentSourceUrl(doc.slug)}>Implementation Source</a> when you need the
          complete dependency chain. Required-field summaries cover fields declared directly in that
          type. Source-only helpers and inferred schema outputs describe the local implementation,
          not additional props you can pass to every component.
        </p>
        <div class="blocks-api-types">
          {entries.map((entry) => {
            const id = componentTypeId(entry);
            return (
              <BlockTypeDefinition
                key={id}
                id={id}
                entry={{
                  name: entry.name,
                  title: entry.name.endsWith("Props")
                    ? `${entry.name.replace(/Props$/, "")} props`
                    : entry.name,
                  description: entry.description || (
                    <>
                      <strong>
                        {entry.exported ? "Exported Source" : "Local Source"} Declaration
                      </strong>{" "}
                      from <code>{entry.filePath.split("/").at(-1)}</code>. Referenced types retain
                      their original names; inspect that file for imports and supporting
                      definitions.
                    </>
                  ),
                }}
                source={entry.source}
                filePath={entry.filePath}
                fieldCount={entry.fields.length}
                requiredFields={entry.fields
                  .filter((field) => field.required)
                  .map((field) => field.name)}
                showFieldDocs={entry.source.includes("/**")}
                open={definitions.isOpen(id)}
                onOpenChange={(open) => definitions.setOpen(id, open)}
                onReveal={() => definitions.reveal(id)}
              />
            );
          })}
        </div>
        {!entries.length && (
          <DocsCallout
            class="docs-callout-spaced"
            title="Follow the implementation"
            icon={<InfoIcon />}
          >
            <p>
              This implementation does not declare a separate props or data type in its component
              folder. Follow the <a href={componentSourceUrl(doc.slug)}>Source Reference</a> and
              documented signatures above; no extra type is implied by the examples.
            </p>
          </DocsCallout>
        )}
      </section>
    </section>
  );
}
