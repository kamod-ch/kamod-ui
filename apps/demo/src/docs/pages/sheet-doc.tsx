import {
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const sheetDocPage = createGenericDocPage({
  slug: "sheet",
  title: "Sheet",
  usageLabel: "Sheet extends Dialog to render content from a viewport edge.",
  installationText: "Import Sheet primitives from `@/components/kamod-ui/sheet`.",
  usageText:
    'Use SheetTrigger to open and SheetContent with side="top" | "right" | "bottom" | "left". Left and right panels accept max-width utilities; top and bottom span the viewport width. Bottom/top padding includes safe-area insets for notched devices.',
  exampleSections: [
    {
      id: "basic-sheet",
      title: "Basic",
      text: "Open a Sheet and present focused context with title and description.",
      code: `import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/kamod-ui/sheet";

export const Example = () => (
  <Sheet>
    <SheetTrigger>Open</SheetTrigger>
    <SheetContent side="right" class="max-w-md">
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div class="stack">
        <Label for="sheet-name">Name</Label>
        <Input id="sheet-name" value="@peduarte" />
      </div>
      <SheetFooter>
        <Button>Save changes</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);`,
      renderPreview: () => (
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent side="right" class="max-w-md">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div class="stack">
              <Label for="sheet-preview-name">Name</Label>
              <Input id="sheet-preview-name" value="@peduarte" />
            </div>
            <SheetFooter>
              <Button>Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ),
    },
    {
      id: "sheet-side",
      title: "Side",
      text: "Set side on SheetContent to top, right, bottom, or left. Top and bottom sheets span the full viewport width; use max-width classes only for left and right.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/kamod-ui/sheet";

const sides = ["top", "right", "bottom", "left"] as const;

export const Example = () => (
  <div class="row">
    {sides.map((side) => (
      <Sheet key={side}>
        <SheetTrigger>{side}</SheetTrigger>
        <SheetContent side={side} class={side === "top" || side === "bottom" ? undefined : "max-w-md"}>
          <SheetHeader>
            <SheetTitle>{side} sheet</SheetTitle>
            <SheetDescription>
              This Sheet opens from the {side} edge.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    ))}
  </div>
);`,
      renderPreview: () => (
        <div class="row">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger>{side}</SheetTrigger>
              <SheetContent
                side={side}
                class={side === "top" || side === "bottom" ? undefined : "max-w-md"}
              >
                <SheetHeader>
                  <SheetTitle>{side} sheet</SheetTitle>
                  <SheetDescription>This Sheet opens from the {side} edge.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      ),
    },
    {
      id: "sheet-no-close-button",
      title: "No Close Button",
      text: "Disable the built-in close button with showCloseButton={false}.",
      code: `import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/kamod-ui/sheet";

export const Example = () => (
  <Sheet>
    <SheetTrigger>Open Sheet</SheetTrigger>
    <SheetContent side="right" showCloseButton={false} class="max-w-md">
      <SheetHeader>
        <SheetTitle>Custom closing flow</SheetTitle>
        <SheetDescription>
          This variant hides the default close button for custom UI patterns.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
);`,
      renderPreview: () => (
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent side="right" showCloseButton={false} class="max-w-md">
            <SheetHeader>
              <SheetTitle>Custom closing flow</SheetTitle>
              <SheetDescription>
                This variant hides the default close button for custom UI patterns.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ),
    },
  ],
  apiRows: [
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    {
      prop: "SheetContent side",
      type: '"left" | "right" | "top" | "bottom"',
      defaultValue: '"right"',
    },
    { prop: "SheetContent showCloseButton", type: "boolean", defaultValue: "true" },
    { prop: "SheetContent forceMount", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    "Always provide a descriptive title/description and ensure users can close the sheet via keyboard or explicit actions.",
});
