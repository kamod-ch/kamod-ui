/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { BlockSourceExplorer } from "./BlockSourceExplorer";

afterEach(cleanup);

it("selects the correct full path when grouped basenames repeat", () => {
  const onSelect = vi.fn();
  render(
    <BlockSourceExplorer
      files={[{ label: "components/nav.tsx" }, { label: "demo/nav.tsx" }]}
      selectedFile="components/nav.tsx"
      onSelect={onSelect}
      grouped
    />,
  );
  const result = screen.getByTitle("demo/nav.tsx");
  expect(result).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(result);
  expect(onSelect).toHaveBeenCalledWith("demo/nav.tsx");
});

it("shows complete paths when grouping is disabled", () => {
  const onSelect = vi.fn();
  render(
    <BlockSourceExplorer
      files={[{ label: "assets/logo.svg" }]}
      selectedFile="assets/logo.svg"
      onSelect={onSelect}
      grouped={false}
    />,
  );
  expect(screen.getByRole("button", { name: "assets/logo.svg" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(onSelect).not.toHaveBeenCalled();
});
