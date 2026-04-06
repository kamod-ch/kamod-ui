import type { DocSection } from "./types";

/** Builds a Markdown outline from doc metadata (title, install command, section headings and blurbs). */
export function buildComponentDocMarkdown(
  title: string,
  command: string,
  sections: DocSection[],
): string {
  const parts: string[] = [`# ${title}`, ""];

  for (const section of sections) {
    parts.push(`## ${section.title}`, "");
    if (section.id === "installation") {
      parts.push("```bash", command, "```", "");
    }
    parts.push(section.text.trim(), "");
  }

  return parts.join("\n").trimEnd() + "\n";
}
