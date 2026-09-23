/**
 * Variant header, breadcrumbs and links to neighbouring blocks and repository resources.
 * @see https://www.shadcnblocks.com/block/application-shell1 — header design reference.
 */
import { applicationShellBlocks } from "@kamod-ch/blocks/application-shell";
import { ArrowLeftIcon, BugIcon, ChevronLeftIcon, ChevronRightIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import {
  type ApplicationShellBlock,
  blocksOverviewHref,
  categoryPath,
  repositoryUrl,
} from "./application-shell-config";
import { ShellHeadingLink } from "./ShellHeadingLink";

/**
 * Introduces the variant and provides category, adjacent-variant and repository links.
 * Registry order determines previous/next destinations; missing neighbours render as
 * native disabled buttons rather than inert anchors. Source links target the
 * implementation on upstream main.
 *
 * @param props - The registered variant displayed by this detail page.
 */
export const ShellPageHeader = ({ block }: { block: ApplicationShellBlock }) => {
  const displayName = `Application Shell ${block.id.replace("application-shell-", "")}`;

  return (
    <header class="blocks-shell-header" aria-labelledby={`${block.id}-overview`}>
      <div class="blocks-shell-header-intro">
        <a class="blocks-detail-back blocks-shell-header-back" href={withBasePath(categoryPath)}>
          <ArrowLeftIcon
            size={16}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          All application shell blocks
        </a>
        <div class="blocks-shell-header-title-row">
          <h1 id={`${block.id}-overview`} tabIndex={-1}>
            <ShellHeadingLink id="top">
              {displayName} — Sidebar shell with breadcrumbs
            </ShellHeadingLink>
          </h1>
          <Badge variant="secondary" size="md">
            Layout block
          </Badge>
        </div>
        <p>
          A responsive frame for your application, with a collapsible sidebar, grouped navigation,
          nested links and an account menu. Add your pages beneath the breadcrumb header and connect
          your own routing and user actions.{" "}
          <a class="blocks-shell-header-about" href="#application-shell-about">
            About this block
          </a>
          .
        </p>
      </div>
      <div class="blocks-shell-header-toolbar">
        <Breadcrumb aria-label="Block breadcrumb">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath("/")}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={blocksOverviewHref}>Blocks</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={withBasePath(categoryPath)}>Application Shell</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{block.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ShellHeaderActions block={block} />
      </div>
    </header>
  );
};

/** Keeps adjacent-variant controls and repository URLs together. */
const ShellHeaderActions = ({ block }: { block: ApplicationShellBlock }) => {
  const index = applicationShellBlocks.findIndex((entry) => entry.id === block.id);
  const neighbours = [
    {
      label: "Previous",
      rel: "prev",
      block: applicationShellBlocks[index - 1],
      Icon: ChevronLeftIcon,
    },
    {
      label: "Next",
      rel: "next",
      block: applicationShellBlocks[index + 1],
      Icon: ChevronRightIcon,
    },
  ];
  const sourceUrl = `${repositoryUrl}/tree/main/packages/blocks/src/${block.category}/${block.id}`;
  const issueQuery = new URLSearchParams({
    title: `bug(blocks): ${block.title} — `,
    body: `Block: ${block.title}\nSource: ${sourceUrl}\n\n### What happened?\n\n### Steps to reproduce\n\n1. \n\n### Expected behavior\n\n### Browser and screen size\n\n`,
  });

  return (
    <div class="blocks-shell-header-actions" role="group" aria-label="Block navigation and links">
      {neighbours.map(({ label, rel, block: neighbour, Icon }) => (
        <Button
          key={rel}
          variant="ghost"
          size="icon"
          {...(neighbour
            ? { href: withBasePath(`${categoryPath}/${neighbour.id}`), rel }
            : { type: "button", disabled: true })}
          aria-label={
            neighbour ? `${label} variant: ${neighbour.title}` : `${label} variant unavailable`
          }
          title={neighbour ? `${label}: ${neighbour.title}` : `No ${label.toLowerCase()} variant`}
        >
          <Icon
            size={16}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
        </Button>
      ))}
      <Button
        variant="ghost"
        size="icon"
        href={`${repositoryUrl}/issues/new?${issueQuery}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Report a bug with ${block.title} on GitHub (opens in a new tab)`}
        title="Report a bug on GitHub"
      >
        <BugIcon
          size={16}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        href={sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`View ${block.title} source on GitHub (opens in a new tab)`}
        title="View source on GitHub"
      >
        <BrandGithubIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  );
};
