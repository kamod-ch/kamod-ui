import {
  BookOpenIcon,
  BracesIcon,
  ComponentIcon,
  FileCodeIcon,
  GlobeIcon,
} from "@kamod-ch/icons/lucide";
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import type { CodeReferenceHelp } from "../types";

export type ReferenceResource = NonNullable<CodeReferenceHelp["related"]>[number];

const resources = {
  type: {
    Icon: BracesIcon,
    label: "Type",
    caption: "Type contract",
    description:
      "Read the **complete type definition**, including unions, inherited fields and supporting declarations.",
  },
  props: {
    Icon: ComponentIcon,
    label: "Props",
    caption: "Options & defaults",
    description:
      "Review **component options and defaults**, required values and supported configuration before composing it.",
  },
  source: {
    Icon: FileCodeIcon,
    label: "Source",
    caption: "Source & ownership",
    description:
      "Inspect the **original implementation**, its exports and supporting imports before adapting this reference.",
  },
  guide: {
    Icon: BookOpenIcon,
    label: "Page",
    caption: "Documentation",
    description:
      "Read the **complete guide** for setup, examples and the surrounding API or design context.",
  },
};

/** A compact kind label and an explanation of the actual linked resource. */
export function referenceResource(resource: ReferenceResource) {
  const presentation = resources[resource.kind];
  if (resource.kind === "source" && resource.href.startsWith("https://github.com/"))
    return { ...presentation, Icon: BrandGithubIcon };
  if (resource.kind === "guide" && /^https?:\/\//.test(resource.href))
    return {
      ...presentation,
      Icon: GlobeIcon,
      label: "Docs",
      description:
        "Read the **linked documentation** for API details, integration examples and version-specific guidance.",
    };
  return presentation;
}
