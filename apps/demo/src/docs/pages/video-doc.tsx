import { Video } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const videoDocPage = createGenericDocPage({
  slug: "video",
  title: "Video",
  usageLabel: "Video displays embedded media with browser-native controls.",
  installationText: "Import Video from @kamod-ui/core.",
  usageText: "Use controls for playback affordance and provide fallback text where needed.",
  exampleSections: [
    {
      id: "video-with-source",
      title: "Video With Source",
      text: "Provide a source file and keep controls enabled.",
      code: `import { Video } from "@kamod-ui/core";

export const Example = () => (
  <Video class="max-w-xl">
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  </Video>
);`,
      renderPreview: () => (
        <Video class="max-w-xl">
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </Video>
      )
    },
    {
      id: "muted-preview",
      title: "Muted Preview",
      text: "Use muted autoplay previews in media galleries.",
      code: `import { Video } from "@kamod-ui/core";

export const Example = () => (
  <Video class="max-w-sm" muted loop autoPlay>
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  </Video>
);`,
      renderPreview: () => (
        <Video class="max-w-sm" muted loop autoPlay>
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </Video>
      )
    }
  ],
  apiRows: [
    { prop: "controls", type: "boolean", defaultValue: "true" },
    { prop: "muted / autoPlay / loop", type: "boolean", defaultValue: "false" },
    { prop: "children", type: "source tracks and fallback", defaultValue: "undefined" }
  ],
  accessibilityText: "Provide captions/subtitles when possible and avoid autoplay with sound to reduce accessibility friction."
});
