import { PuzzleIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../../base-path";
import { CodeBlock } from "../../components/CodeBlock";
import { DocsCallout } from "../../components/DocsCallout";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";
import {
  CodeControlSlotsPlayground,
  CodePartsPlayground,
  CodePreferencesPlayground,
} from "./code-playgrounds";

export const controlledCodeSnippet = String.raw`import { Code } from "@kamod-ch/ui/code";
import { useState } from "preact/hooks";

const source = 'import { Button } from "@kamod-ch/ui/button";\n\nexport const Save = () => <Button>Save</Button>;';

export function SharedReader() {
  const [wrapped, setWrapped] = useState(true);
  const [importsCollapsed, setImportsCollapsed] = useState(false);
  return (
    <Code
      code={source}
      filePath="src/Save.tsx"
      wrapped={wrapped}
      onWrappedChange={setWrapped}
      importsCollapsed={importsCollapsed}
      onImportsCollapsedChange={setImportsCollapsed}
    />
  );
}`;

export const customControlsSnippet = `import { Button } from "@kamod-ch/ui/button";
import { Code } from "@kamod-ch/ui/code";

export function CustomReader({ source }: { source: string }) {
  return (
    <Code
      code={source}
      language="tsx"
      renderWrapControl={({ codeId, wrapped, onWrappedChange }) => (
        <Button
          type="button"
          variant="outline"
          aria-controls={codeId}
          aria-pressed={wrapped}
          onClick={() => onWrappedChange(!wrapped)}
        >
          Wrap {wrapped ? "on" : "off"}
        </Button>
      )}
      renderCopyAction={({ defaultControl }) => (
        <span class="inline-flex" title="Copy the complete source, including folded imports">
          {defaultControl}
        </span>
      )}
    />
  );
}`;

export function CodeModularityGuide() {
  return (
    <>
      <Topic id="code-visible-parts" title="Start complete, then remove the distractions">
        <p>
          <strong>Every example starts with useful defaults.</strong> Hide a part only when the
          surrounding interface already covers its job. A compact report might need only Copy; an
          embedded source excerpt might need no header at all. Try the switches below to see exactly
          which pieces belong together.
        </p>
        <CodePartsPlayground />
        <div class="docs-api-table-wrap">
          <table class="docs-api-table">
            <thead>
              <tr>
                <th>What you want</th>
                <th>Option</th>
                <th>What stays</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>A source-only headerless panel</td>
                <td>
                  <code>{"showToolbar={false}"}</code>
                </td>
                <td>
                  Eligible reading controls stay above the source. Copy is part of the hidden
                  header.
                </td>
              </tr>
              <tr>
                <td>No clipboard action</td>
                <td>
                  <code>{"showCopy={false}"}</code>
                </td>
                <td>The header, source selection and reading controls.</td>
              </tr>
              <tr>
                <td>Always-visible imports</td>
                <td>
                  <code>{"showImportControl={false}"}</code>
                </td>
                <td>The complete source, including its declarations.</td>
              </tr>
              <tr>
                <td>A fixed wrapping choice</td>
                <td>
                  <code>{"showWrapControl={false}"}</code>
                </td>
                <td>
                  <code>defaultWrapped</code> or controlled <code>wrapped</code> still determines
                  the layout.
                </td>
              </tr>
              <tr>
                <td>Source without syntax colors</td>
                <td>
                  <code>{"highlight={false}"}</code>
                </td>
                <td>Language metadata, reading controls, selection and exact copying.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  language="tsx"\n  showToolbar={false}\n  showImportControl={false}\n  showWrapControl={false}\n  defaultWrapped\n/>'
          }
        />
        <p>
          This expression assumes <code>source</code> is your string. Hiding a control never grants
          new capabilities: commands still omit the wrapping switch and unsupported import syntax
          remains visible. Read <a href="#reading-behavior">Reading Preferences</a> for the
          eligibility rules.
        </p>
      </Topic>
      <Topic id="code-controlled-preferences" title="Let the reader choose—or share the choice">
        <p>
          For one independent example, use <code>defaultWrapped</code> and{" "}
          <code>defaultImportsCollapsed</code>. Code owns later changes. For a file browser, a
          preferences toolbar or several synchronized panels, provide <code>wrapped</code> and{" "}
          <code>importsCollapsed</code> with their change callbacks instead.
          <strong> Your state becomes the single source of truth.</strong>
        </p>
        <CodePreferencesPlayground />
        <CodeBlock code={controlledCodeSnippet} filePath="src/SharedReader.tsx" />
        <p>
          Click either the external checkbox or Code’s control: both update the same state. A
          controlled value changes only when your application supplies its next value; a callback is
          a request, not an automatic mutation. Supplying a value without a callback intentionally
          fixes that preference. Choose controlled or uncontrolled ownership when mounting and keep
          that choice stable.
        </p>
        <p>
          Uncontrolled wrapping carries across source changes; uncontrolled import folding resets to
          its default for a different <code>code</code> string. Controlled preferences remain yours
          across files. Store preferences above the viewer if you want them to survive unmounting;
          Code does not read or write browser storage.
        </p>
      </Topic>
      <Topic id="code-control-slots" title="Replace one control without replacing its behavior">
        <p>
          Use <code>renderWrapControl</code>, <code>renderImportControl</code> or{" "}
          <code>renderCopyAction</code> when a switch, menu or custom button fits your product
          better. Each callback receives the current state, the source ID, its action and{" "}
          <code>defaultControl</code>. Return your own element, wrap the default element, or return{" "}
          <code>null</code> to omit the visible control.
        </p>
        <CodeControlSlotsPlayground />
        <CodeBlock code={customControlsSnippet} filePath="src/CustomReader.tsx" />
        <DocsCallout title="Keep the behavior; own the presentation" icon={<PuzzleIcon />}>
          <p>
            The copy action still handles the complete source, clipboard failures and its live
            status announcement. Your button supplies its label, disabled state and keyboard
            interaction. Use <code>aria-controls</code> for the source, <code>aria-pressed</code>{" "}
            for a toggle and <code>aria-expanded</code> for import disclosure. A native{" "}
            <a href={withBasePath("/docs/button/installation")}>Button</a> keeps activation
            familiar.
          </p>
        </DocsCallout>
        <p>
          Import and wrap callbacks run only when that control is eligible. Returning{" "}
          <code>null</code> from <code>renderImportControl</code> can hide its button while
          controlled folding still works; <code>{"showImportControl={false}"}</code> disables
          folding altogether. Copy renderers receive <code>idle</code>, <code>copying</code>,{" "}
          <code>copied</code> or <code>error</code>. Call the supplied <code>copy()</code> once; do
          not start a second clipboard write or add a second live region.
        </p>
      </Topic>
      <Topic id="code-content-slots" title="Build the frame around the source">
        <p>
          Use <code>toolbarContent</code> for a short purpose label and <code>renderFilePath</code>{" "}
          to replace the file presentation while retaining inference metadata. For a fully arranged
          header, <code>renderToolbar</code> receives the existing action group. Render it once
          wherever it belongs. <a href="#code-toolbar-composition">Header Composition</a> shows a
          complete example.
        </p>
        <CodeBlock
          language="tsx"
          code={
            '<Code\n  code={source}\n  filePath="src/Welcome.tsx"\n  beforeCode={<p class="px-4 py-3 text-sm">Place this file beside your route.</p>}\n  afterCode={<p class="px-4 py-3 text-sm">Adapt the action to your workspace.</p>}\n/>'
          }
        />
        <p>
          <code>beforeCode</code> sits after the reading controls; <code>afterCode</code> sits after
          the source or prepared document. Both accept Preact content and are excluded from Copy.
          Use them for a concise note or related link. To replace the entire source presentation
          with a document, use{" "}
          <a href="#document">
            <code>renderedContent</code>
          </a>
          . That mode omits code reading controls and highlighting while retaining the original
          string for copying.
        </p>
      </Topic>
    </>
  );
}
