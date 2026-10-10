import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { linkTitle } from "../../../link-title";
import type { PackageTeaserConfig } from "../../pages/kamod-package-doc-factory";
import { CodeBlock } from "../CodeBlock";
import { PackageText } from "./PackageGuideHeader";
import { packageGuideRecipes } from "./package-guide-recipes";

export function PackageExamples({ config }: { config: PackageTeaserConfig }) {
  const recipe = packageGuideRecipes[config.slug];
  return (
    <>
      <CodeBlock
        code={`${config.quickStart.import}\n\n${config.quickStart.usage}`}
        language="tsx"
        filePath="src/example.tsx"
      />
      <h3 id="read-the-example" tabIndex={-1}>
        <BlockHeadingLink id="read-the-example">Read the Example</BlockHeadingLink>
      </h3>
      <p class="block-guide-prose">
        Follow the value from its definition to the interface. Each part below explains a decision
        to keep when adapting the example.
      </p>
      <div class="package-guide-walkthrough">
        {recipe.steps.map(({ title, code, note }, index) => (
          <div class="package-guide-reading" key={title}>
            <div class="package-guide-reading-title">
              <span aria-hidden="true">0{index + 1}</span>
              <strong>{linkTitle(title)}</strong>
            </div>
            <div class="block-guide-prose">
              <p>
                <PackageText text={note} />
              </p>
            </div>
            <CodeBlock code={code} language="tsx" />
          </div>
        ))}
      </div>
      <h3 id="put-it-to-work" tabIndex={-1}>
        <BlockHeadingLink id="put-it-to-work">{recipe.title}</BlockHeadingLink>
      </h3>
      <div class="block-guide-prose">
        <p>{recipe.introduction}</p>
      </div>
      <CodeBlock code={recipe.code} language="tsx" filePath={recipe.file} />
      <div class="block-guide-prose">
        <p>
          <strong>Try the Boundaries.</strong> <PackageText text={recipe.result} />
        </p>
      </div>
    </>
  );
}
