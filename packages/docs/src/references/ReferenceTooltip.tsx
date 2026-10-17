import type { ComponentType } from "preact";
import { useEffect, useState } from "preact/hooks";
import { rootPackageName, savedPackageRoots } from "./catalog/packages";
import {
  CodeReferenceHelpLoading,
  CodeReferenceHelpUnavailable,
} from "./help/code-reference-help-loading";
import type { CodeReferenceHelp, CodeReferenceHelpRequest } from "./types";

type Content = {
  reference: CodeReferenceHelp;
  Component: ComponentType<{ reference: CodeReferenceHelp }>;
};

/** Fetch the detailed catalog/UI only for an opened hint; stale results never reopen dismissed help. */
export function ReferenceTooltip({ request }: { request: CodeReferenceHelpRequest }) {
  // Remount the request boundary so a new term cannot briefly display the previous term's facts.
  return <ReferenceTooltipRequest key={JSON.stringify(request)} request={request} />;
}

function ReferenceTooltipRequest({ request }: { request: CodeReferenceHelpRequest }) {
  const [content, setContent] = useState<Content | null>(null);
  const [failed, setFailed] = useState(false);
  const { label, module, imported, local, filePath, referenceId, href } = request;
  const root = rootPackageName(module);
  const pendingName = !imported && savedPackageRoots.some((name) => name === root) ? root : label;
  useEffect(() => {
    let active = true;
    void Promise.all([
      import("./help/code-reference-help"),
      import("./help/loader").then(({ loadCodeReferenceHelp }) =>
        loadCodeReferenceHelp({ label, module, imported, local, filePath, referenceId, href }),
      ),
    ])
      .then(([ui, reference]) => {
        if (active) {
          setContent({ Component: ui.CodeReferenceHelpContent, reference });
        }
      })
      .catch(() => {
        if (active) {
          setFailed(true);
        }
      });
    return () => {
      active = false;
    };
  }, [label, module, imported, local, filePath, referenceId, href]);
  if (failed)
    return <CodeReferenceHelpUnavailable name={label} module={module ?? label} href={href} />;
  return (
    <div
      class="code-reference-help-transition"
      data-reference-phase={content ? "ready" : "loading"}
    >
      {/* Retain one quiet, inert layer for the CSS handoff; unmounting cancels all work. */}
      <div
        class="code-reference-help-pending"
        aria-hidden={content ? "true" : undefined}
        inert={content ? true : undefined}
      >
        <CodeReferenceHelpLoading name={pendingName} module={module ?? label} active={!content} />
      </div>
      {content && (
        <div class="code-reference-help-ready">
          <content.Component reference={content.reference} />
        </div>
      )}
    </div>
  );
}
