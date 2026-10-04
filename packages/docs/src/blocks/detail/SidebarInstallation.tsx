/** Installation actions and destination tree share the registry's generated ZIP manifest. */
import {
  ChevronDownIcon,
  FolderDownIcon,
  FolderIcon,
  FolderTreeIcon,
  InfoIcon,
  TerminalIcon,
} from "@kamod-ch/icons/lucide";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { withBasePath } from "../../base-path";
import { ShowcaseCodeLink } from "../ShowcaseCodeLink";
import type { VariantGuide } from "./VariantDocumentation";

/** Group exact destination paths while preserving file order within each folder. */
function IncludedFiles({ blockId, paths }: { blockId: string; paths: string[] }) {
  const groups = new Map<string, string[]>();
  for (const path of paths) {
    const separator = path.lastIndexOf("/");
    const folder = path.slice(0, separator + 1);
    const files = groups.get(folder) ?? [];
    files.push(path.slice(separator + 1));
    groups.set(folder, files);
  }
  const entries = [...groups];
  const isComponent = ([folder]: [string, string[]]) => folder.startsWith("components/");
  return (
    <div class="blocks-install-inventory">
      <div class="blocks-install-columns">
        <FileGroups
          blockId={blockId}
          groups={entries.filter((entry) => !isComponent(entry))}
          label="Block files, branding and data"
        />
        <FileGroups
          blockId={blockId}
          groups={entries.filter(isComponent)}
          label="Local components"
        />
      </div>
    </div>
  );
}

function FileGroups({
  blockId,
  groups,
  label,
}: {
  blockId: string;
  groups: [string, string[]][];
  label: string;
}) {
  if (!groups.length) return null;
  return (
    <ul class="blocks-install-folders" aria-label={label}>
      {groups.map(([folder, files]) => (
        <li key={folder} class="blocks-install-folder">
          <div class="blocks-install-folder-label">
            <FolderIcon aria-hidden="true" size={14} />
            <span>{folder || "At folder root"}</span>
          </div>
          <ul>
            {files.map((name) => (
              <li key={name}>
                <ShowcaseCodeLink blockId={blockId} file={`${folder}${name}`}>
                  <code>{name}</code>
                </ShowcaseCodeLink>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function DownloadInfo() {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          class="docs-icon-button blocks-install-info"
          aria-label="About this download"
          onClick={() => setOpen(true)}
        >
          <InfoIcon class="size-3" strokeWidth={2} aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="end"
        class="max-w-[calc(100vw-2rem)] whitespace-normal text-xs"
      >
        Source and license included
      </TooltipContent>
    </Tooltip>
  );
}

/** One native button toggles the whole row; the folder hint shares its hover/focus target. */
function IncludedFilesTrigger({ blockId }: { blockId: string }) {
  return (
    <Tooltip class="w-full" style={{ display: "flex" }}>
      <TooltipTrigger asChild aria-describedby={`${blockId}-extract-destination`}>
        <CollapsibleTrigger
          class="blocks-install-files-heading"
          aria-label="View included files"
          aria-controls={`${blockId}-included-files`}
        >
          <span class="blocks-install-files-trigger">
            <FolderTreeIcon aria-hidden="true" size={16} strokeWidth={2} />
            <span>View included files</span>
          </span>
          <span class="blocks-install-destination" id={`${blockId}-extract-destination`}>
            <span class="blocks-install-destination-dot" aria-hidden="true">
              ·
            </span>
            <span>Extract into</span>
            <span class="blocks-install-path">
              <code>{`src/components/blocks/${blockId}/`}</code>
            </span>
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            size={16}
            class="blocks-install-files-chevron transition-transform group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="end"
        class="max-w-[calc(100vw-2rem)] whitespace-normal text-xs"
      >
        Keep this folder together
      </TooltipContent>
    </Tooltip>
  );
}

export function SidebarInstallation({ guide }: { guide: VariantGuide }) {
  const { block, files, anchor } = guide;
  return (
    <>
      <p>
        Download this variant and extract its <code>{block.id}</code> folder into{" "}
        <code>src/components/blocks</code>. Install the dependencies below, then import the
        component. The folder includes its own helpers and demo data; no other sidebar variants are
        needed. Relative imports are already set up inside the folder, so you can move it as a unit
        and replace the sample navigation and content with your own. The archive already contains
        the outer <code>{block.id}/</code> folder: extract it once, rather than creating a second
        nested folder with the same name. The import examples assume <code>src/App.tsx</code>.
      </p>
      <Collapsible class="blocks-install-files group">
        <div class="blocks-install-actions">
          <div class="blocks-install-download">
            <Button class="docs-icon-button" asChild size="sm">
              <a
                download={`${block.id}.zip`}
                href={withBasePath(`/blocks/downloads/${block.id}.zip`)}
              >
                <FolderDownIcon size={16} strokeWidth={2.5} aria-hidden="true" />
                Download block
              </a>
            </Button>
            <div class="blocks-install-metadata">
              <span>{files.length} files · source ZIP</span>
              <span class="blocks-install-metadata-dot" aria-hidden="true">
                ·
              </span>
              <DownloadInfo />
            </div>
          </div>
          <Button
            variant="ghost"
            size="xs"
            class="docs-icon-button blocks-install-next"
            href={`#${anchor("dependencies")}`}
          >
            Install dependencies
            <TerminalIcon class="size-3" strokeWidth={2.75} aria-hidden="true" />
          </Button>
        </div>
        <IncludedFilesTrigger blockId={block.id} />
        <CollapsibleContent id={`${block.id}-included-files`} duration="0ms">
          <div class="blocks-install-files-content">
            <IncludedFiles blockId={block.id} paths={files.map((file) => file.label)} />
          </div>
        </CollapsibleContent>
      </Collapsible>
      <p class="blocks-doc-note">
        <strong>Prefer manual copying?</strong>{" "}
        <ShowcaseCodeLink blockId={block.id}>Open the Showcase’s Code tab</ShowcaseCodeLink> and
        copy each listed file into the same folder structure above. Its labels are the destination
        paths inside <code>{block.id}/</code>, and its imports already match the download. Keep the
        included license with your copy.
      </p>
    </>
  );
}
