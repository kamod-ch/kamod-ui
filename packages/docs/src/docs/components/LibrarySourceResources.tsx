import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import { linkTitle } from "../../link-title";
import { BrandText } from "./brand/BrandText";
import { LibraryHeading } from "./LibraryHeading";
import { PathDisplay } from "./PathDisplay";

const repositories = [
  {
    name: "kamod-ui",
    label: "Components & Blocks",
    packageName: "@kamod-ch/ui",
    description: (
      <>
        Follow a component into <PathDisplay path={"packages/core"} /> or explore complete
        compositions in <PathDisplay path={"packages/blocks"} />. Read the implementation before
        changing shared behavior.
      </>
    ),
  },
  {
    name: "kamod-icons",
    label: "Icons & Visual Details",
    packageName: "@kamod-ch/icons",
    description: (
      <>
        Explore the icon families, import paths and usage examples. Choose one consistent style for
        related actions and let icons inherit your theme with <code>currentColor</code>.
      </>
    ),
  },
];

/** Compact source references shared by the block and component directories. */
export function LibrarySourceResources() {
  return (
    <section class="library-source-resources" aria-labelledby="library-source-title">
      <LibraryHeading id="library-source-title" level={3}>
        Work with the source
      </LibraryHeading>
      <p>
        <strong>A Useful Next Step: Read the Piece You Want to Change.</strong> These two
        repositories cover the components and visual details behind the library. Check the README
        and the version in your <code>package.json</code> when comparing an example with your
        installed API.
      </p>
      <ul class="library-source-grid">
        {repositories.map(({ name, label, packageName, description }) => (
          <li key={name}>
            <a
              href={`https://github.com/kamod-ch/${name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="library-source-label">{linkTitle(label)}</span>
              <span class="library-source-name">
                <BrandGithubIcon size={17} aria-hidden="true" />
                <strong>{name}</strong>
                <ArrowUpRightIcon size={14} aria-hidden="true" />
              </span>
              <span class="library-source-description">{description}</span>
              <PathDisplay class="library-source-package" path={packageName} link={false} />
              <span class="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <div class="library-source-footer">
        <p>
          <BrandText>
            <strong>Looking Beyond the Interface?</strong> Explore Kamod’s hooks, persisted signals
            and documentation tooling on GitHub. Add what your project needs, one piece at a time.
          </BrandText>
        </p>
        <Button
          class="docs-icon-button"
          variant="ghost"
          size="sm"
          href="https://github.com/kamod-ch"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BrandGithubIcon size={15} aria-hidden="true" />
          All Repositories
          <ArrowUpRightIcon size={13} aria-hidden="true" />
          <span class="sr-only"> (opens in a new tab)</span>
        </Button>
      </div>
    </section>
  );
}
