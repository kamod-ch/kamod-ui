import { Video } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const videoDocPage = createGenericDocPage({
  slug: "video",
  title: "Video",
  usageLabel: "Video displays embedded media with browser-native controls.",
  installationText: "Import Video from `@/components/kamod-ui/video`.",
  usageText: "Use controls for playback affordance and provide fallback text where needed.",
  exampleSections: [
    {
      id: "video-with-source",
      title: "Video with Source",
      text: "**Keep Playback under Understandable Controls.** Supply a video source and keep native controls available when the reader should choose how to play the media. Reserve an appropriate frame and provide the surrounding title or description needed to understand what the video contains.\n\nTest the media when loading fails and avoid depending on the video alone for essential instructions; nearby text should explain what viewers can expect to learn.",
      code: `import { Video } from "@/components/kamod-ui/video";

export const Example = () => (
  <Video class="max-w-xl">
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  </Video>
);`,
      renderPreview: () => (
        <Video class="max-w-xl">
          <source
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            type="video/mp4"
          />
        </Video>
      ),
    },
    {
      id: "muted-preview",
      title: "Muted Preview",
      text: "**Use Automatic Playback Only as a Supplementary Preview.** Use a muted autoplay preview for a visual gallery only when motion is supplementary to the item itself. Keep a useful static presentation available and avoid relying on the preview to communicate information that requires sound.\n\nConsider motion preferences, offer an appropriate way to pause persistent movement and avoid downloading many large previews before users need them.",
      code: `import { Video } from "@/components/kamod-ui/video";

export const Example = () => (
  <Video class="max-w-sm" muted loop autoPlay>
    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
  </Video>
);`,
      renderPreview: () => (
        <Video class="max-w-sm" muted loop autoPlay>
          <source
            src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            type="video/mp4"
          />
        </Video>
      ),
    },
  ],
  apiRows: [
    { prop: "controls", type: "boolean", defaultValue: "true" },
    { prop: "muted / autoPlay / loop", type: "boolean", defaultValue: "false" },
    { prop: "children", type: "source tracks and fallback", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Provide captions/subtitles when possible and avoid autoplay with sound to reduce accessibility friction.",
});
