/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { BlockShowcase, type ShowcaseBlock } from "./BlockShowcase";

vi.mock("./useShowcasePreferences", () => ({
  useShowcasePreferences: () => ({
    ready: false,
    preferences: {
      view: "preview",
      viewport: "desktop",
      appearance: { preset: "ocean", scheme: "dark" },
      promptMode: "setup",
      promptDisplay: "code",
    },
    update: vi.fn(),
  }),
}));
afterEach(cleanup);

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
