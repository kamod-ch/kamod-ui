import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const tooltipDocPage = createGenericDocPage({
  slug: "tooltip",
  title: "Tooltip",
  usageLabel: "A modern popup label that appears on hover or keyboard focus.",
  installationText: "Import TooltipProvider, Tooltip, TooltipTrigger and TooltipContent from @kamod-ui/core.",
  usageText: "Keep tooltip copy short, support keyboard focus, and never hide critical actions behind only tooltip text.",
  exampleSections: [
    {
      id: "basic-tooltip",
      title: "Basic",
      text: "Standard hover and focus tooltip.",
      code: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";

export const Example = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>Add to library</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);`,
      renderPreview: () => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline">Hover</Button>
            </TooltipTrigger>
            <TooltipContent>Add to library</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      id: "side-tooltip",
      title: "Side",
      text: "Choose top, right, bottom, or left placement.",
      code: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";

const sides = ["top", "right", "bottom", "left"] as const;

export const Example = () => (
  <TooltipProvider>
    <div class="docs-tooltip-row">
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger>
            <Button variant="outline" class="capitalize">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  </TooltipProvider>
);`,
      renderPreview: () => (
        <TooltipProvider>
          <div class="docs-tooltip-row">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger>
                  <Button variant="outline" class="capitalize">
                    {side}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      )
    },
    {
      id: "align-tooltip",
      title: "Align and offset",
      text: "Fine-tune edge alignment and nudge the position.",
      code: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";

export const Example = () => (
  <TooltipProvider>
    <div class="docs-tooltip-row">
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">Start</Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="start" alignOffset={6}>Aligned start</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">End</Button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end" alignOffset={-4}>Aligned end</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);`,
      renderPreview: () => (
        <TooltipProvider>
          <div class="docs-tooltip-row">
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline">Start</Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" alignOffset={6}>
                Aligned start
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline">End</Button>
              </TooltipTrigger>
              <TooltipContent side="top" align="end" alignOffset={-4}>
                Aligned end
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      )
    },
    {
      id: "provider-delay-tooltip",
      title: "Provider delay",
      text: "Set shared open/close timing once for a whole area.",
      code: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";

export const Example = () => (
  <TooltipProvider delayDuration={350} closeDelayDuration={100}>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover with delay</Button>
      </TooltipTrigger>
      <TooltipContent>Shared provider timing</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);`,
      renderPreview: () => (
        <TooltipProvider delayDuration={350} closeDelayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline">Hover with delay</Button>
            </TooltipTrigger>
            <TooltipContent>Shared provider timing</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      id: "non-hoverable-content-tooltip",
      title: "Disable hoverable content",
      text: "Close immediately when leaving trigger, even if pointer enters content.",
      code: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";

export const Example = () => (
  <TooltipProvider disableHoverableContent>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover and move away</Button>
      </TooltipTrigger>
      <TooltipContent>This tooltip does not stay open on content hover.</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);`,
      renderPreview: () => (
        <TooltipProvider disableHoverableContent>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline">Hover and move away</Button>
            </TooltipTrigger>
            <TooltipContent>This tooltip does not stay open on content hover.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      id: "shortcut-tooltip",
      title: "With keyboard shortcut",
      text: "Provide compact command hints in the tooltip body.",
      code: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";

export const Example = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Save</Button>
      </TooltipTrigger>
      <TooltipContent>
        Save file <span style={{ opacity: 0.8, marginLeft: "0.5rem" }}>⌘S</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);`,
      renderPreview: () => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline">Save</Button>
            </TooltipTrigger>
            <TooltipContent>
              Save file <span style={{ opacity: 0.8, marginLeft: "0.5rem" }}>Ctrl+S</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    {
      id: "disabled-button-tooltip",
      title: "Disabled button",
      text: "Wrap disabled controls so tooltip still gets hover and focus events.",
      code: `import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ui/core";

export const Example = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <span class="inline-flex">
          <Button disabled>Disabled</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>You need write access to continue.</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);`,
      renderPreview: () => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span class="inline-flex">
                <Button disabled>Disabled</Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>You need write access to continue.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }
  ],
  apiRows: [
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    { prop: "open", type: "boolean", defaultValue: "uncontrolled" },
    { prop: "onOpenChange", type: "(next: boolean) => void", defaultValue: "undefined" },
    { prop: "delayDuration", type: "number", defaultValue: "250" },
    { prop: "closeDelayDuration", type: "number", defaultValue: "120" },
    { prop: "disableHoverableContent", type: "boolean", defaultValue: "false" },
    { prop: "TooltipProvider delayDuration", type: "number", defaultValue: "250" },
    { prop: "TooltipProvider closeDelayDuration", type: "number", defaultValue: "120" },
    { prop: "TooltipProvider disableHoverableContent", type: "boolean", defaultValue: "false" },
    { prop: "TooltipTrigger asChild", type: "boolean", defaultValue: "false" },
    { prop: "TooltipContent asChild", type: "boolean", defaultValue: "false" },
    { prop: "TooltipContent side", type: '"top" | "right" | "bottom" | "left"', defaultValue: '"top"' },
    { prop: "TooltipContent align", type: '"start" | "center" | "end"', defaultValue: '"center"' },
    { prop: "TooltipContent alignOffset", type: "number", defaultValue: "0" },
    { prop: "TooltipContent collisionPadding", type: "number", defaultValue: "8" },
    { prop: "TooltipContent forceMount", type: "boolean", defaultValue: "false" },
    { prop: "TooltipTrigger", type: "focus/hover target", defaultValue: "required" }
  ],
  accessibilityText:
    "Tooltips are supplemental only: keep essential instructions visible in the UI and expose help text via focus for keyboard users."
});
