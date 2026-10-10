import { withBasePath } from "../../../base-path";
import { ShowcaseIntro } from "../ShowcaseIntro";

/** Component and Formisch examples share the block layout without claiming a complete source bundle. */
export function ComponentExampleIntro({ view }: { view: "code" | "prompt" }) {
  const isPrompt = view === "prompt";
  return (
    <ShowcaseIntro
      title={isPrompt ? "Integration prompt" : "Example source"}
      note={isPrompt ? "Build with your assistant" : "Source & behavior"}
      setupHref="#installation"
    >
      {isPrompt ? (
        <>
          Start with{" "}
          <a href="#installation">
            <strong>Setup and Integration</strong>
          </a>
          , or adapt this example with a Ready-to-Copy Brief. Both include the displayed{" "}
          <code>Preact</code> Snippet, a Suggested File Path and <code>TypeScript</code> Integration
          Checks. Ask your Assistant to inspect <code>package.json</code> and{" "}
          <strong>Reuse Your Existing Components and Conventions</strong>. Examples may be
          abbreviated; follow the prompt’s Source References before connecting real Data and
          Callbacks.
        </>
      ) : (
        <>
          Explore the <strong>Imports, State and Behavior</strong>, then follow the{" "}
          <a href="#installation">Setup Guide</a> to use this <code>Preact</code> example in your
          app. Replace demo data and handlers with your own. Keep <code>Tailwind</code> styles
          consistent with the <a href={withBasePath("/docs/theming/installation")}>Theming Guide</a>
          .
        </>
      )}
    </ShowcaseIntro>
  );
}
