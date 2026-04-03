import { ThemeToggle } from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const themeToggleDocPage = createGenericDocPage({
  slug: "theme-toggle",
  title: "Theme Toggle",
  usageLabel: "Theme Toggle switches between light and dark appearance.",
  installationText: "Import ThemeToggle from `@/components/kamod-ui/theme-toggle`.",
  usageText: "Place one toggle in app chrome and let it persist user preference.",
  exampleSections: [
    {
      id: "basic-theme-toggle",
      title: "Basic Theme Toggle",
      text: "Toggle between light and dark mode states.",
      code: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";

export const Example = () => <ThemeToggle />;`,
      renderPreview: () => <ThemeToggle />
    },
    {
      id: "custom-toggle-label",
      title: "Custom Toggle Label",
      text: "Provide explicit custom label content.",
      code: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";

export const Example = () => <ThemeToggle>Toggle theme</ThemeToggle>;`,
      renderPreview: () => <ThemeToggle>Toggle theme</ThemeToggle>
    }
  ],
  apiRows: [
    { prop: "children", type: "ComponentChildren", defaultValue: "auto label" },
    { prop: "onClick", type: "(event) => void", defaultValue: "undefined" },
    { prop: "class", type: "string", defaultValue: "undefined" }
  ],
  accessibilityText: "Ensure toggle purpose is explicit and the label remains understandable without relying on icon-only affordance."
});
