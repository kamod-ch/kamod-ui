import { BookOpenIcon, FileCodeIcon, GlobeIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Tooltip, TooltipContent, TooltipTrigger } from "@kamod-ch/ui/tooltip";
import type { CodeReferenceHelp, CodeReferenceHelpLink } from "../types";
import { ReferenceSentence } from "./reference-sentence";

const descriptions = {
  source:
    "Inspect the **original implementation**, its exports and supporting imports before adapting this reference.",
  guide:
    "Read the **complete guide** for setup, examples and the surrounding API or design context.",
  official:
    "Check the **official documentation** for supported APIs, framework integration and version-specific setup.",
};

type Resource = NonNullable<CodeReferenceHelp["related"]>[number];

/** Only the open card mounts these bounded, primitive-owned resource hints. */
function ResourceAction({
  resource,
  primary,
  name,
}: {
  resource: Resource;
  primary: boolean;
  name: string;
}) {
  const source = resource.kind === "source";
  const external = /^https?:\/\//.test(resource.href);
  const github = resource.href.startsWith("https://github.com/");
  const Icon = source
    ? github
      ? BrandGithubIcon
      : FileCodeIcon
    : external
      ? GlobeIcon
      : BookOpenIcon;
  const label = source ? "Source" : external ? "Docs" : "Guide";
  return (
    <Tooltip delayDuration={250} style={{ position: "static" }}>
      <TooltipTrigger asChild>
        <a
          class={`docs-icon-button code-reference-help-resource-action${primary ? " code-reference-help-primary-link" : ""}`}
          href={resource.href}
          target="_top"
          aria-label={primary ? resource.label : `${resource.label} for ${name}`}
        >
          <Icon size={12} aria-hidden="true" />
          <span>{label}</span>
        </a>
      </TooltipTrigger>
      <TooltipContent
        class="code-reference-resource-hint"
        side="top"
        align="end"
        style={{
          left: "0.5rem",
          right: "0.5rem",
          top: "auto",
          bottom: "calc(100% + 0.375rem)",
          width: "auto",
          maxWidth: "none",
          transform: "none",
        }}
      >
        <strong>
          <Icon size={13} aria-hidden="true" />
          {resource.label}
        </strong>
        <p>
          <ReferenceSentence
            text={descriptions[source ? "source" : external ? "official" : "guide"]}
          />
        </p>
        <code dir="ltr">{resource.href.replace(/^https?:\/\//, "")}</code>
      </TooltipContent>
    </Tooltip>
  );
}

/** A compact closing cue and verified destinations, preserving the selected primary URL. */
export function ReferenceFooter({
  name,
  primary,
  resources,
}: {
  name: string;
  primary?: CodeReferenceHelpLink;
  resources: Resource[];
}) {
  return (
    <footer class="code-reference-help-footer">
      <span class="code-reference-help-note">
        <BookOpenIcon size={12} aria-hidden="true" />
        <span>{resources.length ? "Full context linked" : "Quick reference"}</span>
      </span>
      {!!resources.length && (
        <nav class="code-reference-help-resources" aria-label="Continue reading">
          {resources.map((resource) => (
            <ResourceAction
              key={resource.href}
              resource={resource}
              primary={resource.href === primary?.href}
              name={name}
            />
          ))}
        </nav>
      )}
    </footer>
  );
}
