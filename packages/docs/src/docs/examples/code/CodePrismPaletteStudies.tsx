import { PaletteIcon } from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { Button, Card, CardContent, CardHeader, Code } from "@kamod-ch/ui";
import { prismPalettes } from "./code-syntax-catalog";

const source = `import { Button } from "@kamod-ch/ui/button";

// One clear action, one useful result.
export function Welcome() {
  const count = 3;
  return <Button disabled={false}>Open {count} items</Button>;
}`;

/** Compare real Code instances without creating extra iframes or duplicating reader controls. */
export function CodePrismPaletteStudies() {
  return (
    <div class="code-prism-studies">
      <div class="code-prism-studies-grid">
        {prismPalettes.map((palette) => (
          <Card class="code-prism-study" size="sm" key={palette.id}>
            <CardHeader class="code-prism-study-heading">
              <div>
                <h4>
                  <PaletteIcon size={16} aria-hidden="true" />
                  {palette.title}
                </h4>
                <p>
                  Prism <span aria-hidden="true">·</span> Light / dark
                </p>
              </div>
              <Button
                class="docs-icon-button"
                variant="ghost"
                size="icon-sm"
                href={`https://github.com/PrismJS/prism/blob/v1.30.0/themes/${palette.file}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read the original ${palette.title} Prism stylesheet`}
              >
                <BrandGithubIcon class="size-3.5" size={14} aria-hidden="true" />
              </Button>
            </CardHeader>
            <CardContent>
              <Code
                code={source}
                language="tsx"
                syntaxTheme={palette.id}
                showToolbar={false}
                showCopy={false}
                showImportControl={false}
                showWrapControl={false}
                defaultWrapped
              />
              <p class="code-prism-study-description">{palette.description}</p>
              <p class="code-prism-study-prop">
                <code>{`syntaxTheme="${palette.id}"`}</code>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
