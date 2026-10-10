import {
  accessibilitySections,
  componentAccessibility,
} from "./components/component-detail/accessibility";
import type { DocSection } from "./types";

/** Builds a Markdown outline from doc metadata (title, install command, section headings and blurbs). */
export function buildComponentDocMarkdown(
  title: string,
  command: string,
  sections: DocSection[],
  slug?: string,
  snippetImports: "local" | "package" = "local",
): string {
  const parts: string[] = [
    `# ${title}`,
    "",
    snippetImports === "package"
      ? "> These examples use the public `@kamod-ch/ui` package exports. Install the package and connect its theme stylesheet before rendering."
      : "> Demo snippets in this app use the local `@/components/kamod-ui/*` alias. For real app code, install `@kamod-ch/ui` and import from that package.",
    "",
  ];

  for (const section of sections) {
    const accessibility =
      slug && section.id === "accessibility" ? componentAccessibility(slug) : undefined;
    if (accessibility) {
      parts.push("## Accessibility", "");
      for (const { id, label, text } of accessibilitySections(accessibility)) {
        parts.push(`### ${label}`, "", text, "");
        if (id === "accessibility-naming" && accessibility.example) {
          const { title, note, code } = accessibility.example;
          parts.push(`**${title}.** ${note}`, "", "```tsx", code, "```", "");
        }
      }
      parts.push(
        "### Verify the Complete Interaction",
        "",
        ...accessibility.checks.map((check, index) => `${index + 1}. ${check}`),
        "",
      );
      continue;
    }
    parts.push(`## ${section.title}`, "");
    if (section.id === "installation") {
      parts.push("```bash", command, "```", "");
    }
    parts.push(section.text.trim(), "");
  }

  return parts.join("\n").trimEnd() + "\n";
}
