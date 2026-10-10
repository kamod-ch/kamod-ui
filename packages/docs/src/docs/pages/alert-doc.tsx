import {
  Alert,
  AlertAction,
  AlertCallout,
  AlertDescription,
  AlertTitle,
  Button,
  DirectionProvider,
} from "@kamod-ch/ui";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import type { DocPageModule } from "../types";

function AlertHero() {
  return (
    <div class="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Payment Successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <Info />
        <AlertTitle>New Feature Available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account settings.
        </AlertDescription>
      </Alert>
    </div>
  );
}

const heroCode = `import { Alert, AlertDescription, AlertTitle } from "@/components/kamod-ui/alert";
import { CheckCircle2, Info } from "lucide-preact";

export const Example = () => (
  <div class="grid w-full max-w-md items-start gap-4">
    <Alert>
      <CheckCircle2 />
      <AlertTitle>Payment successful</AlertTitle>
      <AlertDescription>…</AlertDescription>
    </Alert>
    <Alert>
      <Info />
      <AlertTitle>New feature available</AlertTitle>
      <AlertDescription>…</AlertDescription>
    </Alert>
  </div>
);`;

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  callout: {
    preview: () => (
      <AlertCallout
        class="max-w-xl"
        title="Start with one working screen"
        eyebrow="A useful first step"
        icon={<Info />}
        meta="01"
        footer={
          <Button variant="outline" size="sm" href="#installation">
            View setup
          </Button>
        }
      >
        <p>
          Connect your <strong>shared styles</strong>, then render a single <code>Button</code>.
          Once it looks right, build the rest of the page around it.
        </p>
      </AlertCallout>
    ),
    code: `import { AlertCallout, Button } from "@kamod-ch/ui";
import { InfoIcon } from "@kamod-ch/icons/lucide";

<AlertCallout
  title="Start with one working screen"
  eyebrow="A useful first step"
  icon={<InfoIcon />}
  meta="01"
  footer={<Button variant="outline" size="sm" href="#installation">View setup</Button>}
>
  <p>Connect your <strong>shared styles</strong>, then render a single <code>Button</code>.
  Once it looks right, build the rest of the page around it.</p>
</AlertCallout>`,
  },
  basic: {
    preview: () => (
      <Alert class="max-w-md">
        <CheckCircle2 />
        <AlertTitle>Account Updated Successfully</AlertTitle>
        <AlertDescription>
          Your profile information has been saved. Changes will be reflected immediately.
        </AlertDescription>
      </Alert>
    ),
    code: `import { Alert, AlertDescription, AlertTitle } from "@/components/kamod-ui/alert";
import { CheckCircle2 } from "lucide-preact";

<Alert class="max-w-md">
  <CheckCircle2 />
  <AlertTitle>Account updated successfully</AlertTitle>
  <AlertDescription>…</AlertDescription>
</Alert>`,
  },
  destructive: {
    preview: () => (
      <Alert variant="destructive" class="max-w-md">
        <AlertCircle />
        <AlertTitle>Payment Failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please check your payment method and try again.
        </AlertDescription>
      </Alert>
    ),
    code: `import { Alert, AlertDescription, AlertTitle } from "@/components/kamod-ui/alert";
import { AlertCircle } from "lucide-preact";

<Alert variant="destructive" class="max-w-md">
  <AlertCircle />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>…</AlertDescription>
</Alert>`,
  },
  action: {
    preview: () => (
      <Alert class="max-w-md">
        <AlertTitle>Dark Mode Is Now Available</AlertTitle>
        <AlertDescription>Enable it under your profile settings to get started.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="default">
            Enable
          </Button>
        </AlertAction>
      </Alert>
    ),
    code: `import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/kamod-ui/alert"
import { Button } from "@/components/kamod-ui/button";

<Alert class="max-w-md">
  <AlertTitle>Dark mode is now available</AlertTitle>
  <AlertDescription>…</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="default">Enable</Button>
  </AlertAction>
</Alert>`,
  },
  colors: {
    preview: () => (
      <Alert class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
        <AlertTriangle />
        <AlertTitle>Your Subscription Will Expire in 3 Days.</AlertTitle>
        <AlertDescription>
          Renew now to avoid service interruption or upgrade to a paid plan to continue using the
          service.
        </AlertDescription>
      </Alert>
    ),
    code: `<Alert class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
  <AlertTriangle />
  <AlertTitle>…</AlertTitle>
  <AlertDescription>…</AlertDescription>
</Alert>`,
  },
  rtl: {
    preview: () => <AlertRtlDemo />,
    code: `import { Alert, AlertDescription, AlertTitle } from "@/components/kamod-ui/alert"
import { DirectionProvider } from "@/components/kamod-ui/direction";
import { CheckCircle2, Info } from "lucide-preact";

// Wrap grid with dir={dir}; optional DirectionProvider for logical components below.`,
  },
};

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    paymentTitle: string;
    paymentDescription: string;
    featureTitle: string;
    featureDescription: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    paymentTitle: "Payment successful",
    paymentDescription:
      "Your payment of $29.99 has been processed. A receipt has been sent to your email address.",
    featureTitle: "New feature available",
    featureDescription:
      "We've added dark mode support. You can enable it in your account settings.",
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    paymentTitle: "تم الدفع بنجاح",
    paymentDescription:
      "تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.",
    featureTitle: "ميزة جديدة متاحة",
    featureDescription: "لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.",
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    paymentTitle: "התשלום בוצע בהצלחה",
    paymentDescription: "התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.",
    featureTitle: "תכונה חדשה זמינה",
    featureDescription: "הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.",
  },
};

function AlertRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-lg flex-col gap-3">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Language">
        {(Object.keys(rtlCopy) as Lang[]).map((key) => (
          <Button
            key={key}
            variant={lang === key ? "default" : "outline"}
            size="sm"
            type="button"
            onClick={() => setLang(key)}
          >
            {rtlCopy[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir}>
        <div class="grid w-full max-w-md items-start gap-4" dir={t.dir}>
          <Alert>
            <CheckCircle2 />
            <AlertTitle>{t.paymentTitle}</AlertTitle>
            <AlertDescription>{t.paymentDescription}</AlertDescription>
          </Alert>
          <Alert>
            <Info />
            <AlertTitle>{t.featureTitle}</AlertTitle>
            <AlertDescription>{t.featureDescription}</AlertDescription>
          </Alert>
        </div>
      </DirectionProvider>
    </div>
  );
}

const apiSections = [
  {
    title: "Alert",
    description:
      "shadcn-compatible `default` and `destructive`, plus Kamod semantic variants (primary, secondary, info, success, warning, error).",
    rows: [
      {
        prop: "variant",
        type: '"default" | "destructive" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "callout"',
        defaultValue: '"default"',
      },
      { prop: "class", type: "string", defaultValue: "-" },
      { prop: "children", type: "ComponentChildren", defaultValue: "-" },
    ],
  },
  {
    title: "AlertCallout",
    description:
      "Structured guidance built on Alert variant=callout. Defaults to a non-live note; optional slots are omitted when unused.",
    rows: [
      { prop: "title", type: "ComponentChildren", defaultValue: "Required" },
      { prop: "icon / eyebrow / meta / footer", type: "ComponentChildren", defaultValue: "—" },
      { prop: "headingId", type: "string", defaultValue: "Generated label ID" },
      {
        prop: "headingLevel",
        type: "2 | 3 | 4 | 5 | 6",
        defaultValue: "3 with headingId; otherwise a label",
      },
      { prop: "role", type: "HTML role", defaultValue: '"note"' },
    ],
  },
  {
    title: "AlertTitle",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AlertDescription",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AlertAction",
    description: "Absolutely positioned at top-end; reserve space with parent padding.",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
] as const;

export const alertDocPage: DocPageModule = {
  slug: "alert",
  title: "Alert",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Inline callouts with optional leading icon, title, description, destructive variant, action slot, and custom colors (shadcn Alert pattern).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Alert parts from `@/components/kamod-ui/alert`.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Put an optional Lucide icon first, then AlertTitle and AlertDescription. Use AlertAction for a corner control.",
    },
    {
      id: "basic",
      title: "Basic",
      text: "**Keep Persistent Context Close to the Task.** Compose `AlertTitle` and `AlertDescription` beside a supporting icon within one bounded message. The example constrains the width so the status and its explanation read together rather than stretching across the page.\n\nThe icon should reinforce that meaning rather than replace it; this inline pattern stays in the document while the user reads.",
    },
    {
      id: "callout",
      title: "Structured Callout",
      text: '**Give Helpful Context a Clear Home.** `AlertCallout` composes the core Alert’s `callout` variant into an icon header, a reading area and an optional footer. Use `eyebrow` for a short category, `meta` for a small index or badge, and `footer` for related links. Keep the useful explanation in the body; emphasize key decisions with `strong` and exact values with inline `code`.\n\nIt defaults to `role="note"`, so persistent guidance does not announce itself as an urgent alert. The title is a named label by default; set `headingLevel` when it belongs in your page’s heading hierarchy, or `headingId` to create a linkable level-three heading. All slots accept Preact content, and the layout wraps naturally for narrow screens and translated text.',
    },
    {
      id: "destructive",
      title: "Destructive",
      text: '**Explain Both the Problem and the Recovery.** Set `variant="destructive"` when the message describes an error that needs attention. Put the actual problem in `AlertTitle` and use the description to explain its effect and the next useful step.\n\nAvoid relying on red alone, and distinguish a correctable field error from a broader failure that affects the whole page or form.',
    },
    {
      id: "action",
      title: "Action",
      text: "**Offer One Clear Next Step.** Place the recovery control inside `AlertAction`; the alert reserves space for it at the logical end of the message. This keeps a related action close to its explanation without positioning it over the text.\n\nCheck the layout with a long message and a narrow viewport; if several actions compete, move the less urgent ones into the surrounding page.",
    },
    {
      id: "colors",
      title: "Custom Colors",
      text: "**Choose Meaning before Color.** Use `class` utilities to adjust the alert's surface, text and border as a coordinated set. A warning color can distinguish billing or account notices, while the title still states the meaning explicitly.\n\nTest text, icons and borders in both themes, and prefer shared [Theme Tokens](/docs/theming/installation) when the treatment will recur across the product.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on the alert collection when its text reads right to left. Icons and `AlertAction` follow logical positioning, allowing the same message structure to serve translated content.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
    },
    { id: "api-reference", title: "API Reference", text: "Props overview." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference sections={apiSections} />;
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/kamod-ui/alert";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "usage") {
        return (
          <CodeBlock
            code={`import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/kamod-ui/alert"
import { Button } from "@/components/kamod-ui/button";
import { Info } from "lucide-preact";

<Alert>
  <Info />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>You can add components using the CLI.</AlertDescription>
  <AlertAction>
    <Button variant="outline">Enable</Button>
  </AlertAction>
</Alert>`}
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
        previewClass: "overflow-x-auto",
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <AlertHero />,
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto",
        })}
        {context.sections.map((docSection) => (
          <ComponentDocSection key={docSection.id} section={docSection}>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </ComponentDocSection>
        ))}
      </>
    );
  },
};
