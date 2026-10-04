import type { ComponentChildren } from "preact";
import { withBasePath } from "../base-path";
import { ShowcaseIntro } from "../docs/components/ShowcaseIntro";
import type { ShowcaseBlock } from "./BlockShowcase";
import { ShowcaseCodeLink } from "./ShowcaseCodeLink";

/** One compact introduction for both source and prompt views; preview content stays independent. */
export function BlockShowcaseIntro({
  block,
  view,
  metadata,
}: {
  block: ShowcaseBlock;
  view: "code" | "prompt";
  metadata?: ComponentChildren;
}) {
  const isPrompt = view === "prompt";
  const setupId = block.category === "application-shell" ? "application-shell" : block.id;
  return (
    <ShowcaseIntro
      title={isPrompt ? "From preview to your own project" : "Inside the block’s composition"}
      note={isPrompt ? "Build with your assistant" : "Source & structure"}
      setupHref={`#${setupId}-installation`}
      guideLabel="Block guides"
      metadata={metadata}
    >
      {isPrompt ? (
        <>
          Start with{" "}
          <a href={`#${setupId}-installation`}>
            <strong>Setup and Integration</strong>
          </a>
          , or adapt this block with a Ready-to-Copy Brief. Both include <code>Preact</code> Source,
          Destination Paths and <code>TypeScript</code> Integration Checks. Review the{" "}
          <ShowcaseCodeLink blockId={block.id}>Included Source Files</ShowcaseCodeLink>, then ask
          your Assistant to inspect <code>package.json</code> and{" "}
          <strong>reuse your Existing Components and Conventions</strong> before connecting real
          Data and Callbacks.
        </>
      ) : (
        <>
          Explore the <strong>composition and supporting files</strong>, then follow the{" "}
          <a href={`#${setupId}-installation`}>setup guide</a> to bring this block’s{" "}
          <code>Preact</code> components and <code>TypeScript</code> definitions into your app.
          Follow relative imports to understand how the files fit together, use{" "}
          <strong>Wrap and Copy</strong> to inspect and reuse the source, and keep styling
          consistent with the <code>Tailwind</code> setup in the{" "}
          <a href={withBasePath("/docs/theming/installation")}>theming guide</a>.
        </>
      )}
    </ShowcaseIntro>
  );
}
