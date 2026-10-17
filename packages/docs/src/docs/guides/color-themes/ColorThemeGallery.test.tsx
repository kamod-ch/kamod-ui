/** @vitest-environment jsdom */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { colorSchemeSignal, setColorScheme, setThemePreset, THEME_PRESETS } from "@kamod-ch/themes";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { hydrate, render as renderPreact } from "preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { GuideArticle } from "../../components/GuideArticle";
import { themingDocPage } from "../../pages/theming-doc";
import { createComponentThemingSections } from "../component-theming";
import { ColorThemeGallery } from "./ColorThemeGallery";
import { presetDesignNotes } from "./preset-design-notes";
import { presetStudyId } from "./preset-studies";

const source = readFileSync(
  resolve(import.meta.dirname, "../../../../.preactpress/content/theming-foundations.md"),
  "utf8",
);

afterEach(() => {
  cleanup();
  setThemePreset("kamod");
  setColorScheme("light");
  localStorage.clear();
  vi.restoreAllMocks();
});

it("server-renders every gallery contents target once without saving appearance", () => {
  const sections = createComponentThemingSections(source);
  const gallery = sections.find(({ id }) => id === "color-theme-presets")!;
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const html = renderToString(
    <GuideArticle
      header={null}
      sections={[gallery]}
      sectionContent={{ [gallery.id]: <ColorThemeGallery /> }}
    />,
  );
  const document = new DOMParser().parseFromString(html, "text/html");
  for (const id of [gallery.id, ...gallery.children!.map(({ id }) => id)]) {
    expect(document.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
  }
  expect(document.querySelectorAll("[data-theme-scope]")).toHaveLength(THEME_PRESETS.length * 6);
  expect(document.querySelectorAll(".theme-study-practice")).toHaveLength(THEME_PRESETS.length);
  expect(document.querySelectorAll("[data-palette-sketch]")).toHaveLength(THEME_PRESETS.length * 6);
  expect(document.querySelectorAll(".theme-study-colors > div")).toHaveLength(
    THEME_PRESETS.length * 16,
  );
  expect(document.querySelectorAll(".theme-study-notes[open]")).toHaveLength(0);
  for (const panel of document.querySelectorAll(".theme-study-preview")) {
    expect(
      [...panel.querySelectorAll(".theme-study-colors code")].map((node) => node.textContent),
    ).toEqual([
      "--primary",
      "--secondary",
      "--accent",
      "--background",
      "--card",
      "--muted",
      "--destructive",
      "--sidebar-background",
    ]);
  }
  expect(document.querySelectorAll(".theme-study .kamod-code")).toHaveLength(0);
  expect(document.querySelectorAll('[aria-busy="true"], iframe')).toHaveLength(0);
  expect(storage).not.toHaveBeenCalled();
});

it("keeps every generated preset route attached to its real guide target", () => {
  const gallery = createComponentThemingSections(source).find(
    ({ id }) => id === "color-theme-presets",
  )!;
  const routes = themingDocPage.sections.find(({ id }) => id === gallery.id)!;
  expect(routes.children).toEqual(gallery.children);
  expect(themingDocPage.exampleSectionIds).toEqual([]);
});

it("mounts a local recipe only on request and releases it when closed", async () => {
  const view = render(<ColorThemeGallery />);
  const study = view.container.querySelector(`[aria-labelledby="${presetStudyId("ocean")}"]`)!;
  const recipe = study.querySelector<HTMLDetailsElement>(".theme-study-recipe")!;
  expect(recipe.querySelector(".kamod-code")).toBeNull();
  recipe.open = true;
  fireEvent(recipe, new Event("toggle"));
  await waitFor(() =>
    expect(recipe.querySelector("pre code")).toHaveTextContent('data-theme="ocean"'),
  );
  recipe.open = false;
  fireEvent(recipe, new Event("toggle"));
  await waitFor(() => expect(recipe.querySelector(".kamod-code")).toBeNull());
});

it("keeps documented radius and primary font families aligned with the shipped preset CSS", () => {
  const tokens = readFileSync(
    resolve(import.meta.dirname, "../../../../../themes/src/tokens.css"),
    "utf8",
  );
  const baseRadius = tokens.match(/--radius:\s*([^;]+);/)![1];
  for (const { id } of THEME_PRESETS) {
    const css =
      id === "kamod"
        ? tokens
        : readFileSync(
            resolve(import.meta.dirname, `../../../../../themes/src/brands/${id}.css`),
            "utf8",
          );
    expect(presetDesignNotes[id].radius, id).toBe(
      css.match(/--radius:\s*([^;]+);/)?.[1] ?? baseRadius,
    );
    const family = presetDesignNotes[id].type.family;
    if (family) {
      const primary = css.match(/--font-primary:\s*([^;]+);/)![1];
      const declaration = primary.startsWith("var(")
        ? css.match(/--font-sans:\s*([^;]+);/)![1]
        : primary;
      expect(declaration.replace(/\s+/g, " ").trim().startsWith(family), id).toBe(true);
    }
  }
});

it("applies a page preset and preserves the scheme and isolated comparison scopes", () => {
  setThemePreset("kamod");
  setColorScheme("dark");
  const view = render(<ColorThemeGallery />);
  fireEvent.click(view.getByRole("button", { name: "Use Ocean theme on this page" }));
  expect(document.documentElement).toHaveAttribute("data-theme", "ocean");
  expect(colorSchemeSignal.value).toBe("dark");
  expect(localStorage.getItem("theme-preset")).toBe("ocean");
  expect(localStorage.getItem("theme")).toBe("dark");
  expect(view.getByRole("button", { name: "Use Ocean theme on this page" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.getByRole("button", { name: "Use Kamod theme on this page" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  for (const { id } of THEME_PRESETS) {
    const study = view.container.querySelector(`[aria-labelledby="${presetStudyId(id)}"]`)!;
    expect(study.querySelectorAll(`[data-theme="${id}"]`)).toHaveLength(4);
    expect(study.querySelector(".theme-study-preview.light")).toBeTruthy();
    expect(study.querySelector(".theme-study-preview.dark")).toBeTruthy();
  }
});

it("hydrates a saved preset with matching selected attributes, not just updated text", async () => {
  const container = document.createElement("div");
  container.innerHTML = renderToString(<ColorThemeGallery />);
  document.body.append(container);
  setThemePreset("ocean");
  setColorScheme("dark");
  try {
    await act(() => hydrate(<ColorThemeGallery />, container));
    await waitFor(() => {
      const selected = container.querySelector('[aria-label="Use Ocean theme on this page"]');
      expect(selected).toHaveAttribute("aria-pressed", "true");
      expect(selected).toHaveTextContent("In use");
      expect(
        container.querySelector('[aria-label="Use Kamod theme on this page"]'),
      ).toHaveAttribute("aria-pressed", "false");
    });
    expect(colorSchemeSignal.value).toBe("dark");
  } finally {
    act(() => renderPreact(null, container));
    container.remove();
  }
});
