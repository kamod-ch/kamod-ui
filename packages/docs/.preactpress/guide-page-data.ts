import type { PageView } from "@kamod-ch/preactpress/client";
import { excerptFromHtml } from "@kamod-ch/preactpress/shared";

/**
 * These guides render their checked-in Markdown through GuideArticle, not page.html.
 * Retain the exact search excerpt: PreactPress builds its index from the transformed
 * page, so simply removing HTML would silently remove the existing search text.
 */
export function compactGuidePageData(page: PageView): PageView {
  if (
    page.kind !== "markdown" ||
    !["getting-started-guide", "blocks-guide"].includes(String(page.meta?.pageKind))
  )
    return page;
  const excerpt = excerptFromHtml(page.html)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return { ...page, html: `<p>${excerpt}</p>` };
}
