/** Small setup destination for blocks without an extended, block-specific guide. */
import { CodeBlock } from "../docs/components/CodeBlock";
import type { BlockCategory, BlockOverviewEntry } from "./block-categories";
import { getBlockOverviewDetails } from "./block-overview-details";

export function BlockInstallation({
  block,
  category,
}: {
  block: BlockOverviewEntry;
  category: BlockCategory;
}) {
  const { dependencies, installationId, sourceUrl } = getBlockOverviewDetails(category, block);
  return (
    <section class="blocks-basic-installation" aria-labelledby={installationId}>
      <p class="blocks-overview-label">Getting started</p>
      <h2 id={installationId} tabIndex={-1}>
        Add this block
      </h2>
      <p>
        Copy the files listed in the Code tab into your Preact project, including the shared
        components and assets they import. Adapt the imports to your local folders. You can also
        browse the{" "}
        <a href={sourceUrl} target="_blank" rel="noreferrer noopener">
          variant’s source on GitHub
        </a>
        .
      </p>
      <h3>Install missing dependencies</h3>
      <p>
        Add only the packages your project does not already use. Themes and Signals are required
        peers of Kamod UI; use your project’s existing package manager.
      </p>
      <CodeBlock code={`pnpm add ${dependencies.join(" ")}`} language="bash" />
      <p>
        Use your existing Tailwind and Kamod UI theme setup. Replace demo content and connect
        navigation or form callbacks to your application. The block source is copied locally; its{" "}
        <code>@kamod-ch/blocks</code> path is a repository reference, not a package-install command.
      </p>
    </section>
  );
}
