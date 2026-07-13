import { fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import {
  applyColorScheme,
  applyThemePreset,
  DEFAULT_THEME_PRESET,
  isThemePresetId,
  resolveInitialThemePreset,
  THEME_PRESET_STORAGE_KEY,
  THEME_PRESETS,
  ThemeProvider,
  useTheme,
} from "./index";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.documentElement.className = "";
  window.localStorage.clear();
});

describe("theme runtime", () => {
  it("validates exported preset ids", () => {
    for (const preset of THEME_PRESETS) expect(isThemePresetId(preset.id)).toBe(true);
    expect(isThemePresetId("unknown")).toBe(false);
  });

  it("applies a theme preset to the document element", () => {
    applyThemePreset("ocean");
    expect(document.documentElement).toHaveAttribute("data-theme", "ocean");
  });

  it("applies light and dark color schemes", () => {
    applyColorScheme("dark");
    expect(document.documentElement).toHaveClass("dark");
    applyColorScheme("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("resolves initial preset safely and honors valid storage values", () => {
    expect(resolveInitialThemePreset(null)).toBe(DEFAULT_THEME_PRESET);
    window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, "ocean");
    expect(resolveInitialThemePreset()).toBe("ocean");
    window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, "missing");
    expect(resolveInitialThemePreset()).toBe(DEFAULT_THEME_PRESET);
  });

  it("ThemeProvider renders children and updates DOM attributes", () => {
    const TestChild = () => {
      const { preset, setPreset, scheme, setScheme } = useTheme();
      return (
        <div>
          <span data-testid="state">{`${preset}:${scheme}`}</span>
          <button type="button" onClick={() => setPreset("sunset")}>
            preset
          </button>
          <button type="button" onClick={() => setScheme("dark")}>
            scheme
          </button>
        </div>
      );
    };

    render(
      <ThemeProvider defaultPreset="kamod" defaultScheme="light">
        <TestChild />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("state")).toHaveTextContent("kamod:light");
    fireEvent.click(screen.getByText("preset"));
    expect(document.documentElement).toHaveAttribute("data-theme", "sunset");
    fireEvent.click(screen.getByText("scheme"));
    expect(document.documentElement).toHaveClass("dark");
  });
});
