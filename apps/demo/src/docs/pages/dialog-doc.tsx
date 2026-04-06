import { useState } from "preact/hooks";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
  Label,
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    btn: string;
    title: string;
    description: string;
    name: string;
    username: string;
    cancel: string;
    save: string;
  }
> = {
  en: {
    dir: "ltr",
    btn: "Open dialog",
    title: "Edit profile",
    description: "Make changes to your profile here. Click save when you are done.",
    name: "Name",
    username: "Username",
    cancel: "Cancel",
    save: "Save changes",
  },
  ar: {
    dir: "rtl",
    btn: "فتح الحوار",
    title: "تعديل الملف الشخصي",
    description: "قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.",
    name: "الاسم",
    username: "اسم المستخدم",
    cancel: "إلغاء",
    save: "حفظ التغييرات",
  },
  he: {
    dir: "rtl",
    btn: "פתח דיאלוג",
    title: "ערוך פרופיל",
    description: "בצע שינויים בפרופיל שלך כאן. לחץ על שמור כשתסיים.",
    name: "שם",
    username: "שם משתמש",
    cancel: "בטל",
    save: "שמור שינויים",
  },
};

const DialogRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button
            key={key}
            size="sm"
            variant={lang === key ? "default" : "outline"}
            onClick={() => setLang(key)}
          >
            {key.toUpperCase()}
          </Button>
        ))}
      </div>
      <Dialog>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">{t.btn}</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-sm" dir={t.dir}>
            <DialogHeader>
              <DialogTitle>{t.title}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`dlg-rtl-name-${lang}`}>{t.name}</FieldLabel>
                <Input id={`dlg-rtl-name-${lang}`} name="name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor={`dlg-rtl-user-${lang}`}>{t.username}</FieldLabel>
                <Input id={`dlg-rtl-user-${lang}`} name="username" defaultValue="@peduarte" />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t.cancel}</Button>
              </DialogClose>
              <Button type="submit">{t.save}</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

const INSTALLATION_FULLSCREEN_CODE = `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Open fullscreen</Button>
    </DialogTrigger>
    <DialogContent
      presentation="slot"
      class="fixed inset-0 z-50 flex flex-col gap-0 bg-black/60 p-4 backdrop-blur-sm md:p-6"
    >
      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background shadow-lg">
        <DialogHeader class="shrink-0 space-y-2 border-b px-6 py-5 text-start">
          <DialogTitle class="pe-10 text-xl">Fullscreen</DialogTitle>
          <DialogDescription>Slot presentation: you own overlay + panel.</DialogDescription>
        </DialogHeader>
        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-sm text-muted-foreground">
          Add previews, long forms, or media here.
        </div>
        <DialogFooter class="shrink-0 border-t px-6 py-4">
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);`;

const DialogInstallationFullscreenPreview = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Open fullscreen</Button>
    </DialogTrigger>
    <DialogContent
      presentation="slot"
      class="fixed inset-0 z-50 flex flex-col gap-0 bg-black/60 p-4 backdrop-blur-sm md:p-6"
    >
      <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-background shadow-lg">
        <DialogHeader class="shrink-0 space-y-2 border-b px-6 py-5 text-start">
          <DialogTitle class="pe-10 text-xl">Fullscreen</DialogTitle>
          <DialogDescription>Slot presentation: you own overlay + panel.</DialogDescription>
        </DialogHeader>
        <div class="min-h-0 flex-1 overflow-y-auto px-6 py-4 text-sm text-muted-foreground">
          Add previews, long forms, or media here.
        </div>
        <DialogFooter class="shrink-0 border-t px-6 py-4">
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
);

export const dialogDocPage = createGenericDocPage({
  slug: "dialog",
  title: "Dialog",
  previewCode: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Open</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);`,
  usageLabel:
    'Modal dialog with backdrop, centered panel, default close control, Escape + focus return, `presentation="slot"` for custom layouts (Alert Dialog, full-screen previews).',
  installationText:
    'Install `@kamod-ui/core`, then compose `Dialog`, `DialogTrigger`, and `DialogContent` as in the snippet below. The default modal is centered; for immersive full-viewport layouts use `presentation="slot"` and apply overlay + panel classes on `DialogContent` yourself (see Usage).',
  installationExample: {
    code: INSTALLATION_FULLSCREEN_CODE,
    renderPreview: () => <DialogInstallationFullscreenPreview />,
  },
  usageText:
    'Default `DialogContent` is `presentation="modal"` (backdrop + centered panel). If your code used to put **`fixed inset-0`**, **`flex items-center justify-center`**, and **`bg-black/50`** on `DialogContent` itself, you must set **`presentation="slot"`** — otherwise you get two backdrops and a nested centered shell. Same pattern as `AlertDialogContent` and the docs “View Markdown” dialog. Width-only classes like `sm:max-w-md` on modal are fine without slot. `lockBodyScroll` defaults to true on `Dialog`.',
  exampleSections: [
    {
      id: "presentation-slot",
      title: 'Custom layout: presentation="slot"',
      text: "Use when you own the full-screen overlay (fixed inset-0, dimmed backdrop, flex center). Without slot, the default modal adds its own overlay + panel on top.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Custom overlay</Button>
    </DialogTrigger>
    <DialogContent
      presentation="slot"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div class="max-w-sm rounded-lg border bg-background p-6 shadow-lg">
        <p class="text-sm">Your panel markup only — single portaled root.</p>
        <DialogClose asChild>
          <Button class="mt-4" variant="outline">
            Close
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);`,
      renderPreview: () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Custom overlay</Button>
          </DialogTrigger>
          <DialogContent
            presentation="slot"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <div class="max-w-sm rounded-lg border bg-background p-6 shadow-lg">
              <p class="text-sm">Your panel markup only — single portaled root.</p>
              <DialogClose asChild>
                <Button class="mt-4" variant="outline">
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "dialog-demo",
      title: "Demo",
      text: "Form in a dialog with FieldGroup — matches shadcn DialogDemo structure.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/kamod-ui/field"
import { Input } from "@/components/kamod-ui/input";

// See dialog-doc.tsx DialogDemoPreview`,
      renderPreview: () => (
        <Dialog>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="dialog-doc-name">Name</FieldLabel>
                  <Input id="dialog-doc-name" name="name" defaultValue="Pedro Duarte" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="dialog-doc-username">Username</FieldLabel>
                  <Input id="dialog-doc-username" name="username" defaultValue="@peduarte" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      ),
    },
    {
      id: "basic-dialog",
      title: "Basic",
      text: "Minimal title and description.",
      code: `import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger>Open dialog</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);`,
      renderPreview: () => (
        <Dialog>
          <DialogTrigger>Open dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "custom-close",
      title: "Custom close",
      text: "Primary dismiss control in the footer; `showCloseButton={false}` removes the corner X.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog"
import { Input } from "@/components/kamod-ui/input"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Share</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md" showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
      </DialogHeader>
      <div class="flex items-center gap-2">
        <div class="grid flex-1 gap-2">
          <Label htmlFor="link" class="sr-only">Link</Label>
          <Input id="link" readOnly defaultValue="https://ui.shadcn.com/docs/installation" />
        </div>
      </div>
      <DialogFooter class="sm:justify-start">
        <DialogClose asChild>
          <Button type="button">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);`,
      renderPreview: () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Share</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md" showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div class="flex items-center gap-2">
              <div class="grid flex-1 gap-2">
                <Label htmlFor="dialog-doc-link" class="sr-only">
                  Link
                </Label>
                <Input
                  id="dialog-doc-link"
                  readOnly
                  defaultValue="https://ui.shadcn.com/docs/installation"
                />
              </div>
            </div>
            <DialogFooter class="sm:justify-start">
              <DialogClose asChild>
                <Button type="button">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "no-close-button",
      title: "No close button",
      text: "`showCloseButton={false}` hides the corner control — provide another way to dismiss.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">No X</Button>
    </DialogTrigger>
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>No close button</DialogTitle>
        <DialogDescription>Use Escape or click the backdrop to dismiss.</DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);`,
      renderPreview: () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">No X</Button>
          </DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>No close button</DialogTitle>
              <DialogDescription>Use Escape or click the backdrop to dismiss.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "sticky-footer",
      title: "Sticky footer",
      text: "Scroll the body; footer stays in the dialog layout.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Sticky footer</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sticky footer</DialogTitle>
        <DialogDescription>Footer stays visible while content scrolls.</DialogDescription>
      </DialogHeader>
      <div class="-mx-6 max-h-[50vh] overflow-y-auto px-6 text-sm leading-normal">
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} class="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);`,
      renderPreview: () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Sticky footer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sticky footer</DialogTitle>
              <DialogDescription>Footer stays visible while content scrolls.</DialogDescription>
            </DialogHeader>
            <div class="-mx-6 max-h-[50vh] overflow-y-auto px-6 text-sm leading-normal">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={i} class="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "scrollable-content",
      title: "Scrollable content",
      text: "Long content in a scroll region; header stays above.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">Scrollable</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Scrollable content</DialogTitle>
        <DialogDescription>This dialog has a scrollable body.</DialogDescription>
      </DialogHeader>
      <div class="-mx-6 max-h-[50vh] overflow-y-auto px-6 text-sm leading-normal">
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i} class="mb-4">Lorem ipsum dolor sit amet…</p>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);`,
      renderPreview: () => (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Scrollable</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scrollable content</DialogTitle>
              <DialogDescription>This dialog has a scrollable body.</DialogDescription>
            </DialogHeader>
            <div class="-mx-6 max-h-[50vh] overflow-y-auto px-6 text-sm leading-normal">
              {Array.from({ length: 10 }).map((_, i) => (
                <p key={i} class="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua.
                </p>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      ),
    },
    {
      id: "dialog-rtl",
      title: "RTL",
      text: "Set `dir` on `DialogContent` for localized layouts (EN / AR / HE toggle).",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/kamod-ui/dialog";

// See dialog-doc.tsx DialogRtlPreview`,
      renderPreview: () => <DialogRtlPreview />,
    },
    {
      id: "dialog-actions",
      title: "Destructive actions",
      text: "Footer with cancel and destructive confirm.",
      code: `import { Button } from "@/components/kamod-ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/kamod-ui/dialog";

export const Example = () => (
  <Dialog>
    <DialogTrigger>Delete item</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete this item?</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);`,
      renderPreview: () => (
        <Dialog>
          <DialogTrigger>Delete item</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete this item?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ],
  apiRows: [
    { prop: "Dialog lockBodyScroll", type: "boolean", defaultValue: "true" },
    { prop: "open / onOpenChange", type: "controlled", defaultValue: "optional" },
    { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
    {
      prop: "DialogContent presentation",
      type: '"modal" | "slot"',
      defaultValue: '"modal" — use "slot" if DialogContent has fixed inset-0 overlay',
    },
    { prop: "DialogContent showCloseButton", type: "boolean", defaultValue: "true (modal only)" },
    { prop: "DialogContent forceMount", type: "boolean", defaultValue: "false" },
    { prop: "DialogTrigger / DialogClose asChild", type: "boolean", defaultValue: "false" },
  ],
  accessibilityText:
    'The modal panel is focusable (tabIndex -1), closes on Escape, and returns focus to the trigger. Provide DialogTitle and DialogDescription for context. Hide the default close control only when another explicit dismiss action exists. For custom fullscreen overlays, use presentation="slot" so assistive tech and focus stay on one dialog surface (no duplicate modal shells).',
});
