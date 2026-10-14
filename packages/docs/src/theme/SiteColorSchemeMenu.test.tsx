/** @vitest-environment jsdom */
import {
  colorSchemeSignal,
  resolvedColorSchemeSignal,
  setColorScheme,
  setThemePreset,
} from "@kamod-ch/themes";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SiteColorSchemeMenu } from "./SiteColorSchemeMenu";
import { SiteColorSchemeSync } from "./SiteColorSchemeSync";

let dark = false;
const listeners = new Set<() => void>();
beforeEach(() => {
  dark = false;
  listeners.clear();
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return dark;
    },
    addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
  }));
  setColorScheme("light");
  setThemePreset("ocean");
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it("keeps mode choices open, persists manual choices and follows the system without adding subscriptions", async () => {
  const view = render(
    <>
      <SiteColorSchemeSync page="test" />
      <SiteColorSchemeMenu />
    </>,
  );
  const trigger = screen.getByRole("button", { name: "Choose color mode" });
  expect(trigger).toHaveAttribute("data-color-mode", "light");
  fireEvent.click(trigger);
  const menu = screen.getByRole("menu");
  expect(menu.parentElement).toBe(document.body);
  fireEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));
  expect(colorSchemeSignal.value).toBe("dark");
  expect(localStorage.getItem("theme")).toBe("dark");
  expect(localStorage.getItem("theme-preset")).toBe("ocean");
  expect(screen.getByRole("menu")).toBe(menu);
  await waitFor(() =>
    expect(screen.getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute(
      "aria-checked",
      "true",
    ),
  );
  fireEvent.click(screen.getByRole("menuitemradio", { name: "System" }));
  expect(colorSchemeSignal.value).toBe("system");
  expect(localStorage.getItem("theme")).toBeNull();
  act(() => {
    dark = true;
    for (const update of listeners) update();
  });
  expect(resolvedColorSchemeSignal.value).toBe("dark");
  expect(trigger).toHaveAttribute("data-color-mode", "system");
  expect(trigger).toHaveAttribute("data-resolved-mode", "dark");
  fireEvent.click(screen.getByRole("menuitemradio", { name: "Light" }));
  act(() => {
    for (const update of listeners) update();
  });
  expect(resolvedColorSchemeSignal.value).toBe("light");
  expect(listeners.size).toBe(1);
  act(() => {
    view.unmount();
  });
  expect(listeners.size).toBe(0);
  expect(screen.queryByRole("menu")).toBeNull();
});

it("opens from the keyboard, moves focus without selecting and returns focus on Escape", async () => {
  render(<SiteColorSchemeMenu />);
  const trigger = screen.getByRole("button", { name: "Choose color mode" });
  fireEvent.keyDown(trigger, { key: "ArrowDown" });
  const light = screen.getByRole("menuitemradio", { name: "Light" });
  await waitFor(() => expect(light).toHaveFocus());
  fireEvent.keyDown(light, { key: "ArrowDown" });
  expect(screen.getByRole("menuitemradio", { name: "Dark" })).toHaveFocus();
  expect(colorSchemeSignal.value).toBe("light");
  fireEvent.keyDown(screen.getByRole("menu"), { key: "End" });
  expect(screen.getByRole("menuitemradio", { name: "System" })).toHaveFocus();
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
  expect(screen.queryByRole("menu")).toBeNull();
  expect(trigger).toHaveFocus();
});

it("renders an inert, deterministic trigger before hydration", () => {
  setColorScheme("dark");
  const html = renderToString(<SiteColorSchemeMenu />);
  expect(html).toContain('data-color-mode="system"');
  expect(html).toContain("disabled");
  expect(html).not.toContain('role="menu"');
  expect(colorSchemeSignal.value).toBe("dark");
});
