/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, within } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { PrismThemeGallery, PrismThemeStudy } from "./PrismThemeGallery";
import { prismScopeRecipe, prismSpecimens } from "./prism-specimens";
import { prismThemeId, prismThemes } from "./prism-theme-catalog";

// These tests exercise chapter state and lifecycle; Code's grammar and reader have their own suite.
vi.mock("../../../components/CodeBlock", () => ({
  CodeBlock: ({
    code,
    language,
    highlight,
    filePath,
  }: {
    code: string;
    language: string;
    highlight: boolean;
    filePath: string;
  }) => (
    <pre data-highlight={String(highlight)} data-language={language} aria-label={filePath}>
      {code}
    </pre>
  ),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const first = prismThemes[0];
const second = prismThemes[1];

it("server-renders every real chapter and token destination without starting highlights or recipes", () => {
  const save = vi.spyOn(Storage.prototype, "setItem");
  const markup = renderToString(<PrismThemeGallery />);
  const doc = new DOMParser().parseFromString(markup, "text/html");
  expect(doc.querySelectorAll(".prism-theme-study")).toHaveLength(prismThemes.length);
  for (const theme of prismThemes) {
    const id = prismThemeId(theme.id);
    expect(doc.getElementById(id)?.tagName).toBe("H4");
    expect(doc.getElementById(`${id}-tokens`)?.tagName).toBe("H5");
    expect(doc.getElementById(`${id}-recipe`)?.tagName).toBe("H5");
    expect(doc.querySelector(`[data-prism-theme="${theme.id}"]`)).not.toBeNull();
  }
  expect(doc.querySelectorAll('[data-highlight="false"]')).toHaveLength(prismThemes.length);
  expect(doc.querySelectorAll('[data-highlight="true"]')).toHaveLength(0);
  expect(doc.querySelectorAll('[aria-label="ThemedSnippet.tsx"]')).toHaveLength(0);
  expect(doc.querySelector("style")?.textContent).toContain(prismThemes[0].css);
  expect(save).not.toHaveBeenCalled();
});

it("switches source language only inside the chosen study without changing the page appearance", () => {
  const save = vi.spyOn(Storage.prototype, "setItem");
  const attributes = [...document.documentElement.attributes].map(({ name, value }) => [
    name,
    value,
  ]);
  const view = render(
    <>
      <PrismThemeStudy theme={first} index={0} />
      <PrismThemeStudy theme={second} index={1} />
    </>,
  );
  const studies = view.container.querySelectorAll<HTMLElement>(".prism-theme-study");
  fireEvent.click(within(studies[0]).getByRole("button", { name: "CSS", exact: true }));
  expect(within(studies[0]).getByLabelText(prismSpecimens.css.fileName)).toHaveTextContent(
    ".review-queue",
  );
  expect(within(studies[0]).getByRole("button", { name: "CSS", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(within(studies[1]).getByLabelText(prismSpecimens.tsx.fileName)).toBeTruthy();
  expect(within(studies[1]).getByRole("button", { name: "TSX", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect([...document.documentElement.attributes].map(({ name, value }) => [name, value])).toEqual(
    attributes,
  );
  expect(save).not.toHaveBeenCalled();
});

it("uses one shared nearby observer, activates just the approached study, then releases it", () => {
  let notify!: IntersectionObserverCallback;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  const createObserver = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
        createObserver();
      }
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    },
  );
  let hidden = false;
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  const view = render(
    <>
      <PrismThemeStudy theme={first} index={0} />
      <PrismThemeStudy theme={second} index={1} />
    </>,
  );
  const studies = view.container.querySelectorAll<HTMLElement>(".prism-theme-study");
  const near = (target: Element) =>
    act(() => {
      notify(
        [{ target, isIntersecting: true }] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });
  expect(createObserver).toHaveBeenCalledTimes(1);
  expect(observe).toHaveBeenCalledTimes(2);
  expect(view.container.querySelectorAll('[data-highlight="true"]')).toHaveLength(0);
  near(studies[0]);
  expect(studies[0].querySelector("pre")).toHaveAttribute("data-highlight", "true");
  expect(studies[1].querySelector("pre")).toHaveAttribute("data-highlight", "false");
  expect(unobserve).toHaveBeenCalledWith(studies[0]);
  expect(disconnect).not.toHaveBeenCalled();
  hidden = true;
  near(studies[1]);
  expect(studies[1].querySelector("pre")).toHaveAttribute("data-highlight", "false");
  hidden = false;
  fireEvent(document, new Event("visibilitychange"));
  expect(studies[1].querySelector("pre")).toHaveAttribute("data-highlight", "true");
  expect(disconnect).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(unobserve).toHaveBeenCalledTimes(2);
});

it("inspects exact token values and makes precise source help available from keyboard focus", () => {
  const view = render(<PrismThemeStudy theme={first} index={0} />);
  const token = first.colors.find((color) => color.id === "string")!;
  const swatch = view.getByRole("button", {
    name: `Inspect ${first.label} ${token.label.toLowerCase()} color`,
  });
  fireEvent.click(swatch);
  expect(swatch).toHaveAttribute("aria-pressed", "true");
  const selected = view.getByLabelText(`${first.label} selected color`);
  expect(selected).toHaveTextContent(token.value);
  expect(selected).toHaveTextContent(token.selector);
  expect(
    within(selected).getByRole("button", {
      name: `Copy ${first.label} ${token.label.toLowerCase()} color`,
    }),
  ).toBeTruthy();
  fireEvent.focus(swatch);
  expect(view.getByRole("tooltip")).toHaveTextContent(token.description);
  expect(view.getByRole("tooltip")).toHaveTextContent(token.selector);
  expect(view.getByRole("tooltip")).toHaveTextContent("Ink on the saved canvas");
  fireEvent.keyDown(swatch, { key: "Escape" });
  expect(view.queryByRole("tooltip")).toBeNull();
});

it("copies the currently inspected source color and the complete licensed adapter independently", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
  try {
    const view = render(<PrismThemeStudy theme={first} index={0} />);
    const token = first.colors.find((color) => color.id === "comment")!;
    fireEvent.click(
      view.getByRole("button", {
        name: `Inspect ${first.label} ${token.label.toLowerCase()} color`,
      }),
    );
    await act(async () => {
      fireEvent.click(
        view.getByRole("button", {
          name: `Copy ${first.label} ${token.label.toLowerCase()} color`,
        }),
      );
    });
    expect(writeText).toHaveBeenLastCalledWith(token.value);
    await act(async () => {
      fireEvent.click(view.getByRole("button", { name: "Copy scoped CSS", exact: true }));
    });
    expect(writeText).toHaveBeenLastCalledWith(first.css);
    expect(writeText).toHaveBeenCalledTimes(2);
  } finally {
    if (original) Object.defineProperty(navigator, "clipboard", original);
    else Reflect.deleteProperty(navigator, "clipboard");
  }
});

it("mounts a complete integration recipe only when requested and keeps its scope tied to its CSS file", () => {
  const view = render(<PrismThemeStudy theme={first} index={0} />);
  expect(view.queryByLabelText("ThemedSnippet.tsx")).toBeNull();
  fireEvent.click(view.getByRole("button", { name: "Show TSX example" }));
  expect(view.getByRole("button", { name: "Hide TSX example" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  const recipe = view.getByLabelText("ThemedSnippet.tsx");
  expect(recipe.textContent).toBe(prismScopeRecipe(first.id));
  expect(recipe).toHaveTextContent(`import "./prism-${first.id}.css"`);
  expect(recipe).toHaveTextContent(`data-prism-theme="${first.id}"`);
  expect(recipe).toHaveTextContent('syntaxTheme="default"');
  fireEvent.click(view.getByRole("button", { name: "Hide TSX example" }));
  expect(view.queryByLabelText("ThemedSnippet.tsx")).toBeNull();
});

it("downloads the exact local scoped stylesheet and its included notice without fetching a website", async () => {
  const createObjectURL = vi.fn((_blob: Blob) => "blob:prism-theme");
  const revokeObjectURL = vi.fn();
  vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    expect(this.download).toBe(`prism-${first.id}.css`);
  });
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  const view = render(<PrismThemeStudy theme={first} index={0} />);
  fireEvent.click(view.getByRole("button", { name: `Download ${first.label} scoped CSS` }));
  expect(createObjectURL).toHaveBeenCalledTimes(1);
  const blob = createObjectURL.mock.calls[0][0] as Blob;
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
  expect(source).toBe(first.css);
  expect(source).toMatch(/Permission is hereby granted/);
  expect(source).toContain(`[data-prism-theme="${first.id}"]`);
  expect(fetch).not.toHaveBeenCalled();
  view.unmount();
  expect(revokeObjectURL).toHaveBeenCalledWith("blob:prism-theme");
});
