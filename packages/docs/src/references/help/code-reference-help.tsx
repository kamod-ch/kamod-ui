import {
  ArrowUpRightIcon,
  BookOpenIcon,
  BracesIcon,
  ComponentIcon,
  FileCodeIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Badge } from "@kamod-ch/ui/badge";
import { splitDisplayPath } from "../../docs/components/display-path";
import type { CodeReferenceHelp } from "../types";
import { referenceKinds } from "./reference-kinds";

const relatedIcons = {
  type: BracesIcon,
  props: ComponentIcon,
  guide: BookOpenIcon,
  source: FileCodeIcon,
};

/** Render authored/source-derived emphasis as text, never as arbitrary HTML. */
function ReferenceSentence({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
        .map((part, index) =>
          part.startsWith("`") && part.endsWith("`") ? (
            <code key={index}>{part.slice(1, -1)}</code>
          ) : part.startsWith("**") && part.endsWith("**") ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : (
            part
          ),
        )}
    </>
  );
}

/** Keep the exact origin; only the middle of longer paths yields to the tooltip width. */
function ReferencePath({ path }: { path: string }) {
  const { root, middle, end } = splitDisplayPath(path);
  return (
    <code
      class="path-display code-reference-help-path"
      data-path-middle={middle ? "true" : undefined}
      dir="ltr"
    >
      {root && <span data-path-part="root">{root}</span>}
      {middle && <span data-path-part="middle">{middle}</span>}
      {end && <span data-path-part="end">{end}</span>}
    </code>
  );
}

function ReferenceContract({ reference }: { reference: CodeReferenceHelp }) {
  const fields = reference.fields?.slice(0, 3);
  if (!fields?.length && !reference.signature) return null;
  const signature = reference.kind === "type" && fields?.length ? undefined : reference.signature;
  return (
    <section
      class="code-reference-help-contract"
      aria-label={referenceKinds[reference.kind].contract}
    >
      <div class="code-reference-help-section-label">
        <strong>{referenceKinds[reference.kind].contract}</strong>
        {!!fields?.length && (
          <span>
            {reference.fields!.length > 3
              ? "Selected fields"
              : `${fields.length} ${fields.length === 1 ? "field" : "fields"}`}
          </span>
        )}
      </div>
      {signature && (
        <code class="code-reference-help-signature" dir="ltr">
          {signature}
        </code>
      )}
      {!!fields?.length && (
        <dl class="code-reference-help-fields">
          {fields.map((field) => (
            <div key={field.name}>
              <dt>
                <code>{field.name}</code>
                <span>{field.required ? "Required" : "Optional"}</span>
              </dt>
              <dd>
                <code>{field.type}</code>
                {field.description && (
                  <p>
                    <ReferenceSentence text={field.description} />
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

/** One compact reading layout, with verified contracts and destinations tailored to each kind. */
export function CodeReferenceHelpContent({ reference }: { reference: CodeReferenceHelp }) {
  const { kind, name, module, description, detail, source, docs } = reference;
  const { Icon, label } = referenceKinds[kind];
  const moduleDestination = docs ?? source;
  const related = reference.related?.slice(0, 4);
  const SourceIcon = source?.href.startsWith("https://github.com/")
    ? BrandGithubIcon
    : FileCodeIcon;
  return (
    <div class="code-reference-help-layout" data-reference-kind={kind}>
      <header class="code-reference-help-header">
        <span class="code-reference-help-kind-icon" aria-hidden="true">
          <Icon size={17} />
        </span>
        <strong>
          <code>{name}</code>
        </strong>
        <Badge class="code-reference-help-kind" size="xxs">
          <Icon size={11} aria-hidden="true" />
          {label}
        </Badge>
      </header>
      <div class="code-reference-help-origin">
        <span>
          {reference.originLabel ??
            (kind === "file"
              ? "Source path"
              : kind === "module" || kind === "package"
                ? "Import path"
                : "Import from")}
        </span>
        {moduleDestination ? (
          <a href={moduleDestination.href} target="_top" aria-label={`Open ${module} reference`}>
            <ReferencePath path={module} />
          </a>
        ) : (
          <ReferencePath path={module} />
        )}
      </div>
      <div class="code-reference-help-summary">
        <p>
          <ReferenceSentence text={description} />
        </p>
        {detail && detail !== description && (
          <p class="code-reference-help-detail">
            <ReferenceSentence text={detail} />
          </p>
        )}
      </div>
      <ReferenceContract reference={reference} />
      {!!reference.facts?.length && (
        <section aria-label="Reference details">
          <dl class="code-reference-help-fields">
            {reference.facts.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {!!related?.length && (
        <section class="code-reference-help-related" aria-label="Related references">
          <div class="code-reference-help-section-label">
            <strong>
              {kind === "component" || kind === "type"
                ? "Types & related reading"
                : kind === "module" || kind === "package"
                  ? "Inside this reference"
                  : "Keep exploring"}
            </strong>
          </div>
          <div class="code-reference-help-related-links">
            {related.map((link) => {
              const RelatedIcon = relatedIcons[link.kind];
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_top"
                  class="code-reference-help-related-link"
                >
                  <RelatedIcon size={11} aria-hidden="true" />
                  <code>{link.label}</code>
                  <ArrowUpRightIcon size={10} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </section>
      )}
      {(source || docs) && (
        <footer class="code-reference-help-footer">
          {docs && (
            <a class="code-reference-help-primary-link" href={docs.href} target="_top">
              <BookOpenIcon size={13} aria-hidden="true" />
              <span>{docs.label}</span>
              <ArrowUpRightIcon size={12} aria-hidden="true" />
            </a>
          )}
          {source && (
            <a class="code-reference-help-source-link" href={source.href} target="_top">
              <SourceIcon size={13} aria-hidden="true" />
              <span>{source.label}</span>
              <ArrowUpRightIcon size={12} aria-hidden="true" />
            </a>
          )}
        </footer>
      )}
    </div>
  );
}
