import { Button } from "@kamod-ch/ui";
import { linkTitle } from "../../../link-title";
import { BrandText } from "../brand/BrandText";

export type PackageTeaserStat = {
  value: string;
  label: string;
};

export type PackageTeaserHeroProps = {
  eyebrow: string;
  headline: string;
  lead: string;
  stats: PackageTeaserStat[];
  externalDocsUrl: string;
  githubUrl: string;
  npmUrl: string;
};

export const PackageTeaserHero = ({
  eyebrow,
  headline,
  lead,
  stats,
  externalDocsUrl,
  githubUrl,
  npmUrl,
}: PackageTeaserHeroProps) => (
  <section class="docs-package-teaser" aria-label="Package overview">
    <p class="docs-package-teaser-eyebrow">{eyebrow}</p>
    <h2 class="docs-package-teaser-headline">{linkTitle(headline)}</h2>
    <p class="docs-package-teaser-lead">
      <BrandText>{lead}</BrandText>
    </p>
    {stats.length ? (
      <dl class="docs-package-teaser-stats">
        {stats.map((stat) => (
          <div class="docs-package-teaser-stat" key={stat.label}>
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
      </dl>
    ) : null}
    <div class="docs-package-teaser-actions">
      <Button variant="default" size="sm" asChild>
        <a href={externalDocsUrl} target="_blank" rel="noopener noreferrer">
          Open Live Docs
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a href={githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <a href={npmUrl} target="_blank" rel="noopener noreferrer">
          npm
        </a>
      </Button>
    </div>
  </section>
);
