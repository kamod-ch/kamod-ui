import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DirectionProvider,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@kamod-ch/ui";
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  File,
  Folder,
  Maximize2,
  Minimize2,
} from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import {
  MOTION_COLLAPSIBLE_EXAMPLE_CODE,
  MotionCollapsibleFileTreePreview,
} from "../examples/ui-motion/collapsible-example";
import { UiMotionDocLink } from "../examples/ui-motion/ui-motion-doc-link";
import { createGenericDocPage } from "./create-generic-doc-page";

const CollapsibleDemoPreview = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      class="flex w-full max-w-[350px] flex-col gap-2"
    >
      <div class="flex items-center justify-between gap-4 px-4">
        <h4 class="text-sm font-semibold">Order #4189</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" class="size-8 shrink-0">
            <ChevronsUpDown class="size-4" />
            <span class="sr-only">Toggle details</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
        <span class="text-muted-foreground">Status</span>
        <span class="font-medium">Shipped</span>
      </div>
      <CollapsibleContent class="flex flex-col gap-2">
        <div class="rounded-md border px-4 py-2 text-sm">
          <p class="font-medium">Shipping Address</p>
          <p class="text-muted-foreground">100 Market St, San Francisco</p>
        </div>
        <div class="rounded-md border px-4 py-2 text-sm">
          <p class="font-medium">Items</p>
          <p class="text-muted-foreground">2x Studio Headphones</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const CollapsibleBasicPreview = () => (
  <Card class="mx-auto w-full max-w-sm">
    <CardContent>
      <Collapsible class="rounded-md data-[state=open]:bg-muted/60">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            class="group h-auto w-full justify-between gap-2 py-2 font-normal"
          >
            <span>Product details</span>
            <ChevronDown class="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent class="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
          <div>This panel can be expanded or collapsed to reveal additional content.</div>
          <Button size="xs">Learn more</Button>
        </CollapsibleContent>
      </Collapsible>
    </CardContent>
  </Card>
);

const CollapsibleSettingsPreview = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card class="mx-auto w-full max-w-xs" size="sm">
      <CardHeader>
        <CardTitle>Radius</CardTitle>
        <CardDescription>Set the corner radius of the element.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} class="flex items-start gap-2">
          <FieldGroup class="grid w-full grid-cols-2 gap-2">
            <Field>
              <FieldLabel htmlFor="collapsible-radius-x-a" class="sr-only">
                Radius X (row 1)
              </FieldLabel>
              <Input id="collapsible-radius-x-a" placeholder="0" defaultValue="0" />
            </Field>
            <Field>
              <FieldLabel htmlFor="collapsible-radius-y-a" class="sr-only">
                Radius Y (row 1)
              </FieldLabel>
              <Input id="collapsible-radius-y-a" placeholder="0" defaultValue="0" />
            </Field>
            <CollapsibleContent class="col-span-full grid grid-cols-subgrid gap-2">
              <Field>
                <FieldLabel htmlFor="collapsible-radius-x-b" class="sr-only">
                  Radius X (row 2)
                </FieldLabel>
                <Input id="collapsible-radius-x-b" placeholder="0" defaultValue="0" />
              </Field>
              <Field>
                <FieldLabel htmlFor="collapsible-radius-y-b" class="sr-only">
                  Radius Y (row 2)
                </FieldLabel>
                <Input id="collapsible-radius-y-b" placeholder="0" defaultValue="0" />
              </Field>
            </CollapsibleContent>
          </FieldGroup>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              class="shrink-0"
              aria-label={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? <Minimize2 class="size-4" /> : <Maximize2 class="size-4" />}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

const fileTree: FileTreeItem[] = [
  {
    name: "components",
    items: [
      {
        name: "ui",
        items: [
          { name: "button.tsx" },
          { name: "card.tsx" },
          { name: "dialog.tsx" },
          { name: "input.tsx" },
          { name: "select.tsx" },
          { name: "table.tsx" },
        ],
      },
      { name: "login-form.tsx" },
      { name: "register-form.tsx" },
    ],
  },
  {
    name: "lib",
    items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
  },
  {
    name: "hooks",
    items: [
      { name: "use-media-query.ts" },
      { name: "use-debounce.ts" },
      { name: "use-local-storage.ts" },
    ],
  },
  { name: "app.tsx" },
  { name: "package.json" },
];

const CollapsibleFileTreePreview = () => {
  const renderItem = (fileItem: FileTreeItem, depth = 0): ComponentChildren => {
    if ("items" in fileItem) {
      return (
        <Collapsible key={`${fileItem.name}-${depth}`}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              class="group h-auto w-full justify-start gap-2 transition-none hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronRight class="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-90" />
              <Folder class="size-4 shrink-0" />
              {fileItem.name}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent class="mt-1 ms-5 flex flex-col gap-1">
            {fileItem.items.map((child) => renderItem(child, depth + 1))}
          </CollapsibleContent>
        </Collapsible>
      );
    }
    return (
      <Button
        key={`${fileItem.name}-${depth}`}
        variant="link"
        size="sm"
        class="h-auto w-full justify-start gap-2 text-foreground"
      >
        <File class="size-4 shrink-0" />
        <span>{fileItem.name}</span>
      </Button>
    );
  };

  return (
    <Card class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
      <CardHeader class="pb-2">
        <Tabs defaultValue="explorer">
          <TabsList variant="line" class="w-full">
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="settings">Outline</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="flex flex-col gap-1">{fileTree.map((item) => renderItem(item))}</div>
      </CardContent>
    </Card>
  );
};

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    orderNumber: string;
    status: string;
    shipped: string;
    shippingAddress: string;
    address: string;
    items: string;
    itemsDescription: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    orderNumber: "Order #4189",
    status: "Status",
    shipped: "Shipped",
    shippingAddress: "Shipping address",
    address: "100 Market St, San Francisco",
    items: "Items",
    itemsDescription: "2x Studio Headphones",
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    orderNumber: "الطلب #4189",
    status: "الحالة",
    shipped: "تم الشحن",
    shippingAddress: "عنوان الشحن",
    address: "100 Market St, San Francisco",
    items: "العناصر",
    itemsDescription: "2x سماعات الاستوديو",
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    orderNumber: "הזמנה #4189",
    status: "סטטוס",
    shipped: "נשלח",
    shippingAddress: "כתובת משלוח",
    address: "100 Market St, San Francisco",
    items: "פריטים",
    itemsDescription: "2x אוזניות סטודיו",
  },
};

const CollapsibleRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const [isOpen, setIsOpen] = useState(false);
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-md flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button
            key={key}
            variant={lang === key ? "default" : "outline"}
            size="sm"
            onClick={() => setLang(key)}
          >
            {rtlCopy[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir} class="w-full">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          class="flex w-full max-w-[350px] flex-col gap-2"
          dir={t.dir}
        >
          <div class="flex items-center justify-between gap-4 px-4">
            <h4 class="text-sm font-semibold">{t.orderNumber}</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" class="size-8 shrink-0">
                <ChevronsUpDown class="size-4" />
                <span class="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
            <span class="text-muted-foreground">{t.status}</span>
            <span class="font-medium">{t.shipped}</span>
          </div>
          <CollapsibleContent class="flex flex-col gap-2">
            <div class="rounded-md border px-4 py-2 text-sm">
              <p class="font-medium">{t.shippingAddress}</p>
              <p class="text-muted-foreground">{t.address}</p>
            </div>
            <div class="rounded-md border px-4 py-2 text-sm">
              <p class="font-medium">{t.items}</p>
              <p class="text-muted-foreground">{t.itemsDescription}</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </DirectionProvider>
    </div>
  );
};

const CollapsibleControlledPreview = () => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} class="w-full max-w-md">
      <CollapsibleTrigger class="mb-2">Toggle</CollapsibleTrigger>
      <CollapsibleContent>Controlled content</CollapsibleContent>
    </Collapsible>
  );
};

export const collapsibleDocPage = createGenericDocPage({
  slug: "collapsible",
  title: "Collapsible",
  previewCode: `import { useState } from "preact/hooks";
import { Button } from "@/components/kamod-ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/kamod-ui/collapsible";
import { ChevronsUpDown } from "lucide-preact";

export const Example = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} class="flex w-[350px] flex-col gap-2">
      <div class="flex items-center justify-between gap-4 px-4">
        <h4 class="text-sm font-semibold">Order #4189</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" class="size-8">
            <ChevronsUpDown class="size-4" />
            <span class="sr-only">Toggle details</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="flex flex-col gap-2">{/* … */}</CollapsibleContent>
    </Collapsible>
  );
};`,
  usageLabel:
    "Progressive disclosure with open/onOpenChange, asChild triggers, height animation (accordion-style), shadcn-aligned examples.",
  installationText:
    "Import Collapsible, CollapsibleTrigger and CollapsibleContent from `@/components/kamod-ui/collapsible`. Motion is optional — core CollapsibleContent includes CSS height animation.",
  sectionExtras: {
    "with-motion": () => <UiMotionDocLink section="collapsible" />,
  },
  usageText:
    "Wrap trigger and content. Use open and onOpenChange for controlled state. Use CollapsibleTrigger asChild with Button for icon toggles. CollapsibleContent animates height (respects prefers-reduced-motion).",
  exampleSections: [
    {
      id: "collapsible-demo",
      title: "Demo",
      text: "**Reveal Supporting Detail on Demand.** Control a `Collapsible` within an order card to reveal supporting details only when needed. A ghost icon trigger keeps the summary compact, while the expanded area provides context without replacing the main order information.\n\nThe order-card composition suits optional detail rather than required instructions; important next steps should remain visible without asking users to discover the disclosure.",
      code: `// See previewCode hero — open + onOpenChange, asChild Button, ChevronsUpDown.`,
      renderPreview: () => <CollapsibleDemoPreview />,
    },
    {
      id: "collapsible-usage",
      title: "Usage",
      text: "**Separate the Trigger from the Revealed Content.** Pair `CollapsibleTrigger` with `CollapsibleContent` for a minimal disclosure. The trigger changes visibility and the content contains the optional explanation, giving you a small foundation before adding card surfaces or custom controls.\n\nPreserve the trigger's keyboard behavior and expanded state, and avoid hiding the only explanation of its purpose inside the closed content.",
      code: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/kamod-ui/collapsible";

export const Example = () => (
  <Collapsible>
    <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
    <CollapsibleContent>
      Yes. Free to use for personal and commercial projects. No attribution required.
    </CollapsibleContent>
  </Collapsible>
);`,
      renderPreview: () => (
        <Collapsible class="w-full max-w-lg">
          <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
          <CollapsibleContent>
            Yes. Free to use for personal and commercial projects. No attribution required.
          </CollapsibleContent>
        </Collapsible>
      ),
    },
    {
      id: "collapsible-controlled",
      title: "Controlled State",
      text: "**Coordinate Visibility with Application State.** Supply `open` and `onOpenChange` when the disclosure must coordinate with external controls or application state. The parent owns the boolean value, and the collapsible reports requests to change it through the callback.\n\nKeep `onOpenChange` connected to that source of truth and consider where focus should remain when another part of the page opens or closes the panel.",
      code: `import { useState } from "preact/hooks";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/kamod-ui/collapsible";

export const Example = () => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent>Content</CollapsibleContent>
    </Collapsible>
  );
};`,
      renderPreview: () => <CollapsibleControlledPreview />,
    },
    {
      id: "collapsible-basic",
      title: "Basic",
      text: "**Make the Whole Summary Easy to Activate.** Use a full-width ghost trigger inside a card so the summary row clearly opens the details below. A rotating chevron reinforces the expanded state without making the icon the only indicator of the interaction.\n\nKeep nested links or buttons outside that trigger to avoid conflicting interactive targets, and ensure the label still describes the content when the icon is not visible.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Card, CardContent } from "@/components/kamod-ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/kamod-ui/collapsible";
import { ChevronDown } from "lucide-preact";`,
      renderPreview: () => <CollapsibleBasicPreview />,
    },
    {
      id: "collapsible-settings",
      title: "Settings Panel",
      text: "**Keep Advanced Settings Optional and Understandable.** Keep common settings visible and reveal less frequently used fields inside `CollapsibleContent`. The maximize/minimize control explains that the same settings area can show more detail while preserving the surrounding form context.\n\nDecide whether hidden fields retain their values, explain any dependencies outside the disclosure, and ensure validation does not strand an error inside an unnoticed closed panel.",
      code: `// Collapsible + FieldGroup grid-cols-2, CollapsibleContent col-span-full grid-cols-subgrid`,
      renderPreview: () => <CollapsibleSettingsPreview />,
    },
    {
      id: "collapsible-file-tree",
      title: "File Tree",
      text: "**Keep Folder Disclosure Distinct from File Actions.** Nest collapsibles to represent folder branches, with a separate trigger for each expandable level. The tree example combines these disclosures with a tabbed header, illustrating how local expansion can coexist with another navigation choice.\n\nUse stable keys and test deep nesting; choose [Tree](/docs/tree/installation) when you need dedicated tree selection and keyboard navigation.",
      code: `// Recursive Collapsible per folder; ChevronRight rotates when open.`,
      renderPreview: () => <CollapsibleFileTreePreview />,
    },
    {
      id: "collapsible-rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Apply the translated `dir` value to the collapsible and share it with `DirectionProvider`. Labels, spacing and directional symbols should describe the same disclosure in each language without changing its open-state model.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: `import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/kamod-ui/collapsible"
import { DirectionProvider } from "@/components/kamod-ui/direction";`,
      renderPreview: () => <CollapsibleRtlPreview />,
    },
    {
      id: "with-motion",
      title: "With Motion",
      text: "**Keep Motion Separate from the Interaction Contract.** Replace the content region with `MotionCollapsibleContent` to animate its measured height and opacity. Keep `aria-expanded` and meaningful status text on the trigger so the disclosure remains understandable independently of the transition.\n\nTest repeated activation and reduced-motion preferences, keep the underlying controlled state in one place and avoid making application logic depend on a decorative transition finishing.",
      code: MOTION_COLLAPSIBLE_EXAMPLE_CODE,
      renderPreview: () => <MotionCollapsibleFileTreePreview />,
    },
  ],
  apiRows: [
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    { prop: "open", type: "boolean", defaultValue: "— (uncontrolled)" },
    { prop: "onOpenChange", type: "(open: boolean) => void", defaultValue: "—" },
    { prop: "CollapsibleTrigger asChild", type: "boolean", defaultValue: "false" },
    { prop: "CollapsibleContent forceMount", type: "boolean", defaultValue: "false" },
    {
      prop: "CollapsibleContent duration / timingFunction",
      type: "string",
      defaultValue: "320ms / cubic-bezier…",
    },
  ],
  accessibilityText:
    "Trigger exposes aria-expanded; content is aria-hidden and inert when closed. Provide sr-only labels on icon-only triggers.",
});
