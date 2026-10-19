import { withBasePath } from "../../base-path";
import { PathDisplay } from "../../docs/components/PathDisplay";
import type { ApplicationShellBlock } from "../application-shell-config";
import { type ShellVariantId } from "./application-shell-profiles";
import { BlockDocSection } from "./BlockDocumentation";

/** Reference guidance shared by the data-driven application shell variants. */
export function ShellVariantReference({ block }: { block: ApplicationShellBlock }) {
  const id = block.id as ShellVariantId;
  const path = `src/components/application-shell/${id}`;
  return (
    <BlockDocSection
      id="application-shell-reference"
      introduction={
        <p>
          <strong>An Original Kamod Composition.</strong> This variant builds on the repository’s
          existing sidebar and account-menu helpers. It is not presented as a numbered port of an
          external design collection.
        </p>
      }
    >
      <p>
        The reusable entrypoint is <PathDisplay path={`${path}/index.ts`} /> after copying. Compare
        the <a href={block.sourceUrl}>Repository Source</a> with your installed UI version when an
        API differs. Keep a note of local layout changes and preserve the repository license when
        sharing a copy.
      </p>
      <p>
        Start from the <a href="#application-shell-usage">Working Integration</a>, adjust one
        boundary at a time, and verify the result inside your actual application. Return to the{" "}
        <a href={withBasePath("/blocks/getting-started")}>Block Setup Guide</a> for source
        ownership, routing and production checks.
      </p>
    </BlockDocSection>
  );
}
