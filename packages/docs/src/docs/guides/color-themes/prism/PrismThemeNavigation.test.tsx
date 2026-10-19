/** @vitest-environment jsdom */
import { cleanup, fireEvent, render } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { PrismThemeNavigation } from "./PrismThemeNavigation";
import { prismThemeId, prismThemes } from "./prism-theme-catalog";

afterEach(() => {
  cleanup();
  history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

it("renders a closed last navigation group with every stable destination available without preferences", () => {
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const html = renderToString(<PrismThemeNavigation />);
  const document = new DOMParser().parseFromString(html, "text/html");
  expect(document.querySelector("details")?.open).toBe(false);
  expect(
    [...document.querySelectorAll(".prism-theme-index-links a")].map((link) =>
      link.getAttribute("href"),
    ),
  ).toEqual(prismThemes.map((theme) => `#${prismThemeId(theme.id)}`));
  expect(storage).not.toHaveBeenCalled();
});

it("filters only navigation by theme/author and canvas and offers a complete reset", () => {
  const view = render(<PrismThemeNavigation />);
  const details = view.container.querySelector("details")!;
  details.open = true;
  const search = view.getByRole("searchbox", { name: "Find a Prism theme" });
  fireEvent.input(search, { target: { value: "dracula" } });
  expect(view.container.querySelectorAll(".prism-theme-index-links a")).toHaveLength(1);
  expect(view.getByRole("link", { name: "Dracula", exact: true })).toHaveAttribute(
    "href",
    "#prism-theme-dracula",
  );
  fireEvent.change(view.getByRole("combobox", { name: "Prism code canvas" }), {
    target: { value: "light" },
  });
  expect(view.container.querySelectorAll(".prism-theme-index-links a")).toHaveLength(0);
  fireEvent.click(view.getByRole("button", { name: "Clear filters" }));
  expect(search).toHaveFocus();
  expect(search).toHaveValue("");
  expect(view.container.querySelectorAll(".prism-theme-index-links a")).toHaveLength(
    prismThemes.length,
  );
  fireEvent.change(view.getByRole("combobox"), { target: { value: "light" } });
  expect(view.container.querySelectorAll(".prism-theme-index-links a")).toHaveLength(
    prismThemes.filter((theme) => theme.canvas === "light").length,
  );
});

it("reveals the index for incoming Prism fragments and removes its hash listener on teardown", () => {
  history.replaceState(null, "", "/#prism-theme-nord");
  const remove = vi.spyOn(window, "removeEventListener");
  const view = render(<PrismThemeNavigation />);
  const details = view.container.querySelector("details")!;
  expect(details.open).toBe(true);
  details.open = false;
  history.replaceState(null, "", "/#prism-theme-resources");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(details.open).toBe(true);
  view.unmount();
  expect(remove).toHaveBeenCalledWith("hashchange", expect.any(Function));
});

it("also reveals an incoming generated Prism section route without a fragment", () => {
  history.replaceState(null, "", "/docs/theming/prism-theme-atom-dark");
  const view = render(<PrismThemeNavigation />);
  expect(view.container.querySelector("details")!.open).toBe(true);
});
