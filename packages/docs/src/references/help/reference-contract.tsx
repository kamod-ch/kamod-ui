import { BracesIcon, CodeIcon, TerminalIcon } from "@kamod-ch/icons/lucide";
import { lazy, Suspense } from "preact/compat";
import { useErrorBoundary } from "preact/hooks";
import type { CodeReferenceHelp } from "../types";
import { referenceKinds } from "./reference-kinds";
import { ReferenceSection } from "./reference-section";
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

/** A bare type name belongs in metadata or reading links, not an otherwise empty chapter. */
export function hasReferenceContract({ fields, signature }: CodeReferenceHelp) {
  return !!(fields?.length || (signature && !/^[A-Za-z_$][\w$]*$/.test(signature)));
}

export function ReferenceContract({ reference }: { reference: CodeReferenceHelp }) {
  const fields = reference.fields?.slice(0, 3);
  if (!hasReferenceContract(reference)) return null;
  const signature = reference.kind === "type" && fields?.length ? undefined : reference.signature;
  const command = reference.kind === "command";
  const contractName = signature && /^[A-Za-z_$][\w$]*$/.test(signature);
  const Icon = command ? TerminalIcon : BracesIcon;
  return (
    <ReferenceSection
      className="code-reference-help-contract"
      title={referenceKinds[reference.kind].contract}
      detail={command ? "Shell command" : "Declared contract"}
      Icon={Icon}
      source={reference.docs ?? reference.source}
      name={reference.name}
      count={
        fields?.length
          ? reference.fields!.length > 3
            ? "Selected fields"
            : `${fields.length} ${fields.length === 1 ? "field" : "fields"}`
          : command
            ? "Shell"
            : "TypeScript"
      }
      note={
        fields?.length ? (
          <>
            Directly declared fields only
            {reference.docs && (
              <>
                {" "}
                ·{" "}
                <a href={reference.docs.href} target="_top">
                  Complete contract
                </a>
              </>
            )}
            .
          </>
        ) : undefined
      }
    >
      {contractName ? (
        <p class="code-reference-help-contract-name">
          <code>{signature}</code>
        </p>
      ) : (
        signature && (
          <div class="code-reference-help-declaration">
            <div class="code-reference-help-code-toolbar">
              <span>
                <CodeIcon size={10} aria-hidden="true" />
                {command ? "Invocation" : "Declaration"}
              </span>
              <span>{command ? "Shell" : "TypeScript"}</span>
            </div>
            <pre class="code-reference-help-signature">
              <DeclarationCode text={signature} command={command} />
            </pre>
          </div>
        )
      )}
      {!!fields?.length && (
        <div class="code-reference-help-props">
          <div class="code-reference-help-field-columns" aria-hidden="true">
            <span>Prop / type</span>
            <span>Usage</span>
          </div>
          <dl class="code-reference-help-fields">
            {fields.map((field) => (
              <div key={field.name}>
                <dt>
                  <code>{field.name}</code>
                  <span data-required={field.required ? "true" : undefined}>
                    {field.required ? "Required" : "Optional"}
                  </span>
                  <DeclarationCode text={field.type} />
                </dt>
                <dd>
                  <ReferenceSentence
                    text={
                      field.description ||
                      (field.required ? "Required in this declaration." : "May be omitted.")
                    }
                  />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ReferenceSection>
  );
}
