import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import type { GrowthLocation } from "../../analytics/growth-types";
import { CODE_COPY_SUCCESS_EVENT, TEMPLATE_DELIVERED_EVENT } from "./notify";
import { StarInvitationToast } from "./StarInvitationToast";
import { recordShown, shouldShowInvitation } from "./storage";

/** Client-only star nudge after verified copy or template delivery; rate-limited in localStorage. */
export function StarInvitationHost() {
  const [open, setOpen] = useState(false);
  const [inviteLocation, setInviteLocation] = useState<GrowthLocation | undefined>();
  const sessionShown = useRef(false);

  const tryOpen = useCallback((location: GrowthLocation) => {
    if (sessionShown.current) return;
    if (!shouldShowInvitation()) return;
    const stored = recordShown();
    sessionShown.current = !stored;
    setInviteLocation(location);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onCopySuccess = () => tryOpen("post_copy");
    const onTemplate = () => tryOpen("post_download");
    window.addEventListener(CODE_COPY_SUCCESS_EVENT, onCopySuccess);
    window.addEventListener(TEMPLATE_DELIVERED_EVENT, onTemplate);

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type !== "attributes" || record.attributeName !== "data-copy-state") continue;
        const target = record.target;
        if (!(target instanceof Element)) continue;
        if (target.getAttribute("data-copy-state") === "copied") onCopySuccess();
      }
    });
    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ["data-copy-state"],
    });

    return () => {
      window.removeEventListener(CODE_COPY_SUCCESS_EVENT, onCopySuccess);
      window.removeEventListener(TEMPLATE_DELIVERED_EVENT, onTemplate);
      observer.disconnect();
    };
  }, [tryOpen]);

  if (!open) return null;

  return <StarInvitationToast inviteLocation={inviteLocation} onDismiss={() => setOpen(false)} />;
}
