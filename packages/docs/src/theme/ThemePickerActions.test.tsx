/** @vitest-environment jsdom */

import { ThemePickerActions as PickerActions } from "@kamod-ch/blocks/shared";
import {
  colorSchemeSignal,
  resolvedColorSchemeSignal,
  setColorScheme,
  themePresetSignal,
} from "@kamod-ch/themes";
import { ThemeToggle } from "@kamod-ch/ui";
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { SiteColorSchemeSync } from "./SiteColorSchemeSync";
import { useSiteThemePreset } from "./useSiteThemePreset";

const ThemePickerActions = () => (
  <PickerActions scheme={colorSchemeSignal.value} onSchemeChange={setColorScheme} />
);

let matches = false;
const listeners = new Set<() => void>();
const removeEventListener = vi.fn((_event, callback: () => void) => listeners.delete(callback));
beforeEach(() => {
  matches = false;
  listeners.clear();
  removeEventListener.mockImplementation((_event, callback: () => void) =>
    listeners.delete(callback),
  );
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return matches;
    },
    addEventListener: (_event: string, callback: () => void) => listeners.add(callback),
    removeEventListener,
  }));
  setColorScheme("light");
});
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it("follows the system across every site toggle and stops following after manual selection", () => {
  const view = render(
    <>
      <SiteColorSchemeSync page="test" />
      <ThemePickerActions />
      <ThemeToggle aria-label="Navbar mode" />
    </>,
  );
  const system = view.getByRole("button", { name: "Use system color mode" });
  act(() => {
    matches = true;
  });
  fireEvent.click(system);
  expect(system).toHaveAttribute("aria-pressed", "true");
  expect(document.documentElement).toHaveClass("dark");
  expect(view.getByRole("button", { name: "Navbar mode" })).toHaveAttribute("data-state", "dark");
  expect(localStorage.getItem("theme")).toBeNull();
  act(() => {
    matches = false;
    for (const update of listeners) update();
  });
  expect(resolvedColorSchemeSignal.value).toBe("light");
  expect(view.getByRole("button", { name: "Navbar mode" })).toHaveAttribute("data-state", "light");
  fireEvent.click(view.getByRole("button", { name: "Navbar mode" }));
  expect(system).toHaveAttribute("aria-pressed", "false");
  expect(colorSchemeSignal.value).toBe("dark");
  act(() => {
    for (const update of listeners) update();
  });
  expect(resolvedColorSchemeSignal.value).toBe("dark");
});

it("turning system mode off retains the resolved mode", () => {
  const view = render(<ThemePickerActions />);
  const system = view.getByRole("button", { name: "Use system color mode" });
  fireEvent.click(system);
  fireEvent.click(system);
  expect(colorSchemeSignal.value).toBe("light");
  expect(localStorage.getItem("theme")).toBe("light");
  fireEvent.click(view.getByRole("button", { name: "Switch to dark mode" }));
  expect(colorSchemeSignal.value).toBe("dark");
});

it("syncs another tab and cleans up its subscriptions", () => {
  const view = render(<SiteColorSchemeSync page="test" />);
  expect(listeners.size).toBe(1);
  act(() => {
    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "dark" }));
  });
  expect(resolvedColorSchemeSignal.value).toBe("dark");
  act(() => {
    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: null }));
  });
  expect(colorSchemeSignal.value).toBe("system");
  act(() => {
    view.unmount();
  });
  expect(listeners.size).toBe(0);
  expect(removeEventListener).toHaveBeenCalled();
  act(() => {
    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "dark" }));
  });
  expect(colorSchemeSignal.value).toBe("system");
});

it("leaves independent preview documents alone", () => {
  history.replaceState(null, "", "/blocks/application-shell/application-shell-1/preview");
  try {
    render(<SiteColorSchemeSync page="preview" />);
    expect(listeners.size).toBe(0);
  } finally {
    history.replaceState(null, "", "/");
  }
});

it("shares one cross-tab subscription across pickers and releases it on navigation", () => {
  const add = vi.spyOn(window, "addEventListener");
  const remove = vi.spyOn(window, "removeEventListener");
  const Picker = () => <span data-testid="preset">{useSiteThemePreset()}</span>;
  const Page = ({ page }: { page: string }) => (
    <>
      <SiteColorSchemeSync page={page} />
      <Picker />
      <Picker />
    </>
  );
  const view = render(<Page page="first" />);
  try {
    expect(add.mock.calls.filter(([event]) => event === "storage")).toHaveLength(1);
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: "theme-preset", newValue: "ocean" }));
    });
    for (const picker of view.getAllByTestId("preset")) expect(picker).toHaveTextContent("ocean");
    view.rerender(<Page page="second" />);
    expect(remove.mock.calls.filter(([event]) => event === "storage")).toHaveLength(1);
    act(() => {
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
    });
    expect(themePresetSignal.value).toBe("kamod");
    expect(colorSchemeSignal.value).toBe("system");
    act(() => {
      view.unmount();
    });
    expect(remove.mock.calls.filter(([event]) => event === "storage")).toHaveLength(2);
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "theme-preset", newValue: "sunset" }),
      );
    });
    expect(themePresetSignal.value).toBe("kamod");
  } finally {
    add.mockRestore();
    remove.mockRestore();
  }
});
