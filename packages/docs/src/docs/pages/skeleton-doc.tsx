import { Skeleton } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const skeletonDocPage = createGenericDocPage({
  slug: "skeleton",
  title: "Skeleton",
  usageLabel: "Skeleton placeholders indicate loading content structure.",
  installationText: "Import Skeleton from `@/components/kamod-ui/skeleton`.",
  usageText:
    "Build placeholders that mirror final UI structure (avatar, text, form, table) for a more polished loading experience.",
  exampleSections: [
    {
      id: "pulse-skeleton",
      title: "Pulse Variant (Default)",
      text: "**Represent Content that Is Genuinely Loading.** Use the default pulse skeleton while a known content shape is loading. Match its dimensions to the expected result so the placeholder explains the reserved space without suggesting that real information is already available.\n\nMatch the approximate final dimensions, keep placeholders out of the meaningful reading order and provide a separate status message when users need to understand the pending operation.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export const Example = () => (
  <div class="w-full max-w-md space-y-3">
    <Skeleton class="h-4 w-[92%]" />
    <Skeleton class="h-4 w-[84%]" />
    <Skeleton class="h-4 w-[76%]" />
  </div>
);`,
      renderPreview: () => (
        <div class="w-full max-w-md space-y-3">
          <Skeleton class="h-4 w-[92%]" />
          <Skeleton class="h-4 w-[84%]" />
          <Skeleton class="h-4 w-[76%]" />
        </div>
      ),
    },
    {
      id: "shimmer-skeleton",
      title: "Shimmer Variant",
      text: "**Use Movement Sparingly Across Large Surfaces.** Choose the shimmer skeleton when a moving highlight fits the surrounding loading treatment. Apply it consistently to the anticipated content regions, keeping the final layout and reduced-motion experience in mind.\n\nKeep the final layout's shape, respect reduced-motion needs and replace the placeholders with a clear error or empty state if the content cannot arrive.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export const Example = () => (
  <div class="w-full max-w-md space-y-3">
    <Skeleton variant="shimmer" class="h-4 w-[92%]" />
    <Skeleton variant="shimmer" class="h-4 w-[84%]" />
    <Skeleton variant="shimmer" class="h-4 w-[76%]" />
  </div>
);`,
      renderPreview: () => (
        <div class="w-full max-w-md space-y-3">
          <Skeleton variant="shimmer" class="h-4 w-[92%]" />
          <Skeleton variant="shimmer" class="h-4 w-[84%]" />
          <Skeleton variant="shimmer" class="h-4 w-[76%]" />
        </div>
      ),
    },
    {
      id: "glass-skeleton",
      title: "Glass Variant",
      text: "**Check the Placeholder Against Its Actual Surface.** Use the glass skeleton for a softer translucent placeholder on a suitable surface. Compare it in both themes so the reserved content remains visible without relying on a background treatment that disappears against the page.\n\nTest both themes and avoid using visual subtlety to hide an indefinite wait; provide meaningful status and recovery outside the decorative shapes.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export const Example = () => (
  <div class="w-full max-w-md rounded-xl border p-4 space-y-3">
    <Skeleton variant="glass" class="h-8 w-32 rounded-lg" />
    <Skeleton variant="glass" class="h-4 w-[92%]" />
    <Skeleton variant="glass" class="h-4 w-[78%]" />
  </div>
);`,
      renderPreview: () => (
        <div class="w-full max-w-md rounded-xl border p-4 space-y-3">
          <Skeleton variant="glass" class="h-8 w-32 rounded-lg" />
          <Skeleton variant="glass" class="h-4 w-[92%]" />
          <Skeleton variant="glass" class="h-4 w-[78%]" />
        </div>
      ),
    },
    {
      id: "avatar-skeleton",
      title: "Avatar Skeleton",
      text: "**Reserve the Profile's Layout before Data Arrives.** Combine a circular placeholder with short text lines for a profile that has not loaded yet. The circle reserves the avatar's area, while the lines suggest the position of the name and supporting identity information.\n\nKeep their dimensions close to the final content and replace the entire loading state when the real profile or an explicit failure becomes available.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export const Example = () => (
  <div class="flex items-center gap-4">
    <Skeleton class="h-12 w-12 rounded-full" />
    <div class="space-y-2">
      <Skeleton class="h-4 w-[240px]" />
      <Skeleton class="h-4 w-[180px]" />
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="flex items-center gap-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[240px]" />
            <Skeleton class="h-4 w-[180px]" />
          </div>
        </div>
      ),
    },
    {
      id: "text-skeleton",
      title: "Text Skeleton",
      text: "**Suggest Paragraph Shape without Imitating Readable Content.** Vary skeleton line widths to suggest a paragraph's shape rather than repeating identical full-width bars. Match the number and spacing of lines to the likely content, keeping the placeholder a useful approximation of the final region.\n\nMatch the expected number of lines conservatively, avoid exposing decorative bars as text to assistive technology and let the real content determine its natural height after loading.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export const Example = () => (
  <div class="w-full max-w-md space-y-3">
    <Skeleton class="h-4 w-[92%]" />
    <Skeleton class="h-4 w-[88%]" />
    <Skeleton class="h-4 w-[75%]" />
  </div>
);`,
      renderPreview: () => (
        <div class="w-full max-w-md space-y-3">
          <Skeleton class="h-4 w-[92%]" />
          <Skeleton class="h-4 w-[88%]" />
          <Skeleton class="h-4 w-[75%]" />
        </div>
      ),
    },
    {
      id: "card-skeleton",
      title: "Card Skeleton",
      text: "**Mirror the Card's Actual Information Hierarchy.** Arrange avatar, heading, metadata and body placeholders in the same positions as the eventual card content. This lets the loading state preserve the card's hierarchy instead of replacing it with one undifferentiated block.\n\nAvoid adding placeholder regions the finished card will not contain, and handle partial or failed data explicitly rather than leaving isolated animated fragments behind.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export function SkeletonCard() {
  return (
    <div class="w-full max-w-md rounded-xl border p-4 space-y-4">
      <div class="flex items-center gap-3">
        <Skeleton class="h-10 w-10 rounded-full" />
        <div class="space-y-2">
          <Skeleton class="h-3 w-[160px]" />
          <Skeleton class="h-3 w-[110px]" />
        </div>
      </div>
      <Skeleton class="h-44 w-full rounded-lg" />
      <div class="space-y-2">
        <Skeleton class="h-4 w-[92%]" />
        <Skeleton class="h-4 w-[78%]" />
      </div>
    </div>
  );
}`,
      renderPreview: () => (
        <div class="w-full max-w-md rounded-xl border p-4 space-y-4">
          <div class="flex items-center gap-3">
            <Skeleton class="h-10 w-10 rounded-full" />
            <div class="space-y-2">
              <Skeleton class="h-3 w-[160px]" />
              <Skeleton class="h-3 w-[110px]" />
            </div>
          </div>
          <Skeleton class="h-44 w-full rounded-lg" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[92%]" />
            <Skeleton class="h-4 w-[78%]" />
          </div>
        </div>
      ),
    },
    {
      id: "form-skeleton",
      title: "Form Skeleton",
      text: "**Avoid Making Loading Placeholders Look Editable.** Reserve the positions of labels, inputs and actions with form-shaped skeletons while required data loads. The placeholders should resemble the layout without inviting typing into controls that are not yet ready to accept values.\n\nExplain that the form is loading, preserve its surrounding context and only expose real controls when their initial values and required configuration are ready.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export function SkeletonForm() {
  return (
    <div class="w-full max-w-md rounded-xl border p-4 space-y-4">
      <div class="space-y-2">
        <Skeleton class="h-4 w-24" />
        <Skeleton class="h-10 w-full" />
      </div>
      <div class="space-y-2">
        <Skeleton class="h-4 w-32" />
        <Skeleton class="h-10 w-full" />
      </div>
      <Skeleton class="h-10 w-28" />
    </div>
  );
}`,
      renderPreview: () => (
        <div class="w-full max-w-md rounded-xl border p-4 space-y-4">
          <div class="space-y-2">
            <Skeleton class="h-4 w-24" />
            <Skeleton class="h-10 w-full" />
          </div>
          <div class="space-y-2">
            <Skeleton class="h-4 w-32" />
            <Skeleton class="h-10 w-full" />
          </div>
          <Skeleton class="h-10 w-28" />
        </div>
      ),
    },
    {
      id: "table-skeleton",
      title: "Table Skeleton",
      text: "**Keep Row and Column Geometry Stable.** Use consistent row heights and column widths for a loading table. Preserving that structure helps readers recognize the expected result and reduces movement when the actual headers, values and row actions appear.\n\nPreserve headers where useful, keep decorative cells out of the reading order and replace the loading body with a clear empty or error state when appropriate.",
      code: `import { Skeleton } from "@/components/kamod-ui/skeleton";

export function SkeletonTable() {
  return (
    <div class="w-full max-w-2xl rounded-xl border overflow-hidden">
      <div class="border-b p-3">
        <Skeleton class="h-4 w-40" />
      </div>
      <div class="space-y-0">
        {[...Array(4)].map((_, i) => (
          <div class="grid grid-cols-3 gap-4 border-b p-3" key={i}>
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-4 w-[85%]" />
            <Skeleton class="h-4 w-[60%]" />
          </div>
        ))}
      </div>
    </div>
  );
}`,
      renderPreview: () => (
        <div class="w-full max-w-2xl rounded-xl border overflow-hidden">
          <div class="border-b p-3">
            <Skeleton class="h-4 w-40" />
          </div>
          <div class="space-y-0">
            {[...Array(4)].map((_, i) => (
              <div class="grid grid-cols-3 gap-4 border-b p-3" key={i}>
                <Skeleton class="h-4 w-full" />
                <Skeleton class="h-4 w-[85%]" />
                <Skeleton class="h-4 w-[60%]" />
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "variant", type: '"pulse" | "shimmer" | "glass"', defaultValue: '"pulse"' },
    { prop: "data-slot", type: '"skeleton"', defaultValue: '"skeleton"' },
    { prop: "children", type: "not used", defaultValue: "n/a" },
  ],
  accessibilityText:
    "Skeletons are visual-only loading placeholders. Add a nearby live status like 'Loading content...' for assistive technologies and replace placeholders promptly when data arrives.",
});
