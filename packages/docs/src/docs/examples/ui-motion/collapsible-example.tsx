import { Button } from "@kamod-ch/ui/button";
import { Collapsible, CollapsibleTrigger } from "@kamod-ch/ui/collapsible";
import { MotionCollapsibleContent } from "@kamod-ch/ui-motion/collapsible";
import { ChevronRight, File, Folder } from "lucide-preact";
import { useState } from "preact/hooks";
import type { UiMotionDocExample } from "./types.js";

export const MOTION_COLLAPSIBLE_EXAMPLE_CODE = `import { Button } from "@kamod-ch/ui/button";
import { Collapsible, CollapsibleTrigger } from "@kamod-ch/ui/collapsible";
import { MotionCollapsibleContent } from "@kamod-ch/ui-motion/collapsible";
import { ChevronRight, File, Folder } from "lucide-preact";
import { useState } from "preact/hooks";

function TreeFolder({ name, files }: { name: string; files: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} class="flex flex-col gap-1">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          class="group h-8 w-full justify-start gap-2 px-2 font-normal"
          aria-expanded={open}
        >
          <ChevronRight class="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
          <Folder class="size-4 shrink-0 text-muted-foreground" />
          <span>{name}</span>
          <span class="ms-auto text-xs text-muted-foreground" data-state={open ? "open" : "closed"}>
            {open ? "Expanded" : "Collapsed"}
          </span>
        </Button>
      </CollapsibleTrigger>
      <MotionCollapsibleContent class="flex flex-col gap-1 border-s border-border ps-6">
        {files.map((file) => (
          <div key={file} class="flex h-8 items-center gap-2 px-2 text-sm">
            <File class="size-4 shrink-0 text-muted-foreground" />
            {file}
          </div>
        ))}
      </MotionCollapsibleContent>
    </Collapsible>
  );
}

export function MotionFileTree() {
  return (
    <div class="w-full max-w-sm rounded-lg border border-border p-2">
      <TreeFolder name="src" files={["index.ts", "utils.ts"]} />
      <TreeFolder name="public" files={["favicon.svg"]} />
    </div>
  );
}`;

function TreeFolder({ name, files, testId }: { name: string; files: string[]; testId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      class="flex flex-col gap-1"
      data-testid={`ui-motion-collapsible-${testId}`}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          class="group h-8 w-full justify-start gap-2 px-2 font-normal"
          data-testid={`ui-motion-collapsible-trigger-${testId}`}
        >
          <ChevronRight class="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
          <Folder class="size-4 shrink-0 text-muted-foreground" />
          <span>{name}</span>
          <span
            class="ms-auto text-xs text-muted-foreground"
            data-testid={`ui-motion-collapsible-status-${testId}`}
            data-state={open ? "open" : "closed"}
          >
            {open ? "Expanded" : "Collapsed"}
          </span>
        </Button>
      </CollapsibleTrigger>
      <MotionCollapsibleContent
        class="flex flex-col gap-1 border-s border-border ps-6"
        data-testid={`ui-motion-collapsible-content-${testId}`}
      >
        {files.map((file) => (
          <button
            key={file}
            type="button"
            class="flex h-8 items-center gap-2 rounded-md px-2 text-start text-sm hover:bg-muted/60"
            data-testid={`ui-motion-collapsible-file-${testId}-${file}`}
          >
            <File class="size-4 shrink-0 text-muted-foreground" />
            {file}
          </button>
        ))}
      </MotionCollapsibleContent>
    </Collapsible>
  );
}

export function MotionCollapsibleFileTreePreview() {
  return (
    <div
      class="w-full max-w-sm rounded-lg border border-border p-2"
      data-testid="ui-motion-collapsible-tree"
    >
      <TreeFolder testId="src" name="src" files={["index.ts", "utils.ts"]} />
      <TreeFolder testId="public" name="public" files={["favicon.svg"]} />
    </div>
  );
}

export const collapsibleExample: UiMotionDocExample = {
  id: "collapsible",
  title: "Collapsible",
  text: "File-tree folders with aria-expanded on the trigger, explicit Expanded/Collapsed status text, and MotionCollapsibleContent for height + opacity reveal. Closed panels are inert so nested controls are not tab-reachable; rapid toggles cancel in-flight motion without leaving stale inline heights.",
  code: MOTION_COLLAPSIBLE_EXAMPLE_CODE,
  renderPreview: () => <MotionCollapsibleFileTreePreview />,
  previewClass: "data-[chromeless=true]:overflow-visible",
};
