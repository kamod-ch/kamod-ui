import { Typography } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const typographyDocPage = createGenericDocPage({
  slug: "typography",
  title: "Typography",
  usageLabel: "Typography centralizes modern text styles with semantic variants.",
  installationText: "Import Typography from `@/components/kamod-ui/typography`.",
  usageText:
    "Use semantic elements via `as` and apply the matching visual variant for consistent hierarchy.",
  exampleSections: [
    {
      id: "full-example",
      title: "Full Typography Example",
      text: "**Review the Page Rhythm as a Whole.** Read a complete article-style composition to see headings, body text, quotations, lists and a table work together. `Typography` coordinates their presentation, while the document's semantic hierarchy continues to describe how the ideas relate.\n\nKeep semantic elements meaningful rather than choosing them only for their appearance, and inspect the composition at narrow widths with realistic text lengths.",
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
          <Typography as="h1" variant="h1">
            Taxing Laughter: The Joke Tax Chronicles
          </Typography>
          <Typography as="p" variant="p">
            Once upon a time, in a far-off land, there was a very lazy king who spent all day
            lounging on his throne. One day, his advisors came to him with a problem: the kingdom
            was running out of money.
          </Typography>
          <Typography as="h2" variant="h2">
            The King's Plan
          </Typography>
          <Typography as="p" variant="p">
            The king thought long and hard, and finally came up with a brilliant plan: he would tax
            the jokes in the kingdom.
          </Typography>
          <Typography as="blockquote" variant="blockquote">
            "After all," he said, "everyone enjoys a good joke, so it's only fair that they should
            pay for the privilege."
          </Typography>
          <Typography as="h3" variant="h3">
            The Joke Tax
          </Typography>
          <Typography as="ul" variant="list">
            <li>1st level of puns: 5 gold coins</li>
            <li>2nd level of jokes: 10 gold coins</li>
            <li>3rd level of one-liners : 20 gold coins</li>
          </Typography>
        </div>
      ),
    },
    {
      id: "h1",
      title: "h1",
      text: "**Use the Top Heading to Name the Page.** Use the `h1` treatment for the page's main title, giving the document a clear starting point. Choose the semantic heading level according to its role rather than selecting the largest font merely for emphasis.\n\nKeep its visual prominence distinct from supporting copy and avoid choosing an `h1` merely to enlarge text inside a smaller component or card.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h1" variant="h1">Taxing Laughter: The Joke Tax Chronicles</Typography>
);`,
      renderPreview: () => (
        <Typography as="h1" variant="h1">
          Taxing Laughter: The Joke Tax Chronicles
        </Typography>
      ),
    },
    {
      id: "h2",
      title: "h2",
      text: "**Introduce a Major Section in the Document.** Use the `h2` treatment to introduce a major section beneath the page title. Its divider creates a quiet structural break, separating substantial topics while maintaining the shared typography of the article.\n\nKeep the level consistent with the page outline and check that anchor navigation leaves enough room above the heading for it to remain visible.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h2" variant="h2">The People's Rebellion</Typography>
);`,
      renderPreview: () => (
        <Typography as="h2" variant="h2">
          The People's Rebellion
        </Typography>
      ),
    },
    {
      id: "h3",
      title: "h3",
      text: "**Organize Content within a Larger Section.** Use the `h3` treatment for a subsection within a larger topic. Keep its wording specific to that part of the explanation so the heading remains meaningful when read in the page's outline or contents navigation.\n\nKeep labels concise but specific, and preserve the hierarchy instead of skipping levels to obtain a preferred size; visual styling and semantic structure serve different purposes.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h3" variant="h3">The Joke Tax</Typography>
);`,
      renderPreview: () => (
        <Typography as="h3" variant="h3">
          The Joke Tax
        </Typography>
      ),
    },
    {
      id: "h4",
      title: "h4",
      text: "**Use a Local Heading Only When the Structure Needs It.** Use `h4` for a further level of detail when a subsection genuinely needs smaller topics. This preserves the relationship to its parent heading instead of creating another unrelated main section solely for a smaller font size.\n\nKeep the relationship to its parent clear and use ordinary emphasized text for small labels that are not actual sections.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="h4" variant="h4">People stopped telling jokes</Typography>
);`,
      renderPreview: () => (
        <Typography as="h4" variant="h4">
          People stopped telling jokes
        </Typography>
      ),
    },
    {
      id: "paragraph",
      title: "Paragraph",
      text: "**Keep Ordinary Reading Comfortable.** Use the paragraph treatment for the explanation that connects headings, examples and decisions. Keep each paragraph focused on one idea, using inline emphasis or code where it helps the reader distinguish terminology from ordinary prose.\n\nBreak long explanations into coherent paragraphs, use emphasis selectively and let links and inline `code` stand out without turning the whole paragraph into competing visual fragments.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="p" variant="p">
    The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
  </Typography>
);`,
      renderPreview: () => (
        <Typography as="p" variant="p">
          The king, seeing how much happier his subjects were, realized the error of his ways and
          repealed the joke tax.
        </Typography>
      ),
    },
    {
      id: "blockquote",
      title: "Blockquote",
      text: "**Mark a Quotation as a Quotation.** Use `blockquote` for an actual quotation or clearly attributed excerpt that belongs apart from the main explanation. Its visual boundary helps identify the quoted voice, while the surrounding text should explain why the passage matters.\n\nKeep the source or speaker clear where relevant and preserve surrounding context; use [Alert](/docs/alert/installation) when the content is an instruction or status message from the application itself.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="blockquote" variant="blockquote">
    "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
  </Typography>
);`,
      renderPreview: () => (
        <Typography as="blockquote" variant="blockquote">
          "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay
          for the privilege."
        </Typography>
      ),
    },
    {
      id: "table",
      title: "Table",
      text: "**Keep Structured Comparisons Semantic.** Use the table typography inside a suitable responsive wrapper when information needs row-and-column comparison. Keep headers descriptive and cells concise so the structure remains meaningful when the available reading width changes.\n\nUse tables for actual row-and-column relationships, not general page layout, and keep long cell content readable without forcing the entire document wider than the viewport.",
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
                <th class="h-10 px-2 text-left align-middle font-medium">People's Happiness</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-2 align-middle">Empty</td>
                <td class="p-2 align-middle">Overflowing</td>
              </tr>
              <tr class="border-b">
                <td class="p-2 align-middle">Modest</td>
                <td class="p-2 align-middle">Satisfied</td>
              </tr>
              <tr>
                <td class="p-2 align-middle">Full</td>
                <td class="p-2 align-middle">Ecstatic</td>
              </tr>
            </tbody>
          </table>
        </Typography>
      ),
    },
    {
      id: "list",
      title: "List",
      text: "**Use a List When the Items Are Genuinely Parallel.** Use the list treatment for related items that benefit from parallel wording and clear separation. The shared indentation and spacing should make the sequence easy to scan without replacing paragraphs that need connected explanation.\n\nKeep each item's phrasing consistent, avoid excessive nesting and use real list markup so the structure remains available beyond its visual indentation.",
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
      ),
    },
    {
      id: "inline-code",
      title: "Inline Code",
      text: "**Distinguish Literal Values from Explanatory Prose.** Use inline code for exact package names, tokens or identifiers that readers may need to recognize or copy. Keep the spelling and casing of values such as `class` intact even when surrounding emphasized prose uses title case.\n\nKeep punctuation outside the code when it is not part of the value, and move longer examples into a separate code block rather than stretching a paragraph.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="code" variant="inlineCode">@radix-ui/react-alert-dialog</Typography>
);`,
      renderPreview: () => (
        <Typography as="code" variant="inlineCode">
          @radix-ui/react-alert-dialog
        </Typography>
      ),
    },
    {
      id: "lead",
      title: "Lead",
      text: "**Introduce the Section without Repeating Its Heading.** Use the lead treatment for a short introduction that establishes the purpose of a section before the detailed explanation. Its larger, secondary typography should summarize the reader's next task without duplicating the full paragraph below it.\n\nKeep it brief enough to remain an introduction and reserve its larger treatment for a small number of meaningful entry points on the page.",
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
      ),
    },
    {
      id: "large",
      title: "Large",
      text: "**Emphasize a Short Piece of Supporting Content.** Use the large treatment for a short piece of emphasized text within the existing document structure. It can highlight a local takeaway, but a true section title should still use an appropriate semantic heading.\n\nKeep the semantic element appropriate to the content, and avoid using enlarged text for long paragraphs that compete with the page's actual hierarchy.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="div" variant="large">Are you absolutely sure?</Typography>
);`,
      renderPreview: () => (
        <Typography as="div" variant="large">
          Are you absolutely sure?
        </Typography>
      ),
    },
    {
      id: "small",
      title: "Small",
      text: "**Keep Helper Text Readable and Useful.** Use the small treatment for brief supporting labels near the content they explain. Keep it readable at the intended viewport size, especially when the label carries information needed to understand a nearby control.\n\nDo not hide required information through tiny type; essential field guidance belongs close to the control it explains.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="small" variant="small">Email address</Typography>
);`,
      renderPreview: () => (
        <Typography as="small" variant="small">
          Email address
        </Typography>
      ),
    },
    {
      id: "muted",
      title: "Muted",
      text: "**Make Secondary Context Quieter without Making It Disappear.** Use muted typography for secondary context that supports the main message without competing with it. The text should remain legible in both themes, and essential instructions should not depend on unusually faint presentation.\n\nCheck both themes and preserve sufficient readability, especially when small type or long paragraphs would amplify the reduced emphasis.",
      code: `import { Typography } from "@/components/kamod-ui/typography";

export const Example = () => (
  <Typography as="p" variant="muted">Enter your email address.</Typography>
);`,
      renderPreview: () => (
        <Typography as="p" variant="muted">
          Enter your email address.
        </Typography>
      ),
    },
    {
      id: "rtl-support",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Let typography inherit the document's reading direction and use logical alignment for translated content. Review mixed code, numbers and punctuation alongside the prose because these sequences may follow different reading conventions.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
      code: `<div dir="rtl" class="max-w-3xl space-y-3">
  <Typography as="h1" variant="h1">فرض الضرائب على الضحك: سجلات ضريبة النكتة</Typography>
  <Typography as="p" variant="p">
    في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي يومه كله مستلقياً على عرشه.
  </Typography>
</div>`,
      renderPreview: () => (
        <div dir="rtl" class="max-w-3xl space-y-3">
          <Typography as="h1" variant="h1">
            فرض الضرائب على الضحك: سجلات ضريبة النكتة
          </Typography>
          <Typography as="p" variant="p">
            في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي يومه كله مستلقياً على عرشه.
          </Typography>
        </div>
      ),
    },
  ],
  apiRows: [
    {
      prop: "variant",
      type: '"h1" | "h2" | "h3" | "h4" | "p" | "blockquote" | "code" | "inlineCode" | "list" | "table" | "lead" | "large" | "muted" | "small"',
      defaultValue: '"p"',
    },
    { prop: "as", type: "keyof HTMLElementTagNameMap", defaultValue: '"p"' },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Maintain semantic heading order, avoid skipping heading levels, and ensure muted text still passes contrast requirements in every theme.",
});
