import { Separator } from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const separatorDocPage = createGenericDocPage({
  slug: "separator",
  title: "Separator",
  usageLabel: "Separator trennt Inhalte visuell oder semantisch in modernen Layouts.",
  installationText: "Import Separator from `@/components/kamod-ui/separator`.",
  usageText:
    "Nutze horizontale Separatoren fuer gestapelte Bereiche und vertikale Separatoren fuer Inline-Gruppen oder Menues.",
  exampleSections: [
    {
      id: "horizontal-separator",
      title: "Horizontal Separator",
      text: "**Separate Related Content without Adding Another Surface.** Place a horizontal `Separator` between distinct blocks of related content. It creates a quiet visual boundary within the reading flow without requiring a separate card surface or additional heading for every division.\n\nKeep it visually secondary and decide whether it conveys a meaningful structural boundary or is purely decorative before choosing its accessible treatment.",
      code: `import { Separator } from "@/components/kamod-ui/separator";

export const Example = () => (
  <div class="w-full max-w-md space-y-2">
    <h4 class="text-sm font-medium leading-none">Blog</h4>
    <p class="text-sm text-muted-foreground">
      Read product updates, release notes, and engineering deep-dives.
    </p>
    <Separator />
    <h4 class="text-sm font-medium leading-none">Docs</h4>
    <p class="text-sm text-muted-foreground">
      Browse setup guides, API references, and usage examples.
    </p>
  </div>
);`,
      renderPreview: () => (
        <div class="w-full max-w-md space-y-2">
          <h4 class="text-sm font-medium leading-none">Blog</h4>
          <p class="text-sm text-muted-foreground">
            Read product updates, release notes, and engineering deep-dives.
          </p>
          <Separator />
          <h4 class="text-sm font-medium leading-none">Docs</h4>
          <p class="text-sm text-muted-foreground">
            Browse setup guides, API references, and usage examples.
          </p>
        </div>
      ),
    },
    {
      id: "vertical-separator",
      title: "Vertical Separator",
      text: '**Give Inline Groups a Quiet Boundary.** Set `orientation="vertical"` for a separator between compact inline groups. Give the surrounding row a meaningful height so the line can distinguish neighboring content without becoming an oversized decorative element.\n\nSet a usable surrounding height, keep spacing balanced on both sides and let narrow layouts adapt instead of leaving an isolated divider on a wrapped line.',
      code: `import { Separator } from "@/components/kamod-ui/separator";

export const Example = () => (
  <div class="flex h-5 items-center space-x-4 text-sm">
    <span class="font-medium">Blog</span>
    <Separator orientation="vertical" />
    <span>Docs</span>
    <Separator orientation="vertical" />
    <span>Source</span>
  </div>
);`,
      renderPreview: () => (
        <div class="flex h-5 items-center space-x-4 text-sm">
          <span class="font-medium">Blog</span>
          <Separator orientation="vertical" />
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Source</span>
        </div>
      ),
    },
    {
      id: "menu-separator",
      title: "Menu",
      text: "**Group Navigation by Meaning.** Use vertical separators to distinguish adjacent menu-like entries that include supporting descriptions. The line clarifies their boundaries, while the wording and navigation semantics still explain what each entry represents.\n\nKeep the link text primary, avoid placing a rule between every small fragment, and verify that the arrangement remains understandable when the items wrap.",
      code: `import { Separator } from "@/components/kamod-ui/separator";

export const Example = () => (
  <div class="docs-separator-menu">
    <div class="docs-separator-menu-item">
      <p class="docs-separator-menu-title">Settings</p>
      <p class="docs-separator-menu-copy">Manage preferences</p>
    </div>
    <Separator orientation="vertical" class="docs-separator-menu-line" decorative />
    <div class="docs-separator-menu-item">
      <p class="docs-separator-menu-title">Account</p>
      <p class="docs-separator-menu-copy">Profile and security</p>
    </div>
    <Separator orientation="vertical" class="docs-separator-menu-line" decorative />
    <div class="docs-separator-menu-item">
      <p class="docs-separator-menu-title">Help</p>
      <p class="docs-separator-menu-copy">Support and docs</p>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-separator-menu">
          <div class="docs-separator-menu-item">
            <p class="docs-separator-menu-title">Settings</p>
            <p class="docs-separator-menu-copy">Manage preferences</p>
          </div>
          <Separator orientation="vertical" class="docs-separator-menu-line" decorative />
          <div class="docs-separator-menu-item">
            <p class="docs-separator-menu-title">Account</p>
            <p class="docs-separator-menu-copy">Profile and security</p>
          </div>
          <Separator orientation="vertical" class="docs-separator-menu-line" decorative />
          <div class="docs-separator-menu-item">
            <p class="docs-separator-menu-title">Help</p>
            <p class="docs-separator-menu-copy">Support and docs</p>
          </div>
        </div>
      ),
    },
    {
      id: "list-separator",
      title: "List",
      text: "**Create a Consistent Rhythm in Dense Lists.** Insert horizontal separators between compact list rows when full borders would add unnecessary visual weight. Keep the spacing consistent so each item remains a recognizable unit rather than appearing attached to the following row.\n\nAlign it with the content structure, preserve enough vertical space for wrapped text and avoid duplicating a border already supplied by the row component.",
      code: `import { Separator } from "@/components/kamod-ui/separator";

export const Example = () => (
  <div class="docs-separator-list">
    <div class="docs-separator-list-item">
      <span>Item 1</span>
      <span>Value 1</span>
    </div>
    <Separator decorative />
    <div class="docs-separator-list-item">
      <span>Item 2</span>
      <span>Value 2</span>
    </div>
    <Separator decorative />
    <div class="docs-separator-list-item">
      <span>Item 3</span>
      <span>Value 3</span>
    </div>
  </div>
);`,
      renderPreview: () => (
        <div class="docs-separator-list">
          <div class="docs-separator-list-item">
            <span>Item 1</span>
            <span>Value 1</span>
          </div>
          <Separator decorative />
          <div class="docs-separator-list-item">
            <span>Item 2</span>
            <span>Value 2</span>
          </div>
          <Separator decorative />
          <div class="docs-separator-list-item">
            <span>Item 3</span>
            <span>Value 3</span>
          </div>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "orientation", type: '"horizontal" | "vertical"', defaultValue: '"horizontal"' },
    { prop: "decorative", type: "boolean", defaultValue: "false" },
    { prop: "class", type: "string", defaultValue: "undefined" },
    {
      prop: "aria-orientation",
      type: "managed by component",
      defaultValue: "auto (unless decorative)",
    },
  ],
  accessibilityText:
    'Setze `decorative` fuer rein visuelle Trennung. Wenn die Trennung semantische Bedeutung hat, nutze die Standard-Variante mit `role="separator"`.',
});
