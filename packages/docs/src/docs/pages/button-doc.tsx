import { Button, ButtonGroup, DirectionProvider, Spinner } from "@kamod-ch/ui";
import { ArrowRight, ArrowUp, ArrowUpRight, GitBranch, Plus } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import type { DocPageModule } from "../types";

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<
  Lang,
  {
    dir: "ltr" | "rtl";
    label: string;
    button: string;
    submit: string;
    delete: string;
    loading: string;
  }
> = {
  en: {
    dir: "ltr",
    label: "English (LTR)",
    button: "Button",
    submit: "Submit",
    delete: "Delete",
    loading: "Loading",
  },
  ar: {
    dir: "rtl",
    label: "العربية (RTL)",
    button: "زر",
    submit: "إرسال",
    delete: "حذف",
    loading: "جاري التحميل",
  },
  he: {
    dir: "rtl",
    label: "עברית (RTL)",
    button: "כפתור",
    submit: "שלח",
    delete: "מחק",
    loading: "טוען",
  },
};

function ButtonRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-2xl flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        {(["en", "ar", "he"] as const).map((key) => (
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
        <div class="flex flex-wrap items-center gap-2 md:flex-row" dir={t.dir}>
          <Button variant="outline">{t.button}</Button>
          <Button variant="destructive">{t.delete}</Button>
          <Button variant="outline">
            {t.submit}{" "}
            <ArrowRight class={t.dir === "rtl" ? "rotate-180" : ""} data-icon="inline-end" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Add">
            <Plus />
          </Button>
          <Button variant="secondary" disabled>
            <Spinner data-icon="inline-start" size="sm" tone="muted" />
            {t.loading}
          </Button>
        </div>
      </DirectionProvider>
    </div>
  );
}

const cursorCssSnippet = `@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}`;

const heroCode = `import { ArrowUp } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <div class="flex flex-wrap items-center gap-2 md:flex-row">
    <Button variant="outline">Button</Button>
    <Button variant="outline" size="icon" aria-label="Submit">
      <ArrowUp />
    </Button>
  </div>
);`;

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  size: {
    preview: () => (
      <div class="flex flex-col items-start gap-8 sm:flex-row">
        <div class="flex items-start gap-2">
          <Button size="xs" variant="outline">
            Extra Small
          </Button>
          <Button size="icon-xs" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
        <div class="flex items-start gap-2">
          <Button size="sm" variant="outline">
            Small
          </Button>
          <Button size="icon-sm" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
        <div class="flex items-start gap-2">
          <Button variant="outline">Default</Button>
          <Button size="icon" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
        <div class="flex items-start gap-2">
          <Button variant="outline" size="lg">
            Large
          </Button>
          <Button size="icon-lg" aria-label="Submit" variant="outline">
            <ArrowUpRight />
          </Button>
        </div>
      </div>
    ),
    code: `import { ArrowUpRight } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <div class="flex flex-col items-start gap-8 sm:flex-row">
    <div class="flex items-start gap-2">
      <Button size="xs" variant="outline">Extra Small</Button>
      <Button size="icon-xs" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
    <div class="flex items-start gap-2">
      <Button size="sm" variant="outline">Small</Button>
      <Button size="icon-sm" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline">Default</Button>
      <Button size="icon" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
    <div class="flex items-start gap-2">
      <Button variant="outline" size="lg">Large</Button>
      <Button size="icon-lg" aria-label="Submit" variant="outline"><ArrowUpRight /></Button>
    </div>
  </div>
);`,
  },
  default: {
    preview: () => <Button>Button</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button>Button</Button>;`,
  },
  outline: {
    preview: () => <Button variant="outline">Outline</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="outline">Outline</Button>;`,
  },
  secondary: {
    preview: () => <Button variant="secondary">Secondary</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="secondary">Secondary</Button>;`,
  },
  inverse: {
    preview: () => <Button variant="inverse">Inverse</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="inverse">Inverse</Button>;`,
  },
  ghost: {
    preview: () => <Button variant="ghost">Ghost</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="ghost">Ghost</Button>;`,
  },
  destructive: {
    preview: () => <Button variant="destructive">Destructive</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="destructive">Destructive</Button>;`,
  },
  link: {
    preview: () => <Button variant="link">Link</Button>,
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => <Button variant="link">Link</Button>;`,
  },
  icon: {
    preview: () => (
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUp />
      </Button>
    ),
    code: `import { ArrowUp } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button variant="outline" size="icon" aria-label="Submit">
    <ArrowUp />
  </Button>
);`,
  },
  "with-icon": {
    preview: () => (
      <Button variant="outline" size="sm">
        <GitBranch data-icon="inline-start" />
        New branch
      </Button>
    ),
    code: `import { GitBranch } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button variant="outline" size="sm">
    <GitBranch data-icon="inline-start" />
    New branch
  </Button>
);`,
  },
  rounded: {
    preview: () => (
      <div class="flex flex-col gap-8">
        <Button variant="outline" size="icon" class="rounded-full" aria-label="Submit">
          <ArrowUp />
        </Button>
      </div>
    ),
    code: `import { ArrowUp } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button variant="outline" size="icon" class="rounded-full" aria-label="Submit">
    <ArrowUp />
  </Button>
);`,
  },
  spinner: {
    preview: () => (
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" size="sm" tone="muted" />
          Generating
        </Button>
        <Button variant="secondary" disabled>
          Downloading
          <Spinner data-icon="inline-end" size="sm" tone="muted" />
        </Button>
      </div>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { Spinner } from "@/components/kamod-ui/spinner";

export const Example = () => (
  <div class="flex gap-2">
    <Button variant="outline" disabled>
      <Spinner data-icon="inline-start" size="sm" tone="muted" />
      Generating
    </Button>
    <Button variant="secondary" disabled>
      Downloading
      <Spinner data-icon="inline-end" size="sm" tone="muted" />
    </Button>
  </div>
);`,
  },
  "button-group": {
    preview: () => (
      <ButtonGroup>
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
        <Button variant="outline">Snooze</Button>
      </ButtonGroup>
    ),
    code: `import { Button } from "@/components/kamod-ui/button"
import { ButtonGroup } from "@/components/kamod-ui/button-group";

export const Example = () => (
  <ButtonGroup>
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
    <Button variant="outline">Snooze</Button>
  </ButtonGroup>
);`,
  },
  "as-child": {
    preview: () => (
      <Button asChild>
        <a href="#login">Login</a>
      </Button>
    ),
    code: `import { Button } from "@/components/kamod-ui/button";

export const Example = () => (
  <Button asChild>
    <a href="/login">Login</a>
  </Button>
);`,
  },
  rtl: {
    preview: () => <ButtonRtlDemo />,
    code: `import { ArrowRight, Plus } from "lucide-preact";
import { Button } from "@/components/kamod-ui/button";
import { DirectionProvider } from "@/components/kamod-ui/direction";
import { Spinner } from "@/components/kamod-ui/spinner";
// Wrap row in DirectionProvider; mirror directional icons with rotate-180 in RTL.`,
  },
};

const buttonApiRows: Array<{ prop: string; type: string; defaultValue: string }> = [
  {
    prop: "variant",
    type: '"default" | "outline" | "ghost" | "destructive" | "secondary" | "inverse" | "link"',
    defaultValue: '"default"',
  },
  {
    prop: "size",
    type: '"default" | "xxs" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
    defaultValue: '"default"',
  },
  {
    prop: "asChild",
    type: "boolean",
    defaultValue: "false",
  },
];

export const buttonDocPage: DocPageModule = {
  slug: "button",
  title: "Button",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Primary actions with variants and sizes; icons via data-icon; asChild for links; pairs with ButtonGroup and Spinner (shadcn Button pattern).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Button from `@/components/kamod-ui/button`. Use variant and size props; optional asChild to merge styles onto a child element (for example an anchor).",
    },
    {
      id: "cursor",
      title: "Cursor",
      text: "**Keep Pointer Feedback Consistent.** Kamod `Button` supplies `cursor-pointer` and a disabled cursor treatment. The CSS example below is for native buttons outside that component, allowing you to decide whether the same pointer convention should apply across your application.\n\nA cursor is a visual hint, not an interaction contract; disabled behavior, accessible names and keyboard activation still need to come from the element and its props.",
    },
    {
      id: "size",
      title: "Size",
      text: "**Choose Density by Context.** Set `size` to choose the button's height and padding, pairing text sizes with their corresponding icon sizes. The additional `xxs` option supports unusually dense interfaces; the grid compares the more commonly used sizes.\n\nMatch icon-only controls to adjacent text buttons and test longer labels; a smaller visual size should not make frequent touch actions difficult to activate.",
    },
    {
      id: "default",
      title: "Default",
      text: "**Give the Primary Action a Clear Priority.** Use the default `Button` variant for a filled action that stands out against the surrounding surface. Its theme tokens supply the emphasis, leaving the label to describe the concrete result of activating it.\n\nKeep nearby alternatives quieter and choose a verb that describes the outcome; visual emphasis does not replace a meaningful button label.",
    },
    {
      id: "outline",
      title: "Outline",
      text: '**Offer a Visible Secondary Action.** Set `variant="outline"` to give a secondary action a defined border without a strong filled surface. It can sit beside the default variant or in a toolbar where several actions deserve similar emphasis.\n\nThis works well for cancel, review and utility actions; check its separation from the surrounding surface in both themes, especially inside cards or grouped controls.',
    },
    {
      id: "secondary",
      title: "Secondary",
      text: '**Keep Supporting Actions Easy to Find.** Set `variant="secondary"` for a supporting action with a muted fill. This sits between an outlined or ghost treatment and the primary action, giving related choices a visible target without equal visual priority.\n\nUse it consistently for equivalent choices and avoid implying a disabled state through low contrast; an available action should still look usable.',
    },
    {
      id: "inverse",
      title: "Inverse",
      text: '**Use Contrast Sparingly.** Set `variant="inverse"` for a filled control that reverses the foreground/background relationship. Because those tokens respond to the theme, the comparison should be reviewed in both light and dark appearances.\n\nCheck both themes and nearby controls before adopting it; a high-contrast button should reflect a real priority rather than decorate every action.',
    },
    {
      id: "ghost",
      title: "Ghost",
      text: '**Reduce Visual Weight in Dense Interfaces.** Set `variant="ghost"` to reduce the button\'s resting surface while retaining its interactive states. This suits repeated toolbar actions where a full border around every control would compete with the content.\n\nKeep the label or icon recognizable at rest and preserve keyboard focus; discoverability should not depend entirely on hovering over an otherwise invisible target.',
    },
    {
      id: "destructive",
      title: "Destructive",
      text: '**Name the Irreversible Operation.** Use `variant="destructive"` for an operation such as deleting a record. The color communicates severity, while the click handler and any [Alert Dialog](/docs/alert-dialog/installation) determine what actually happens before the operation proceeds.\n\nUse a specific confirmation label that names the affected record, and define what happens while deletion is pending or fails. If the operation is recoverable, explain the recovery path where the result is shown.',
    },
    {
      id: "link",
      title: "Link",
      text: '**Separate Appearance from Semantics.** Set `variant="link"` for an underlined treatment with the visual weight of inline navigation. The style does not itself change the rendered element; use [As Child](#as-child) when the destination should be a real anchor.\n\nCheck the resulting element in the Code view before copying it. Navigation should support ordinary link behavior, including opening another tab; a local operation should use a named button with an appropriate `type` inside a form.',
    },
    {
      id: "icon",
      title: "Icon",
      text: '**Name the Action without Visible Text.** Combine an icon size with an explicit accessible name, such as `aria-label="Open settings"`, when the button has no visible text. The symbol stays compact while the name explains the action to assistive technology.\n\nKeep the icon\'s meaning consistent, and use an appropriate size for its context rather than shrinking the target to the graphic itself.',
    },
    {
      id: "with-icon",
      title: "With Icon",
      text: '**Use the Icon to Support the Verb.** Mark a leading icon with `data-icon="inline-start"` or a trailing one with `data-icon="inline-end"`. The button uses that position to balance spacing, so icon-and-label combinations need fewer manual padding adjustments.\n\nKeep the text understandable on its own, hide purely decorative graphics from assistive technology, and use logical placement so spacing remains consistent in translated layouts.',
    },
    {
      id: "rounded",
      title: "Rounded",
      text: "**Change the Silhouette without Changing the Action.** Apply `rounded-full` through `class` for a pill-shaped text button or a circular icon control. This changes the silhouette while the existing `variant` and `size` continue to determine emphasis and density.\n\nRetain the same focus and disabled behavior as other buttons, and use the shape consistently rather than mixing radii without a hierarchy.",
    },
    {
      id: "spinner",
      title: "Spinner",
      text: "**Show Progress without Inviting Duplicate Work.** Place `Spinner` next to a meaningful loading label and use `data-icon` to keep its spacing aligned. Connect this presentation to the real pending state so the example's visual feedback represents actual work.\n\nRestore an actionable state after failure, and communicate the result separately; a spinner alone cannot explain whether the request succeeded.",
    },
    {
      id: "button-group",
      title: "Button Group",
      text: "**Keep Related Operations Together.** Wrap related actions in [ButtonGroup](/docs/button-group/installation) to coordinate their borders and spacing. Use the group's composition patterns when actions form one local task, rather than manually removing each button's corner radius.\n\nInspect the individual actions as well as their joined appearance: each still needs a clear label and its own handler. If pressing a control should leave a setting selected, compare [Toggle Group](/docs/toggle-group/installation) instead.",
    },
    {
      id: "as-child",
      title: "As Child",
      text: "**Style the Element that Actually Performs the Action.** Set `asChild` when a compatible child should receive the button's styles instead of rendering another button around it. An anchor can then look like a primary action while retaining normal link navigation behavior.\n\nAvoid nested interactive elements, pass the destination to the child, and check that forwarded attributes reach the real focusable element.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Share direction through `DirectionProvider` and review icons whose meaning depends on pointing left or right. A utility such as `rotate-180` can mirror a directional arrow without changing the label or action.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
    },
    { id: "api-reference", title: "API Reference", text: "Button props and accepted values." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return (
          <ApiReference
            sections={[
              {
                title: "Button",
                description:
                  "Wrapper around button (or anchor with href) that applies variant and size tokens.",
                rows: buttonApiRows,
              },
            ]}
          />
        );
      }
      if (sectionId === "cursor") {
        return <CodeBlock code={cursorCssSnippet} language="css" />;
      }
      if (sectionId === "installation") {
        return (
          <div class="grid gap-3">
            <CodeBlock
              code={`import { Button } from "@/components/kamod-ui/button";`}
              language="tsx"
            />
            <CodeBlock code={`<Button variant="outline">Button</Button>`} language="tsx" />
          </div>
        );
      }
      const block = sectionBlocks[sectionId];
      if (!block) {
        return null;
      }
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code,
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: (
            <div class="flex flex-wrap items-center gap-2 md:flex-row">
              <Button variant="outline">Button</Button>
              <Button variant="outline" size="icon" aria-label="Submit">
                <ArrowUp />
              </Button>
            </div>
          ),
          codeSnippet: heroCode,
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
