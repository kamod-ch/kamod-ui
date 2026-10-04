/** Source signatures and field descriptions share the Application Shell API presentation. */
import { CodeIcon } from "@kamod-ch/icons/lucide";
import { Badge } from "@kamod-ch/ui";
import { useMemo } from "preact/hooks";
import { PathDisplay } from "../../docs/components/PathDisplay";
import { RequiredIndicator } from "../RequiredIndicator";
import { BlockDocSection, BlockGuideHeading } from "./BlockDocumentation";
import { BlockPropsTable } from "./BlockPropsTable";
import { BlockTypeDefinition } from "./BlockTypeDefinition";
import { useTypeDefinitions } from "./useTypeDefinitions";
import type { VariantGuide } from "./VariantDocumentation";

export function VariantApi({ guide }: { guide: VariantGuide }) {
  const { anchor, api, category, component } = guide;
  const typeIds = useMemo(
    () => guide.api.map((entry) => guide.anchor(`type-${entry.name}`)),
    [guide],
  );
  const definitions = useTypeDefinitions(typeIds);
  return (
    <BlockDocSection
      id={anchor("props")}
      className="blocks-api"
      introduction={
        <>
          <p>
            <code>{component}</code> is a ready-made demonstration page with no public props. The
            reference below describes the{" "}
            <strong>local {category === "sidebar" ? "helpers and data" : "form"}</strong> you can
            configure after copying the source. Definitions come directly from the implementation;
            descriptions explain where your application takes over. Start with the component or data
            shape you want to change, then follow its type link to the complete definition.
            {category === "sidebar" && (
              <>
                {" "}
                Keep sample values in <PathDisplay path={"data/"} /> separate from the behavior in
                your copied components. This lets you replace labels and destinations without
                rewriting the surrounding layout in <code>{guide.block.id}.tsx</code>.
              </>
            )}
          </p>
          <div class="blocks-api-source-note">
            <CodeIcon size={18} strokeWidth={2} aria-hidden="true" />
            <span>
              The signatures below come from the copied source files. Use the{" "}
              <a href={`#${anchor("data-types")}`}>data type reference</a> to inspect complete
              definitions and required fields. Optional callbacks do not imply that a backend is
              included. Select a table row’s type name to open its definition automatically. Use{" "}
              <code>import type</code> from the corresponding copied file when typing your own data
              or component inputs. This reference describes the shipped source; changes in your
              local files will not update this page.
            </span>
            <Badge variant="secondary">TypeScript</Badge>
          </div>
        </>
      }
    >
      <section class="blocks-api-section" aria-labelledby={anchor("prop-reference")}>
        <BlockGuideHeading id={anchor("prop-reference")} />
        <div role="paragraph">
          Each field includes its type and integration behavior. The asterisk{" "}
          <RequiredIndicator label="Required field indicator" tooltip="Required field" /> marks
          required fields. {category === "sidebar" && "Navigation helpers require their data; "}
          {category === "sidebar" ? "omitted" : "Omitted"} optional fields use the defaults
          described below. The definitions retain the actual source’s optional markers and callback
          return types. Read each field together with its owning type: the same name can have a
          different purpose on another helper. A <code>?</code> means the field may be omitted, not
          that every optional field has a fallback value. When a field accepts an array, its
          required marker means you must supply the array; check the helper’s behavior before using
          an empty <code>[]</code>.
        </div>
        <BlockPropsTable
          labelledBy={anchor("prop-reference")}
          caption="Local helper props and data fields"
          requiredKind="field"
          rows={api.flatMap((entry) =>
            entry.fields.map((field) => ({
              ...field,
              key: `${entry.name}-${field.name}`,
              owner: (
                <a
                  href={`#${anchor(`type-${entry.name}`)}`}
                  class="blocks-api-field-owner"
                  onClick={() => definitions.reveal(anchor(`type-${entry.name}`))}
                >
                  {entry.name}
                </a>
              ),
            })),
          )}
        />
        {category === "sidebar" && (
          <p class="blocks-doc-note">
            Configure the core <code>Sidebar</code> directly in your copied page: <code>side</code>{" "}
            chooses left or right, <code>variant</code> controls the surface, and{" "}
            <code>collapsible</code> chooses offcanvas, icon or none. The references here list only
            types included in this variant’s download.
            {api.some((entry) => entry.name === "NavigationItem") && (
              <>
                {" "}
                Inherited types are shown separately: <code>NavigationItem</code> adds an icon and
                optional children to <code>NavigationLink</code>, which owns the required title and
                URL. Read both definitions when building a navigation item.
              </>
            )}
            {api.some((entry) => entry.name === "SearchFormProps") && (
              <>
                {" "}
                <code>SearchFormProps</code> refers to Preact’s form attributes rather than
                declaring custom search inputs. The helper does not implement search or expose its
                input value as a prop; connect the input and prevent the form’s default submission
                in your local copy when implementing client-side search.
              </>
            )}
          </p>
        )}
      </section>
      <section class="blocks-api-section" aria-labelledby={anchor("data-types")}>
        <BlockGuideHeading id={anchor("data-types")} />
        <p>
          Expand a definition to copy its exact TypeScript shape. Required fields are listed below
          each summary for fields declared in that definition. The code header shows the file's
          installation path; copy the definition with the button beside it. For intersections, also
          inspect the referenced base type’s required fields. Local types can be imported from the
          same files as your copied components; they are not added to the zero-prop page wrapper.
        </p>
        <div class="blocks-api-types">
          {api.map((entry) => (
            <BlockTypeDefinition
              key={entry.name}
              id={anchor(`type-${entry.name}`)}
              entry={entry}
              source={entry.source}
              filePath={entry.filePath}
              showFieldDocs={entry.source.includes("/**")}
              open={definitions.isOpen(anchor(`type-${entry.name}`))}
              onOpenChange={(open) => definitions.setOpen(anchor(`type-${entry.name}`), open)}
              onReveal={() => definitions.reveal(anchor(`type-${entry.name}`))}
              requiredFields={entry.fields
                .filter((field) => field.required)
                .map((field) => field.name)}
            />
          ))}
        </div>
      </section>
    </BlockDocSection>
  );
}
