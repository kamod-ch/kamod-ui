import { fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyColorScheme,
  applyThemePreset,
  DEFAULT_THEME_PRESET,
  isThemePresetId,
  readThemePresetFromDom,
  resolveInitialThemePreset,
  THEME_PRESET_STORAGE_KEY,
  THEME_PRESETS,
  ThemeProvider,
  useTheme,
  useThemePreset,
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

  it("temporarily adds theme-switching while applying color scheme", () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        rafCallbacks.push(callback);
        return rafCallbacks.length;
      }),
    );

    applyColorScheme("dark");
    expect(document.documentElement).toHaveClass("theme-switching");
    expect(document.documentElement).toHaveClass("dark");
    expect(rafCallbacks).toHaveLength(1);

    rafCallbacks.shift()?.(0);
    expect(document.documentElement).toHaveClass("theme-switching");
    expect(rafCallbacks).toHaveLength(1);

    rafCallbacks.shift()?.(0);
    expect(document.documentElement).not.toHaveClass("theme-switching");

    vi.unstubAllGlobals();
  });

  it("temporarily adds theme-switching while applying a theme preset", () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        rafCallbacks.push(callback);
        return rafCallbacks.length;
      }),
    );

    applyThemePreset("ocean");
    expect(document.documentElement).toHaveAttribute("data-theme", "ocean");
    expect(document.documentElement).toHaveClass("theme-switching");
    expect(rafCallbacks).toHaveLength(1);

    rafCallbacks.shift()?.(0);
    expect(document.documentElement).toHaveClass("theme-switching");
    expect(rafCallbacks).toHaveLength(1);

    rafCallbacks.shift()?.(0);
    expect(document.documentElement).not.toHaveClass("theme-switching");

    vi.unstubAllGlobals();
  });

  it("reads the active preset from the document element", () => {
    document.documentElement.setAttribute("data-theme", "watson");
    expect(readThemePresetFromDom()).toBe("watson");
    document.documentElement.setAttribute("data-theme", "invalid");
    expect(readThemePresetFromDom()).toBeNull();
  });

  it("useThemePreset reflects localStorage and bootstrapped data-theme", () => {
    window.localStorage.setItem(THEME_PRESET_STORAGE_KEY, "sunset");
    document.documentElement.setAttribute("data-theme", "sunset");

    const TestChild = () => {
      const preset = useThemePreset();
      return <span data-testid="preset">{preset}</span>;
    };

    render(<TestChild />);
    expect(screen.getByTestId("preset")).toHaveTextContent("sunset");
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
