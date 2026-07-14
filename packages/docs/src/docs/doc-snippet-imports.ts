/**
 * Doc snippets: bind rewrite helpers to slugs from the live docs registry.
 */

import {
  docImportFrom as docImportFromPath,
  rewriteKamodCoreImportsInDocString as rewriteWithSlugs,
} from "./doc-snippet-rewrite";
import { docsPageSlugsLongestFirst } from "./registry";

export function rewriteKamodCoreImportsInDocString(source: string, fallbackSlug: string): string {
  return rewriteWithSlugs(source, fallbackSlug, docsPageSlugsLongestFirst);
}

export function docImportFrom(slug: string): string {
  return docImportFromPath(slug);
}
