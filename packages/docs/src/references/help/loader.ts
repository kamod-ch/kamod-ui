import navigation from "virtual:kamod-code-references";
import { withBasePath } from "../../base-path";
import { componentPropsId } from "../../docs/components/component-detail/component-api-id";
import { packageApiReferences } from "../../docs/components/package-api-references";
import { docsNavigation } from "../../docs/generated-navigation";
import { packageGuide, rootPackageName } from "../catalog/packages";
import { packageSource } from "../package-source";
import type {
  CodeReferenceHelp,
  CodeReferenceHelpCatalog,
  CodeReferenceHelpRequest,
  CodeReferenceSourceModule,
  CodeReferenceSourceSymbol,
} from "../types";
import { loadInlineReferenceHelp } from "./inline-help";
import { referenceSourceSections } from "./reference-source-sections";

const repository = "https://github.com/kamod-ch/kamod-ui";
const routes = new Set<string>(docsNavigation.map(({ slug }) => slug));
const modules = new Map<string, Promise<CodeReferenceSourceModule>>();
const packageDeclarations = new Map<string, Promise<Record<string, CodeReferenceSourceSymbol[]>>>();
let catalog: Promise<CodeReferenceHelpCatalog> | undefined;
const sourceUrl = (file: string) => `${repository}/blob/main/${file}`;
const resource = (label: string, href: string) => ({
  label,
  href: href.startsWith("/") ? withBasePath(href) : href,
});

/** One shared manifest request and one request per visited source module; failures can be retried. */
async function helpCatalog() {
  if (!catalog)
    catalog = import("virtual:kamod-code-reference-help")
      .then(({ default: value }) => value)
      .catch((error) => {
        catalog = undefined;
        throw error;
      });
  return catalog;
}

async function sourceModule(data: CodeReferenceHelpCatalog, slug: string | undefined) {
  if (!slug || !Object.hasOwn(data.loaders, slug)) return;
  let request = modules.get(slug);
  if (!request) {
    request = data.loaders[slug]().catch((error) => {
      modules.delete(slug);
      throw error;
    });
    modules.set(slug, request);
  }
  return request;
}

async function packageSymbol(data: CodeReferenceHelpCatalog, request: CodeReferenceHelpRequest) {
  const root = rootPackageName(request.module);
  const load =
    data.packageLoaders && Object.hasOwn(data.packageLoaders, root)
      ? data.packageLoaders[root]
      : undefined;
  const name = originalName(request);
  if (!load || !name || name === "*") return;
  let pending = packageDeclarations.get(root);
  if (!pending) {
    pending = load().catch((error) => {
      packageDeclarations.delete(root);
      throw error;
    });
    packageDeclarations.set(root, pending);
  }
  return (await pending)[request.module]?.find((symbol) => symbol.name === name);
}

const originalName = (request: CodeReferenceHelpRequest) =>
  request.imported === "default"
    ? request.local || request.label
    : request.imported ||
      (!request.module && /^[A-Za-z_$][\w$]*$/.test(request.label) ? request.label : undefined);

function moduleSlug(request: CodeReferenceHelpRequest) {
  // Stylesheet entrypoints have their own source, not the similarly named JS module.
  if (/\.(css|json)$/i.test(request.module)) return;
  const name = originalName(request);
  const known =
    name && Object.hasOwn(navigation.components, name) ? navigation.components[name] : undefined;
  if (!request.module) return request.href.match(/\/docs\/([^/]+)\/installation(?:#|$)/)?.[1];
  if (request.module.startsWith("@/components/kamod-ui/")) {
    const slug = request.module.split("/").at(-1);
    return !known || known.slug === slug ? slug : undefined;
  }
  if (
    request.module === "@/lib/utils" ||
    request.module === "@kamod-ch/ui/lib/utils" ||
    (name === "cn" && request.module.startsWith("@kamod-ch/ui"))
  )
    return "cn";
  if (request.module === "@kamod-ch/ui") return known?.slug;
  if (request.module.startsWith("@kamod-ch/ui/")) {
    const slug = request.module.slice("@kamod-ch/ui/".length).split("/")[0];
    return !known || known.slug === slug ? slug : undefined;
  }
  if (request.module.startsWith(".") && known && request.filePath?.startsWith("packages/")) {
    const parts = request.filePath.replaceAll("\\", "/").split("/").slice(0, -1);
    for (const segment of request.module.split("/")) {
      if (segment === "..") parts.pop();
      else if (segment !== ".") parts.push(segment);
    }
    const path = parts.join("/");
    const matches = [
      path,
      `${path}.tsx`,
      `${path}.ts`,
      `${path}/index.tsx`,
      `${path}/index.ts`,
    ].includes(known.file);
    const destination =
      request.href === sourceUrl(known.file) ||
      (routes.has(known.slug) &&
        request.href === withBasePath(`/docs/${known.slug}/installation#api-reference`));
    if (matches && navigation.files.includes(known.file) && destination) return known.slug;
  }
  return undefined;
}

function relatedDefinitions(module: CodeReferenceSourceModule, symbol: CodeReferenceSourceSymbol) {
  const definitions = module.symbols.filter((entry) => entry.typeId);
  const directlyRelated = new Set(symbol.typeNames);
  if (symbol.kind === "type") directlyRelated.add(symbol.name);
  // One dependency level keeps the card useful without expanding the entire type graph.
  for (const definition of definitions)
    if (directlyRelated.has(definition.name))
      for (const name of definition.typeNames) directlyRelated.add(name);
  for (const definition of definitions)
    if (definition.typeNames.some((name) => directlyRelated.has(name)))
      directlyRelated.add(definition.name);
  return definitions
    .filter(({ name }) => directlyRelated.has(name) && name !== symbol.name)
    .slice(0, 3);
}

/** Derive a compact presentation from source-backed facts; missing contracts stay explicitly unlisted. */
export function describeCodeReference(
  request: CodeReferenceHelpRequest,
  data: CodeReferenceHelpCatalog,
  module?: CodeReferenceSourceModule,
  declaration?: CodeReferenceSourceSymbol,
): CodeReferenceHelp {
  const name = originalName(request);
  const symbol =
    name && name !== "*" ? module?.symbols.find((entry) => entry.name === name) : undefined;
  const onSite = module && routes.has(module.slug);
  const guide = onSite ? `/docs/${module.slug}/installation` : undefined;
  if (module && symbol) {
    const description =
      symbol.description ||
      (symbol.kind === "type"
        ? `The \`${symbol.name}\` TypeScript contract from the **${module.title}** source. Declared fields and related definitions show how this value is shaped.`
        : module.description ||
          `${symbol.name} is an exported ${symbol.kind} in the ${module.title} module. Follow its implementation for the complete behavior.`);
    const related: NonNullable<CodeReferenceHelp["related"]> = guide
      ? relatedDefinitions(module, symbol).map((entry) => ({
          ...resource(entry.name, `${guide}#${entry.typeId}`),
          kind: "type",
        }))
      : [];
    const propsTitle =
      module.propsTitles.find(
        (title) =>
          title
            .replace(/\s+(props|api|reference)$/i, "")
            .replace(/[^a-z0-9]/gi, "")
            .toLowerCase() === symbol.name.toLowerCase(),
      ) || module.propsTitles[0];
    if (guide && propsTitle && (symbol.kind === "component" || symbol.fields?.length))
      related.push({
        ...resource("Props & defaults", `${guide}#${componentPropsId(module.slug, propsTitle)}`),
        kind: "props",
      });
    return {
      kind: symbol.kind,
      name: request.label || symbol.name,
      module: request.module,
      description,
      detail:
        request.local && request.local === request.label && request.local !== symbol.name
          ? `This snippet imports \`${symbol.name}\` as \`${request.local}\`; both names resolve to the same source.`
          : undefined,
      signature: symbol.signature,
      source: resource("Implementation", sourceUrl(symbol.file)),
      docs: guide
        ? resource(
            symbol.kind === "type" ? "Type definition" : "API reference",
            `${guide}#${symbol.typeId || "api-reference"}`,
          )
        : undefined,
      related,
      fields: symbol.fields?.slice(0, 4),
      sections: referenceSourceSections(module, symbol, guide),
    };
  }
  if (module && (!name || name === "*")) {
    const path = module.sourcePath;
    const isFile = path && /\.[cm]?[jt]sx?$/.test(path);
    return {
      kind: "module",
      name: request.label || request.module,
      module: request.module,
      description:
        module.description ||
        `This module groups the ${module.title} exports and their TypeScript contracts. Import only the parts your composition uses.`,
      source: path
        ? resource(
            isFile ? "Implementation" : "Source directory",
            isFile ? sourceUrl(path) : `${repository}/tree/main/${path}`,
          )
        : undefined,
      docs: guide ? resource("Module reference", `${guide}#api-reference`) : undefined,
      related: guide
        ? module.symbols
            .filter(
              (symbol) => symbol.kind === "type" && symbol.typeId && symbol.name.endsWith("Props"),
            )
            .slice(0, 3)
            .map((symbol) => ({
              ...resource(symbol.name, `${guide}#${symbol.typeId}`),
              kind: "type",
            }))
        : [],
    };
  }
  const root = rootPackageName(request.module);
  const manifest = Object.hasOwn(data.packages, root) ? data.packages[root] : undefined;
  const companion =
    name && Object.hasOwn(packageApiReferences, name) && root.startsWith("@kamod-ch/")
      ? packageApiReferences[name]
      : undefined;
  const isSymbol = Boolean(name && name !== "*");
  const isIcon = isSymbol && ["@kamod-ch/icons", "lucide-preact"].includes(root);
  const kind =
    declaration?.kind ||
    (request.module.startsWith(".")
      ? "file"
      : isIcon
        ? "icon"
        : isSymbol
          ? companion
            ? "function"
            : "export"
          : request.module === root
            ? "package"
            : "module");
  const localGuide = request.href.startsWith("/") ? request.href : undefined;
  const nearestGuide = isSymbol
    ? (localGuide ?? packageGuide(request.module))
    : (packageGuide(request.module) ?? localGuide);
  const sourceDestination = packageSource(request.module);
  const description =
    declaration?.description ||
    companion?.description ||
    (isSymbol
      ? `${request.label || name} is imported from ${request.module}. ${manifest?.description || "The linked source is the verified destination for this export; its full contract is maintained there."}`
      : request.module.endsWith(".css")
        ? `Stylesheet entrypoint from \`${root}\`. Its source defines the **CSS shipped by this import**; the related guide explains stylesheet integration and ownership.`
        : manifest?.description ||
          `The ${request.module} import resolves to the linked source. Its exports and dependency requirements belong to that module.`);
  return {
    kind,
    name: request.label || name || request.module,
    module: request.module,
    description,
    detail: manifest?.private
      ? `Private workspace package. Use the checked-in source and its local integration guide; this is not a published registry dependency.`
      : manifest?.license
        ? `Published under ${manifest.license}. ${request.module !== root && !request.module.startsWith(".") ? `This is a subpath of ${root}.` : "Inspect the package documentation for compatibility and setup."}`
        : undefined,
    signature: declaration?.signature,
    fields: declaration?.fields?.slice(0, 4),
    source: resource(
      isIcon
        ? "Icon source"
        : isSymbol
          ? "Export source"
          : sourceDestination
            ? request.module.endsWith(".css")
              ? "Stylesheet source"
              : "Package source"
            : "Repository",
      companion?.href || (!isSymbol && sourceDestination) || manifest?.repository || request.href,
    ),
    docs: nearestGuide
      ? resource("In this documentation", nearestGuide)
      : manifest?.homepage
        ? resource("Project documentation", manifest.homepage)
        : undefined,
    related:
      companion && manifest?.repository
        ? [{ ...resource("Package repository", manifest.repository), kind: "source" }]
        : [],
  };
}

/** Load compact source or inline-family help, never a page runtime or source-code compiler. */
export async function loadCodeReferenceHelp(
  request: CodeReferenceHelpRequest,
): Promise<CodeReferenceHelp> {
  const data = await helpCatalog();
  if (request.referenceId) return loadInlineReferenceHelp(data, request);
  const [module, declaration] = await Promise.all([
    sourceModule(data, moduleSlug(request)),
    packageSymbol(data, request),
  ]);
  return describeCodeReference(request, data, module, declaration);
}
