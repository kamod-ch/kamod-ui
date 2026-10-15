/** @vitest-environment jsdom */

import catalog from "virtual:kamod-code-references";
import { cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it } from "vitest";
import { packageLabels } from "./catalog/packages";
import { technologies } from "./catalog/technologies";
import { parseCommand } from "./command-reference";
import { connectInlineCode } from "./connect-inline-references";
import { CodeReferenceHelpContent } from "./help/code-reference-help";
import { loadCodeReferenceHelp } from "./help/loader";
import { InlineCodeReference } from "./InlineCodeReference";
import { inlineSourceReference } from "./inline-references";
import { sourceReferenceHelp } from "./source-reference-target";

afterEach(cleanup);

it.each([
  "pnpm build",
  "npm add preact",
  "pnpm run build",
  "corepack pnpm",
  "$ git status",
  "npx shadcn add button",
  "pnpm constructor",
  'pnpm --filter "@kamod-ch/ui-docs" add @formisch/preact valibot',
])(
  "recognizes a complete invocation without reclassifying its package arguments: %s",
  async (label) => {
    const request = inlineSourceReference(label)!;
    expect(request.referenceId).toMatch(/^command:/);
    const help = await loadCodeReferenceHelp(request);
    expect(help.kind).toBe("command");
    expect(help.name).toBe(label);
    expect(help.originLabel).toBe("Tool");
    expect(help.detail).toContain("No command is executed");
    expect(help.fields).toBeUndefined();
  },
);

it("keeps quoted arguments together and removes workspace selectors from the operation", () => {
  expect(parseCommand('corepack pnpm --filter="@kamod-ch/ui-docs" run build')).toMatchObject({
    tool: "pnpm",
    wrapped: true,
    workspace: "@kamod-ch/ui-docs",
    operation: "run",
    args: ["run", "build"],
  });
  expect(parseCommand("pnpm -w run build")?.operation).toBe("run");
});

it.each([
  "pnpm",
  "pnpm run build && git status",
  "npm add preact | cat",
  "git status > output.txt",
  "pnpm run `whoami`",
  "pnpm run $(whoami)",
  "pnpm run ${SCRIPT}",
  'pnpm run "unfinished',
  "pnpm run build\nother",
  `pnpm run ${"x".repeat(1024)}`,
])("does not parse a bare tool, compound command or shell expression: %s", (label) => {
  expect(parseCommand(label)).toBeUndefined();
  if (label !== "pnpm") expect(inlineSourceReference(label)).toBeUndefined();
});

it("covers every authored technology name and alias, case-insensitively, without changing visible spelling", async () => {
  for (const { name, aliases = [] } of technologies) {
    for (const label of [name, name.toLowerCase(), ...aliases]) {
      const request = inlineSourceReference(label)!;
      expect(request, label).toBeDefined();
      // Verified exports and unambiguous package names take precedence over technology aliases.
      if (request.imported) continue;
      if (Object.hasOwn(packageLabels, label.toLowerCase())) {
        expect(request.module, label).toBe(packageLabels[label.toLowerCase()]);
        expect((await loadCodeReferenceHelp(request)).kind, label).toBe("package");
        continue;
      }
      expect(request.referenceId, label).toMatch(/^technology:/);
      expect((await loadCodeReferenceHelp(request)).name).toBe(label);
    }
  }
  expect(inlineSourceReference("Tailwind CSS v4")?.referenceId).toBe("technology:tailwind");
  expect(inlineSourceReference("preact/hooks")?.referenceId).toBeUndefined();
  expect(inlineSourceReference("@formisch/preact")?.referenceId).toBeUndefined();
  expect(inlineSourceReference("useState()")?.imported).toBe("useState");
});

it.each([
  ["sidebar-05.tsx", "/blocks/sidebar/sidebar-05"],
  ["Application Shell 8", "/blocks/application-shell/application-shell-8"],
  ["@kamod-ch/blocks/signup/signup-01", "/blocks/signup/signup-01"],
  ["login/login-03", "/blocks/login/login-03"],
])(
  "resolves registered block identity %s to its real guide and source directory",
  async (label, href) => {
    const request = inlineSourceReference(label)!;
    expect(request.href).toBe(href);
    const help = await loadCodeReferenceHelp(request);
    expect(help).toMatchObject({ kind: "block", originLabel: "Workspace target" });
    expect(help.detail).toContain("not a published installable package");
    expect(help.source?.href).toContain(
      `/tree/main/packages/blocks/src/${href.slice("/blocks/".length)}`,
    );
    expect(help.facts?.find(({ label }) => label === "Source files")?.value).not.toBe("0");
  },
);

it.each([
  "Getting Started Guide",
  "Theming Guide",
  "Theme Tokens",
  "CSS Guide",
  "Block Setup Guide",
  "Forms",
])(
  "classifies the authored guide name %s as a page, without a separate guide family",
  async (label) => {
    const request = inlineSourceReference(label)!;
    expect(request.referenceId).toMatch(/^page:/);
    expect((await loadCodeReferenceHelp(request)).originLabel).toBe("Page");
  },
);

it("validates page/section destinations against real routes, preserving the authored anchor", async () => {
  for (const path of [
    "/docs/components#library-items",
    "/docs/code/installation#code-prism-pipeline",
    "/docs/code/code-prism-pipeline",
    "/blocks/signup/signup-01#signup-01-copy",
  ]) {
    const request = inlineSourceReference(path)!;
    expect(request.href).toBe(path);
    expect(request.referenceId).toMatch(/^page:/);
    expect((await loadCodeReferenceHelp(request)).docs?.href).toBe(path);
  }
  const request = inlineSourceReference("Read this section", "/docs/components#library-items")!;
  expect((await loadCodeReferenceHelp(request)).facts).toEqual([
    { label: "Section ID", value: "library-items" },
  ]);
  for (const label of [
    "/docs/unknown",
    "/docs/components#invented",
    "#library-items",
    "Usage",
    "Installation",
    "sidebar-99.tsx",
    "UnknownTechnology",
    "--primary",
    "aria-current",
    "window",
    "package.json",
  ])
    expect(inlineSourceReference(label), label).toBeUndefined();
  // The pre-existing package fallback does not claim an unknown subpath is a registered block.
  expect(inlineSourceReference("@kamod-ch/blocks/signup/signup-99")?.referenceId).toBeUndefined();
  expect(inlineSourceReference("preact", "javascript:alert(1)")).toBeUndefined();
  expect(inlineSourceReference("pnpm build", "//example.com")).toBeUndefined();
});

it("round-trips family identities through native links and delegated authored destinations, with cleanup", () => {
  const { container, getByRole } = render(
    <>
      <InlineCodeReference>pnpm build</InlineCodeReference>
      <p>
        <a href="/docs/components#library-items">
          <code>Read this section</code>
        </a>
        <code>Valibot</code>
      </p>
      <pre>
        <code>pnpm build</code>
      </pre>
    </>,
  );
  const request = sourceReferenceHelp(getByRole("link", { name: "pnpm build" }));
  expect(request?.referenceId).toBe("command:pnpm");
  const stop = connectInlineCode(document);
  const link = getByRole("link", { name: "Read this section" });
  expect(sourceReferenceHelp(link)?.referenceId).toBe("page:/docs/components");
  expect(container.querySelector("pre code")).not.toHaveAttribute("data-code-reference");
  stop();
  expect(link).not.toHaveAttribute("data-code-reference");
  expect(link).toHaveAttribute("href", "/docs/components#library-items");
});

it("keeps detailed metadata out of the eager identity index and renders family facts without prop markers", async () => {
  expect(JSON.stringify(catalog.inline)).not.toContain('"description":');
  const reference = await loadCodeReferenceHelp(
    inlineSourceReference("pnpm --filter @kamod-ch/ui-docs run build")!,
  );
  const { container, getByText } = render(<CodeReferenceHelpContent reference={reference} />);
  expect(getByText("Workspace selector")).toBeVisible();
  expect(getByText("@kamod-ch/ui-docs")).toBeVisible();
  expect(container.textContent).not.toMatch(/Required|Optional|Import from/);
});
