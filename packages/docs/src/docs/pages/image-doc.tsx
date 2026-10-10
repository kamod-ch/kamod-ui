import { Image } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const imageDocPage = createGenericDocPage({
  slug: "image",
  title: "Image",
  usageLabel: "Image renders responsive media with consistent styling.",
  installationText: "Import Image from `@/components/kamod-ui/image`.",
  usageText: "Use alt text for accessibility and className for shape/size control.",
  exampleSections: [
    {
      id: "basic-image",
      title: "Basic Image",
      text: "**Reserve Space and Describe Meaningful Media.** Place an image in a simple rounded frame to establish its role in the layout. Supply an appropriate text alternative and reserve sensible dimensions so the visual does not disrupt nearby content as it loads.\n\nProvide useful `alt` text for informative images and an empty alternative for purely decorative ones; rounded corners change presentation, not the image's accessible meaning.",
      code: `import { Image } from "@/components/kamod-ui/image";

export const Example = () => (
  <Image
    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
    alt="Mountain landscape"
    class="h-40 w-full max-w-lg object-cover"
  />
);`,
      renderPreview: () => (
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
          alt="Mountain landscape"
          class="h-40 w-full max-w-lg object-cover"
        />
      ),
    },
    {
      id: "image-thumbnail",
      title: "Image Thumbnail",
      text: "**Keep Compact Media Recognizable.** Use a smaller image frame when media supports a list row or card rather than leading the page. Keep the crop and dimensions consistent across neighboring items so the text remains easy to scan alongside the previews.\n\nCheck cropping with real images and use [Aspect Ratio](/docs/aspect-ratio/installation) when different source dimensions need a consistent frame; preserve a clear destination if the preview is clickable.",
      code: `import { Image } from "@/components/kamod-ui/image";

export const Example = () => (
  <Image
    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400"
    alt="Forest thumbnail"
    class="h-20 w-28 object-cover"
  />
);`,
      renderPreview: () => (
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400"
          alt="Forest thumbnail"
          class="h-20 w-28 object-cover"
        />
      ),
    },
  ],
  apiRows: [
    { prop: "src", type: "string", defaultValue: "required" },
    { prop: "alt", type: "string", defaultValue: '""' },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Provide descriptive alt text for informative images and empty alt text for purely decorative imagery.",
});
