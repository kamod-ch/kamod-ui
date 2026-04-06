import { useEffect, useState } from "preact/hooks";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Label,
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

const DRAWER_SIDES = ["top", "right", "bottom", "left"] as const;

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden
  >
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden
  >
    <path d="M5 12h14M12 5v14" />
  </svg>
);

const GoalDemoPreview = () => {
  const [goal, setGoal] = useState(350);
  const adjust = (n: number) => setGoal((g) => Math.max(200, Math.min(400, g + n)));
  const barHeights = [40, 55, 35, 50, 38, 62, 48, 52, 44, 58, 41, 47].map(
    (h) => `${(h / 70) * 100}%`,
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div class="p-4 pb-0">
            <div class="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 shrink-0 rounded-full"
                onClick={() => adjust(-10)}
                disabled={goal <= 200}
              >
                <MinusIcon />
                <span class="sr-only">Decrease</span>
              </Button>
              <div class="flex-1 text-center">
                <div class="text-7xl font-bold tracking-tighter">{goal}</div>
                <div class="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
              </div>
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 shrink-0 rounded-full"
                onClick={() => adjust(10)}
                disabled={goal >= 400}
              >
                <PlusIcon />
                <span class="sr-only">Increase</span>
              </Button>
            </div>
            <div class="mt-3 flex h-[120px] items-end justify-between gap-1 px-1">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  class="bg-primary/80 w-full max-w-[12%] rounded-t-sm"
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const ResponsiveProfilePreview = () => {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const form = (
    <form
      class="grid items-start gap-6 px-4"
      onSubmit={(e) => {
        e.preventDefault();
        setOpen(false);
      }}
    >
      <div class="grid gap-3">
        <Label htmlFor="drawer-doc-email">Email</Label>
        <Input type="email" id="drawer-doc-email" defaultValue="shadcn@example.com" />
      </div>
      <div class="grid gap-3">
        <Label htmlFor="drawer-doc-username">Username</Label>
        <Input id="drawer-doc-username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} lockBodyScroll>
        <DialogTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </DialogTrigger>
        {/* Default presentation="modal": only max-width override; use presentation="slot" only with your own fixed inset-0 overlay */}
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div class="px-1">{form}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader class="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        {form}
        <DrawerFooter class="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const drawerDocPage = createGenericDocPage({
  slug: "drawer",
  title: "Drawer",
  previewCode: `import { Button } from "@/components/kamod-ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/kamod-ui/drawer";

export const Example = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button variant="outline">Open</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Title</DrawerTitle>
        <DrawerDescription>Description</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);`,
  usageLabel:
    "Mobile-first panel built on Sheet/Dialog — default bottom `direction`, drag handle, `data-vaul-drawer-direction` for shadcn-style utilities, optional `open`/`onOpenChange`, `DrawerTrigger`/`DrawerClose` with `asChild`.",
  installationText:
    "Import Drawer primitives from `@/components/kamod-ui/drawer` (same surface as shadcn drawer; no Vaul runtime).",
  usageText:
    "Set `direction` on `Drawer` (`top` | `right` | `bottom` | `left`). `DrawerContent` defaults `showCloseButton` to false (use footer actions). Use `showHandle={false}` to hide the top/bottom affordance bar.",
  exampleSections: [
    {
      id: "drawer-demo",
      title: "Demo",
      text: "Goal stepper and simple bar strip (shadcn DrawerDemo pattern, no Recharts).",
      code: `// See repo drawer-doc.tsx — Drawer + DrawerTrigger asChild + DrawerContent + header/footer`,
      renderPreview: () => <GoalDemoPreview />,
    },
    {
      id: "basic-example",
      title: "Basic",
      text: "Trigger opens a bottom drawer with title and description.",
      code: `import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/kamod-ui/drawer";

export const Example = () => (
  <Drawer>
    <DrawerTrigger>Open drawer</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>Update account settings.</DrawerDescription>
      </DrawerHeader>
    </DrawerContent>
  </Drawer>
);`,
      renderPreview: () => (
        <Drawer>
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>Update account settings.</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ),
    },
    {
      id: "footer-actions",
      title: "Footer actions",
      text: "Submit and cancel via DrawerClose asChild.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTrigger } from "@/components/kamod-ui/drawer";

export const Example = () => (
  <Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
      <DrawerFooter>
        <Button>Save</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);`,
      renderPreview: () => (
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerFooter>
              <Button>Save</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ),
    },
    {
      id: "scrollable",
      title: "Scrollable content",
      text: "Right drawer with scroll region; footer stays in the sheet layout (shadcn Scrollable Content).",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/kamod-ui/drawer";

export const Example = () => (
  <Drawer direction="right">
    <DrawerTrigger asChild>
      <Button variant="outline">Scrollable</Button>
    </DrawerTrigger>
    <DrawerContent class="max-w-md">
      <DrawerHeader>
        <DrawerTitle>Notes</DrawerTitle>
        <DrawerDescription>Long body scrolls inside the drawer.</DrawerDescription>
      </DrawerHeader>
      <div class="max-h-48 overflow-y-auto px-1 text-sm leading-normal">
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} class="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);`,
      renderPreview: () => (
        <Drawer direction="right">
          <DrawerTrigger asChild>
            <Button variant="outline">Scrollable</Button>
          </DrawerTrigger>
          <DrawerContent class="max-w-md">
            <DrawerHeader>
              <DrawerTitle>Notes</DrawerTitle>
              <DrawerDescription>Long body scrolls inside the drawer.</DrawerDescription>
            </DrawerHeader>
            <div class="max-h-48 overflow-y-auto px-1 text-sm leading-normal">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={i} class="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ),
    },
    {
      id: "sides",
      title: "Sides",
      text: "Each `direction` opens from that edge (shadcn Sides).",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/kamod-ui/drawer";

const SIDES = ["top", "right", "bottom", "left"] as const;

export const Example = () => (
  <div class="flex flex-wrap gap-2">
    {SIDES.map((side) => (
      <Drawer key={side} direction={side}>
        <DrawerTrigger asChild>
          <Button variant="outline" class="capitalize">
            {side}
          </Button>
        </DrawerTrigger>
        <DrawerContent class="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div class="max-h-32 overflow-y-auto px-1 text-sm">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ))}
  </div>
);`,
      renderPreview: () => (
        <div class="flex flex-wrap gap-2">
          {DRAWER_SIDES.map((side) => (
            <Drawer key={side} direction={side}>
              <DrawerTrigger asChild>
                <Button variant="outline" class="capitalize">
                  {side}
                </Button>
              </DrawerTrigger>
              <DrawerContent class="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
                <DrawerHeader>
                  <DrawerTitle>Move Goal</DrawerTitle>
                  <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                </DrawerHeader>
                <div class="max-h-32 overflow-y-auto px-1 text-sm">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      ),
    },
    {
      id: "responsive-dialog",
      title: "Responsive dialog",
      text: "Dialog from md breakpoint up, Drawer below (shared `open` / `onOpenChange`). Resize the viewport to compare.",
      code: `// See drawer-doc.tsx — useMediaQuery (min-width: 768px), Dialog vs Drawer`,
      renderPreview: () => <ResponsiveProfilePreview />,
    },
    {
      id: "rtl-drawer",
      title: "RTL",
      text: 'Set dir="rtl" on DrawerContent when the page is RTL.',
      code: `import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/kamod-ui/drawer";

export const Example = () => (
  <Drawer>
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent dir="rtl">
      <DrawerHeader>
        <DrawerTitle>عنوان</DrawerTitle>
      </DrawerHeader>
    </DrawerContent>
  </Drawer>
);`,
      renderPreview: () => (
        <Drawer>
          <DrawerTrigger>Open RTL</DrawerTrigger>
          <DrawerContent dir="rtl">
            <DrawerHeader>
              <DrawerTitle>عنوان</DrawerTitle>
              <DrawerDescription>وصف قصير</DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      ),
    },
  ],
  apiRows: [
    {
      prop: "Drawer direction",
      type: '"top" | "right" | "bottom" | "left"',
      defaultValue: '"bottom"',
    },
    { prop: "open", type: "boolean", defaultValue: "uncontrolled" },
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    { prop: "onOpenChange", type: "(open: boolean) => void", defaultValue: "undefined" },
    { prop: "DrawerContent showHandle", type: "boolean", defaultValue: "true for top/bottom" },
    { prop: "DrawerContent showCloseButton", type: "boolean", defaultValue: "false" },
    { prop: "DrawerTrigger / DrawerClose asChild", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    "Use DrawerTitle and DrawerDescription for the dialog context. The drag handle is aria-hidden; provide explicit actions (e.g. Cancel) in the footer. For responsive patterns, keep the same form labels and control ids in Dialog and Drawer branches.",
});
