/** @vitest-environment jsdom */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { colorSchemeSignal, setColorScheme, setThemePreset, THEME_PRESETS } from "@kamod-ch/themes";
import { act, cleanup, fireEvent, render, waitFor, within } from "@testing-library/preact";
import { hydrate, render as renderPreact } from "preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { GuideArticle } from "../../components/GuideArticle";
import { flattenContents } from "../../components/PageContentsList";
import { themingDocPage } from "../../pages/theming-doc";
import { createComponentThemingSections } from "../component-theming";
import { ColorThemeGallery } from "./ColorThemeGallery";
import { presetDesignNotes } from "./preset-design-notes";
import { presetStudyId } from "./preset-studies";
import { prismThemes } from "./prism/prism-theme-catalog";

const source = readFileSync(
  resolve(import.meta.dirname, "../../../../.preactpress/content/theming-foundations.md"),
  "utf8",
);

// These integration tests exercise gallery preference ownership. Keep offscreen
// palette resolution idle, as in a browser; its viewport/color work has separate coverage.
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  setThemePreset("kamod");
  setColorScheme("light");
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it(
  "server-renders every gallery contents target once without saving appearance",
  { timeout: 15000 },
  () => {
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
    for (const id of [gallery.id, ...flattenContents(gallery.children!).map(({ id }) => id)]) {
      expect(document.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
    }
    expect(document.querySelectorAll(".theme-study-practice")).toHaveLength(THEME_PRESETS.length);
    expect(document.querySelectorAll("[data-palette-sketch]")).toHaveLength(
      THEME_PRESETS.length * 6,
    );
    expect(document.querySelectorAll(".theme-study-notes[open]")).toHaveLength(0);
    for (const { id } of THEME_PRESETS) {
      const study = document.querySelector(`[aria-labelledby="${presetStudyId(id)}"]`)!;
      expect(study.tagName).toBe("SECTION");
      for (const link of study.querySelectorAll<HTMLAnchorElement>(".theme-study-jump-links a")) {
        expect(study.querySelectorAll(`[id="${link.hash.slice(1)}"]`)).toHaveLength(1);
      }
      expect(study.querySelector(".theme-color-core")).not.toBeNull();
      expect(study.querySelector(".theme-color-all")).not.toBeNull();
      expect(study.querySelector(".theme-playground")).not.toBeNull();
      expect(study.querySelector(".theme-study-recipe pre code")?.textContent).toContain(
        `data-theme="${id}"`,
      );
    }
    expect(document.querySelectorAll(".theme-study .kamod-code")).toHaveLength(
      THEME_PRESETS.length,
    );
    expect(document.querySelectorAll(".prism-theme-index-links a")).toHaveLength(
      prismThemes.length,
    );
    expect(document.querySelectorAll('[aria-busy="true"], iframe')).toHaveLength(0);
    expect(storage).not.toHaveBeenCalled();
  },
);

it("keeps every generated preset route attached to its real guide target", () => {
  const gallery = createComponentThemingSections(source).find(
    ({ id }) => id === "color-theme-presets",
  )!;
  const routes = themingDocPage.sections.find(({ id }) => id === gallery.id)!;
  expect(routes.children).toEqual(gallery.children);
  expect(themingDocPage.exampleSectionIds).toEqual([]);
});

it("renders the complete scoped app recipe without a disclosure or additional action", () => {
  const view = render(<ColorThemeGallery />);
  const study = view.container.querySelector(`[aria-labelledby="${presetStudyId("ocean")}"]`)!;
  const recipe = study.querySelector(".theme-study-recipe")!;
  expect(recipe.tagName).toBe("SECTION");
  expect(recipe.querySelector("summary")).toBeNull();
  expect(recipe.querySelector("pre code")).toHaveTextContent('data-theme="ocean"');
  expect(recipe.querySelector('[aria-label="Copy code"]')).not.toBeNull();
  expect(recipe.querySelector('[aria-label="Download code"]')).not.toBeNull();
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
  const header = (id: string) =>
    within(
      view.container.querySelector<HTMLElement>(
        `[aria-labelledby="color-theme-${id}"] .theme-study-header`,
      )!,
    );
  const oceanAction = header("ocean").getByRole("button", { name: "Use Ocean theme on this page" });
  fireEvent.click(oceanAction);
  expect(document.documentElement).toHaveAttribute("data-theme", "ocean");
  expect(colorSchemeSignal.value).toBe("dark");
  expect(localStorage.getItem("theme-preset")).toBe("ocean");
  expect(localStorage.getItem("theme")).toBe("dark");
  expect(oceanAction).toHaveAttribute("aria-pressed", "true");
  expect(
    header("kamod").getByRole("button", { name: "Use Kamod theme on this page" }),
  ).toHaveAttribute("aria-pressed", "false");
  for (const { id } of THEME_PRESETS) {
    const study = view.container.querySelector(`[aria-labelledby="${presetStudyId(id)}"]`)!;
    for (const scope of study.querySelectorAll("[data-theme-scope]")) {
      expect(scope).toHaveAttribute("data-theme", id);
    }
    expect(study.querySelector(".theme-study-preview.light")).toBeTruthy();
    expect(study.querySelector(".theme-study-preview.dark")).toBeTruthy();
  }
}, 20000);

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
}, 20000);
