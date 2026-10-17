import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const tooltipDocPage = createGenericDocPage({
  slug: "tooltip",
  title: "Tooltip",
  usageLabel: "A modern popup label that appears on hover or keyboard focus.",
  installationText:
    "Import TooltipProvider, Tooltip, TooltipTrigger and TooltipContent from `@/components/kamod-ui/tooltip`.",
  usageText:
    "Keep tooltip copy short, support keyboard focus, and never hide critical actions behind only tooltip text.",
  exampleSections: [
    {
      id: "basic-tooltip",
      title: "Basic",
      text: "**Add a Brief Explanation, Not Hidden Instructions.** Pair a tooltip trigger with a brief explanation that appears on hover or keyboard focus. Use it for supplemental help around an already understandable control, keeping essential task instructions visible in the main interface.\n\nKeep essential information visible elsewhere and avoid placing actions or long content inside a surface intended for short hints.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/kamod-ui/tooltip";

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
      ),
    },
    {
      id: "side-tooltip",
      title: "Side",
      text: "**Choose a Preferred Side that Leaves Room to Read.** Choose the tooltip's `side` from top, right, bottom or left according to the trigger's location. Compare the same hint at each edge so the preferred placement leaves room without obscuring the control it explains.\n\nTest near viewport edges and in dense toolbars, and keep the tooltip short enough that its position does not become a layout problem.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/kamod-ui/tooltip";

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
      ),
    },
    {
      id: "align-tooltip",
      title: "Align and Offset",
      text: "**Use Offsets to Refine a Clear Relationship.** Use alignment and position offsets to fine-tune the tooltip's relationship to its trigger. These adjustments are useful near edges or grouped controls, where a centered popup may compete with neighboring content.\n\nCheck real text lengths and narrow containers before adding special-case positions for individual buttons.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/kamod-ui/tooltip";

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
      ),
    },
    {
      id: "provider-delay-tooltip",
      title: "Provider Delay",
      text: "**Keep Timing Consistent within a Control Area.** Set shared tooltip timing through the provider when a toolbar or region should use one consistent delay. This avoids configuring every hint independently while allowing the opening behavior to suit the density of the surrounding controls.\n\nBalance quick discovery with accidental activation, and preserve keyboard focus behavior independently of pointer timing; longer delays should not hide essential explanations.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/kamod-ui/tooltip";

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
      ),
    },
    {
      id: "non-hoverable-content-tooltip",
      title: "Disable Hoverable Content",
      text: "**Use This for Short, Non-Interactive Hints.** Use the non-hoverable content option when leaving the trigger should dismiss a brief passive hint immediately. Keep that content nonessential and noninteractive, since users are not being given time to move into it.\n\nKeep the text brief and choose [Popover](/docs/popover/installation) when users need to move into the panel or interact with its contents.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/kamod-ui/tooltip";

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
      ),
    },
    {
      id: "shortcut-tooltip",
      title: "With Keyboard Shortcut",
      text: "**Pair the Action Name with an Accurate Key Hint.** Include a compact keyboard hint alongside the tooltip's action name when the application supports that command. The visible key sequence documents a real shortcut, rather than adding keyboard behavior to the trigger automatically.\n\nKeep the trigger usable without the shortcut and ensure platform-specific modifiers match the behavior users actually receive.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/kamod-ui/tooltip";

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
      ),
    },
    {
      id: "disabled-button-tooltip",
      title: "Disabled Button",
      text: "**Explain the Restriction without Enabling the Action.** Wrap a disabled button with a suitable tooltip trigger because the disabled control may not receive the necessary events. Give the wrapper appropriate focus behavior so the reason for the restriction is available beyond pointer hover.\n\nKeep the reason concise, test both pointer and keyboard access, and put important prerequisites in persistent text when the tooltip would otherwise be the only way to discover them.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/kamod-ui/tooltip";

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
      ),
    },
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
    {
      prop: "TooltipContent side",
      type: '"top" | "right" | "bottom" | "left"',
      defaultValue: '"top"',
    },
    { prop: "TooltipContent align", type: '"start" | "center" | "end"', defaultValue: '"center"' },
    { prop: "TooltipContent alignOffset", type: "number", defaultValue: "0" },
    { prop: "TooltipContent collisionPadding", type: "number", defaultValue: "8" },
    { prop: "TooltipContent forceMount", type: "boolean", defaultValue: "false" },
    { prop: "TooltipTrigger", type: "focus/hover target", defaultValue: "required" },
  ],
  accessibilityText:
    "Tooltips are supplemental only: keep essential instructions visible in the UI and expose help text via focus for keyboard users.",
});
