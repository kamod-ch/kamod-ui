/**
 * Doc snippets: bind rewrite helpers to slugs from the live docs registry.
 */

import {
  buildDocsPageSlugsLongestFirst,
  docImportFrom as docImportFromPath,
  rewriteKamodCoreImportsInDocString as rewriteWithSlugs,
} from "./doc-snippet-rewrite";
import { docsRouteManifest } from "./generated-manifest";

// Importing the runtime registry here pulled every example into each preview frame.
const docsPageSlugsLongestFirst = buildDocsPageSlugsLongestFirst(
  docsRouteManifest.map(({ slug }) => slug),
);

export function rewriteKamodCoreImportsInDocString(source: string, fallbackSlug: string): string {
  return rewriteWithSlugs(source, fallbackSlug, docsPageSlugsLongestFirst);
}

export function docImportFrom(slug: string): string {
  return docImportFromPath(slug);
}
