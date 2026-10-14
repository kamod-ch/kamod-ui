/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { BlockShowcase, type ShowcaseBlock } from "./BlockShowcase";

const saved = vi.hoisted(() => ({
  ready: false,
  preferences: {
    view: "preview" as "preview" | "code" | "prompt",
    viewport: "desktop",
    appearance: { preset: "ocean", scheme: "dark" },
    promptMode: "setup",
    promptDisplay: "code",
  },
  update: vi.fn(),
}));
vi.mock("./useShowcasePreferences", () => ({
  useShowcasePreferences: () => saved,
}));
afterEach(() => {
  cleanup();
  saved.ready = false;
  saved.preferences.view = "preview";
  saved.update.mockClear();
});

it("renders the themed Code loader when selected before saved controls finish restoring", async () => {
  const block: ShowcaseBlock = {
    id: "sidebar-test",
    title: "Test sidebar",
    description: "A compact example",
    category: "sidebar",
    dependencies: [],
    installCommand: "pnpm add @kamod-ch/ui",
    preview: { height: 320 },
    files: [{ label: "sidebar.tsx", path: "sidebar.tsx" }],
  };
  const loadSource = vi.fn(async () => "export const Sidebar = () => null;");
  const { getByRole } = render(<BlockShowcase block={block} loadSource={loadSource} />);
  fireEvent.click(getByRole("tab", { name: "Code", exact: true }));
  const panel = getByRole("tabpanel");
  const loader = panel.querySelector(".showcase-loading");
  expect(loader).toHaveAttribute("data-view", "code");
  expect(loader).toHaveAttribute("data-theme", "ocean");
  expect(loader).toHaveClass("dark");
  expect(panel.querySelector('[role="status"]')).toHaveTextContent("Opening the source");
  expect(loadSource).not.toHaveBeenCalled();
  // Flush pending mount effects before tearing down their browser globals.
  await act(async () => {});
});

it.each(["Code", "Preview"])(
  "keeps an early %s selection when saved preferences arrive afterward",
  async (choice) => {
    const block: ShowcaseBlock = {
      id: "sidebar-early-selection",
      title: "Early selection",
      description: "A compact example",
      category: "sidebar",
      dependencies: [],
      installCommand: "pnpm add @kamod-ch/ui",
      preview: { height: 320 },
      files: [{ label: "sidebar.tsx", path: "sidebar.tsx" }],
    };
    const loadSource = vi.fn(async () => "export const Sidebar = () => null;");
    const { getByRole, rerender } = render(<BlockShowcase block={block} loadSource={loadSource} />);
    fireEvent.click(getByRole("tab", { name: "Code", exact: true }));
    if (choice === "Preview") fireEvent.click(getByRole("tab", { name: "Preview", exact: true }));
    saved.ready = true;
    saved.preferences.view = "prompt";
    rerender(<BlockShowcase block={{ ...block }} loadSource={loadSource} />);
    await waitFor(() => expect(saved.update).toHaveBeenCalledWith({ view: choice.toLowerCase() }));
    expect(getByRole("tab", { name: choice, exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    if (choice === "Preview") expect(loadSource).not.toHaveBeenCalled();
    else expect(loadSource).toHaveBeenCalledWith("sidebar.tsx");
  },
);
