import { Separator } from "@kamod-ui/core";
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
      text: "Klassische Trennung zwischen Content-Bloecken in einer vertikalen Sektion.",
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
      text: 'Nutze `orientation="vertical"` fuer kompakte Inline-Navigation.',
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
      text: "Vertikale Separatoren zwischen Menuepunkten mit zusaetzlichen Beschreibungen.",
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
      text: "Horizontale Trenner zwischen Zeilen in einer kompakten Liste.",
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
