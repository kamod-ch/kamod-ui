import { basePrefix, withBasePath } from "../../base-path";
import { savedPackageProfile } from "../catalog/package-profiles";
import { packageGuide, rootPackageName } from "../catalog/packages";
import { packageEntrypointSource } from "../package-source";
import type { CodeReferenceHelp, CodeReferenceHelpLink, CodeReferenceHelpRequest } from "../types";
import { referenceSectionLinks } from "./reference-section-links";

const localLink = (link: CodeReferenceHelpLink | undefined) =>
  link && {
    ...link,
    href:
      link.href.startsWith("/") && !link.href.startsWith(`${basePrefix()}/`)
        ? withBasePath(link.href)
        : link.href,
  };

/** Lazy, authored README previews; a subpath augments its owner instead of inventing file content. */
export function packageReferenceHelp(
  request: CodeReferenceHelpRequest,
): CodeReferenceHelp | undefined {
  if (request.imported || request.referenceId) return;
  const profile = savedPackageProfile(request.module);
  if (!profile) return;
  const root = rootPackageName(request.module);
  const related = profile.related?.map((link) => ({ ...link, ...localLink(link)! })) ?? [];
  const guidePath = packageGuide(request.module);
  const guide = localLink(guidePath ? { label: "In Kamod", href: guidePath } : undefined);
  if (guide && !related.some(({ href }) => href === guide.href))
    related.push({ ...guide, kind: "guide" });
  let notice: CodeReferenceHelp["notice"];
  if (request.module !== root && profile.source) {
    const exact = packageEntrypointSource(request.module);
    const subpath = request.module.slice(root.length + 1);
    const source = exact
      ? { label: "View this entrypoint", href: exact }
      : {
          label: "Find this entrypoint",
          href: `${profile.source.href}/search?q=${encodeURIComponent(subpath)}&type=code`,
        };
    notice = {
      description: `\`${request.module}\` is an entrypoint of \`${root}\`. This saved preview covers the package.${exact ? "" : " The link searches its repository for this subpath."}`,
      source,
    };
    related.push({ ...source, kind: "source" });
  }
  return {
    kind: "package",
    name: profile.name,
    module: root,
    description: profile.description,
    detail: profile.detail,
    source: localLink(profile.source),
    docs: localLink(profile.docs),
    related,
    sections: profile.sections.map(referenceSectionLinks),
    notice,
  };
}
