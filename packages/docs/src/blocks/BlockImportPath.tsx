import { useTimeout } from "@kamod-ch/hooks";
import { CheckIcon, WaypointsIcon } from "@kamod-ch/icons/lucide";
import { CopyIcon } from "@kamod-ch/icons/tabler/outline";
import { Button } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { PathDisplay } from "../docs/components/PathDisplay";

/** Keeps clipboard feedback local so copying a path never rerenders the source browser. */
export function BlockImportPath({
  path,
  label,
  copyable,
}: {
  path: string;
  label: string;
  copyable: boolean;
}) {
  const [copied, setCopied] = useState(false);
  useTimeout(() => setCopied(false), copied ? 1600 : undefined);
  const CopyStateIcon = copied ? CheckIcon : CopyIcon;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div class="blocks-showcase-import">
      <span class="showcase-metadata-label">
        <WaypointsIcon size={16} strokeWidth={1.75} aria-hidden="true" />
        {label}
      </span>
      <span class="blocks-showcase-import-value">
        <PathDisplay path={path} />
        {copyable && (
          <Button
            class="docs-icon-button"
            size="icon-sm"
            variant="ghost"
            aria-label={copied ? "Block path copied" : "Copy block path"}
            onClick={copy}
          >
            <CopyStateIcon
              size={14}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            />
          </Button>
        )}
      </span>
    </div>
  );
}
