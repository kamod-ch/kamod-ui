/** Source signatures and field descriptions share the Application Shell API presentation. */
import { CodeIcon } from "@kamod-ch/icons/lucide";
import { Badge } from "@kamod-ch/ui";
import { useMemo } from "preact/hooks";
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
            <strong>local {category === "sidebar" ? "layout helpers" : "form"}</strong> you can
            configure after copying the source. Definitions come directly from the implementation;
            descriptions explain where your application takes over.
          </p>
          <div class="blocks-api-source-note">
            <CodeIcon size={18} strokeWidth={2} aria-hidden="true" />
            <span>
              The signatures below come from the copied source files. Use the{" "}
              <a href={`#${anchor("data-types")}`}>data type reference</a> to inspect complete
              definitions and required fields. Optional callbacks do not imply that a backend is
              included.
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
          required data fields; the form and layout-helper props themselves are optional. The
          definitions retain the actual source’s optional markers and callback return types.
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
            <code>AppSidebarProps</code> also inherits the core <code>SidebarProps</code>. In
            particular, <code>side</code> chooses left or right, <code>variant</code> controls the
            surface, and <code>collapsible</code> chooses offcanvas, icon or none. The local helper
            defaults to offcanvas. These are helper props, not props on the exported variant page.
          </p>
        )}
      </section>
      <section class="blocks-api-section" aria-labelledby={anchor("data-types")}>
        <BlockGuideHeading id={anchor("data-types")} />
        <p>
          Expand a definition to copy its exact TypeScript shape. Required fields are listed below
          each summary and beside the code’s Copy button. Local types can be imported from the same
          files as your copied components; they are not added to the zero-prop page wrapper.
        </p>
        <div class="blocks-api-types">
          {api.map((entry) => (
            <BlockTypeDefinition
              key={entry.name}
              id={anchor(`type-${entry.name}`)}
              entry={entry}
              source={entry.source}
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
