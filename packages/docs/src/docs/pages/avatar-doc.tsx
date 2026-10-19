import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Button,
  DirectionProvider,
  Dropdown,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
} from "@kamod-ch/ui";
import { Plus } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
import {
  SMART_AVATAR_ANIMATED_FALLBACK_CODE,
  SMART_AVATAR_GENERATED_FALLBACK_CODE,
  SmartAvatarAnimatedFallbackPreview,
  SmartAvatarGeneratedFallbackPreview,
} from "../examples/avatar";
import type { DocPageModule } from "../types";

function AvatarHeroDemo() {
  return (
    <div class="flex flex-row flex-wrap items-center justify-center gap-6 md:gap-12">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <AvatarFallback>ER</AvatarFallback>
        <AvatarBadge class="bg-green-600 dark:bg-green-800" />
      </Avatar>
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}

const heroCode = `import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <div class="flex flex-row flex-wrap items-center gap-6 md:gap-12">
    <Avatar>…</Avatar>
    <Avatar>…<AvatarBadge class="bg-green-600 dark:bg-green-800" /></Avatar>
    <AvatarGroup class="grayscale">…<AvatarGroupCount>+3</AvatarGroupCount></AvatarGroup>
  </div>
);`;

type Lang = "en" | "ar" | "he";

const rtlCopy: Record<Lang, { dir: "ltr" | "rtl"; label: string; moreUsers: string }> = {
  en: { dir: "ltr", label: "English (LTR)", moreUsers: "+3" },
  ar: { dir: "rtl", label: "العربية (RTL)", moreUsers: "+٣" },
  he: { dir: "rtl", label: "עברית (RTL)", moreUsers: "+3" },
};

function AvatarRtlDemo() {
  const [lang, setLang] = useState<Lang>("ar");
  const t = rtlCopy[lang];

  return (
    <div class="flex w-full max-w-3xl flex-col gap-3">
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
        <div class="flex flex-row flex-wrap items-center gap-6 md:gap-12" dir={t.dir}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
            <AvatarBadge class="bg-green-600 dark:bg-green-800" />
          </Avatar>
          <AvatarGroup class="grayscale">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
              <AvatarFallback>LR</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>{t.moreUsers}</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </DirectionProvider>
    </div>
  );
}

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  basic: {
    preview: () => (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" class="grayscale" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);`,
  },
  "generated-fallback": {
    preview: () => <SmartAvatarGeneratedFallbackPreview />,
    code: SMART_AVATAR_GENERATED_FALLBACK_CODE,
  },
  "animated-fallback": {
    preview: () => <SmartAvatarAnimatedFallbackPreview />,
    code: SMART_AVATAR_ANIMATED_FALLBACK_CODE,
  },
  badge: {
    preview: () => (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge class="bg-green-600 dark:bg-green-800" />
      </Avatar>
    ),
    code: `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge class="bg-green-600 dark:bg-green-800" />
  </Avatar>
);`,
  },
  "badge-icon": {
    preview: () => (
      <Avatar class="grayscale">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
        <AvatarBadge>
          <Plus />
        </AvatarBadge>
      </Avatar>
    ),
    code: `import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";
import { Plus } from "lucide-preact";

export const Example = () => (
  <Avatar class="grayscale">
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
    <AvatarBadge>
      <Plus />
    </AvatarBadge>
  </Avatar>
);`,
  },
  group: {
    preview: () => (
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    ),
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <AvatarGroup class="grayscale">
    <Avatar>…</Avatar>
    <Avatar>…</Avatar>
    <Avatar>…</Avatar>
  </AvatarGroup>
);`,
  },
  "group-count": {
    preview: () => (
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    ),
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <AvatarGroup class="grayscale">
    …
    <AvatarGroupCount>+3</AvatarGroupCount>
  </AvatarGroup>
);`,
  },
  "group-count-icon": {
    preview: () => (
      <AvatarGroup class="grayscale">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>
          <Plus />
        </AvatarGroupCount>
      </AvatarGroup>
    ),
    code: `import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";
import { Plus } from "lucide-preact";

export const Example = () => (
  <AvatarGroup class="grayscale">
    …
    <AvatarGroupCount>
      <Plus />
    </AvatarGroupCount>
  </AvatarGroup>
);`,
  },
  sizes: {
    preview: () => (
      <div class="flex flex-wrap items-center gap-2 grayscale">
        <Avatar size="sm">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <div class="flex flex-wrap gap-2 grayscale">
    <Avatar size="sm">…</Avatar>
    <Avatar>…</Avatar>
    <Avatar size="lg">…</Avatar>
  </div>
);`,
  },
  dropdown: {
    preview: () => (
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant="ghost" size="icon" class="rounded-full" aria-label="Account menu">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownTrigger>
        <DropdownContent class="w-40">
          <DropdownGroup>
            <DropdownItem>Profile</DropdownItem>
            <DropdownItem>Billing</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
          </DropdownGroup>
          <DropdownSeparator />
          <DropdownGroup>
            <DropdownItem variant="destructive">Log out</DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>
    ),
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar"
import { Button } from "@/components/kamod-ui/button"
import { Dropdown, DropdownContent, DropdownGroup, DropdownItem, DropdownSeparator, DropdownTrigger } from "@/components/kamod-ui/dropdown";

export const Example = () => (
  <Dropdown>
    <DropdownTrigger asChild>
      <Button variant="ghost" size="icon" class="rounded-full" aria-label="Account menu">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownTrigger>
    <DropdownContent class="w-40">…</DropdownContent>
  </Dropdown>
);`,
  },
  rtl: {
    preview: () => <AvatarRtlDemo />,
    code: `import { Avatar, AvatarGroup, AvatarGroupCount } from "@/components/kamod-ui/avatar"
import { DirectionProvider } from "@/components/kamod-ui/direction";
// Set dir on the flex row; localize AvatarGroupCount (e.g. +٣).`,
  },
};

const apiSections = [
  {
    title: "Avatar",
    description: "Root container; size maps to data-size for badge scaling.",
    rows: [
      { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"' },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "AvatarImage",
    rows: [
      { prop: "src", type: "string", defaultValue: "-" },
      { prop: "alt", type: "string", defaultValue: '""' },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "AvatarFallback",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AvatarBadge",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AvatarGroup",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
  {
    title: "AvatarGroupCount",
    rows: [{ prop: "class", type: "string", defaultValue: "-" }],
  },
] as const;

const smartAvatarRecipeApiSections = [
  {
    title: "SmartAvatar (docs recipe)",
    description:
      "Optional composition in packages/docs/src/docs/examples/avatar/SmartAvatar.tsx. Depends on blobatar and @blobatar/preact — not shipped with @kamod-ch/ui.",
    rows: [
      { prop: "name", type: "string", defaultValue: "required (blobatar seed)" },
      { prop: "src", type: "string | null", defaultValue: "undefined" },
      { prop: "label", type: "string", defaultValue: "undefined" },
      { prop: "badge", type: "ComponentChildren", defaultValue: "undefined" },
      { prop: "blobatar", type: "SmartAvatarBlobatarOptions", defaultValue: "undefined" },
      { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"' },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
] as const;

export const avatarDocPage: DocPageModule = {
  slug: "avatar",
  title: "Avatar",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Profile image with initials fallback, status badge, overlapping groups, count chip, sizes, and dropdown trigger (shadcn Avatar pattern; no Radix dependency).",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import Avatar primitives from `@/components/kamod-ui/avatar`.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Place AvatarImage and AvatarFallback inside Avatar. The fallback stays visible until the image fires load; on error it shows again.",
    },
    {
      id: "basic",
      title: "Basic",
      text: "**Plan for Missing or Slow Images.** Provide a photo through `AvatarImage` and a recognizable alternative through `AvatarFallback`. The fallback gives the identity a stable visual representation when the photo is missing or cannot be displayed.\n\nAn avatar is a compact identity cue; it should not be the only way to distinguish important people or account actions.",
    },
    {
      id: "generated-fallback",
      title: "Generated Fallback",
      text: "**Keep Generated Identities Stable.** The optional `SmartAvatar` recipe derives a repeatable blobatar from a stable user identifier. Install `blobatar` separately and copy the recipe when this fallback is useful; the core `Avatar` remains the underlying primitive.\n\nReview the [SmartAvatar Recipe](#smartavatar-recipe) before adoption, then check a missing photo, a failed URL and a slow connection. Use the same user identifier across renders so those situations do not unexpectedly change someone's visual identity.",
    },
    {
      id: "animated-fallback",
      title: "Animated Fallback",
      text: '**Use Motion as an Optional Enhancement.** Enable `blobatar.animate="hover"` in the optional recipe and import `blobatar/motion.css` once in your stylesheet. This adds movement to the generated fallback without requiring animation for ordinary photos or static avatars.\n\nApply animation only where it adds personality without distracting from a list of names, and avoid loading motion styles if the application uses only static avatars.',
    },
    {
      id: "badge",
      title: "Badge",
      text: "**Pair Presence with an Understandable Status.** Add `AvatarBadge` to place a status marker at the photo's bottom inline edge. Its separating ring helps the overlapping marker remain distinct from the image; the surrounding text should explain what that status means.\n\nAdd an accessible or nearby text description when status matters, and check that the badge remains distinct against both the photo and the surrounding surface.",
    },
    {
      id: "badge-icon",
      title: "Badge with Icon",
      text: "**Use a Symbol for a Specific Status.** Put a recognizable symbol inside `AvatarBadge` when a plain status dot is insufficient. The small avatar treatment hides the inner SVG to avoid crowding, so the symbol must not carry essential information alone.\n\nProvide a nearby text equivalent for meaningful status and test the smallest size before choosing a symbol. Distinguish that account state from identity: the avatar should still identify the person when there is no room for the badge graphic.",
    },
    {
      id: "group",
      title: "Avatar Group",
      text: "**Show a Collection without Hiding Its Meaning.** Wrap related avatars in `AvatarGroup` to overlap their edges while keeping a ring between neighboring images. This presents a compact group of people without requiring a separate labeled row for each person.\n\nKeep the order stable and provide another way to inspect names; if each avatar is interactive, verify that overlapping surfaces do not make its target difficult to reach.",
    },
    {
      id: "group-count",
      title: "Avatar Group Count",
      text: "**Make Overflow Informative.** Append `AvatarGroupCount` after the visible avatars to show how many people are omitted. Derive the `+N` label from the same collection that supplies the photos so the summary remains accurate.\n\nIf the count opens a participant list, use a real control with a descriptive accessible name rather than making a decorative bubble unexpectedly interactive.",
    },
    {
      id: "group-count-icon",
      title: "Group Count with Icon",
      text: "**Distinguish Overflow from Adding a Person.** An icon inside `AvatarGroupCount` can suggest more participants or a group action. Pair the visual shorthand with a meaningful accessible name whenever the surrounding composition makes it an interactive control.\n\nKeep a numeric or textual explanation available when the size of the group matters to the reader.",
    },
    {
      id: "sizes",
      title: "Sizes",
      text: '**Match the Avatar to Its Role.** Choose `size="sm"`, the default size or `size="lg"` on `Avatar` to match its context. The comparison shows how the image, fallback and badge share the same overall density choice.\n\nCheck photo crops, fallback initials and badges at each size rather than scaling only the image; the accompanying name should remain the primary readable identity.',
    },
    {
      id: "dropdown",
      title: "Dropdown",
      text: "**Treat the Avatar as an Account-Menu Trigger.** Wrap the avatar in a ghost-style icon button and use that button as the dropdown trigger. The photo identifies the account while the button provides the focusable target for its related actions.\n\nGroup account actions clearly in the [Dropdown](/docs/dropdown/installation), and make switching accounts distinct from signing out.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Set the row's `dir` to match its language and let the avatar badge use logical end positioning. This preserves its relationship to the image when nearby account text changes reading direction.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
    },
    {
      id: "smartavatar-recipe",
      title: "SmartAvatar Recipe (Optional)",
      text: "**Adopt the Recipe Deliberately.** Use the docs' `SmartAvatar` recipe when generated fallbacks belong in your application. It composes Kamod primitives with a separate third-party package; copying it does not add blobatar behavior to the core `Avatar` API.\n\nChoose a stable seed, a readable initials fallback and an appropriate loading strategy; verify the result when remote photos fail rather than testing only successful images.",
    },
    { id: "api-reference", title: "API Reference", text: "@kamod-ch/ui Avatar primitives." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") {
        return <ApiReference sections={apiSections} />;
      }
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/components/kamod-ui/avatar";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "smartavatar-recipe") {
        return (
          <>
            <CodeBlock code="pnpm add blobatar @blobatar/preact" language="bash" />
            <ApiReference sections={smartAvatarRecipeApiSections} />
          </>
        );
      }
      if (sectionId === "usage") {
        return context.renderPreviewAndCodeTabs({
          preview: (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ),
          codeSnippet: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/kamod-ui/avatar";

export const Example = () => (
  <Avatar>
    <AvatarImage src="https://github.com/shadcn.png" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
);`,
        });
      }
      const block = sectionBlocks[sectionId];
      if (!block) {
        return null;
      }
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code,
        previewClass:
          sectionId === "generated-fallback" || sectionId === "animated-fallback"
            ? "overflow-x-auto"
            : undefined,
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <AvatarHeroDemo />,
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
