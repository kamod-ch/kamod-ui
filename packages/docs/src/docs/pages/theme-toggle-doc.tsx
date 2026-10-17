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
      text: "**Keep the Chosen Appearance Consistent Across the Application.** Use `ThemeToggle` to switch between the interface's light and dark appearances. The control should reflect the currently applied mode, allowing the same page content and semantic tokens to be inspected in both themes.\n\nCheck the initial server-rendered appearance and preference persistence, and ensure the control's accessible name describes the action or available mode clearly.",
      code: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";

export const Example = () => <ThemeToggle />;`,
      renderPreview: () => <ThemeToggle />,
    },
    {
      id: "custom-toggle-label",
      title: "Custom Toggle Label",
      text: "**Use Wording that Makes the Next Change Predictable.** Provide custom label content when an explicit phrase explains the theme action better than an icon alone. Keep that wording consistent with the current mode and what activating the control will change.\n\nKeep the text useful when icons are unavailable and verify both light and dark states rather than checking only the initial label.",
      code: `import { ThemeToggle } from "@/components/kamod-ui/theme-toggle";

export const Example = () => <ThemeToggle>Toggle theme</ThemeToggle>;`,
      renderPreview: () => <ThemeToggle>Toggle theme</ThemeToggle>,
    },
    {
      id: "ripple-theme-toggle",
      title: "Ripple Theme Transition",
      text: '**Treat the Transition as Progressive Enhancement.** Set `transition="ripple"` for a circular theme transition from the click origin; the default is `instant`. Import the theme stylesheet for its transition rules. Unsupported environments and reduced-motion preferences fall back to an immediate change.\n\nTest both directions and rapid repeated activation, and avoid making surrounding state changes depend on a decorative transition completing successfully.',
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
