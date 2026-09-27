/** Installation actions and destination tree share the registry's generated ZIP manifest. */
import { ChevronDownIcon, DownloadIcon, FileCodeIcon, FolderIcon } from "@kamod-ch/icons/lucide";
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { CodeBlock } from "../../docs/components/CodeBlock";
import type { VariantGuide } from "./VariantDocumentation";
import { variantImport } from "./variant-examples";

function FileTree({ paths }: { paths: string[] }) {
  const groups = new Map<string, string[]>();
  for (const path of paths) {
    const [name, ...rest] = path.split("/");
    const children = groups.get(name) ?? [];
    if (rest.length) children.push(rest.join("/"));
    groups.set(name, children);
  }
  return (
    <ul class="blocks-install-tree">
      {[...groups].map(([name, children]) => (
        <li key={name}>
          <span>
            {children.length ? (
              <FolderIcon aria-hidden="true" size={14} />
            ) : (
              <FileCodeIcon aria-hidden="true" size={14} />
            )}
            <code>
              {name}
              {children.length ? "/" : ""}
            </code>
          </span>
          {children.length > 0 && <FileTree paths={children} />}
        </li>
      ))}
    </ul>
  );
}

export function SidebarInstallation({ guide }: { guide: VariantGuide }) {
  const { block, files } = guide;
  return (
    <>
      <p>
        Download this variant and extract its <code>{block.id}</code> folder into{" "}
        <code>src/components/blocks</code>. Install the dependencies below, then import the
        component. The folder includes its own helpers and demo data; no other sidebar variants are
        needed.
      </p>
      <div class="blocks-install-actions">
        <Button asChild size="sm">
          <a download={`${block.id}.zip`} href={withBasePath(`/blocks/downloads/${block.id}.zip`)}>
            <DownloadIcon size={16} aria-hidden="true" />
            Download block
          </a>
        </Button>
        <span>{files.length} files · source ZIP</span>
      </div>
      <Collapsible class="blocks-install-files group">
        <CollapsibleTrigger class="blocks-install-files-trigger">
          <span>View included files</span>
          <ChevronDownIcon
            aria-hidden="true"
            size={16}
            class="transition-transform group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent duration="0ms">
          <p class="blocks-install-destination">
            Extract into <code>src/components/blocks/</code>
          </p>
          <FileTree paths={files.map((file) => `${block.id}/${file.label}`)} />
        </CollapsibleContent>
      </Collapsible>
      <CodeBlock code={variantImport(guide)} language="tsx" />
      <p class="blocks-doc-note">
        <strong>Prefer manual copying?</strong> Open the <a href={`#${block.id}`}>showcase</a>’s
        Code tab and copy each listed file into the same folder structure above. Its labels are the
        destination paths inside <code>{block.id}/</code>, and its imports already match the
        download. Keep the included license with your copy.
      </p>
    </>
  );
}
