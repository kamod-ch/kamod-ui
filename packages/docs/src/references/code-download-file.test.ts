import { describe, expect, it } from "vitest";
import { codeDownloadFile } from "./code-download-file";

describe("code download metadata", () => {
  it.each([
    ["text", "txt", "text/plain"],
    ["typescript", "ts", "text/typescript"],
    ["tsx", "tsx", "text/typescript"],
    ["javascript", "js", "text/javascript"],
    ["jsx", "jsx", "text/javascript"],
    ["json", "json", "application/json"],
    ["css", "css", "text/css"],
    ["markup", "html", "text/html"],
    ["markdown", "md", "text/markdown"],
    ["bash", "sh", "text/x-shellscript"],
    ["yaml", "yaml", "application/yaml"],
    ["diff", "diff", "text/x-diff"],
  ])(
    "chooses a useful extension and MIME for %s without inventing source paths",
    (language, extension, mime) => {
      expect(codeDownloadFile({ code: "literal source", language, inferLanguage: false })).toEqual({
        fileName: `snippet.${extension}`,
        mimeType: `${mime};charset=utf-8`,
      });
    },
  );

  it.each([
    ["src/components/Title.TSX:24:7?raw#L24", "Title.TSX", "text/typescript"],
    ["C:\\project\\styles\\theme.css:3:2", "theme.css", "text/css"],
    ["https://example.com/src/data.JSON?raw#L3", "data.JSON", "application/json"],
    ["src/logo.svg#L4", "logo.svg", "image/svg+xml"],
    ["examples/fragment.xml?raw", "fragment.xml", "application/xml"],
    ["./config/.env", ".env", "text/plain"],
    ["Dockerfile", "Dockerfile", "text/plain"],
  ])("preserves the clean basename of %s", (filePath, fileName, mime) => {
    expect(codeDownloadFile({ code: "source", filePath })).toEqual({
      fileName,
      mimeType: `${mime};charset=utf-8`,
    });
  });

  it("prefers an explicit clean filename and its extension over the source label", () => {
    expect(
      codeDownloadFile(
        { code: "const x = 1;", language: "typescript", filePath: "src/old.ts" },
        "../downloads/notes.md:4?raw#L4",
      ),
    ).toEqual({ fileName: "notes.md", mimeType: "text/markdown;charset=utf-8" });
    expect(
      codeDownloadFile({ code: "const x = 1;", language: "typescript" }, "literal.txt").mimeType,
    ).toBe("text/plain;charset=utf-8");
  });

  it("uses the same inference and explicit opt-out as the code reader", () => {
    const code = "export const Preview = () => <View />;";
    expect(codeDownloadFile({ code, language: "javascript" }).fileName).toBe("snippet.jsx");
    expect(codeDownloadFile({ code, language: "javascript", inferLanguage: false }).fileName).toBe(
      "snippet.js",
    );
    expect(codeDownloadFile({ code, inferLanguage: false }).fileName).toBe("snippet.txt");
    expect(codeDownloadFile({ code: "pnpm add preact" }).fileName).toBe("snippet.sh");
    expect(
      codeDownloadFile({ code: "literal", language: "language-md", inferLanguage: false }).fileName,
    ).toBe("snippet.md");
  });

  it("falls back from an empty filename without changing existing extensionless names", () => {
    expect(
      codeDownloadFile({ code: "literal", language: "css", filePath: "src/" }, " ").fileName,
    ).toBe("snippet.css");
    expect(codeDownloadFile({ code: "# Notes", language: "markdown" }, "README").fileName).toBe(
      "README",
    );
    expect(codeDownloadFile({ code: "literal", filePath: "docs/readme.md" }, "#L12").fileName).toBe(
      "readme.md",
    );
  });
});
