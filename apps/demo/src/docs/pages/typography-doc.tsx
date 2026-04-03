import { Typography } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const typographyDocPage = createGenericDocPage({
  slug: "typography",
  title: "Typography",
  usageLabel: "Typography centralizes modern text styles with semantic variants.",
  installationText: "Import Typography from `@/components/kamod-ui/typography`.",
  usageText: "Use semantic elements via `as` and apply the matching visual variant for consistent hierarchy.",
  exampleSections: [
    {
      id: "full-example",
      title: "Full Typography Example",
      text: "Complete example matching shadcn's Typography showcase content.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <div class="max-w-3xl space-y-4">
    <Typography as="h1" variant="h1">Taxing Laughter: The Joke Tax Chronicles</Typography>
    <Typography as="p" variant="p">
      Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne.
      One day, his advisors came to him with a problem: the kingdom was running out of money.
    </Typography>
    <Typography as="h2" variant="h2">The King's Plan</Typography>
    <Typography as="p" variant="p">
      The king thought long and hard, and finally came up with a brilliant plan: he would tax the jokes in the kingdom.
    </Typography>
    <Typography as="blockquote" variant="blockquote">
      "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
    </Typography>
    <Typography as="h3" variant="h3">The Joke Tax</Typography>
    <Typography as="ul" variant="list">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li>
    </Typography>
  </div>
);`,
      renderPreview: () => (
        <div class="max-w-3xl space-y-4">
          <Typography as="h1" variant="h1">Taxing Laughter: The Joke Tax Chronicles</Typography>
          <Typography as="p" variant="p">
            Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne.
            One day, his advisors came to him with a problem: the kingdom was running out of money.
          </Typography>
          <Typography as="h2" variant="h2">The King's Plan</Typography>
          <Typography as="p" variant="p">
            The king thought long and hard, and finally came up with a brilliant plan: he would tax the jokes in the kingdom.
          </Typography>
          <Typography as="blockquote" variant="blockquote">
            "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
          </Typography>
          <Typography as="h3" variant="h3">The Joke Tax</Typography>
          <Typography as="ul" variant="list">
            <li>1st level of puns: 5 gold coins</li>
            <li>2nd level of jokes: 10 gold coins</li>
            <li>3rd level of one-liners : 20 gold coins</li>
          </Typography>
        </div>
      )
    },
    {
      id: "h1",
      title: "h1",
      text: "Top-level page heading style.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h1" variant="h1">Taxing Laughter: The Joke Tax Chronicles</Typography>
);`,
      renderPreview: () => (
        <Typography as="h1" variant="h1">Taxing Laughter: The Joke Tax Chronicles</Typography>
      )
    },
    {
      id: "h2",
      title: "h2",
      text: "Second-level heading with divider.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h2" variant="h2">The People's Rebellion</Typography>
);`,
      renderPreview: () => (
        <Typography as="h2" variant="h2">The People's Rebellion</Typography>
      )
    },
    {
      id: "h3",
      title: "h3",
      text: "Third-level section heading.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h3" variant="h3">The Joke Tax</Typography>
);`,
      renderPreview: () => (
        <Typography as="h3" variant="h3">The Joke Tax</Typography>
      )
    },
    {
      id: "h4",
      title: "h4",
      text: "Fourth-level heading for local sub-sections.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h4" variant="h4">People stopped telling jokes</Typography>
);`,
      renderPreview: () => (
        <Typography as="h4" variant="h4">People stopped telling jokes</Typography>
      )
    },
    {
      id: "paragraph",
      title: "p",
      text: "Default body copy for long-form content.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="p" variant="p">
    The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
  </Typography>
);`,
      renderPreview: () => (
        <Typography as="p" variant="p">
          The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        </Typography>
      )
    },
    {
      id: "blockquote",
      title: "blockquote",
      text: "Use for important quoted callouts.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="blockquote" variant="blockquote">
    "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
  </Typography>
);`,
      renderPreview: () => (
        <Typography as="blockquote" variant="blockquote">
          "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
        </Typography>
      )
    },
    {
      id: "table",
      title: "table",
      text: "Responsive table wrapper with Typography table variant.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="div" variant="table">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b">
          <th class="h-10 px-2 text-left align-middle font-medium">King's Treasury</th>
          <th class="h-10 px-2 text-left align-middle font-medium">People's happiness</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b"><td class="p-2 align-middle">Empty</td><td class="p-2 align-middle">Overflowing</td></tr>
        <tr class="border-b"><td class="p-2 align-middle">Modest</td><td class="p-2 align-middle">Satisfied</td></tr>
        <tr><td class="p-2 align-middle">Full</td><td class="p-2 align-middle">Ecstatic</td></tr>
      </tbody>
    </table>
  </Typography>
);`,
      renderPreview: () => (
        <Typography as="div" variant="table">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="h-10 px-2 text-left align-middle font-medium">King's Treasury</th>
                <th class="h-10 px-2 text-left align-middle font-medium">People's happiness</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b"><td class="p-2 align-middle">Empty</td><td class="p-2 align-middle">Overflowing</td></tr>
              <tr class="border-b"><td class="p-2 align-middle">Modest</td><td class="p-2 align-middle">Satisfied</td></tr>
              <tr><td class="p-2 align-middle">Full</td><td class="p-2 align-middle">Ecstatic</td></tr>
            </tbody>
          </table>
        </Typography>
      )
    },
    {
      id: "list",
      title: "list",
      text: "Bulleted list with consistent spacing.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="ul" variant="list">
    <li>1st level of puns: 5 gold coins</li>
    <li>2nd level of jokes: 10 gold coins</li>
    <li>3rd level of one-liners : 20 gold coins</li>
  </Typography>
);`,
      renderPreview: () => (
        <Typography as="ul" variant="list">
          <li>1st level of puns: 5 gold coins</li>
          <li>2nd level of jokes: 10 gold coins</li>
          <li>3rd level of one-liners : 20 gold coins</li>
        </Typography>
      )
    },
    {
      id: "inline-code",
      title: "Inline code",
      text: "Use inline code style for package names and tokens.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="code" variant="inlineCode">@radix-ui/react-alert-dialog</Typography>
);`,
      renderPreview: () => (
        <Typography as="code" variant="inlineCode">@radix-ui/react-alert-dialog</Typography>
      )
    },
    {
      id: "lead",
      title: "Lead",
      text: "Lead copy for section intros.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="p" variant="lead">
    A modal dialog that interrupts the user with important content and expects a response.
  </Typography>
);`,
      renderPreview: () => (
        <Typography as="p" variant="lead">
          A modal dialog that interrupts the user with important content and expects a response.
        </Typography>
      )
    },
    {
      id: "large",
      title: "Large",
      text: "Emphasized short text with large style.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="div" variant="large">Are you absolutely sure?</Typography>
);`,
      renderPreview: () => (
        <Typography as="div" variant="large">Are you absolutely sure?</Typography>
      )
    },
    {
      id: "small",
      title: "Small",
      text: "Small helper label text.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="small" variant="small">Email address</Typography>
);`,
      renderPreview: () => (
        <Typography as="small" variant="small">Email address</Typography>
      )
    },
    {
      id: "muted",
      title: "Muted",
      text: "Secondary text for subtle context.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="p" variant="muted">Enter your email address.</Typography>
);`,
      renderPreview: () => (
        <Typography as="p" variant="muted">Enter your email address.</Typography>
      )
    },
    {
      id: "rtl-support",
      title: "RTL",
      text: "Direction-agnostic typography styles for right-to-left content.",
      code: `<div dir="rtl" class="max-w-3xl space-y-3">
  <Typography as="h1" variant="h1">فرض الضرائب على الضحك: سجلات ضريبة النكتة</Typography>
  <Typography as="p" variant="p">
    في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي يومه كله مستلقياً على عرشه.
  </Typography>
</div>`,
      renderPreview: () => (
        <div dir="rtl" class="max-w-3xl space-y-3">
          <Typography as="h1" variant="h1">فرض الضرائب على الضحك: سجلات ضريبة النكتة</Typography>
          <Typography as="p" variant="p">
            في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي يومه كله مستلقياً على عرشه.
          </Typography>
        </div>
      )
    }
  ],
  apiRows: [
    { prop: "variant", type: '"h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "code" | "inlineCode" | "list" | "table" | "lead" | "large" | "muted" | "small"', defaultValue: '"p"' },
    { prop: "as", type: "keyof HTMLElementTagNameMap", defaultValue: '"p"' },
    { prop: "class", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText:
    "Maintain semantic heading order, avoid skipping heading levels, and ensure muted text still passes contrast requirements in every theme."
});
