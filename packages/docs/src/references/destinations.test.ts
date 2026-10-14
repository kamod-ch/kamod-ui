import catalog from "virtual:kamod-code-references";
import { expect, it } from "vitest";
import { repositoryUrl } from "../../.preactpress/code-reference-plugin";
import { codeFenceMarkup } from "../docs/components/code-fence-markup";
import { resolveCodeReference } from "./destinations";

it("prefers real on-site references for components, aliases, package guides and cn", () => {
  expect(resolveCodeReference({ module: "@kamod-ch/ui", imported: "Button", local: "Save" })).toBe(
    "/docs/button/installation#api-reference",
  );
  expect(
    resolveCodeReference({ module: "@/components/kamod-ui/card", imported: "CardContent" }),
  ).toBe("/docs/card/installation#api-reference");
  expect(resolveCodeReference({ module: "@kamod-ch/ui/button" })).toBe(
    "/docs/button/installation#api-reference",
  );
  expect(resolveCodeReference({ module: "@kamod-ch/hooks" })).toBe(
    "/docs/hooks-package/installation",
  );
  expect(resolveCodeReference({ module: "@/lib/utils", imported: "cn" })).toBe(
    "/docs/cn/installation#api-reference",
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

it("accepts only GitHub repository metadata", () => {
  expect(repositoryUrl("preactjs/preact")).toBe("https://github.com/preactjs/preact");
  expect(repositoryUrl({ url: "git+https://github.com/org/project.git" })).toBe(
    "https://github.com/org/project",
  );
  expect(repositoryUrl({ url: "javascript:alert(1)" })).toBeUndefined();
  expect(repositoryUrl({ url: "https://example.test/not-github" })).toBeUndefined();
});
