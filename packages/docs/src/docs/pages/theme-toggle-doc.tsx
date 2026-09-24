import { ThemeToggle } from "@kamod-ch/ui";
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
      renderPreview: () => <ThemeToggle />,
    },
    {
      id: "custom-toggle-label",
      title: "Custom Toggle Label",
      text: "Provide explicit custom label content.",
      code: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";

export const Example = () => <ThemeToggle>Toggle theme</ThemeToggle>;`,
      renderPreview: () => <ThemeToggle>Toggle theme</ThemeToggle>,
    },
    {
      id: "ripple-theme-toggle",
      title: "Ripple Theme Transition",
      text: 'Set `transition="ripple"` for a circular View Transition from the click origin. Defaults to `"instant"`. Falls back to an immediate switch when View Transitions, `Element.animate`, or motion are unavailable (SSR, older browsers, or `prefers-reduced-motion: reduce`). Import `@kamod-ch/ui/theme.css` or `@kamod-ch/themes/theme.css` so ripple view-transition styles apply.',
      code: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";
import "@kamod-ch/ui/theme.css";

export const Example = () => <ThemeToggle transition="ripple" />;`,
      renderPreview: () => <ThemeToggle transition="ripple" />,
    },
  ],
  apiRows: [
    { prop: "children", type: "ComponentChildren", defaultValue: "auto label" },
    { prop: "transition", type: '"instant" | "ripple"', defaultValue: '"instant"' },
    { prop: "onClick", type: "(event) => void", defaultValue: "undefined" },
    { prop: "class", type: "string", defaultValue: "undefined" },
  ],
  accessibilityText:
    "Ensure toggle purpose is explicit and the label remains understandable without relying on icon-only affordance.",
});
