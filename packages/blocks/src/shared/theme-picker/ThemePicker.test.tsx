import { cleanup, fireEvent, render, screen, within } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ThemePicker } from "./ThemePicker";

afterEach(cleanup);

it("delegates appearance changes without modifying the page or storage", async () => {
  const onPresetChange = vi.fn();
  const onSchemeChange = vi.fn();
  const storage = vi.spyOn(Storage.prototype, "setItem");
  const pageTheme = document.documentElement.getAttribute("data-theme");
  const pageClass = document.documentElement.className;
  render(
    <ThemePicker
      preset="ocean"
      onPresetChange={onPresetChange}
      scheme="light"
      onSchemeChange={onSchemeChange}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Choose color theme" }));
  const picker = within(await screen.findByRole("dialog", { name: "Find your Palette" }));
  fireEvent.click(picker.getByRole("button", { name: "Sunset", exact: true }));
  fireEvent.click(picker.getByRole("button", { name: "Switch to dark mode" }));
  fireEvent.click(picker.getByRole("button", { name: "Use system color mode" }));
  expect(onPresetChange).toHaveBeenCalledWith("sunset");
  expect(onSchemeChange.mock.calls).toEqual([["dark"], ["system"]]);
  expect(
    picker.getByRole("button", { name: "Ocean", exact: true }).getAttribute("aria-pressed"),
  ).toBe("true");
  expect(picker.getByText("active").closest("button")?.getAttribute("aria-label")).toBe("Ocean");
  expect(
    picker.getByRole("button", { name: "Ocean", exact: true }).getAttribute("data-tooltip"),
  ).toBe("Cool cyan and indigo accents over slate surfaces: calm, clear and refreshing.");
  expect(document.documentElement.getAttribute("data-theme")).toBe(pageTheme);
  expect(document.documentElement.className).toBe(pageClass);
  expect(storage).not.toHaveBeenCalled();
  storage.mockRestore();
});

it("supports host controls, preset subsets, local URLs and close focus restoration", async () => {
  render(
    <ThemePicker
      preset="ocean"
      onPresetChange={() => {}}
      scheme="dark"
      onSchemeChange={() => {}}
      presets={[{ id: "ocean", label: "Ocean" }]}
      resolveHref={(href) => `/library${href}`}
      label="Preview color theme"
    >
      <button type="button">Reset Preview</button>
    </ThemePicker>,
  );
  const trigger = screen.getByRole("button", { name: "Preview color theme" });
  fireEvent.click(trigger);
  const dialog = await screen.findByRole("dialog", { name: "Find your Palette" });
  const picker = within(dialog);
  expect(picker.getByRole("group", { name: "Preview color theme" }).children).toHaveLength(1);
  expect(picker.getByRole("button", { name: "Reset Preview" })).toBeTruthy();
  expect(picker.getByRole("link", { name: "Theming Guide" }).getAttribute("href")).toBe(
    "/library/docs/theming/installation",
  );
  fireEvent.click(picker.getByRole("button", { name: "Close color theme picker" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
