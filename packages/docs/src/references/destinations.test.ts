import catalog from "virtual:kamod-code-references";
import { findCodeReferences } from "@kamod-ch/ui/code";
import { expect, it } from "vitest";
import { repositoryUrl } from "../../.preactpress/reference-package-catalog";
import { codeFenceMarkup } from "../docs/components/code-fence-markup";
import { resolveCodeReference } from "./destinations";

it("prefers API destinations for symbols and source owners for package/module paths", () => {
  expect(resolveCodeReference({ module: "@kamod-ch/ui", imported: "Button", local: "Save" })).toBe(
    "/docs/button/installation#api-reference",
  );
  expect(resolveCodeReference({ module: "@kamod-ch/ui/button" })).toBe(
    "https://github.com/kamod-ch/kamod-ui/tree/main/packages/core/src/components/button",
  );
  expect(resolveCodeReference({ module: "@kamod-ch/hooks" })).toBe(
    "https://github.com/kamod-ch/kamod-hooks/tree/main/packages/core",
  );
  expect(resolveCodeReference({ module: "@kamod-ch/themes", imported: "useTheme" })).toBe(
    "/docs/theming/installation#read-and-change-appearance",
  );
});

it("uses checkout files and installed repository metadata without guessing unknown packages", () => {
  expect(catalog.components.Button.file).toBe("packages/core/src/components/button/Button.tsx");
  expect(resolveCodeReference({ module: "@kamod-ch/ui/copy-button", imported: "CopyButton" })).toBe(
    "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/components/copy-button/CopyButton.tsx",
  );
  expect(resolveCodeReference({ module: "preact/hooks", imported: "useState" })).toBe(
    "https://github.com/preactjs/preact",
  );
  expect(
    resolveCodeReference({ module: "unverified-package", imported: "Button" }),
  ).toBeUndefined();
  expect(resolveCodeReference({ module: "@kamod-ch/ui/card", imported: "Button" })).toBe(
    "https://github.com/kamod-ch/kamod-ui",
  );
});

it("decorates static Markdown fences before hydration", () => {
  const html = codeFenceMarkup(
    'import { Button } from "@kamod-ch/ui/button";\nconst Example = () => <Button />;',
    "tsx",
  );
  expect(html).toContain('href="/docs/button/installation#api-reference"');
  expect(html.match(/class="kamod-code-reference"/g)).toHaveLength(3);
});

it("keeps consumer-local import paths plain while preserving verified symbol references", () => {
  for (const module of [
    "@/components/kamod-ui/button",
    "@/lib/utils",
    "./app.css",
    "./package.json",
  ]) {
    expect(resolveCodeReference({ module, filePath: "src/app.tsx" }), module).toBeUndefined();
    expect(
      resolveCodeReference({ module, imported: "*", filePath: "src/app.tsx" }),
      module,
    ).toBeUndefined();
  }
  const source =
    'import { Button } from "@/components/kamod-ui/button";\nimport { cn } from "@/lib/utils";\nconst App = () => <Button class={cn("px-4")} />;';
  const references = findCodeReferences(source, "tsx", resolveCodeReference);
  expect(references.map(({ start, end }) => source.slice(start, end))).toEqual([
    "Button",
    "cn",
    "Button",
    "cn",
  ]);
  const html = codeFenceMarkup(source, "tsx");
  expect(html).toContain('data-code-imported="Button"');
  expect(html).toContain('data-code-imported="cn"');
  expect(html.match(/class="kamod-code-reference"/g)).toHaveLength(4);
});

it("accepts only GitHub repository metadata", () => {
  expect(repositoryUrl("preactjs/preact")).toBe("https://github.com/preactjs/preact");
  expect(repositoryUrl({ url: "git+https://github.com/org/project.git" })).toBe(
    "https://github.com/org/project",
  );
  expect(repositoryUrl({ url: "javascript:alert(1)" })).toBeUndefined();
  expect(repositoryUrl({ url: "https://example.test/not-github" })).toBeUndefined();
});
