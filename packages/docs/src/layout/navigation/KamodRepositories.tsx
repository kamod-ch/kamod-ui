import { ArrowUpRightIcon, ChevronUpIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kamod-ch/ui";
import { useId } from "preact/hooks";
import { KamodReference } from "../../docs/components/brand/KamodReference";

const repositories = [
  { label: "Icons", slug: "kamod-icons" },
  { label: "Hooks", slug: "kamod-hooks" },
  { label: "Signals", slug: "kamod-signals" },
  { label: "State", slug: "kamod-state" },
  { label: "i18n", slug: "kamod-i18n" },
  { label: "Motion", slug: "kamod-motion" },
  { label: "Charts", slug: "kamod-charts" },
  { label: "PreactPress", slug: "preactpress" },
];

/** Bottom-anchored disclosure shared by desktop and mobile navigation. */
export function KamodRepositories() {
  const id = useId();
  return (
    <nav class="docs-sidebar-ecosystem" aria-label="Kamod repositories">
      <Collapsible>
        <CollapsibleTrigger
          class="docs-sidebar-ecosystem-heading sidebar-entry-row"
          aria-controls={id}
          data-navigation-help="ecosystem"
        >
          <BrandGithubIcon size={16} aria-hidden="true" />
          <span class="docs-sidebar-ecosystem-title sidebar-entry-heading">
            <strong class="sidebar-entry-title">Kamod Ecosystem</strong>
            <span class="sidebar-entry-caption">
              <span aria-hidden="true">·</span> Toolkit
            </span>
          </span>
          <span class="docs-sidebar-ecosystem-toggle sidebar-entry-action" aria-hidden="true">
            <ChevronUpIcon size={14} strokeWidth={1.75} />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent id={id} duration="200ms">
          <div class="docs-sidebar-ecosystem-body" data-tooltip="off">
            <ul>
              {repositories.map(({ label, slug }) => (
                <li key={slug}>
                  <a
                    class="docs-sidebar-repository"
                    href={`https://github.com/kamod-ch/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} on GitHub (opens in a new tab)`}
                  >
                    <BrandGithubIcon size={13} aria-hidden="true" />
                    <span class="docs-sidebar-repository-content">
                      <strong>{label}</strong>
                      <span class="docs-sidebar-repository-slash" aria-hidden="true">
                        /
                      </span>
                      <code>
                        <KamodReference
                          label={`@kamod-ch/${slug.replace(/^kamod-/, "")}`}
                          showArrow={false}
                        >{`@kamod-ch/${slug.replace(/^kamod-/, "")}`}</KamodReference>
                      </code>
                    </span>
                    <ArrowUpRightIcon size={12} strokeWidth={2} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              class="docs-sidebar-ecosystem-all"
              href="https://github.com/orgs/kamod-ch/repositories"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="All Kamod repositories (opens in a new tab)"
            >
              All repositories <ArrowUpRightIcon size={11} aria-hidden="true" />
            </a>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}
