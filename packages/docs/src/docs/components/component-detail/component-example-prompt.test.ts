import { describe, expect, it } from "vitest";
import { createComponentExamplePrompt } from "./component-example-prompt";

describe("component example briefs", () => {
  it.each(["setup", "adapt"] as const)(
    "keeps source, references and installation context intact in %s",
    (mode) => {
      const snippet = "const markdown = `# Example\n```tsx\n…\n````;";
      const prompt = createComponentExamplePrompt(
        {
          title: "Formisch",
          description: "Schema-first forms.",
          command: "pnpm add @formisch/preact valibot",
          documentationUrl: "https://ui.kamod.ch/docs/formisch/installation",
          sourceUrl: "https://github.com/kamod-ch/kamod-ui",
          filePath: "src/BugReportForm.tsx",
          codeSnippet: snippet,
        },
        mode,
      );
      expect(prompt).toContain(snippet);
      expect(prompt).toContain("````tsx\n");
      expect(prompt).toContain("pnpm add @formisch/preact valibot");
      expect(prompt).toContain("src/BugReportForm.tsx");
      expect(prompt).toContain("do not treat this as a complete component source bundle");
      expect(prompt.includes("[describe the outcome]")).toBe(mode === "adapt");
    },
  );
});
