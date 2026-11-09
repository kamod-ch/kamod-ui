import { DownloadIcon, LoaderCircleIcon } from "@kamod-ch/icons/lucide";
import { ChecksIcon } from "@kamod-ch/icons/tabler/outline";
import { Button } from "@kamod-ch/ui";
import { useId, useRef, useState } from "preact/hooks";
import { trackGrowthEvent } from "../analytics/growth-track";
import { withBasePath } from "../base-path";
import { notifyTemplateDelivered } from "../layout/star-invitation/notify";

type Phase = "idle" | "loading" | "complete" | "error";

/** Deliver the starter ZIP via fetch + blob; invite only after a successful browser handoff. */
export function StarterTemplateDownloadButton() {
  const statusId = useId();
  const [phase, setPhase] = useState<Phase>("idle");
  const busy = useRef(false);
  const href = withBasePath("/starters/saas-team-demo.zip");

  const download = async () => {
    if (busy.current) return;
    busy.current = true;
    trackGrowthEvent("template_download_click", {
      location: "landing",
      templateId: "saas-team-demo",
    });
    setPhase("loading");
    const link = document.createElement("a");
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error("fetch failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = "saas-team-demo.zip";
      link.hidden = true;
      document.body.append(link);
      link.click();
      setPhase("complete");
      trackGrowthEvent("template_download_prepared", {
        location: "landing",
        templateId: "saas-team-demo",
      });
      notifyTemplateDelivered();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setPhase("idle");
        busy.current = false;
      }, 1800);
    } catch {
      setPhase("error");
      busy.current = false;
    } finally {
      link.remove();
    }
  };

  const failed = phase === "error";
  const loading = phase === "loading";
  const complete = phase === "complete";

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        class="home-secondary-cta"
        data-download-state={phase}
        aria-busy={loading || undefined}
        aria-describedby={failed ? statusId : undefined}
        onClick={() => void download()}
      >
        {loading ? (
          <LoaderCircleIcon size={18} aria-hidden="true" class="docs-file-download-spinner" />
        ) : complete ? (
          <ChecksIcon size={18} aria-hidden="true" />
        ) : (
          <DownloadIcon size={18} aria-hidden="true" />
        )}
        Use this template
      </Button>
      <span id={statusId} class="sr-only" role="status" aria-live="polite">
        {loading
          ? "Preparing template download."
          : complete
            ? "Template sent to your browser downloads."
            : failed
              ? "Could not download the template."
              : ""}
      </span>
    </>
  );
}
