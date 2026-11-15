import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { componentApiExport, componentApiExports } from "./generated-component-api";

describe("generated component API", () => {
  it("covers every @kamod-ch/ui package export", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("../../../core/package.json", import.meta.url), "utf8"),
    ) as {
      exports: Record<string, unknown>;
    };
    expect(
      componentApiExports()
        .map((entry) => entry.export)
        .sort(),
    ).toEqual(Object.keys(pkg.exports).sort());
  });

  it("records button props, signal status, and theme-toggle peers", () => {
    const button = componentApiExport("button");
    const variant = button?.components
      .find((component) => component.name === "Button")
      ?.props.find((prop) => prop.name === "variant");
    expect(button?.signals).toBe("none");
    expect(button?.specifier).toBe("@kamod-ch/ui/button");
    expect(variant?.default).toBe('"default"');
    expect(variant?.type).toContain('"outline"');
    expect(componentApiExport("checkbox")?.signals).toBe("none");
    expect(componentApiExport("switch")?.signals).toBe("none");
    expect(componentApiExport("dialog")?.signals).toBe("direct");
    expect(componentApiExport("dialog")?.components.map((component) => component.name)).toContain(
      "DialogTrigger",
    );
    expect(componentApiExport("sheet")?.signals).toBe("indirect");
    expect(componentApiExport("sheet")?.signalsVia).toBe("dialog");
    expect(componentApiExport("theme-toggle")?.peers).toContain("@kamod-ch/themes");
    expect(componentApiExport("lib/signals")?.signals).toBe("direct");
  });
});
