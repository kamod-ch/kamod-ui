import { useState } from "preact/hooks";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Direction,
  DirectionProvider,
  Input,
  Label,
  useDirection
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

const DirectionValuePreview = () => {
  const dir = useDirection();
  return <p class="text-muted-foreground text-sm">useDirection(): {dir}</p>;
};

type Lang = "en" | "ar" | "he";

const copy: Record<
  Lang,
  { dir: "ltr" | "rtl"; label: string; title: string; description: string; signUp: string; email: string; password: string; forgot: string; login: string; google: string }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    title: "Login to your account",
    description: "Enter your email below to login to your account",
    signUp: "Sign up",
    email: "Email",
    password: "Password",
    forgot: "Forgot password?",
    login: "Login",
    google: "Login with Google"
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    title: "تسجيل الدخول إلى حسابك",
    description: "أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك",
    signUp: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgot: "نسيت كلمة المرور؟",
    login: "تسجيل الدخول",
    google: "تسجيل الدخول باستخدام Google"
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    title: "התחבר לחשבון שלך",
    description: "הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך",
    signUp: "הירשם",
    email: "אימייל",
    password: "סיסמה",
    forgot: "שכחת את הסיסמה?",
    login: "התחבר",
    google: "התחבר עם Google"
  }
};

const CardRtlPreview = () => {
  const [lang, setLang] = useState<Lang>("ar");
  const t = copy[lang];

  return (
    <div class="flex w-full max-w-sm flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" onClick={() => setLang(key)}>
            {copy[key].label}
          </Button>
        ))}
      </div>
      <DirectionProvider direction={t.dir} class="w-full">
        <Card class="w-full max-w-sm" dir={t.dir}>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
            <CardAction>
              <Button variant="link">{t.signUp}</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                  <Label htmlFor={`dir-doc-email-${lang}`}>{t.email}</Label>
                  <Input id={`dir-doc-email-${lang}`} type="email" placeholder="m@example.com" required />
                </div>
                <div class="grid gap-2">
                  <div class="flex items-center gap-2">
                    <Label htmlFor={`dir-doc-password-${lang}`}>{t.password}</Label>
                    <a href="#direction" class="text-primary ms-auto inline-block text-sm underline-offset-4 hover:underline">
                      {t.forgot}
                    </a>
                  </div>
                  <Input id={`dir-doc-password-${lang}`} type="password" required />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter class="flex-col gap-2">
            <Button type="button" class="w-full">
              {t.login}
            </Button>
            <Button type="button" variant="outline" class="w-full">
              {t.google}
            </Button>
          </CardFooter>
        </Card>
      </DirectionProvider>
    </div>
  );
};

export const directionDocPage = createGenericDocPage({
  slug: "direction",
  title: "Direction",
  previewCode: `import { DirectionProvider } from "@kamod-ui/core";

export const Example = () => (
  <DirectionProvider direction="rtl">
    <p>Subtree uses RTL context and dir attribute.</p>
  </DirectionProvider>
);`,
  usageLabel:
    "Text direction context for RTL/LTR — `DirectionProvider` (shadcn API) plus legacy `Direction` with `dir`, and `useDirection()` hook.",
  installationText: "Import DirectionProvider, Direction, and useDirection from @kamod-ui/core (no Radix package required).",
  usageText:
    "Wrap subtrees that need explicit direction. Combine with `dir` on `<html>` for full-page RTL. Use logical Tailwind utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`) so layouts flip automatically.",
  exampleSections: [
    {
      id: "card-rtl",
      title: "Card (RTL preview)",
      text: "Login card with EN / AR / HE toggle — mirrors the shadcn Direction doc preview (Card + ms-auto link).",
      code: `import {
  Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  DirectionProvider, Input, Label
} from "@kamod-ui/core";

// See direction-doc.tsx — translations + DirectionProvider direction={t.dir}`,
      renderPreview: () => <CardRtlPreview />
    },
    {
      id: "direction-provider",
      title: "DirectionProvider",
      text: "shadcn-style API: `direction` prop sets context and wraps children in a `div` with `dir`.",
      code: `import { DirectionProvider } from "@kamod-ui/core";

export const Example = () => (
  <DirectionProvider direction="rtl">
    <div class="rounded border p-4">RTL subtree</div>
  </DirectionProvider>
);`,
      renderPreview: () => (
        <DirectionProvider direction="rtl">
          <div class="rounded border p-4">This subtree uses DirectionProvider direction=&quot;rtl&quot;.</div>
        </DirectionProvider>
      )
    },
    {
      id: "direction-legacy",
      title: "Direction (dir)",
      text: "Legacy Kamod API — same behavior using the `dir` prop.",
      code: `import { Direction } from "@kamod-ui/core";

export const Example = () => (
  <Direction dir="rtl">
    <div class="rounded border p-4">RTL via dir prop</div>
  </Direction>
);`,
      renderPreview: () => (
        <Direction dir="rtl">
          <div class="rounded border p-4">RTL via &lt;Direction dir=&quot;rtl&quot;&gt;.</div>
        </Direction>
      )
    },
    {
      id: "hook-usage",
      title: "useDirection",
      text: "Read the current direction inside any descendant.",
      code: `import { DirectionProvider, useDirection } from "@kamod-ui/core";

const Child = () => {
  const direction = useDirection();
  return <p>Current direction: {direction}</p>;
};

export const Example = () => (
  <DirectionProvider direction="ltr">
    <Child />
  </DirectionProvider>
);`,
      renderPreview: () => (
        <DirectionProvider direction="ltr" class="rounded border p-4">
          <DirectionValuePreview />
        </DirectionProvider>
      )
    },
    {
      id: "html-note",
      title: "Document + provider",
      text: "For production RTL, set `dir` on the root `<html>` element and still use DirectionProvider so hooks and portaled UI see the same value.",
      code: `<!-- index.html -->
<html dir="rtl">
  <body>
    <div id="app"></div>
  </body>
</html>

// app root
import { DirectionProvider } from "@kamod-ui/core";

export const App = () => (
  <DirectionProvider direction="rtl">{/* routes */}</DirectionProvider>
);`,
      renderPreview: () => (
        <p class="text-muted-foreground max-w-prose text-sm leading-relaxed">
          Set <code class="bg-muted rounded px-1 py-0.5 text-xs">dir</code> on{" "}
          <code class="bg-muted rounded px-1 py-0.5 text-xs">html</code> for document-wide defaults; keep{" "}
          <code class="bg-muted rounded px-1 py-0.5 text-xs">DirectionProvider</code> aligned so{" "}
          <code class="bg-muted rounded px-1 py-0.5 text-xs">useDirection()</code> matches.
        </p>
      )
    }
  ],
  apiRows: [
    { prop: "DirectionProvider direction", type: '"ltr" | "rtl"', defaultValue: '"ltr"' },
    { prop: "Direction dir", type: '"ltr" | "rtl"', defaultValue: '"ltr"' },
    { prop: "useDirection()", type: "DirectionValue", defaultValue: '"ltr" (fallback if no provider)' }
  ],
  accessibilityText:
    "Match `dir` to the active locale so reading order, tab order, and screen reader traversal follow user expectations. Prefer logical CSS over hard-coded left/right margins."
});
