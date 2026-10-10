import { type ComponentChildren, render } from "preact";
import { applyPreviewAppearance, previewAppearanceFromSearch } from "../blocks/preview-appearance";
import { ApplicationTooltips } from "../layout/tooltips/ApplicationTooltips";
import { PathCopySupport } from "./components/PathCopySupport";
import { getDocSections } from "./doc-sections";
import { docsShowMotion, isMotionDocSlug } from "./docs-feature-flags";
import type { DocPageModule } from "./types";

const pages = import.meta.glob<Record<string, DocPageModule>>("./pages/*-doc.{ts,tsx}");
const root = document.getElementById("component-preview-root")!;
// Only the outer documentation page owns the showcase backdrop; local themes style the demo.
if (window.self !== window.top)
  document.documentElement.classList.add("showcase-embedded-document");
const params = new URLSearchParams(location.search);
const appearance = previewAppearanceFromSearch(location.search);
if (appearance) applyPreviewAppearance(document.documentElement, appearance);
const slug = params.get("component") ?? "";
const rawIndex = params.get("example") ?? "";
const index = /^\d+$/.test(rawIndex) ? Number(rawIndex) : -1;

async function loadPreview() {
  if (slug === "home-workspace" && index === 0) {
    document.documentElement.classList.add("home-workspace-document");
    const { WorkspaceDemo } = await import("../home/WorkspaceDemo");
    render(<WorkspaceDemo />, root);
    return;
  }
  const load = pages[`./pages/${slug}-doc.tsx`] ?? pages[`./pages/${slug}-doc.ts`];
  if (
    !load ||
    !Number.isSafeInteger(index) ||
    index < 0 ||
    (!docsShowMotion && isMotionDocSlug(slug))
  )
    throw new Error("Unknown example");
  const doc = Object.values(await load()).find((value) => value?.slug === slug);
  if (!doc || doc.guideContents || doc.navGroup === "packages")
    throw new Error("Not an example page");
  let current = 0;
  let preview: ComponentChildren;
  // The page defines the examples once. Only the requested VNode is mounted; no article,
  // router, sidebars, Markdown exports or other example state is initialized here.
  doc.renderMain({
    title: doc.title,
    sections: getDocSections(doc),
    activeSectionId: "installation",
    getSectionHref: (id) => `#${id}`,
    renderTitleRow: () => null,
    renderMarkdownAction: () => null,
    renderSectionExtraContent: () => null,
    renderPreviewAndCodeTabs: ({ preview: example, previewClass }) => {
      if (current++ === index)
        preview = (
          <div class={`preview component-example-canvas ${previewClass ?? ""}`}>{example}</div>
        );
      return null;
    },
  });
  if (preview === undefined) throw new Error("Unknown example index");
  render(
    <>
      <PathCopySupport />
      <ApplicationTooltips page={slug} />
      {preview}
    </>,
    root,
  );
}

void loadPreview()
  .catch(() => render(<p role="alert">This example could not be loaded. Try Reset.</p>, root))
  .finally(() => {
    root.dataset.previewReady = "true";
    document.dispatchEvent(new Event("kamod:preview-ready"));
  });
