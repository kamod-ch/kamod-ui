import { describe, expect, it } from "vitest";
import { blockCategories } from "./block-categories";
import { createBlockPrompt, promptDestination } from "./block-prompts";

describe("block prompts", () => {
  it("assigns unique local destinations for every published variant, without using auth display labels", () => {
    for (const category of Object.values(blockCategories)) {
      for (const block of category.blocks) {
        const paths = block.files.map((file) => promptDestination(block, file));
        expect(new Set(paths).size).toBe(block.files.length);
        expect(
          paths.every((path) => path.startsWith("src/components/") && !path.includes("..")),
        ).toBe(true);
        const sources = paths.map((destination) => ({ destination, code: "// source" }));
        for (const mode of ["setup", "adapt"] as const) {
          const prompt = createBlockPrompt(block, mode, sources);
          for (const path of paths) expect(prompt).toContain(`### ${path}\n`);
          expect(prompt).toContain(`Source files (${block.files.length})`);
        }
      }
    }
    const auth = blockCategories.login.blocks[0];
    expect(promptDestination(auth, auth.files[0])).toBe(
      "src/components/blocks/login/login-01/page.tsx",
    );
    const sidebar = blockCategories.sidebar.blocks[0];
    const helper = sidebar.files.find((file) => file.label.startsWith("components/"))!;
    expect(promptDestination(sidebar, helper)).toBe(
      `src/components/blocks/sidebar-01/${helper.label}`,
    );
    const shell = blockCategories["application-shell"].blocks[0];
    expect(promptDestination(shell, shell.files[0])).toBe(
      "src/components/application-shell-1/application-shell-1.tsx",
    );
  });

  it("gives setup actionable dependency guidance and adaptation editable requirements", () => {
    const block = blockCategories.sidebar.blocks[4];
    const setup = createBlockPrompt(block, "setup", []);
    expect(setup).toContain("The outer Sidebar05 component is an editable composition");
    expect(setup).toContain("`@kamod-ch/themes`, `@preact/signals`");
    expect(setup).toContain("package is private");
    expect(setup).toContain("#sidebar-05-installation");
    const adapt = createBlockPrompt(block, "adapt", []);
    expect(adapt).toContain("[what this screen should do and display]");
    expect(adapt).toContain("preserve changes already made in my app");
    expect(adapt).not.toContain("## Installation and integration");
  });

  it("preserves source text containing Markdown fences", () => {
    const code = "```tsx\nconst value = `<div />`;\n```\n";
    const prompt = createBlockPrompt(blockCategories.sidebar.blocks[0], "setup", [
      { destination: "src/README.md", code },
    ]);
    expect(prompt).toContain(`### src/README.md\n\n\`\`\`\`markdown\n${code}\n\`\`\`\``);
  });

  it("labels source fences by file type and leads from setup through verification to source", () => {
    const prompt = createBlockPrompt(blockCategories.sidebar.blocks[0], "setup", [
      { destination: "src/demo.tsx", code: "export const Demo = () => <main />;" },
      { destination: "src/data.ts", code: "export const items = [];" },
      { destination: "src/theme.css", code: ".demo { color: red; }" },
      { destination: "src/unknown.asset", code: "literal" },
    ]);
    for (const language of ["tsx", "typescript", "css", "text"]) {
      expect(prompt).toContain(`\`\`\`${language}\n`);
    }
    expect(prompt.indexOf("### 1. Understand the project")).toBeLessThan(
      prompt.indexOf("### 4. Mount this block"),
    );
    expect(prompt.indexOf("## Verify the result")).toBeLessThan(prompt.indexOf("## Source files"));
    expect(prompt).toContain("### Leave a useful handoff");
  });
});
