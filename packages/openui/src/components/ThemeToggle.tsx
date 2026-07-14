import { ThemeToggle } from "@kamod-ch/ui/theme-toggle";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";

export const themeToggleComponent = defineComponent({
  name: "ThemeToggle",
  description: "Toggles light/dark color scheme. No props.",
  props: z.object({}),
  component: () => <ThemeToggle />,
});
