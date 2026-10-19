import { ArrowUpRightIcon, FilesIcon } from "@kamod-ch/icons/lucide";
import { ShowcaseCodeLink } from "./ShowcaseCodeLink";

function SourceCount({ count }: { count: number }) {
  return (
    <span class="blocks-prompt-source-count">
      <FilesIcon size={14} strokeWidth={1.75} aria-hidden="true" />
      <span>
        <strong>{count}</strong> source {count === 1 ? "file" : "files"}
        <span class="blocks-prompt-source-detail"> included</span>
      </span>
    </span>
  );
}

/** One source link at every size, with a fuller label when the showcase has room. */
export function PromptSourceSummary({ blockId, count }: { blockId: string; count: number }) {
  return (
    <span class="blocks-prompt-sources">
      <ShowcaseCodeLink blockId={blockId}>
        <SourceCount count={count} />
        <ArrowUpRightIcon size={13} strokeWidth={1.75} aria-hidden="true" />
      </ShowcaseCodeLink>
    </span>
  );
}
