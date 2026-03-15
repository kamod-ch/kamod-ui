import { Image } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const imageDocPage = createGenericDocPage({
  slug: "image",
  title: "Image",
  usageLabel: "Image renders responsive media with consistent styling.",
  installationText: "Import Image from @kamod-ui/core.",
  usageText: "Use alt text for accessibility and className for shape/size control.",
  exampleSections: [
    {
      id: "basic-image",
      title: "Basic Image",
      text: "Display an image with rounded corners.",
      code: `import { Image } from "@kamod-ui/core";

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
      )
    },
    {
      id: "image-thumbnail",
      title: "Image Thumbnail",
      text: "Use compact image previews in lists or cards.",
      code: `import { Image } from "@kamod-ui/core";

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
      )
    }
  ],
  apiRows: [
    { prop: "src", type: "string", defaultValue: "required" },
    { prop: "alt", type: "string", defaultValue: '""' },
    { prop: "class", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText: "Provide descriptive alt text for informative images and empty alt text for purely decorative imagery."
});
