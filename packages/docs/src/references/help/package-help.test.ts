import { expect, it } from "vitest";
import { withBasePath } from "../../base-path";
import { inlineSourceReference } from "../inline-references";
import { loadCodeReferenceHelp } from "./loader";
import { packageReferenceHelp } from "./package-help";

it("opens saved root profiles for prose package labels while keeping actual imported symbols", async () => {
  for (const module of ["ui", "hooks", "icons", "signals", "preactpress"]) {
    const name = `@kamod-ch/${module}`;
    const request = inlineSourceReference(name)!;
    expect(request).toBeDefined();
    const reference = await loadCodeReferenceHelp(request);
    expect(reference.kind).toBe("package");
    expect(reference.name).toBe(name);
    expect(reference.sections?.length).toBeGreaterThanOrEqual(3);
    expect(reference.notice).toBeUndefined();
  }
  const component = await loadCodeReferenceHelp(inlineSourceReference("Dialog")!);
  expect(component.kind).toBe("component");
  expect(component.source?.href).toContain("/dialog/Dialog.tsx");
  expect(component.notice).toBeUndefined();
  const hook = await loadCodeReferenceHelp(inlineSourceReference("useCounter")!);
  expect(hook.kind).toBe("function");
  expect(hook.source?.href).toContain("/useCounter/index.ts");
});

it("keeps the package preview and exact stylesheet destination distinct", async () => {
  const root = await loadCodeReferenceHelp(inlineSourceReference("@kamod-ch/ui")!);
  const entrypoint = await loadCodeReferenceHelp(inlineSourceReference("@kamod-ch/ui/theme.css")!);
  expect(entrypoint).toMatchObject({
    kind: "package",
    name: root.name,
    module: root.module,
    sections: root.sections,
    source: root.source,
    notice: {
      description: expect.stringContaining("`@kamod-ch/ui/theme.css`"),
      source: {
        href: "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/theme.css",
      },
    },
  });
  expect(entrypoint.related).toContainEqual({
    label: "In Kamod",
    href: withBasePath("/docs/theming/installation#css-setup"),
    kind: "guide",
  });
});

it("uses an honest repository search when an entrypoint has no verified file, without changing its owner", () => {
  const reference = packageReferenceHelp({
    module: "@kamod-ch/hooks/unlisted-entrypoint",
    label: "@kamod-ch/hooks/unlisted-entrypoint",
    href: "https://github.com/kamod-ch/kamod-hooks",
  })!;
  expect(reference.name).toBe("@kamod-ch/hooks");
  expect(reference.source?.href).toBe("https://github.com/kamod-ch/kamod-hooks");
  expect(reference.notice?.source).toEqual({
    label: "Find this entrypoint",
    href: "https://github.com/kamod-ch/kamod-hooks/search?q=unlisted-entrypoint&type=code",
  });
  expect(reference.notice?.description).toContain("searches its repository");
  for (const imported of ["useCounter", "*"])
    expect(
      packageReferenceHelp({ module: "@kamod-ch/hooks", imported, label: imported, href: "" }),
    ).toBeUndefined();
  expect(
    packageReferenceHelp({ module: "@kamod-ch/unknown", label: "unknown", href: "" }),
  ).toBeUndefined();
});
