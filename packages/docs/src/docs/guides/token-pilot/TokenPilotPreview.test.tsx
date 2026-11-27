/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, within } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { TokenPilotPreview } from "./TokenPilotPreview";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("server-renders the four production components with an invalid field", () => {
  const save = vi.spyOn(Storage.prototype, "setItem");
  const html = renderToString(<TokenPilotPreview />);
  const document = new DOMParser().parseFromString(html, "text/html");
  const scope = document.querySelector(".token-pilot-scope");
  expect(scope?.getAttribute("data-theme")).toBe("kamod");
  expect(scope?.hasAttribute("data-theme-scope")).toBe(true);
  expect(scope?.classList.contains("light")).toBe(true);
  expect(document.querySelectorAll('[data-slot="button"]').length).toBeGreaterThan(0);
  expect(document.querySelector('[data-slot="input"]')?.getAttribute("aria-invalid")).toBe("true");
  expect(document.querySelector('[data-slot="badge"]')?.textContent).toContain("Draft");
  expect(document.querySelector('[data-slot="card"]')).not.toBeNull();
  expect(document.querySelector("#token-pilot-title-error")?.getAttribute("role")).toBe("alert");
  expect(save).not.toHaveBeenCalled();
});

it("switches Kamod and Watson in light and dark without touching the page theme", () => {
  const save = vi.spyOn(Storage.prototype, "setItem");
  const attributes = [...document.documentElement.attributes].map(({ name, value }) => [
    name,
    value,
  ]);
  const view = render(<TokenPilotPreview />);
  const scope = view.container.querySelector(".token-pilot-scope")!;
  const preview = within(scope as HTMLElement);

  fireEvent.click(preview.getByRole("button", { name: "Watson" }));
  expect(scope).toHaveAttribute("data-theme", "watson");
  fireEvent.click(preview.getByRole("button", { name: "Dark" }));
  expect(scope).toHaveClass("dark");
  expect(preview.getByRole("button", { name: "Dark" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(preview.getByRole("button", { name: "Kamod" }));
  fireEvent.click(preview.getByRole("button", { name: "Light" }));
  expect(scope).toHaveAttribute("data-theme", "kamod");
  expect(scope).toHaveClass("light");
  expect(scope).not.toHaveClass("dark");

  const title = preview.getByRole("textbox", { name: "Title" });
  expect(title.className).toContain("focus-visible:ring");
  act(() => title.focus());
  expect(document.activeElement).toBe(title);
  expect([...document.documentElement.attributes].map(({ name, value }) => [name, value])).toEqual(
    attributes,
  );
  expect(save).not.toHaveBeenCalled();
});
