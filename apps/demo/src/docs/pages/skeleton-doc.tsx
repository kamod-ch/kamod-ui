import { Skeleton } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const skeletonDocPage = createGenericDocPage({
  slug: "skeleton",
  title: "Skeleton",
  usageLabel: "Skeleton placeholders indicate loading content structure.",
  installationText: "Import Skeleton from @kamod-ui/core.",
  usageText: "Build placeholders that mirror final UI structure (avatar, text, form, table) for a more polished loading experience.",
  exampleSections: [
    {
      id: "pulse-skeleton",
      title: "Pulse Variant (Default)",
      text: "Use the default pulse variant for clean, minimal loading placeholders.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    },
    {
      id: "shimmer-skeleton",
      title: "Shimmer Variant",
      text: "Use the shimmer variant for a more premium loading feel.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    },
    {
      id: "glass-skeleton",
      title: "Glass Variant",
      text: "Use the glass variant for soft, subtle placeholders in dark and mixed surfaces.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    },
    {
      id: "avatar-skeleton",
      title: "Avatar Skeleton",
      text: "Use circle + text lines to represent profile loading states.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    },
    {
      id: "text-skeleton",
      title: "Text Skeleton",
      text: "Create varying text line widths to mimic natural paragraph rhythm.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    },
    {
      id: "card-skeleton",
      title: "Card Skeleton",
      text: "Layer avatar, title, metadata, and content placeholders in card form.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    },
    {
      id: "form-skeleton",
      title: "Form Skeleton",
      text: "Mirror label/input/button spacing to prevent layout shift while forms load.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    },
    {
      id: "table-skeleton",
      title: "Table Skeleton",
      text: "Keep row height and column rhythm consistent with the final data table.",
      code: `import { Skeleton } from "@kamod-ui/core";

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
      )
    }
  ],
  apiRows: [
    { prop: "class", type: "string", defaultValue: "undefined" },
    { prop: "variant", type: '"pulse" | "shimmer" | "glass"', defaultValue: '"pulse"' },
    { prop: "data-slot", type: '"skeleton"', defaultValue: '"skeleton"' },
    { prop: "children", type: "not used", defaultValue: "n/a" }
  ],
  accessibilityText:
    "Skeletons are visual-only loading placeholders. Add a nearby live status like 'Loading content...' for assistive technologies and replace placeholders promptly when data arrives."
});
