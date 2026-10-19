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
  REGEXP_ONLY_DIGITS_AND_CHARS,
} from "@kamod-ch/ui";
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
      text: "**Match the Code Length to the Actual Challenge.** Use six `InputOTPSlot` positions to display one code value, optionally prefilled through `defaultValue`. The slots divide the presentation into readable characters while the verification flow still treats the code as one input.\n\nSupport a clear verification and retry flow, and avoid treating a fully filled input as proof that the code is valid.",
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
      ),
    },
    {
      id: "otp-usage",
      title: "Usage",
      text: "**Group Characters to Help Scanning.** Arrange two groups of three slots with a separator to make a six-character code easier to scan. The visual grouping does not add a separator character to the code that the user enters or submits.\n\nKeep the group structure consistent with the message users receive, and test pasting a complete code as well as entering each character individually.",
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
      ),
    },
    {
      id: "otp-pattern",
      title: "Pattern",
      text: "**Filter Entry without Replacing Verification.** Pass an exported pattern constant to restrict the permitted characters, choosing digits or a mixed alphanumeric code. Keep that restriction consistent with the actual code issued by the service rather than only its visual example.\n\nExplain the accepted alphabet, handle incomplete entry clearly, and avoid rejecting legitimate characters merely because the visual example uses digits.",
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
      ),
    },
    {
      id: "otp-separator-multi",
      title: "Separator",
      text: "**Choose a Rhythm that Matches the Source.** Split six slots into three groups of two when that rhythm matches the code users receive. Separators improve recognition of the displayed pattern while the stored value remains a single sequence of characters.\n\nKeep separator marks decorative, preserve a single logical value, and verify that pasting and keyboard editing work naturally across group boundaries.",
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
      ),
    },
    {
      id: "otp-disabled",
      title: "Disabled",
      text: "**Explain When Verification Cannot Proceed.** Combine `disabled` with an existing `value` to show a code that is currently unavailable for editing. The filled slots preserve context, while the surrounding message should explain whether verification is pending or the entry step has ended.\n\nRestore an editable path after a recoverable error and avoid leaving a stale code visible as if verification had succeeded.",
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
      ),
    },
    {
      id: "otp-controlled",
      title: "Controlled",
      text: "**Keep Feedback Derived from the Entered Code.** Pass `value` and update it through `onChange` or `onValueChange` when a parent owns code entry. Derive any length or completion hint from that value so the feedback remains synchronized with the visible slots.\n\nUse the same value for display and submission, and keep request state separate so an in-flight response cannot incorrectly validate a later edit.",
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
      renderPreview: () => <ControlledOtpPreview />,
    },
    {
      id: "otp-invalid",
      title: "Invalid",
      text: "**Provide a Useful Retry Message.** Apply `aria-invalid` to the slots when validation rejects the entered code and show the reason nearby. Visual error styling communicates which entry needs attention, while your validation flow decides whether another attempt is allowed.\n\nDecide whether to preserve the entered value for correction or clear it deliberately, and keep focus behavior predictable after the failure.",
      code: `// <InputOTPSlot index={0} aria-invalid class="border-destructive" />`,
      renderPreview: () => (
        <div class="flex justify-center py-2">
          <InputOTP maxLength={6} value="000000" onChange={() => {}}>
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                aria-invalid
                class="border-destructive aria-invalid:ring-destructive/40"
              />
              <InputOTPSlot
                index={1}
                aria-invalid
                class="border-destructive aria-invalid:ring-destructive/40"
              />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot
                index={2}
                aria-invalid
                class="border-destructive aria-invalid:ring-destructive/40"
              />
              <InputOTPSlot
                index={3}
                aria-invalid
                class="border-destructive aria-invalid:ring-destructive/40"
              />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot
                index={4}
                aria-invalid
                class="border-destructive aria-invalid:ring-destructive/40"
              />
              <InputOTPSlot
                index={5}
                aria-invalid
                class="border-destructive aria-invalid:ring-destructive/40"
              />
            </InputOTPGroup>
          </InputOTP>
        </div>
      ),
    },
    {
      id: "otp-four",
      title: "Four Digits",
      text: "**Use Four Slots Only for a Four-Character Contract.** Use four slots and a digits pattern when the issued PIN has exactly four numeric characters. The number of visible slots should match the expected value, avoiding an interface that suggests extra characters are required.\n\nLabel the field, support paste and provide a clear retry route; a shorter visual pattern does not define security requirements.",
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
      ),
    },
    {
      id: "otp-alphanumeric",
      title: "Alphanumeric",
      text: "**Make the Accepted Alphabet Clear.** Use `REGEXP_ONLY_DIGITS_AND_CHARS` when the verification code may contain letters as well as numbers. Explain that format before entry so users do not mistake alphabetic characters for a numeric-only PIN.\n\nKeep the displayed groups readable and test pasted values; input filtering should prevent obvious mistakes without silently changing a valid code into a different value.",
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
      ),
    },
    {
      id: "otp-form",
      title: "Form",
      text: "**Build the Surrounding Verification Journey.** Place the OTP entry in a verification card with instructions and an explicit action. Larger slots can improve readability, while the surrounding form explains which code to enter and what happens when it is submitted.\n\nConnect submission to actual verification, provide pending and failure feedback, and make resend or change-destination actions distinct from confirming the current code.",
      code: `// Card + Label + InputOTP with InputOTPGroup className for h-12 w-11 text-xl slots`,
      renderPreview: () => (
        <Card class="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Verify Your Login</CardTitle>
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
      ),
    },
    {
      id: "otp-rtl",
      title: "RTL",
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on `InputOTP` when the intended entry order is right to left. Verify the code format with the actual delivery channel, since a translated interface does not automatically imply that every code reverses direction.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
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
      ),
    },
  ],
  apiRows: [
    { prop: "maxLength", type: "number", defaultValue: "6" },
    { prop: "value / defaultValue", type: "string", defaultValue: "—" },
    { prop: "onChange / onValueChange", type: "(v: string) => void", defaultValue: "—" },
    { prop: "pattern", type: "RegExp", defaultValue: "—" },
    { prop: "InputOTPSlot index", type: "number", defaultValue: "required" },
    {
      prop: "REGEXP_ONLY_DIGITS / REGEXP_ONLY_DIGITS_AND_CHARS",
      type: "RegExp",
      defaultValue: "exported",
    },
  ],
  accessibilityText:
    "A single focusable input covers the slots; use a visible Label and htmlFor when possible. autoComplete defaults to one-time-code. Do not auto-submit before the user confirms the code.",
});
