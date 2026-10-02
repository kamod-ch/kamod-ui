import { useEffect, useState } from "preact/hooks";
import { DocsComponentContent } from "../../DocsComponentContent";
import { docsBySlug } from "../../registry";

/** One static route serves every registered example without duplicating demo definitions. */
export function ComponentPreviewPage() {
  const [selection, setSelection] = useState<{ slug: string; index: number } | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("component") ?? "";
    const rawIndex = params.get("example") ?? "";
    const index = /^\d+$/.test(rawIndex) ? Number(rawIndex) : -1;
    if (docsBySlug[slug] && Number.isSafeInteger(index) && index >= 0)
      setSelection({ slug, index });
  }, []);
  return (
    <main id="component-preview-root">
      {selection ? (
        <DocsComponentContent slug={selection.slug} previewIndex={selection.index} />
      ) : (
        <p role="status">Choose an example from its documentation page.</p>
      )}
    </main>
  );
}
