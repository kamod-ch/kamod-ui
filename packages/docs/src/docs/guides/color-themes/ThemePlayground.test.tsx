/** @vitest-environment jsdom */
import { THEME_PRESETS } from "@kamod-ch/themes";
import { act, cleanup, fireEvent, render, within } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { ThemePlayground } from "./ThemePlayground";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("server-renders a usable local workspace for every preset without loading or saving", () => {
  const save = vi.spyOn(Storage.prototype, "setItem");
  const html = renderToString(
    <>
      {THEME_PRESETS.map(({ id, label }) => (
        <ThemePlayground key={id} preset={id} label={label} />
      ))}
    </>,
  );
  const document = new DOMParser().parseFromString(html, "text/html");
  for (const { id } of THEME_PRESETS) {
    const heading = document.querySelector(`#color-theme-${id}-playground`);
    expect(heading?.tagName).toBe("H4");
    expect(document.querySelectorAll(`[data-theme="${id}"][data-theme-scope]`)).toHaveLength(1);
  }
  expect(document.querySelectorAll('[data-slot="skeleton"], [aria-busy="true"]')).toHaveLength(0);
  expect(document.querySelectorAll('[data-slot="input"]')).toHaveLength(THEME_PRESETS.length);
  expect(save).not.toHaveBeenCalled();
});

it("changes only the selected workspace appearance and preserves page preferences", () => {
  const save = vi.spyOn(Storage.prototype, "setItem");
  const attributes = [...document.documentElement.attributes].map(({ name, value }) => [
    name,
    value,
  ]);
  const view = render(
    <>
      <ThemePlayground preset="kamod" label="Kamod" />
      <ThemePlayground preset="ocean" label="Ocean" />
    </>,
  );
  const kamod = view.container.querySelector('[data-theme="kamod"]')!;
  const ocean = view.container.querySelector('[data-theme="ocean"]')!;
  fireEvent.click(within(ocean as HTMLElement).getByRole("button", { name: "Dark", exact: true }));
  expect(ocean).toHaveClass("dark");
  expect(kamod).toHaveClass("light");
  expect(
    within(ocean as HTMLElement).getByRole("button", { name: "Dark", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  expect([...document.documentElement.attributes].map(({ name, value }) => [name, value])).toEqual(
    attributes,
  );
  expect(save).not.toHaveBeenCalled();
});

it("keeps publishing unavailable until the real form is valid and all checks are complete", () => {
  const view = render(<ThemePlayground preset="kamod" label="Kamod" />);
  const publish = view.getByRole("button", { name: "Publish preview" });
  expect(publish).toBeDisabled();
  expect(view.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  fireEvent.click(view.getByRole("checkbox", { name: /Both modes checked/ }));
  expect(view.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "3");
  expect(publish).toBeEnabled();
  fireEvent.input(view.getByRole("textbox", { name: "Release title" }), { target: { value: " " } });
  expect(publish).toBeDisabled();
  expect(view.getByRole("alert")).toHaveTextContent("Give your release a title");
  fireEvent.input(view.getByRole("textbox", { name: "Release title" }), {
    target: { value: "A clear next step" },
  });
  expect(view.queryByRole("alert")).toBeNull();
  fireEvent.click(publish);
  expect(view.getByRole("status")).toHaveTextContent("Published. Team notification previewed.");
  expect(view.getByRole("button", { name: "Published locally" })).toBeDisabled();
  expect(view.getByRole("checkbox", { name: /Both modes checked/ })).toBeDisabled();
});

it("previews validation and paused skeleton states without losing the edited release", () => {
  const view = render(<ThemePlayground preset="kamod" label="Kamod" />);
  fireEvent.click(view.getByRole("button", { name: "Validation", exact: true }));
  const title = view.getByRole("textbox", { name: "Release title" });
  expect(title).toHaveAttribute("aria-invalid", "true");
  expect(view.getByRole("alert")).toHaveTextContent("already in use");
  fireEvent.input(title, { target: { value: "A fresh title" } });
  expect(view.queryByRole("alert")).toBeNull();
  expect(view.getByRole("button", { name: "Content", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  fireEvent.click(view.getByRole("button", { name: "Loading", exact: true }));
  expect(view.getByLabelText("Loading state specimen")).toBeTruthy();
  expect(view.getByRole("switch", { name: "Animate placeholders" })).not.toBeChecked();
  expect(view.container.querySelectorAll('[data-slot="skeleton"]')).toHaveLength(12);
  expect(view.queryByRole("textbox")).toBeNull();
  expect(view.getByRole("button", { name: "Publish preview" })).toBeDisabled();
  fireEvent.click(view.getByRole("button", { name: "Content", exact: true }));
  expect(view.getByRole("textbox", { name: "Release title" })).toHaveValue("A fresh title");
});

it("animates only on request near the viewport in a visible tab and releases each observation", () => {
  let notify!: IntersectionObserverCallback;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    },
  );
  let hidden = false;
  vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
  const view = render(<ThemePlayground preset="kamod" label="Kamod" />);
  fireEvent.click(view.getByRole("button", { name: "Loading", exact: true }));
  const specimen = view.getByLabelText("Loading state specimen");
  expect(observe).not.toHaveBeenCalled();
  expect(specimen).not.toHaveAttribute("data-loading-active");

  const visibility = (isIntersecting: boolean) => {
    act(() => {
      notify(
        [{ target: specimen, isIntersecting }] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });
  };
  fireEvent.click(view.getByRole("switch", { name: "Animate placeholders" }));
  expect(observe).toHaveBeenLastCalledWith(specimen);
  expect(specimen).not.toHaveAttribute("data-loading-active");
  visibility(true);
  expect(specimen).toHaveAttribute("data-loading-active");
  hidden = true;
  fireEvent(document, new Event("visibilitychange"));
  expect(specimen).not.toHaveAttribute("data-loading-active");
  hidden = false;
  fireEvent(document, new Event("visibilitychange"));
  expect(specimen).toHaveAttribute("data-loading-active");
  visibility(false);
  expect(specimen).not.toHaveAttribute("data-loading-active");
  visibility(true);
  fireEvent.click(view.getByRole("switch", { name: "Animate placeholders" }));
  expect(specimen).not.toHaveAttribute("data-loading-active");
  expect(unobserve).toHaveBeenLastCalledWith(specimen);
  expect(disconnect).toHaveBeenCalledTimes(1);

  fireEvent.click(view.getByRole("switch", { name: "Animate placeholders" }));
  visibility(true);
  fireEvent.click(view.getByRole("button", { name: "Content", exact: true }));
  expect(disconnect).toHaveBeenCalledTimes(2);
  fireEvent.click(view.getByRole("button", { name: "Loading", exact: true }));
  expect(view.getByRole("switch", { name: "Animate placeholders" })).not.toBeChecked();
  expect(observe).toHaveBeenCalledTimes(2);
  fireEvent.click(view.getByRole("switch", { name: "Animate placeholders" }));
  view.unmount();
  expect(unobserve).toHaveBeenCalledTimes(3);
  expect(disconnect).toHaveBeenCalledTimes(3);
});

it("changes notification feedback and resets the experiment without changing appearance", () => {
  const view = render(<ThemePlayground preset="kamod" label="Kamod" />);
  fireEvent.click(view.getByRole("button", { name: "Dark", exact: true }));
  fireEvent.click(view.getByRole("switch", { name: "Notify the team" }));
  fireEvent.click(view.getByRole("checkbox", { name: /Both modes checked/ }));
  fireEvent.click(view.getByRole("button", { name: "Publish preview" }));
  expect(view.getByRole("status")).toHaveTextContent("Published quietly.");
  fireEvent.click(view.getByRole("button", { name: "Reset experiment" }));
  expect(view.getByRole("textbox", { name: "Release title" })).toHaveValue(
    "A better first impression",
  );
  expect(view.getByRole("switch", { name: "Notify the team" })).toBeChecked();
  expect(view.getByRole("button", { name: "Dark", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(view.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  expect(view.getByRole("button", { name: "Publish preview" })).toBeDisabled();
});

it("makes role explanations available to keyboard focus and dismisses them with Escape", () => {
  const view = render(<ThemePlayground preset="kamod" label="Kamod" />);
  const hint = view.getByRole("button", { name: "About progress and feedback colors" });
  fireEvent.focus(hint);
  expect(view.getByRole("tooltip")).toHaveTextContent("progress bar uses primary on muted");
  fireEvent.keyDown(hint, { key: "Escape" });
  expect(view.queryByRole("tooltip")).toBeNull();
});
