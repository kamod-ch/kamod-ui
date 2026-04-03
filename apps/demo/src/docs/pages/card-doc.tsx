import { useState } from "preact/hooks";
import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DirectionProvider,
  Input,
  Label
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

const p = "card-doc";

const USAGE_SNIPPET = `import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/kamod-ui/card";

export const Example = () => (
  <Card>
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
      <CardAction>Card Action</CardAction>
    </CardHeader>
    <CardContent>
      <p>Card Content</p>
    </CardContent>
    <CardFooter>
      <p>Card Footer</p>
    </CardFooter>
  </Card>
);`;

const LOGIN_DEMO_CODE = `import { Button } from "@/components/kamod-ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/kamod-ui/card";
import { Input } from "@/components/kamod-ui/input";
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
      <CardAction>
        <Button variant="link">Sign Up</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                class="ms-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" required />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex-col gap-2">
      <Button type="submit" class="w-full">
        Login
      </Button>
      <Button variant="outline" class="w-full">
        Login with Google
      </Button>
    </CardFooter>
  </Card>
);`;

const CardDemoPreview = () => (
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>Enter your email below to login to your account</CardDescription>
      <CardAction>
        <Button variant="link">Sign Up</Button>
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
            <Label htmlFor={`${p}-email`}>Email</Label>
            <Input id={`${p}-email`} type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center gap-2">
              <Label htmlFor={`${p}-password`}>Password</Label>
              <a href="#card" class="text-primary ms-auto inline-block text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input id={`${p}-password`} type="password" required />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex-col gap-2">
      <Button type="button" class="w-full">
        Login
      </Button>
      <Button type="button" variant="outline" class="w-full">
        Login with Google
      </Button>
    </CardFooter>
  </Card>
);

const CardSmallPreview = () => (
  <Card size="sm" class="mx-auto w-full max-w-sm">
    <CardHeader>
      <CardTitle>Small Card</CardTitle>
      <CardDescription>This card uses the small size variant.</CardDescription>
    </CardHeader>
    <CardContent>
      <p class="text-sm">
        The card component supports a size prop that can be set to &quot;sm&quot; for a more compact appearance.
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="sm" class="w-full">
        Action
      </Button>
    </CardFooter>
  </Card>
);

const CardImagePreview = () => (
  <Card class="relative mx-auto w-full max-w-sm pt-0">
    <div class="absolute inset-0 z-30 aspect-video bg-black/35" aria-hidden />
    <img
      src="https://avatar.vercel.sh/shadcn1"
      alt="Event cover"
      class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
    />
    <CardHeader>
      <CardAction>
        <Badge variant="secondary">Featured</Badge>
      </CardAction>
      <CardTitle>Design systems meetup</CardTitle>
      <CardDescription>
        A practical talk on component APIs, accessibility, and shipping faster.
      </CardDescription>
    </CardHeader>
    <CardFooter>
      <Button class="w-full">View Event</Button>
    </CardFooter>
  </Card>
);

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    title: string;
    description: string;
    signUp: string;
    email: string;
    password: string;
    forgot: string;
    login: string;
    google: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    title: "Login to your account",
    description: "Enter your email below to login to your account",
    signUp: "Sign Up",
    email: "Email",
    password: "Password",
    forgot: "Forgot your password?",
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
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-sm flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
          <Button key={key} variant={lang === key ? "default" : "outline"} size="sm" onClick={() => setLang(key)}>
            {rtlCopy[key].label}
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
                  <Label htmlFor={`${p}-rtl-email-${lang}`}>{t.email}</Label>
                  <Input
                    id={`${p}-rtl-email-${lang}`}
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div class="grid gap-2">
                  <div class="flex items-center gap-2">
                    <Label htmlFor={`${p}-rtl-password-${lang}`}>{t.password}</Label>
                    <a href="#card" class="text-primary ms-auto inline-block text-sm underline-offset-4 hover:underline">
                      {t.forgot}
                    </a>
                  </div>
                  <Input id={`${p}-rtl-password-${lang}`} type="password" required />
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

const InstallationUsagePreview = () => (
  <Card class="w-full max-w-md">
    <CardHeader>
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
      <CardAction>
        <Button variant="link" size="sm">
          Action
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p class="text-muted-foreground text-sm">Card Content</p>
    </CardContent>
    <CardFooter>
      <span class="text-muted-foreground text-xs">Card Footer</span>
    </CardFooter>
  </Card>
);

export const cardDocPage = createGenericDocPage({
  slug: "card",
  title: "Card",
  previewCode: LOGIN_DEMO_CODE,
  usageLabel:
    "Surface for grouped content and actions — shadcn-aligned slots, `size=\"sm\"`, header grid with `CardAction`, image hero, and RTL.",
  installationText: "Import Card and subcomponents from `@/components/kamod-ui/card`.",
  installationExample: {
    code: USAGE_SNIPPET,
    renderPreview: () => <InstallationUsagePreview />
  },
  usageText:
    "Compose `CardHeader` (title, description, optional `CardAction`), `CardContent`, and `CardFooter`. Set `size=\"sm\"` on `Card` for tighter padding. For cover images, use `class=\"pt-0\"` on the card and place the image as the first block; pair with `DirectionProvider` for RTL layouts.",
  exampleSections: [
    {
      id: "card-demo",
      title: "Demo",
      text: "Login-style layout with header action, form fields, and stacked footer buttons (shadcn CardDemo).",
      code: LOGIN_DEMO_CODE,
      renderPreview: () => <CardDemoPreview />
    },
    {
      id: "card-size",
      title: "Size",
      text: "Use `size=\"sm\"` for reduced vertical padding and smaller type scale on the card.",
      code: `import { Button } from "@/components/kamod-ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/kamod-ui/card";

export const Example = () => (
  <Card size="sm" class="mx-auto w-full max-w-sm">
    <CardHeader>
      <CardTitle>Small Card</CardTitle>
      <CardDescription>
        This card uses the small size variant.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p>
        The card component supports a size prop that can be set to
        &quot;sm&quot; for a more compact appearance.
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="sm" class="w-full">
        Action
      </Button>
    </CardFooter>
  </Card>
);`,
      renderPreview: () => <CardSmallPreview />
    },
    {
      id: "card-image",
      title: "Image",
      text: "Hero image with overlay, badge action in the header, and a full-width primary button (shadcn CardImage).",
      code: `import { Badge } from "@/components/kamod-ui/badge";
import { Button } from "@/components/kamod-ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/kamod-ui/card";

export const Example = () => (
  <Card class="relative mx-auto w-full max-w-sm pt-0">
    <div class="absolute inset-0 z-30 aspect-video bg-black/35" />
    <img
      src="https://avatar.vercel.sh/shadcn1"
      alt="Event cover"
      class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
    />
    <CardHeader>
      <CardAction>
        <Badge variant="secondary">Featured</Badge>
      </CardAction>
      <CardTitle>Design systems meetup</CardTitle>
      <CardDescription>
        A practical talk on component APIs, accessibility, and shipping
        faster.
      </CardDescription>
    </CardHeader>
    <CardFooter>
      <Button class="w-full">View Event</Button>
    </CardFooter>
  </Card>
);`,
      renderPreview: () => <CardImagePreview />
    },
    {
      id: "card-rtl",
      title: "RTL",
      text: "English, Arabic, and Hebrew samples with `DirectionProvider` and logical `ms-auto` on the forgot-password link (shadcn RTL guide).",
      code: `import { useState } from "preact/hooks";
import { Button } from "@/components/kamod-ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/kamod-ui/card"
import { DirectionProvider } from "@/components/kamod-ui/direction"
import { Input } from "@/components/kamod-ui/input"
import { Label } from "@/components/kamod-ui/label";

/* …translations en / ar / he… */

export const Example = () => {
  const [lang, setLang] = useState<"en" | "ar" | "he">("ar");
  const t = translations[lang];
  return (
    <DirectionProvider direction={t.dir}>
      <Card class="w-full max-w-sm" dir={t.dir}>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
          <CardAction>
            <Button variant="link">{t.signUp}</Button>
          </CardAction>
        </CardHeader>
        <CardContent>{/* form + ms-auto link */}</CardContent>
        <CardFooter class="flex-col gap-2">{/* buttons */}</CardFooter>
      </Card>
    </DirectionProvider>
  );
};`,
      renderPreview: () => <CardRtlPreview />
    }
  ],
  apiRows: [
    { prop: "Card `size`", type: "`\"default\"` | `\"sm\"`", defaultValue: "`\"default\"`" },
    { prop: "Card `class`", type: "string", defaultValue: "undefined" },
    { prop: "CardHeader `class`", type: "string", defaultValue: "undefined" },
    { prop: "CardTitle `class`", type: "string", defaultValue: "undefined" },
    { prop: "CardDescription `class`", type: "string", defaultValue: "undefined" },
    { prop: "CardAction `class`", type: "string", defaultValue: "undefined" },
    { prop: "CardContent `class`", type: "string", defaultValue: "undefined" },
    { prop: "CardFooter `class`", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText:
    "Keep headings concise; ensure `CardAction` controls have visible labels. When using image cards, provide meaningful `alt` text. For RTL, set `dir` on the card and wrap with `DirectionProvider` so spacing utilities resolve correctly."
});
