import type { ComponentChildren } from "preact";
import { Alert, AlertAction, AlertDescription, AlertTitle, Button, DirectionProvider } from "@kamod-ui/core";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

function AlertHero() {
  return (
    <div class="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>
          Your payment of $29.99 has been processed. A receipt has been sent to your email address.
        </AlertDescription>
      </Alert>
      <Alert>
        <Info />
        <AlertTitle>New feature available</AlertTitle>
        <AlertDescription>
          We&apos;ve added dark mode support. You can enable it in your account settings.
        </AlertDescription>
      </Alert>
    </div>
  );
}

const heroCode = `import { Alert, AlertDescription, AlertTitle } from "@kamod-ui/core";
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
  basic: {
    preview: () => (
      <Alert class="max-w-md">
        <CheckCircle2 />
        <AlertTitle>Account updated successfully</AlertTitle>
        <AlertDescription>
          Your profile information has been saved. Changes will be reflected immediately.
        </AlertDescription>
      </Alert>
    ),
    code: `import { Alert, AlertDescription, AlertTitle } from "@kamod-ui/core";
import { CheckCircle2 } from "lucide-preact";

<Alert class="max-w-md">
  <CheckCircle2 />
  <AlertTitle>Account updated successfully</AlertTitle>
  <AlertDescription>…</AlertDescription>
</Alert>`
  },
  destructive: {
    preview: () => (
      <Alert variant="destructive" class="max-w-md">
        <AlertCircle />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your payment could not be processed. Please check your payment method and try again.
        </AlertDescription>
      </Alert>
    ),
    code: `import { Alert, AlertDescription, AlertTitle } from "@kamod-ui/core";
import { AlertCircle } from "lucide-preact";

<Alert variant="destructive" class="max-w-md">
  <AlertCircle />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>…</AlertDescription>
</Alert>`
  },
  action: {
    preview: () => (
      <Alert class="max-w-md">
        <AlertTitle>Dark mode is now available</AlertTitle>
        <AlertDescription>Enable it under your profile settings to get started.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="default">
            Enable
          </Button>
        </AlertAction>
      </Alert>
    ),
    code: `import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from "@kamod-ui/core";

<Alert class="max-w-md">
  <AlertTitle>Dark mode is now available</AlertTitle>
  <AlertDescription>…</AlertDescription>
  <AlertAction>
    <Button size="xs" variant="default">Enable</Button>
  </AlertAction>
</Alert>`
  },
  colors: {
    preview: () => (
      <Alert class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
        <AlertTriangle />
        <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
        <AlertDescription>
          Renew now to avoid service interruption or upgrade to a paid plan to continue using the service.
        </AlertDescription>
      </Alert>
    ),
    code: `<Alert class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
  <AlertTriangle />
  <AlertTitle>…</AlertTitle>
  <AlertDescription>…</AlertDescription>
</Alert>`
  },
  rtl: {
    preview: () => <AlertRtlDemo />,
    code: `import { Alert, AlertDescription, AlertTitle, DirectionProvider } from "@kamod-ui/core";
import { CheckCircle2, Info } from "lucide-preact";

// Wrap grid with dir={dir}; optional DirectionProvider for logical components below.`
  }
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
    featureDescription: "We've added dark mode support. You can enable it in your account settings."
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    paymentTitle: "تم الدفع بنجاح",
    paymentDescription:
      "تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.",
    featureTitle: "ميزة جديدة متاحة",
    featureDescription: "لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك."
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    paymentTitle: "התשלום בוצע בהצלחה",
    paymentDescription: "התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.",
    featureTitle: "תכונה חדשה זמינה",
    featureDescription: "הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך."
  }
};

function AlertRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-lg flex-col gap-3">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Language">
        {(Object.keys(rtlCopy) as Lang[]).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" type="button" onClick={() => setLang(key)}>
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
        type: '"default" | "destructive" | "primary" | "secondary" | "info" | "success" | "warning" | "error"',
        defaultValue: '"default"'
      },
      { prop: "class", type: "string", defaultValue: "-" },
      { prop: "children", type: "ComponentChildren", defaultValue: "-" }
    ]
  },
  {
    title: "AlertTitle",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AlertDescription",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  },
  {
    title: "AlertAction",
    description: "Absolutely positioned at top-end; reserve space with parent padding.",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }]
  }
] as const;

export const alertDocPage: DocPageModule = {
  slug: "alert",
  title: "Alert",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Inline callouts with optional leading icon, title, description, destructive variant, action slot, and custom colors (shadcn Alert pattern).",
  sections: [
    { id: "installation", title: "Installation", text: "Import Alert parts from @kamod-ui/core." },
    {
      id: "usage",
      title: "Usage",
      text: "Put an optional Lucide icon first, then AlertTitle and AlertDescription. Use AlertAction for a corner control."
    },
    { id: "basic", title: "Basic", text: "Icon, title, and description in a max-width column." },
    { id: "destructive", title: "Destructive", text: "Use variant=\"destructive\" for errors and irreversible failures." },
    {
      id: "action",
      title: "Action",
      text: "AlertAction pins a button (or group) to the top-inline-end; the root adds padding so text does not overlap."
    },
    {
      id: "colors",
      title: "Custom colors",
      text: "Override surface and border with utilities (e.g. amber) for marketing or billing warnings."
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Set dir on the stack; icons and AlertAction use logical end positioning."
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
            code={`import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@kamod-ui/core";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "usage") {
        return (
          <CodeBlock
            code={`import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from "@kamod-ui/core";
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
        previewClass: "overflow-x-auto"
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <AlertHero />,
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
