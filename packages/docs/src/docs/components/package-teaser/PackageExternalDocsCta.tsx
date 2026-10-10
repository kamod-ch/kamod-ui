import { ArrowUpRightIcon, BookOpenIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { linkTitle } from "../../../link-title";
import { DocsCallout } from "../DocsCallout";

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
  <DocsCallout
    class="docs-callout-spaced"
    title={linkTitle(title)}
    icon={<BookOpenIcon />}
    eyebrow="Keep exploring"
    footer={
      <Button
        variant="ghost"
        size="sm"
        href={externalDocsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkTitle(ctaLabel)}
        <ArrowUpRightIcon size={14} aria-hidden="true" />
      </Button>
    }
  >
    <p>{description}</p>
  </DocsCallout>
);
