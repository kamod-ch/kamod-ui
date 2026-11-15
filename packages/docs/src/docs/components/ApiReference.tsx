import type { ComponentChildren } from "preact";
import { useContext, useId } from "preact/hooks";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { BlockPropsTable } from "../../blocks/detail/BlockPropsTable";
import { linkTitle, utilityName } from "../../link-title";
import { type ComponentApiExport, componentApiExport } from "../generated-component-api";
import { ComponentTypeRevealContext } from "./component-detail/ComponentApiSection";
import { componentApiRowOwners, componentTypeId } from "./component-detail/component-api";
import { componentPropsId } from "./component-detail/component-api-id";
import { ComponentExamplesContext } from "./component-detail/component-examples";

type ApiReferenceRow = {
  prop: string;
  type: string;
  defaultValue: string;
  description?: ComponentChildren;
};

type ApiReferenceSection = {
  title: string;
  description?: string;
  rows: readonly ApiReferenceRow[];
};

type ApiReferenceProps = {
  /** Core subpath slug. When set, tables come from the generated manifest. */
  component?: string;
  /** Authored rows. Rendered when `component` is omitted; kept for the help extractor when both are set. */
  sections?: readonly ApiReferenceSection[];
};

function ApiReferenceTable({ section }: { section: ApiReferenceSection }) {
  const id = `api-${useId()}`;
  const collection = useContext(ComponentExamplesContext);
  const reveal = useContext(ComponentTypeRevealContext);
  if (collection) {
    return (
      <div id={componentPropsId(collection.doc.slug, section.title)} class="docs-api-reference">
        <h4 id={id} tabIndex={-1}>
          <BlockHeadingLink id={id}>{section.title}</BlockHeadingLink>
        </h4>
        {section.description && <p class="docs-copy">{utilityName(section.description)}</p>}
        <BlockPropsTable
          labelledBy={id}
          caption={`${section.title} documented props`}
          rows={section.rows.map((row) => {
            const owners = componentApiRowOwners(collection.doc.slug, section.title, row.prop);
            const propName = row.prop.split(/\s+/).at(-1)!.replace(/\?$/, "");
            const field = owners[0]?.fields.find(({ name }) => name === propName);
            // Older guide rows store usage requirements in the default-value column.
            const isRequirement = row.defaultValue.trim().toLowerCase() === "required";
            return {
              key: row.prop,
              name: row.prop,
              type: row.type,
              required: field?.required ?? false,
              owner: owners.length ? (
                <span class="component-api-owners">
                  {owners.map((owner) => (
                    <a
                      key={owner.name}
                      class="blocks-api-field-owner"
                      data-tooltip={`Open the ${owner.name} source definition`}
                      href={`#${componentTypeId(owner)}`}
                      onClick={() => reveal?.(componentTypeId(owner))}
                    >
                      {linkTitle(owner.name)}
                    </a>
                  ))}
                </span>
              ) : undefined,
              description: (
                <>
                  <p>
                    {row.description || field?.description || (
                      <>
                        Configure <code>{row.prop}</code> for{" "}
                        <strong>{utilityName(section.title)}</strong>. Compare its accepted type
                        with the <a href="#usage">Usage Guidance</a> before supplying a value.
                      </>
                    )}
                  </p>
                  <dl class="component-api-default">
                    <dt
                      data-tooltip={
                        isRequirement
                          ? "Required by this example; check the source type for required props."
                          : "Documented value or built-in behavior; confirm against your installed version."
                      }
                    >
                      {isRequirement ? "Usage requirement" : "Default"}
                    </dt>
                    <dd>
                      {isRequirement ? <span>Required</span> : <code>{row.defaultValue}</code>}
                    </dd>
                  </dl>
                </>
              ),
            };
          })}
        />
      </div>
    );
  }
  return (
    <div class="docs-api-reference" key={section.title}>
      <h3 id={id} tabIndex={-1}>
        <BlockHeadingLink id={id}>{section.title}</BlockHeadingLink>
      </h3>
      {section.description ? <p class="docs-copy">{utilityName(section.description)}</p> : null}
      <div class="docs-api-table-wrap">
        <table class="docs-api-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={`${section.title}-${row.prop}`}>
                <td data-label="Prop">
                  <code>{row.prop}</code>
                </td>
                <td data-label="Type">
                  <code>{row.type}</code>
                </td>
                <td data-label="Default">
                  <code>{row.defaultValue}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatKb(bytes: number) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function signalLabel(entry: ComponentApiExport) {
  if (entry.signals === "direct") return "Signals: direct";
  if (entry.signals === "indirect") return `Signals: via ${entry.signalsVia}`;
  return "Signals: none";
}

function ApiExportMeta({ entry }: { entry: ComponentApiExport }) {
  return (
    <div class="docs-api-meta">
      <code aria-label="Subpath import">{entry.specifier}</code>
      <span aria-label="Bundle size">
        {formatKb(entry.size.min)} min · {formatKb(entry.size.gzip)} gzip
      </span>
      <span aria-label="Signal status">{signalLabel(entry)}</span>
      {entry.peers.map((peer) => (
        <span key={peer}>{peer}</span>
      ))}
    </div>
  );
}

function GeneratedApiReference({ slug }: { slug: string }) {
  const entry = componentApiExport(slug);
  if (!entry) {
    return (
      <p class="docs-copy">
        No generated API entry for <code>{slug}</code>.
      </p>
    );
  }
  const sections: ApiReferenceSection[] = entry.components
    .filter((component) => component.props.length > 0)
    .map((component) => ({
      title: component.name,
      description: component.propsType,
      rows: component.props.map((prop) => ({
        prop: prop.name,
        type: prop.type,
        defaultValue: prop.default ?? "—",
        description: prop.description || undefined,
      })),
    }));
  return (
    <div class="docs-api-reference-group">
      <ApiExportMeta entry={entry} />
      {sections.map((section) => (
        <ApiReferenceTable key={section.title} section={section} />
      ))}
    </div>
  );
}

export const ApiReference = (props: ApiReferenceProps) => {
  if (props.component) return <GeneratedApiReference slug={props.component} />;
  return (
    <div class="docs-api-reference-group">
      {(props.sections ?? []).map((section) => (
        <ApiReferenceTable key={section.title} section={section} />
      ))}
    </div>
  );
};

export type { ApiReferenceRow, ApiReferenceSection };
