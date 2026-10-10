import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BellIcon,
  BookOpenIcon,
  CheckIcon,
  HeartIcon,
  PackageIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { InlineReferenceCode } from "../InlineCodeLink";

const sampleIcons = [SearchIcon, HeartIcon, BellIcon, SettingsIcon, SparklesIcon, CheckIcon];

/** A static, page-local finish; resource URLs stay owned by the package configuration. */
export function IconsGuideEnding({
  githubUrl,
  externalDocsUrl,
  npmUrl,
}: {
  githubUrl: string;
  externalDocsUrl: string;
  npmUrl: string;
}) {
  const nextSteps = [
    {
      title: "Find your next icon",
      description:
        "Search the catalog, choose a family, and copy the exact import for your screen.",
      href: externalDocsUrl,
      external: true,
    },
    {
      title: "Give it a real job",
      description: "Pair an icon with a Button. Let the component handle interaction and focus.",
      href: withBasePath("/docs/button/installation"),
    },
    {
      title: "Make the meaning clear",
      description: "Check accessible names and decorative icons before calling your screen done.",
      href: "#accessibility",
    },
  ];
  return (
    <section class="icons-guide-ending" aria-labelledby="icons-next-steps">
      <header class="icons-ending-heading">
        <span class="icons-ending-eyebrow">
          <SparklesIcon size={14} aria-hidden="true" /> Make It Your Own
        </span>
        <h2 id="icons-next-steps" tabIndex={-1}>
          <BlockHeadingLink id="icons-next-steps">
            Small icons. Big finishing touches.
          </BlockHeadingLink>
        </h2>
        <p>
          You have the pieces. <strong>Put them to work in a real screen</strong>, keep its visual
          style consistent, and make every action easy to recognize. Here’s where to go next.
        </p>
      </header>

      <div class="icons-ending-grid">
        <div class="icons-ending-repository">
          <a
            class="icons-ending-repository-main"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Explore kamod-icons on GitHub (opens in a new tab)"
          >
            <span class="icons-ending-repository-top">
              <BrandGithubIcon size={22} aria-hidden="true" />
              <span>Open source · Yours to explore</span>
              <ArrowUpRightIcon size={16} aria-hidden="true" />
            </span>
            <span class="icons-ending-samples" aria-hidden="true">
              {sampleIcons.map((Icon, index) => (
                <span key={index}>
                  <Icon size={20} strokeWidth={1.7} />
                </span>
              ))}
            </span>
            <h3>A closer look, right at the source.</h3>
            <p>
              Explore the exports, follow the changes, or bring a small improvement of your own. The
              repository is a good place to get curious.
            </p>
            <InlineReferenceCode size="compact">kamod-ch/kamod-icons</InlineReferenceCode>
          </a>
          <nav class="icons-ending-repository-links" aria-label="Icon repository resources">
            {[
              ["Readme", `${githubUrl}#readme`],
              ["Issues", `${githubUrl}/issues`],
              ["npm package", npmUrl],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label} <ArrowUpRightIcon size={13} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <nav class="icons-ending-next" aria-label="Next steps with icons">
          <h3>From a good icon to a great fit</h3>
          <ol>
            {nextSteps.map(({ title, description, href, external }, index) => (
              <li key={href}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  <span class="icons-ending-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <span class="icons-ending-description">{description}</span>
                  </span>
                  {external ? (
                    <ArrowUpRightIcon size={15} aria-hidden="true" />
                  ) : (
                    <ArrowRightIcon size={15} aria-hidden="true" />
                  )}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <nav class="icons-ending-guides" aria-label="Getting Started guide">
        {[
          {
            title: "Getting Started",
            description: "Bring the whole interface together.",
            href: "/docs/getting-started",
            Icon: BookOpenIcon,
          },
          {
            title: "Choose Your Companion Packages",
            description: "Find the pieces that fit your application.",
            href: "/docs/getting-started#icons",
            Icon: PackageIcon,
          },
        ].map(({ title, description, href, Icon }) => (
          <a key={href} href={withBasePath(href)}>
            <Icon size={17} aria-hidden="true" />
            <span>
              <strong>{title}</strong>
              <span class="icons-ending-description">{description}</span>
            </span>
            <ArrowRightIcon size={15} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </section>
  );
}
