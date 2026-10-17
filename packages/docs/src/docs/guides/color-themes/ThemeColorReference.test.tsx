/** @vitest-environment jsdom */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { THEME_PRESETS } from "@kamod-ch/themes";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { ThemeColorReference } from "./ThemeColorReference";
import {
  colorFromBytes,
  colorGroups,
  coreColorNames,
  semanticColorNames,
  themeColorTokens,
} from "./theme-color-tokens";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("covers every shipped semantic color and every optional Watson source shade", () => {
  const foundation = readFileSync(
    resolve(import.meta.dirname, "../../../../../themes/src/tokens.css"),
    "utf8",
  );
  const body = foundation.match(/\[data-theme-scope\]\s*\{([^}]+)/)![1];
  const names = [...body.matchAll(/--([\w-]+):/g)]
    .map((match) => match[1])
    .filter((name) => name !== "radius");
  expect(semanticColorNames).toEqual(names);
  for (const { id } of THEME_PRESETS) {
    const tokens = themeColorTokens(id);
    expect(tokens.filter((token) => !token.optional).map((token) => token.name)).toEqual(names);
    expect(new Set(tokens.map((token) => token.name)).size).toBe(tokens.length);
    for (const token of tokens) {
      expect(colorGroups.some((group) => group.id === token.group)).toBe(true);
      expect(token.description).not.toBe("A semantic color supplied by the theme foundation.");
      for (const scheme of ["light", "dark"] as const) {
        expect(token[scheme].declaration).toBeTruthy();
        expect(token[scheme].source).toMatch(/^(tokens\.css|brands\/[\w-]+\.css)$/);
      }
    }
  }
  const watson = readFileSync(
    resolve(import.meta.dirname, "../../../../../themes/src/brands/watson.css"),
    "utf8",
  );
  const extra = [...watson.match(/@theme\s*\{([^}]+)/)![1].matchAll(/--(color-[\w-]+):/g)].map(
    (match) => match[1],
  );
  expect(
    themeColorTokens("watson")
      .filter((token) => token.optional)
      .map((token) => token.name),
  ).toEqual(extra);
});

it("includes Cursor Warm's appearance-specific source colors without shadow or font recipes", () => {
  const extra = themeColorTokens("cursor-warm").filter((token) => token.optional);
  expect(extra).toHaveLength(13);
  expect(extra.find((token) => token.name === "cursor-surface-100")!.light.declaration).toBe(
    "#f7f7f4",
  );
  expect(extra.find((token) => token.name === "cursor-surface-100")!.dark.declaration).toBe(
    "#2a2925",
  );
  expect(extra.find((token) => token.name === "cursor-text-secondary")!.dark.declaration).toBe(
    "rgba(242, 241, 237, 0.65)",
  );
  expect(extra.some((token) => /shadow|font|radius/.test(token.name))).toBe(false);
});

it("follows the actual foundation and brand cascade instead of inventing missing overrides", () => {
  const shadcn = themeColorTokens("shadcn");
  expect(shadcn.find((token) => token.name === "secondary")!.dark).toEqual({
    declaration: "var(--color-fuchsia-700)",
    source: "tokens.css",
  });
  expect(shadcn.find((token) => token.name === "ring")!.dark).toEqual({
    declaration: "hsl(240 4.9% 83.9%)",
    source: "brands/shadcn.css",
  });
  expect(shadcn.find((token) => token.name === "primary-accent")!.dark).toEqual({
    declaration: "var(--color-neutral-300)",
    source: "tokens.css",
  });
  const ocean = themeColorTokens("ocean");
  expect(ocean.find((token) => token.name === "primary")!.light.declaration).toBe(
    "var(--color-cyan-700)",
  );
  expect(ocean.find((token) => token.name === "primary-foreground")!.light.source).toBe(
    "tokens.css",
  );
});

it("exports transparent sRGB colors without silently discarding alpha", () => {
  expect(colorFromBytes("color(srgb 1 0 0 / 0.5)", [255, 0, 0, 128])).toEqual({
    css: "color(srgb 1 0 0 / 0.5)",
    hex: "#FF000080",
    rgb: "rgb(255 0 0 / 0.502)",
    alpha: 128 / 255,
  });
  expect(colorFromBytes("rgb(0, 128, 255)", [0, 128, 255, 255]).hex).toBe("#0080FF");
});

it("server-renders both complete appearances with working variable values and no preference writes", () => {
  const storage = vi.spyOn(Storage.prototype, "setItem");
  for (const { id, label } of THEME_PRESETS) {
    const html = renderToString(<ThemeColorReference preset={id} label={label} />);
    const document = new DOMParser().parseFromString(html, "text/html");
    expect(document.querySelectorAll(`#color-theme-${id}-core-colors`)).toHaveLength(1);
    expect(document.querySelectorAll(`#color-theme-${id}-all-colors`)).toHaveLength(1);
    expect(document.querySelectorAll(".theme-color-swatch")).toHaveLength(coreColorNames.length);
    expect(document.querySelectorAll(".theme-color-token-value")).toHaveLength(
      themeColorTokens(id).length * 2,
    );
    expect(document.querySelectorAll("[data-theme-scope].light")).not.toHaveLength(0);
    expect(document.querySelectorAll("[data-theme-scope].dark")).not.toHaveLength(0);
    expect(document.querySelectorAll('[role="tooltip"]')).toHaveLength(0);
    expect(document.querySelector('[data-code-help="off"]')).toBeTruthy();
  }
  expect(storage).not.toHaveBeenCalled();
});

it("uses one lazy batch per preset and keeps inspection, keyboard help and filtering local", async () => {
  let observerCallback: IntersectionObserverCallback | undefined;
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const view = render(<ThemeColorReference preset="ocean" label="Ocean" />);
  await waitFor(() => expect(observerCallback).toBeTypeOf("function"));
  expect(view.container.querySelector(".theme-color-swatch-value")).toHaveTextContent(
    "Available in browser",
  );
  observerCallback!(
    [{ isIntersecting: true } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
  await waitFor(() => expect(disconnect).toHaveBeenCalledOnce());
  const target = view.getByRole("button", { name: "Inspect Ocean dark Boundary color" });
  await act(() => target.focus());
  await waitFor(() =>
    expect(view.getByRole("tooltip")).toHaveTextContent("composited over its actual backdrop"),
  );
  expect(target).toHaveAttribute("aria-describedby", view.getByRole("tooltip").id);
  fireEvent.keyDown(target, { key: "Escape" });
  await waitFor(() => expect(view.queryByRole("tooltip")).toBeNull());
  fireEvent.click(target);
  expect(view.container.querySelector(".theme-color-inspector-intro")).toHaveTextContent(
    "Boundary / Dark",
  );
  expect(view.getByRole("button", { name: "Copy border CSS variable" })).toBeTruthy();
  fireEvent.input(view.getByRole("searchbox", { name: "Find a Ocean color" }), {
    target: { value: "sidebar" },
  });
  expect(view.container.querySelectorAll(".theme-color-token-value")).toHaveLength(16);
  fireEvent.click(view.getByRole("button", { name: "Dark", exact: true }));
  expect(view.container.querySelectorAll(".theme-color-paint.dark")).toHaveLength(8);
  expect(storage).not.toHaveBeenCalled();
});

it("keeps unavailable fixed colors disabled and copies the selected CSS variable exactly", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  const view = render(<ThemeColorReference preset="ocean" label="Ocean" />);
  const fixed = view.getByRole("button", { name: "Copy Ocean light Primary hex" });
  expect(fixed).toBeDisabled();
  fireEvent.click(fixed);
  expect(writeText).not.toHaveBeenCalled();
  fireEvent.input(view.getByRole("combobox"), { target: { value: "variable" } });
  await waitFor(() =>
    expect(
      view.getByRole("button", { name: "Copy Ocean light Primary variable" }),
    ).not.toBeDisabled(),
  );
  fireEvent.click(view.getByRole("button", { name: "Copy Ocean light Primary variable" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith("var(--primary)"));
  fireEvent.click(view.getByRole("button", { name: "Inspect Ocean dark Boundary color" }));
  fireEvent.click(view.getByRole("button", { name: "Copy border CSS variable" }));
  await waitFor(() => expect(writeText).toHaveBeenLastCalledWith("var(--border)"));
});
