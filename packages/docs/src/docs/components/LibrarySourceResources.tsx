import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button } from "@kamod-ch/ui";
import { LibraryHeading } from "./LibraryHeading";

const repositories = [
  {
    name: "kamod-ui",
    label: "Components & blocks",
    packageName: "@kamod-ch/ui",
    description: (
      <>
        Follow a component into <code>packages/core</code> or explore complete compositions in{" "}
        <code>packages/blocks</code>. Read the implementation before changing shared behavior.
      </>
    ),
  },
  {
    name: "kamod-icons",
    label: "Icons & visual details",
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
        <strong>A useful next step: read the piece you want to change.</strong> These two
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
              <span class="library-source-label">{label}</span>
              <span class="library-source-name">
                <BrandGithubIcon size={17} aria-hidden="true" />
                <strong>{name}</strong>
                <ArrowUpRightIcon size={14} aria-hidden="true" />
              </span>
              <span class="library-source-description">{description}</span>
              <code class="library-source-package">{packageName}</code>
              <span class="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      <div class="library-source-footer">
        <p>
          <strong>Looking beyond the interface?</strong> Explore Kamod’s hooks, persisted signals
          and documentation tooling on GitHub. Add what your project needs, one piece at a time.
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
          All repositories
          <ArrowUpRightIcon size={13} aria-hidden="true" />
          <span class="sr-only"> (opens in a new tab)</span>
        </Button>
      </div>
    </section>
  );
}
