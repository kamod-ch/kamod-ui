import { ArrowUpRightIcon, BookOpenIcon, FileCodeIcon, InfoIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Badge } from "@kamod-ch/ui/badge";
import { splitDisplayPath } from "../../docs/components/display-path";
import type { CodeReferenceHelp } from "../types";
import { ReferenceContract } from "./reference-contract";
import { referenceKinds } from "./reference-kinds";
import { referencePresentation } from "./reference-presentation";
import { ReferenceRelated } from "./reference-related";
import { ReferenceSentence } from "./reference-sentence";

/** Preserve the copyable origin while each path segment yields to the single-line row. */
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

/** One compact reading surface, using verified facts and existing delegated tooltip behavior. */
export function CodeReferenceHelpContent({ reference }: { reference: CodeReferenceHelp }) {
  const { kind, name, module, description, source, facts } = reference;
  const { Icon, label } = referenceKinds[kind];
  const { owner, primary, shortcuts, note, caption } = referencePresentation(reference);
  const ActionIcon =
    primary === source
      ? source?.href.startsWith("https://github.com/")
        ? BrandGithubIcon
        : FileCodeIcon
      : BookOpenIcon;
  return (
    <div class="code-reference-help-layout" data-reference-kind={kind}>
      <header class="code-reference-help-header">
        <span class="code-reference-help-kind-icon" aria-hidden="true">
          <Icon size={17} />
        </span>
        <strong>
          <code>{name}</code>
        </strong>
        <div class="code-reference-help-badges">
          <Badge class="code-reference-help-owner" size="xxs">
            {owner}
          </Badge>
          <span class="code-reference-help-dot" aria-hidden="true">
            ·
          </span>
          <Badge class="code-reference-help-kind" size="xxs">
            <Icon size={11} aria-hidden="true" />
            {label}
          </Badge>
        </div>
      </header>
      <nav class="code-reference-help-origin" aria-label="Reference locations">
        <span class="code-reference-help-origin-label">
          {reference.originLabel ??
            (kind === "file"
              ? "Source path"
              : kind === "module" || kind === "package"
                ? "Import path"
                : "Import from")}
        </span>
        {primary ? (
          <a
            class="code-reference-help-origin-path"
            href={primary.href}
            target="_top"
            aria-label={`Open ${module} reference`}
          >
            <ReferencePath path={module} />
          </a>
        ) : (
          <ReferencePath path={module} />
        )}
        {shortcuts.map((link) => (
          <span class="code-reference-help-shortcut" key={link.href}>
            <span aria-hidden="true">/</span>
            <a href={link.href} target="_top" aria-label={`${link.label} for ${name}`}>
              {link.text}
            </a>
          </span>
        ))}
      </nav>
      <div class="code-reference-help-summary">
        <p>
          <ReferenceSentence text={description} />
        </p>
        {caption && (
          <p class="code-reference-help-detail">
            <ReferenceSentence text={caption} />
          </p>
        )}
      </div>
      <ReferenceContract reference={reference} />
      {!!facts?.length && (
        <section
          class="code-reference-help-panel code-reference-help-facts"
          aria-label="Reference details"
        >
          <div class="code-reference-help-section-label">
            <strong>
              <InfoIcon size={13} aria-hidden="true" />
              Reference details
            </strong>
            <span>
              {facts.length} {facts.length === 1 ? "detail" : "details"}
            </span>
          </div>
          <dl>
            {facts.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  <ReferenceSentence text={value} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <ReferenceRelated reference={reference} />
      <footer class="code-reference-help-footer">
        <span class="code-reference-help-note">
          <InfoIcon size={12} aria-hidden="true" />
          <span>{note}</span>
        </span>
        {primary && (
          <a class="code-reference-help-primary-link" href={primary.href} target="_top">
            <ActionIcon size={13} aria-hidden="true" />
            <span>{primary.label}</span>
            <ArrowUpRightIcon size={12} aria-hidden="true" />
          </a>
        )}
      </footer>
    </div>
  );
}
