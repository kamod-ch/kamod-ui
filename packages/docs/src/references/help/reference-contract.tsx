import { BracesIcon, TerminalIcon } from "@kamod-ch/icons/lucide";
import { lazy, Suspense } from "preact/compat";
import { useErrorBoundary } from "preact/hooks";
import type { CodeReferenceHelp } from "../types";
import { referenceKinds } from "./reference-kinds";
import { ReferenceSentence } from "./reference-sentence";

const HighlightedDeclaration = lazy(() => import("./reference-declaration"));

/** Keep literal code readable while the shared optional grammar loads. No reader observers. */
function DeclarationCode({ text, command = false }: { text: string; command?: boolean }) {
  const [error] = useErrorBoundary();
  const fallback = (
    <code class="code-reference-help-syntax" dir="ltr">
      {text}
    </code>
  );
  // Highlighting is optional: a failed grammar chunk must not escape into the page boundary.
  if (error) return fallback;
  return (
    <Suspense fallback={fallback}>
      <HighlightedDeclaration text={text} command={command} />
    </Suspense>
  );
}

export function ReferenceContract({ reference }: { reference: CodeReferenceHelp }) {
  const fields = reference.fields?.slice(0, 3);
  if (!fields?.length && !reference.signature) return null;
  const signature = reference.kind === "type" && fields?.length ? undefined : reference.signature;
  const command = reference.kind === "command";
  const contractName = signature && /^[A-Za-z_$][\w$]*$/.test(signature);
  const Icon = command ? TerminalIcon : BracesIcon;
  return (
    <section
      class="code-reference-help-panel code-reference-help-contract"
      aria-label={referenceKinds[reference.kind].contract}
    >
      <div class="code-reference-help-section-label">
        <strong>
          <Icon size={13} aria-hidden="true" />
          {referenceKinds[reference.kind].contract}
        </strong>
        <span>
          {fields?.length
            ? reference.fields!.length > 3
              ? "Selected fields"
              : `${fields.length} ${fields.length === 1 ? "field" : "fields"}`
            : command
              ? "Shell"
              : "TypeScript"}
        </span>
      </div>
      {contractName ? (
        <p class="code-reference-help-contract-name">
          <code>{signature}</code>
        </p>
      ) : (
        signature && (
          <pre class="code-reference-help-signature">
            <DeclarationCode text={signature} command={command} />
          </pre>
        )
      )}
      {!!fields?.length && (
        <dl class="code-reference-help-fields">
          {fields.map((field) => (
            <div key={field.name}>
              <dt>
                <code>{field.name}</code>
                <span data-required={field.required ? "true" : undefined}>
                  {field.required ? "Required" : "Optional"}
                </span>
              </dt>
              <dd>
                <DeclarationCode text={field.type} />
                {field.description && (
                  <p>
                    <ReferenceSentence text={field.description} />
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
