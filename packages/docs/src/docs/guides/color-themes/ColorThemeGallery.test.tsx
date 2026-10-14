/** @vitest-environment jsdom */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { colorSchemeSignal, setColorScheme, setThemePreset, THEME_PRESETS } from "@kamod-ch/themes";
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { hydrate, render as renderPreact } from "preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { GuideArticle } from "../../components/GuideArticle";
import { createComponentThemingSections } from "../component-theming";
import { ColorThemeGallery } from "./ColorThemeGallery";
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
  expect(document.querySelectorAll("[data-theme-scope]")).toHaveLength(THEME_PRESETS.length * 2);
  expect(storage).not.toHaveBeenCalled();
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
    expect(study.querySelectorAll(`[data-theme="${id}"]`)).toHaveLength(2);
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
