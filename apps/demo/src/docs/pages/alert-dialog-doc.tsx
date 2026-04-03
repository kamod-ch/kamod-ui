import type { ComponentChildren } from "preact";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  DirectionProvider
} from "@kamod-ui/core";
import { Bluetooth, CircleFadingPlus, Trash2 } from "lucide-preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

function BasicHero() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const heroCode = `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/kamod-ui/alert-dialog"
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline">Show Dialog</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your account from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);`;

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  basic: {
    preview: () => <BasicHero />,
    code: heroCode
  },
  small: {
    preview: () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to allow the USB accessory to connect to this device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
            <AlertDialogAction>Allow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/kamod-ui/alert-dialog"
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline">Show Dialog</Button>
    </AlertDialogTrigger>
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
        <AlertDialogDescription>…</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
        <AlertDialogAction>Allow</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);`
  },
  media: {
    preview: () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Share Project</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <CircleFadingPlus />
            </AlertDialogMedia>
            <AlertDialogTitle>Share this project?</AlertDialogTitle>
            <AlertDialogDescription>
              Anyone with the link will be able to view and edit this project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Share</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/kamod-ui/alert-dialog"
import { Button } from "@/components/kamod-ui/button";
import { CircleFadingPlus } from "lucide-preact";

export const Example = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline">Share Project</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <CircleFadingPlus />
        </AlertDialogMedia>
        <AlertDialogTitle>Share this project?</AlertDialogTitle>
        <AlertDialogDescription>…</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Share</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);`
  },
  "small-media": {
    preview: () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Bluetooth />
            </AlertDialogMedia>
            <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to allow the USB accessory to connect to this device?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
            <AlertDialogAction>Allow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `import { AlertDialog, …, AlertDialogMedia, … } from "@/components/kamod-ui/alert-dialog";
import { Bluetooth } from "lucide-preact";

<AlertDialogContent size="sm">
  <AlertDialogHeader>
    <AlertDialogMedia>
      <Bluetooth />
    </AlertDialogMedia>
    …
  </AlertDialogHeader>
</AlertDialogContent>`
  },
  destructive: {
    preview: () => (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Chat</Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat conversation. View{" "}
              <a href="#" class="font-medium text-primary underline underline-offset-4 hover:no-underline">
                Settings
              </a>{" "}
              to delete any memories saved during this chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    code: `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/kamod-ui/alert-dialog"
import { Button } from "@/components/kamod-ui/button";
import { Trash2 } from "lucide-preact";

<AlertDialogContent size="sm">
  <AlertDialogHeader>
    <AlertDialogMedia class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
      <Trash2 />
    </AlertDialogMedia>
    <AlertDialogTitle>Delete chat?</AlertDialogTitle>
    <AlertDialogDescription>… <a href="#" class="text-primary underline …">Settings</a> …</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
    <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`
  },
  rtl: {
    preview: () => <AlertDialogRtlDemo />,
    code: `import { AlertDialog, …, DirectionProvider, Button } from "@/components/kamod-ui/alert-dialog";
import { Bluetooth } from "lucide-preact";

// Toggle dir; pass dir + data-lang on AlertDialogContent for RTL overlays.`
  }
};

type Lang = "en" | "ar" | "he";

const rtlStrings: Record<
  Lang,
  { dir: "ltr" | "rtl"; label: string; showDialog: string; showDialogSm: string; title: string; description: string; cancel: string; continue: string; smallTitle: string; smallDescription: string; dontAllow: string; allow: string }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    showDialog: "Show Dialog",
    showDialogSm: "Show Dialog (sm)",
    title: "Are you absolutely sure?",
    description: "This action cannot be undone. This will permanently delete your account from our servers.",
    cancel: "Cancel",
    continue: "Continue",
    smallTitle: "Allow accessory to connect?",
    smallDescription: "Do you want to allow the USB accessory to connect to this device?",
    dontAllow: "Don't allow",
    allow: "Allow"
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    showDialog: "إظهار الحوار",
    showDialogSm: "إظهار الحوار (صغير)",
    title: "هل أنت متأكد تمامًا؟",
    description: "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.",
    cancel: "إلغاء",
    continue: "متابعة",
    smallTitle: "السماح للملحق بالاتصال؟",
    smallDescription: "هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟",
    dontAllow: "عدم السماح",
    allow: "السماح"
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    showDialog: "הצג דיאלוג",
    showDialogSm: "הצג דיאלוג (קטן)",
    title: "האם אתה בטוח לחלוטין?",
    description: "פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את החשבון שלך מהשרתים שלנו.",
    cancel: "ביטול",
    continue: "המשך",
    smallTitle: "לאפשר להתקן להתחבר?",
    smallDescription: "האם אתה רוצה לאפשר להתקן USB להתחבר למכשיר זה?",
    dontAllow: "אל תאפשר",
    allow: "אפשר"
  }
};

function AlertDialogRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlStrings[lang];

  return (
    <div class="flex w-full max-w-4xl flex-col gap-4">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Language">
        {(Object.keys(rtlStrings) as Lang[]).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" type="button" onClick={() => setLang(key)}>
            {rtlStrings[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir}>
        <div class="flex flex-wrap gap-4" dir={t.dir}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">{t.showDialog}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir={t.dir} data-lang={t.dir === "rtl" ? lang : undefined}>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.title}</AlertDialogTitle>
                <AlertDialogDescription>{t.description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction>{t.continue}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">{t.showDialogSm}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm" dir={t.dir} data-lang={t.dir === "rtl" ? lang : undefined}>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Bluetooth />
                </AlertDialogMedia>
                <AlertDialogTitle>{t.smallTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t.smallDescription}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.dontAllow}</AlertDialogCancel>
                <AlertDialogAction>{t.allow}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DirectionProvider>
    </div>
  );
}

const apiSections = [
  {
    title: "AlertDialog",
    description: "Same as Dialog with lockBodyScroll; use for blocking confirmations.",
    rows: [
      { prop: "defaultOpen", type: "boolean", defaultValue: "false" },
      { prop: "open", type: "boolean", defaultValue: "-" },
      { prop: "onOpenChange", type: "(open: boolean) => void", defaultValue: "-" },
      { prop: "class", type: "string", defaultValue: "-" }
    ]
  },
  {
    title: "AlertDialogTrigger",
    rows: [
      { prop: "asChild", type: "boolean", defaultValue: "false" },
      { prop: "class", type: "string", defaultValue: "-" }
    ]
  },
  {
    title: "AlertDialogContent",
    rows: [
      { prop: "size", type: '"default" | "sm"', defaultValue: '"default"' },
      { prop: "forceMount", type: "boolean", defaultValue: "false" },
      { prop: "class", type: "string", defaultValue: "-" }
    ]
  },
  {
    title: "AlertDialogHeader",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AlertDialogMedia",
    description: "Circular muted icon slot above title.",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AlertDialogTitle",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AlertDialogDescription",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AlertDialogFooter",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AlertDialogCancel",
    rows: [
      { prop: "variant", type: "Button variant", defaultValue: '"outline"' },
      { prop: "asChild", type: "boolean", defaultValue: "false" },
      { prop: "class", type: "string", defaultValue: "-" }
    ]
  },
  {
    title: "AlertDialogAction",
    rows: [
      { prop: "variant", type: "Button variant", defaultValue: '"default"' },
      { prop: "asChild", type: "boolean", defaultValue: "false" },
      { prop: "class", type: "string", defaultValue: "-" }
    ]
  }
] as const;

export const alertDialogDocPage: DocPageModule = {
  slug: "alert-dialog",
  title: "Alert Dialog",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Modal confirmation pattern: explicit continue/cancel, optional media slot, compact size, destructive actions. Content uses Dialog presentation=\"slot\" (custom overlay).",
  sections: [
    { id: "installation", title: "Installation", text: "Import alert dialog primitives from `@/components/kamod-ui/alert-dialog`." },
    {
      id: "usage",
      title: "Usage",
      text: "Compose Trigger (often asChild + Button), Content, Header (title + description), and Footer (Cancel + Action). Cancel and Action close the dialog on click."
    },
    { id: "basic", title: "Basic", text: "Title, description, cancel and continue — matches the shadcn demo." },
    { id: "small", title: "Small", text: "Use size=\"sm\" on AlertDialogContent for a narrower panel." },
    { id: "media", title: "Media", text: "AlertDialogMedia centers an icon or graphic above the title." },
    {
      id: "small-media",
      title: "Small with media",
      text: "Combine size=\"sm\" with AlertDialogMedia for compact hardware-style prompts."
    },
    {
      id: "destructive",
      title: "Destructive",
      text: "Style media with destructive tokens; use variant=\"destructive\" on AlertDialogAction and variant=\"outline\" on Cancel."
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Set dir on the overlay via AlertDialogContent and wrap with DirectionProvider for logical layout."
    },
    { id: "api-reference", title: "API Reference", text: "Props overview." }
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference sections={apiSections} />;
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/kamod-ui/alert-dialog";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "usage") {
        return (
          <CodeBlock
            code={`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Open</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Title</AlertDialogTitle>
      <AlertDialogDescription>Description</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
            language="tsx"
          />
        );
      }
      const block = sectionBlocks[sectionId];
      if (!block) {
        return null;
      }
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code,
        previewClass: "overflow-x-auto"
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <BasicHero />,
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto"
        })}
        {context.sections.map((docSection) => (
          <section key={docSection.id} id={docSection.id} class="docs-section">
            <h2>{docSection.title}</h2>
            <p class="docs-copy">{docSection.text}</p>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </section>
        ))}
      </>
    );
  }
};
