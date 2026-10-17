import { CodeBlock } from "../../components/CodeBlock";
import { InlineCodeLink } from "../../components/InlineCodeLink";
import { CodeGuideTopic as Topic } from "./CodeGuideTopic";

const example = `import { Button as SaveButton } from "@kamod-ch/ui/button";
import { Card, CardContent } from "@kamod-ch/ui/card";

export function SavePanel() {
  return (
    <Card>
      <CardContent>
        <SaveButton>Save your changes</SaveButton>
      </CardContent>
    </Card>
  );
}`;

/** Explain the site's source navigation alongside Code's portable, opt-in resolver contract. */
export function CodeReferenceGuide() {
  return (
    <>
      <Topic id="code-reference-navigation" title="Follow an Import Without Losing the Source">
        <p>
          <strong>Read the example, then inspect the part you need.</strong> Imported names and
          module strings in this documentation are links. The same imported name stays linked when
          it appears later in JSX, a function call or a type annotation. An alias such as
          <code>SaveButton</code> still leads to the original{" "}
          <InlineCodeLink href="/docs/button/installation#api-reference">Button</InlineCodeLink>{" "}
          reference. Namespace members such as <code>UI.Card</code> resolve the member rather than
          guessing from its visible spelling alone.
        </p>
        <CodeBlock code={example} filePath="src/SavePanel.tsx" />
        <p>
          Faint primary-colored dashes identify each destination without adding icons to the source.
          Hover or keyboard focus brings only the line forward; syntax colors stay intact. Pause
          over a link to inspect its <strong>Source, Props and Related Types</strong> in a compact
          reference card. Keyboard focus opens the card immediately: Tab reaches its resources,
          Escape dismisses it, and Enter on the original code link follows its destination.{" "}
          <strong>Syntax colors, line widths and copied source stay unchanged.</strong> Folding
          imports hides their links along with those lines; links in the retained body still work.
        </p>
        <CodeBlock
          code={`import { DirectionProvider, type DirectionProviderProps } from "@kamod-ch/ui/direction";

export function LocaleBoundary({ children }: DirectionProviderProps) {
  return <DirectionProvider direction="rtl">{children}</DirectionProvider>;
}`}
          filePath="src/LocaleBoundary.tsx"
        />
        <p>
          Try <code>DirectionProvider</code>, its props type and the import string above. Components
          show their documented props and related definitions; type references show their shape;
          module references collect the available exports and source directory. Each card includes
          only verified destinations. A quick pass over the code does not load the detailed catalog.
        </p>
      </Topic>
      <Topic id="code-reference-destinations" title="Local Reference First, Verified Source Next">
        <p>
          Component names lead to their <strong>on-site API and source reference</strong> when one
          exists. Package strings lead to the matching local guide. Otherwise, links use
          implementation files in this checkout or GitHub repositories recorded by installed
          packages. Comments, literal strings, JSX prose and shadowing local declarations stay
          source text; unknown destinations remain plain rather than acquiring a speculative link.
        </p>
        <p>
          This is navigation for recognized <code>import</code> syntax in JavaScript, JSX,
          TypeScript and TSX, not a compiler or an execution environment. Plain text, other
          languages and rendered documents retain their own presentation. Code is never evaluated,
          and <a href="#code-copy-fidelity">Copy always uses the original string</a>.
        </p>
      </Topic>
      <Topic id="code-reference-resolver" title="Use the Same Navigation in Your Application">
        <p>
          The published component does not assume this documentation's routes. Give
          <InlineCodeLink href="#api-reference">CodeReferenceProvider</InlineCodeLink> one stable
          resolver to share your own verified destinations, or supply <code>resolveReference</code>
          to a single Code panel. The resolver receives the module, original export, local name and
          optional file path. Return a local or HTTP(S) URL for a known reference, and
          <code>undefined</code> otherwise; <code>resolveReference={null}</code> disables navigation
          for one panel. Styling and syntax highlighting remain independent.
        </p>
        <CodeBlock
          language="tsx"
          filePath="src/SourceReader.tsx"
          code={`import { Code, CodeReferenceProvider, type CodeReferenceResolver } from "@kamod-ch/ui/code";

const resolveReference: CodeReferenceResolver = ({ module, imported }) => {
  if (module !== "@kamod-ch/ui/button") return undefined;
  return imported ? "/reference/button#source" : "/reference/button";
};

export function SourceReader({ source }: { source: string }) {
  return (
    <CodeReferenceProvider resolve={resolveReference}>
      <Code code={source} language="tsx" />
    </CodeReferenceProvider>
  );
}`}
        />
        <p>
          Keep the resolver outside the component, or memoize it when its verified catalog changes.
          Source analysis is reused across import-folding and wrapping changes, and navigation adds
          no request, observer or timer of its own. This documentation adds one shared tooltip
          controller: detailed source facts load only for the reference you open, with a small
          reading placeholder while its first request completes. Read
          <a href="#performance"> Performance and Delivery</a> when a page contains many examples.
        </p>
      </Topic>
    </>
  );
}
