import type { Config } from "tailwindcss";

/**
 * Optional compatibility preset for config-driven Tailwind projects.
 * Tailwind v4 consumers should prefer CSS imports from @kamod-ch/themes/theme.css.
 */
const preset = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        info: "var(--info)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        destructive: "var(--destructive)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        sidebar: "var(--sidebar-background)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.125rem)",
        sm: "calc(var(--radius) - 0.25rem)",
      },
    },
  },
} satisfies Partial<Config>;

export default preset;
