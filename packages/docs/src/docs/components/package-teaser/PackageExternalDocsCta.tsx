import { Button } from "@kamod-ch/ui";

export type PackageExternalDocsCtaProps = {
  title: string;
  description: string;
  externalDocsUrl: string;
  ctaLabel?: string;
};

export const PackageExternalDocsCta = ({
  title,
  description,
  externalDocsUrl,
  ctaLabel = "Open live docs",
}: PackageExternalDocsCtaProps) => (
  <aside class="docs-package-cta-panel">
    <div class="docs-package-cta-copy">
      <h3 class="docs-package-cta-title">{title}</h3>
      <p class="docs-package-cta-text">{description}</p>
    </div>
    <Button variant="default" size="sm" asChild>
      <a href={externalDocsUrl} target="_blank" rel="noopener noreferrer">
        {ctaLabel}
      </a>
    </Button>
  </aside>
);
