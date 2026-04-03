import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Label,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_DIGITS_AND_CHARS
} from "@kamod-ui/core";
import { RefreshCw } from "lucide-preact";
import { useState } from "preact/hooks";
import { createGenericDocPage } from "./create-generic-doc-page";

const slots6 = [0, 1, 2, 3, 4, 5] as const;

function InputOTPDemo() {
  return (
    <InputOTP maxLength={6} defaultValue="123456">
      <InputOTPGroup>
        {slots6.map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}

function ControlledOtpPreview() {
  const [value, setValue] = useState("");
  return (
    <div class="space-y-2">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          {slots6.map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p class="text-center text-sm text-muted-foreground">
        {value === "" ? "Enter your one-time password." : <>You entered: {value}</>}
      </p>
    </div>
  );
}

export const inputOtpDocPage = createGenericDocPage({
  slug: "input-otp",
  title: "Input OTP",
  usageLabel:
    "One-time passcodes with per-character slots, overlay input, patterns (digits / alphanumeric), and shadcn-parity examples.",
  installationText:
    "Import InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator and optional REGEXP_ONLY_DIGITS from `@/components/kamod-ui/input-otp`.",
  usageText:
    "Render one InputOTPSlot per index (0 … maxLength−1). Typing updates all slots from a single transparent input. Use pattern with REGEXP_ONLY_DIGITS or REGEXP_ONLY_DIGITS_AND_CHARS. onChange and onValueChange both receive the string.",
  exampleSections: [
    {
      id: "otp-demo",
      title: "Demo",
      text: "Six slots with defaultValue (shadcn InputOTPDemo).",
      code: `import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/kamod-ui/input-otp";

const slots = [0, 1, 2, 3, 4, 5] as const;

export const Example = () => (
  <InputOTP maxLength={6} defaultValue="123456">
    <InputOTPGroup>
      {slots.map((i) => (
        <InputOTPSlot key={i} index={i} />
      ))}
    </InputOTPGroup>
  </InputOTP>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTPDemo />
        </div>
      )
    },
    {
      id: "otp-usage",
      title: "Usage",
      text: "Group + separator pattern for 3+3 codes.",
      code: `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/kamod-ui/input-otp";

const slots = [0, 1, 2, 3, 4, 5] as const;

export const Example = () => (
  <InputOTP maxLength={6}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    },
    {
      id: "otp-pattern",
      title: "Pattern",
      text: "Digits-only or alphanumeric filtering via exported RegExp constants.",
      code: `import { REGEXP_ONLY_DIGITS } from "lucide-preact"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/kamod-ui/input-otp"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="grid w-fit gap-2">
    <Label htmlFor="digits-only">Digits only</Label>
    <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-fit gap-2">
          <Label htmlFor="digits-only-otp">Digits only</Label>
          <InputOTP id="digits-only-otp" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
            <InputOTPGroup>
              {slots6.map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    },
    {
      id: "otp-separator-multi",
      title: "Separator",
      text: "Multiple groups and separators (2+2+2).",
      code: `// Three groups of two slots with InputOTPSeparator between — see preview`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    },
    {
      id: "otp-disabled",
      title: "Disabled",
      text: "disabled + value shows a filled, non-editable code.",
      code: `import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/kamod-ui/input-otp";

export const Example = () => (
  <InputOTP id="disabled" maxLength={6} disabled value="123456">
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTP id="otp-disabled-doc" maxLength={6} disabled value="123456">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    },
    {
      id: "otp-controlled",
      title: "Controlled",
      text: "value + onChange (or onValueChange) with live hint text.",
      code: `import { useState } from "preact/hooks";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/kamod-ui/input-otp";

export const Example = () => {
  const [value, setValue] = useState("");
  return (
    <div class="space-y-2">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p class="text-center text-sm text-muted-foreground">
        {value === "" ? "Enter your one-time password." : <>You entered: {value}</>}
      </p>
    </div>
  );
};`,
      renderPreview: () => <ControlledOtpPreview />
    },
    {
      id: "otp-invalid",
      title: "Invalid",
      text: "Pass aria-invalid on slots for error styling (manual / server validation).",
      code: `// <InputOTPSlot index={0} aria-invalid class="border-destructive" />`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTP maxLength={6} value="000000" onChange={() => {}}>
            <InputOTPGroup>
              <InputOTPSlot index={0} aria-invalid class="border-destructive aria-invalid:ring-destructive/40" />
              <InputOTPSlot index={1} aria-invalid class="border-destructive aria-invalid:ring-destructive/40" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} aria-invalid class="border-destructive aria-invalid:ring-destructive/40" />
              <InputOTPSlot index={3} aria-invalid class="border-destructive aria-invalid:ring-destructive/40" />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} aria-invalid class="border-destructive aria-invalid:ring-destructive/40" />
              <InputOTPSlot index={5} aria-invalid class="border-destructive aria-invalid:ring-destructive/40" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    },
    {
      id: "otp-four",
      title: "Four digits",
      text: "PIN length 4 with digits pattern.",
      code: `import { REGEXP_ONLY_DIGITS } from "lucide-preact"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/kamod-ui/input-otp";

export const Example = () => (
  <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
    </InputOTPGroup>
  </InputOTP>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    },
    {
      id: "otp-alphanumeric",
      title: "Alphanumeric",
      text: "REGEXP_ONLY_DIGITS_AND_CHARS for mixed codes.",
      code: `import { REGEXP_ONLY_DIGITS_AND_CHARS } from "lucide-preact"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/kamod-ui/input-otp";

export const Example = () => (
  <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
);`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    },
    {
      id: "otp-form",
      title: "Form",
      text: "Verification card layout (shadcn InputOTPForm) with larger slots via group class.",
      code: `// Card + Label + InputOTP with InputOTPGroup className for h-12 w-11 text-xl slots`,
      renderPreview: () => (
        <Card class="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify your login</CardTitle>
            <CardDescription>
              Enter the code we sent to <span class="font-medium">m@example.com</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid gap-2">
              <div class="flex items-center justify-between gap-2">
                <Label htmlFor="otp-verification-doc">Verification code</Label>
                <Button variant="outline" size="xs" type="button" class="shrink-0 gap-1">
                  <RefreshCw class="size-3.5" />
                  Resend
                </Button>
              </div>
              <InputOTP maxLength={6} id="otp-verification-doc">
                <InputOTPGroup class="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator class="mx-2" />
                <InputOTPGroup class="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <p class="text-muted-foreground text-sm">
                <a href="#otp-form" class="underline underline-offset-4">
                  I no longer have access to this email.
                </a>
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="button" class="w-full">
              Verify
            </Button>
          </CardFooter>
        </Card>
      )
    },
    {
      id: "otp-rtl",
      title: "RTL",
      text: "Set dir=\"rtl\" on InputOTP for right-to-left entry.",
      code: `import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/kamod-ui/input-otp"
import { Label } from "@/components/kamod-ui/label";

export const Example = () => (
  <div class="grid w-fit gap-2">
    <Label htmlFor="otp-rtl">رمز التحقق</Label>
    <InputOTP maxLength={6} defaultValue="123456" dir="rtl" id="otp-rtl">
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  </div>
);`,
      renderPreview: () => (
        <div class="grid w-fit gap-2">
          <Label htmlFor="otp-rtl-doc">رمز التحقق</Label>
          <InputOTP maxLength={6} defaultValue="123456" dir="rtl" id="otp-rtl-doc">
            <InputOTPGroup>
              {slots6.map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "maxLength", type: "number", defaultValue: "6" },
    { prop: "value / defaultValue", type: "string", defaultValue: "—" },
    { prop: "onChange / onValueChange", type: "(v: string) => void", defaultValue: "—" },
    { prop: "pattern", type: "RegExp", defaultValue: "—" },
    { prop: "InputOTPSlot index", type: "number", defaultValue: "required" },
    { prop: "REGEXP_ONLY_DIGITS / REGEXP_ONLY_DIGITS_AND_CHARS", type: "RegExp", defaultValue: "exported" }
  ],
  accessibilityText:
    "A single focusable input covers the slots; use a visible Label and htmlFor when possible. autoComplete defaults to one-time-code. Do not auto-submit before the user confirms the code."
});
