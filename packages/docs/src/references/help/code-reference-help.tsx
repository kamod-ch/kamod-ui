import {
  ArrowUpRightIcon,
  CompassIcon,
  ExternalLinkIcon,
  InfoIcon,
  LinkIcon,
} from "@kamod-ch/icons/lucide";
import { Badge } from "@kamod-ch/ui/badge";
import { splitDisplayPath } from "../../docs/components/display-path";
import type { CodeReferenceHelp } from "../types";
import { hasReferenceContract, ReferenceContract } from "./reference-contract";
import { ReferenceFacts } from "./reference-facts";
import { referenceKinds } from "./reference-kinds";
import { ReferenceNotice } from "./reference-notice";
import { referencePresentation } from "./reference-presentation";
import { ReferenceRelated } from "./reference-related";
import { ReferenceSentence } from "./reference-sentence";
import { technologyIcon } from "./technology-icons";

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
  const { kind, name, module, description } = reference;
  const { Icon, label } = referenceKinds[kind];
  const { primary, location, context, resources, note, caption } = referencePresentation(reference);
  const MainIcon = (kind === "technology" && technologyIcon(module)) || Icon;
  const IconTag = primary ? "a" : "span";
  const TitleTag = primary ? "a" : "span";
  return (
    <div class="code-reference-help-layout" data-reference-kind={kind}>
      <header class="code-reference-help-header">
        <IconTag
          class={`code-reference-help-kind-icon${primary ? " docs-icon-button" : ""}`}
          href={primary?.href}
          target={primary ? "_top" : undefined}
          aria-label={primary ? `View ${name} reference` : undefined}
          aria-hidden={primary ? undefined : "true"}
          title={primary?.label}
        >
          <MainIcon size={16} strokeWidth={2} aria-hidden="true" />
        </IconTag>
        <div class="code-reference-help-heading">
          <TitleTag
            class="code-reference-help-title"
            href={primary?.href}
            target={primary ? "_top" : undefined}
          >
            <strong>
              <code>{name}</code>
            </strong>
            <CompassIcon
              class="code-reference-help-title-mark"
              size={12}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </TitleTag>
          {location && primary && (
            <a
              class="code-reference-help-location"
              href={primary.href}
              target="_top"
              aria-label={`Open ${location.path}`}
              title={location.path}
            >
              <span dir="ltr">{location.path}</span>
              <ArrowUpRightIcon size={10} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
        </div>
        <div class="code-reference-help-heading-meta">
          <div class="code-reference-help-badges">
            <Badge class="code-reference-help-kind" size="xxs">
              <Icon size={12} strokeWidth={2} aria-hidden="true" />
              {label}
            </Badge>
            {primary && (
              <>
                <LinkIcon
                  class="code-reference-help-connection"
                  size={8}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <a
                  class="docs-icon-button code-reference-help-open"
                  href={primary.href}
                  target="_top"
                  aria-label={`Open ${primary.label} for ${name}`}
                  title={primary.label}
                >
                  <ExternalLinkIcon size={11} strokeWidth={1.75} aria-hidden="true" />
                </a>
              </>
            )}
          </div>
        </div>
      </header>
      <nav class="code-reference-help-origin" aria-label="Reference locations">
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
        <span class="code-reference-help-context" title={context}>
          <span aria-hidden="true">/</span>
          <span>{context}</span>
        </span>
        {location && (
          <span class="code-reference-help-location-detail" title={location.detail}>
            <InfoIcon size={10} strokeWidth={1.75} aria-hidden="true" />
            <span>{location.detail}</span>
          </span>
        )}
      </nav>
      <div class="code-reference-help-summary">
        <p>
          <ReferenceSentence text={description} />
        </p>
        <ReferenceFacts reference={reference} />
        {caption && (
          <p class="code-reference-help-detail">
            <ReferenceSentence text={caption} />
            {kind !== "command" && (
              <>
                {" "}
                <ReferenceSentence text={note} />
              </>
            )}
          </p>
        )}
      </div>
      {reference.notice && <ReferenceNotice notice={reference.notice} />}
      {hasReferenceContract(reference) && (
        <div class="code-reference-help-content">
          <ReferenceContract reference={reference} />
        </div>
      )}
      <ReferenceRelated reference={reference} links={resources} primary={primary?.href} />
    </div>
  );
}
