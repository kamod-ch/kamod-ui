import type { ComponentType } from "preact";
import { useEffect, useState } from "preact/hooks";
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
  if (!content) return <CodeReferenceHelpLoading name={label} module={module ?? label} />;
  return <content.Component reference={content.reference} />;
}
