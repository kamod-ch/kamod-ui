import type { ComponentChildren } from "preact";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DirectionProvider,
} from "@kamod-ui/core";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

function AccordionHero() {
  return (
    <Accordion type="single" collapsible defaultValue="shipping" class="max-w-lg">
      <AccordionItem value="shipping">
        <AccordionTrigger>What are your shipping options?</AccordionTrigger>
        <AccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">
          We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on
          international orders.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">
          Returns accepted within 30 days. Items must be unused and in original packaging. Refunds
          processed within 5-7 business days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
        <AccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">
          Reach us via email, live chat, or phone. We respond within 24 hours during business days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const heroCode = `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/kamod-ui/accordion";

<Accordion type="single" collapsible defaultValue="shipping" class="max-w-lg">
  <AccordionItem value="shipping">
    <AccordionTrigger>What are your shipping options?</AccordionTrigger>
    <AccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">…</AccordionContent>
  </AccordionItem>
  …
</Accordion>`;

const basicItems = [
  {
    value: "item-1",
    trigger: "How do I reset my password?",
    content:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
  },
  {
    value: "item-2",
    trigger: "Can I change my subscription plan?",
    content:
      "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
  },
  {
    value: "item-3",
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
];

const multipleItems = [
  {
    value: "notifications",
    trigger: "Notification Settings",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "Privacy & Security",
    content:
      "Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
  },
  {
    value: "billing",
    trigger: "Billing & Subscription",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
];

const borderItems = [
  {
    value: "billing",
    trigger: "How does billing work?",
    content:
      "We offer monthly and annual subscription plans. Billing is charged at the beginning of each cycle, and you can cancel anytime. All plans include automatic backups, 24/7 support, and unlimited team members.",
  },
  {
    value: "security",
    trigger: "Is my data secure?",
    content:
      "Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits. All data is encrypted at rest and in transit using industry-standard protocols.",
  },
  {
    value: "integration",
    trigger: "What integrations do you support?",
    content:
      "We integrate with 500+ popular tools including Slack, Zapier, Salesforce, HubSpot, and more. You can also build custom integrations using our REST API and webhooks.",
  },
];

const cardItems = [
  {
    value: "plans",
    trigger: "What subscription plans do you offer?",
    content:
      "We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.",
  },
  {
    value: "billing",
    trigger: "How does billing work?",
    content:
      "Billing occurs automatically at the start of each billing cycle. We accept all major credit cards, PayPal, and ACH transfers for enterprise customers. You'll receive an invoice via email after each payment.",
  },
  {
    value: "cancel",
    trigger: "How do I cancel my subscription?",
    content:
      "You can cancel your subscription anytime from your account settings. There are no cancellation fees or penalties. Your access will continue until the end of your current billing period.",
  },
];

function contentClass() {
  return "pt-0 pb-4 text-sm text-muted-foreground";
}

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  basic: {
    preview: () => (
      <Accordion type="single" collapsible defaultValue="item-1" class="max-w-lg">
        {basicItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent class={contentClass()}>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    ),
    code: `const items = […];

<Accordion type="single" collapsible defaultValue="item-1" class="max-w-lg">
  {items.map((item) => (
    <AccordionItem key={item.value} value={item.value}>
      <AccordionTrigger>{item.trigger}</AccordionTrigger>
      <AccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">{item.content}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>`,
  },
  multiple: {
    preview: () => (
      <Accordion type="multiple" class="max-w-lg" defaultValue={["notifications"]}>
        {multipleItems.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent class={contentClass()}>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    ),
    code: `<Accordion type="multiple" class="max-w-lg" defaultValue={["notifications"]}>
  …
</Accordion>`,
  },
  disabled: {
    preview: () => (
      <Accordion type="single" collapsible class="w-full max-w-lg">
        <AccordionItem value="item-1">
          <AccordionTrigger>Can I access my account history?</AccordionTrigger>
          <AccordionContent class={contentClass()}>
            Yes, you can view your complete account history including all transactions, plan
            changes, and support tickets in the Account History section of your dashboard.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" disabled>
          <AccordionTrigger>Premium feature information</AccordionTrigger>
          <AccordionContent class={contentClass()}>
            This section contains information about premium features. Upgrade your plan to access
            this content.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>How do I update my email address?</AccordionTrigger>
          <AccordionContent class={contentClass()}>
            You can update your email address in your account settings. You&apos;ll receive a
            verification email at your new address to confirm the change.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    code: `<Accordion type="single" collapsible class="w-full max-w-lg">
  <AccordionItem value="item-2" disabled>
    <AccordionTrigger>Premium feature information</AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
  borders: {
    preview: () => (
      <Accordion
        type="single"
        collapsible
        class="max-w-lg rounded-lg border"
        defaultValue="billing"
      >
        {borderItems.map((item) => (
          <AccordionItem key={item.value} value={item.value} class="border-b px-4 last:border-b-0">
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent class={contentClass()}>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    ),
    code: `<Accordion type="single" collapsible class="max-w-lg rounded-lg border" defaultValue="billing">
  <AccordionItem value="…" class="border-b px-4 last:border-b-0">
    …
  </AccordionItem>
</Accordion>`,
  },
  card: {
    preview: () => (
      <Card class="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Subscription & Billing</CardTitle>
          <CardDescription>
            Common questions about your account, plans, payments and cancellations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="plans">
            {cardItems.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>{item.trigger}</AccordionTrigger>
                <AccordionContent class={contentClass()}>{item.content}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    ),
    code: `import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/kamod-ui/card";

<Card class="w-full max-w-sm">
  <CardHeader>…</CardHeader>
  <CardContent>
    <Accordion type="single" collapsible defaultValue="plans">…</Accordion>
  </CardContent>
</Card>`,
  },
  rtl: {
    preview: () => <AccordionRtlDemo />,
    code: `import { Accordion, …, DirectionProvider } from "@/components/kamod-ui/accordion";

// Set dir on Accordion or an ancestor; trigger label uses text-start for logical alignment.`,
  },
};

type Lang = "en" | "ar" | "he";

const rtlStrings: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    q1: "How do I reset my password?",
    a1: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
    q2: "Can I change my subscription plan?",
    a2: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
    q3: "What payment methods do you accept?",
    a3: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    q1: "كيف يمكنني إعادة تعيين كلمة المرور؟",
    a1: "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي صلاحية الرابط خلال 24 ساعة.",
    q2: "هل يمكنني تغيير خطة الاشتراك الخاصة بي؟",
    a2: "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر التغييرات في دورة الفوترة التالية.",
    q3: "ما هي طرق الدفع التي تقبلونها؟",
    a3: "نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية. تتم معالجة جميع المدفوعات بأمان من خلال شركاء الدفع لدينا.",
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    q1: "איך אני מאפס את הסיסמה שלי?",
    a1: "לחץ על 'שכחתי סיסמה' בעמוד ההתחברות, הזן את כתובת האימייל שלך, ונשלח לך קישור לאיפוס הסיסמה. הקישור יפוג תוך 24 שעות.",
    q2: "האם אני יכול לשנות את תוכנית המנוי שלי?",
    a2: "כן, אתה יכול לשדרג או להוריד את התוכנית שלך בכל עת מההגדרות של החשבון שלך. השינויים יבואו לידי ביטוי במחזור החיוב הבא.",
    q3: "אילו אמצעי תשלום אתם מקבלים?",
    a3: "אנו מקבלים כרטיסי אשראי, PayPal והעברות בנקאיות.",
  },
};

function AccordionRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlStrings[lang];
  const items = [
    { value: "item-1", q: t.q1, a: t.a1 },
    { value: "item-2", q: t.q2, a: t.a2 },
    { value: "item-3", q: t.q3, a: t.a3 },
  ];

  return (
    <div class="flex w-full max-w-lg flex-col gap-3">
      <div class="flex flex-wrap gap-2" role="group" aria-label="Language">
        {(Object.keys(rtlStrings) as Lang[]).map((key) => (
          <Button
            key={key}
            variant={lang === key ? "default" : "outline"}
            size="sm"
            type="button"
            onClick={() => setLang(key)}
          >
            {rtlStrings[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir}>
        <Accordion type="single" collapsible defaultValue="item-1" class="max-w-md" dir={t.dir}>
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent class={contentClass()}>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DirectionProvider>
    </div>
  );
}

const apiSections = [
  {
    title: "Accordion",
    description: "Uncontrolled state; use defaultValue as string (single) or string[] (multiple).",
    rows: [
      { prop: "type", type: '"single" | "multiple"', defaultValue: '"single"' },
      { prop: "collapsible", type: "boolean", defaultValue: "true" },
      { prop: "defaultValue", type: "string | string[]", defaultValue: "-" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "AccordionItem",
    rows: [
      { prop: "value", type: "string", defaultValue: "(required)" },
      { prop: "disabled", type: "boolean", defaultValue: "false" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "AccordionTrigger",
    rows: [
      { prop: "hideIndicator", type: "boolean", defaultValue: "false" },
      { prop: "indicator", type: "ComponentChildren", defaultValue: "-" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "AccordionContent",
    description:
      "Height animation; optional forceMount, duration, timingFunction, largeContentThreshold.",
    rows: [
      { prop: "forceMount", type: "boolean", defaultValue: "false" },
      { prop: "duration", type: "string", defaultValue: '"320ms"' },
      { prop: "timingFunction", type: "string", defaultValue: "cubic-bezier…" },
      { prop: "largeContentThreshold", type: "number", defaultValue: "560" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
] as const;

export const accordionDocPage: DocPageModule = {
  slug: "accordion",
  title: "Accordion",
  command: "pnpm add @kamod-ui/core",
  usageLabel:
    "Expandable sections with single or multiple open panels, optional non-collapsible single mode, disabled items, and height-based animation (no Radix dependency).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Accordion, AccordionItem, AccordionTrigger, and AccordionContent.",
    },
    {
      id: "usage",
      title: "Usage",
      text: 'Use type="single" with collapsible for shadcn-style behavior, or type="multiple" with defaultValue as an array.',
    },
    { id: "basic", title: "Basic", text: "Single open section; first item open by default." },
    {
      id: "multiple",
      title: "Multiple",
      text: "Several panels can stay open; defaultValue is a string array.",
    },
    {
      id: "disabled",
      title: "Disabled",
      text: "Set disabled on AccordionItem to block interaction.",
    },
    { id: "borders", title: "Borders", text: "Border on the root and border-b between items." },
    { id: "card", title: "Card", text: "Nest the accordion inside CardContent." },
    { id: "rtl", title: "RTL", text: "dir on the accordion; labels use text-start." },
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
            code={`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/kamod-ui/accordion";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "usage") {
        return (
          <CodeBlock
            code={`<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
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
          preview: <AccordionHero />,
          codeSnippet: heroCode,
          previewClass: "overflow-x-auto",
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
  },
};
