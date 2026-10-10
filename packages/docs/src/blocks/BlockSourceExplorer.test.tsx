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
  expect(screen.getByText("2", { exact: true })).toBeVisible();
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
  expect(screen.getByText("1", { exact: true })).toBeVisible();
  expect(screen.getByRole("button", { name: "assets/logo.svg" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(onSelect).not.toHaveBeenCalled();
});

it("collapses folders independently, preserves totals, and reveals an externally selected file", async () => {
  const files = [
    { label: "index.ts" },
    { label: "components/a.tsx" },
    { label: "components/b.tsx" },
  ];
  const onSelect = vi.fn();
  const { rerender } = render(
    <BlockSourceExplorer files={files} selectedFile="index.ts" onSelect={onSelect} grouped />,
  );
  expect(screen.getByLabelText("2 files in /components")).toHaveTextContent("2");
  const collapse = screen.getByRole("button", { name: "Collapse /components" });
  const list = document.getElementById(collapse.getAttribute("aria-controls")!)!;
  fireEvent.click(collapse);
  expect(collapse).toHaveAttribute("aria-expanded", "false");
  expect(list).not.toBeVisible();
  expect(screen.getByRole("button", { name: "index.ts" })).toBeVisible();
  expect(screen.getByLabelText("2 files in /components")).toBeVisible();
  expect(onSelect).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Expand /components" }));
  fireEvent.click(screen.getByRole("button", { name: "b.tsx" }));
  expect(onSelect).toHaveBeenLastCalledWith("components/b.tsx");
  fireEvent.click(screen.getByRole("button", { name: "Collapse /components" }));
  rerender(
    <BlockSourceExplorer
      files={files}
      selectedFile="components/b.tsx"
      onSelect={onSelect}
      grouped
    />,
  );
  await vi.waitFor(() => expect(list).toBeVisible());
  expect(screen.getByRole("button", { name: "b.tsx" })).toHaveAttribute("aria-pressed", "true");
});

it("toggles all folders from mixed states without changing the selected file", async () => {
  const files = [{ label: "index.ts" }, { label: "components/a.tsx" }, { label: "demo/b.tsx" }];
  const onSelect = vi.fn();
  const { rerender } = render(
    <BlockSourceExplorer files={files} selectedFile="index.ts" onSelect={onSelect} grouped />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Collapse all folders" }));
  expect(screen.queryByRole("button", { name: "index.ts" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "a.tsx" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "b.tsx" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Expand /components" }));
  fireEvent.click(screen.getByRole("button", { name: "Expand all folders" }));
  for (const name of ["index.ts", "a.tsx", "b.tsx"]) {
    expect(screen.getByRole("button", { name })).toBeVisible();
  }
  expect(screen.getByRole("button", { name: "index.ts" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "Collapse all folders" }));
  rerender(
    <BlockSourceExplorer files={files} selectedFile="demo/b.tsx" onSelect={onSelect} grouped />,
  );
  await vi.waitFor(() => expect(screen.getByRole("button", { name: "b.tsx" })).toBeVisible());
  expect(screen.queryByRole("button", { name: "a.tsx" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Expand all folders" })).toBeVisible();
  expect(onSelect).not.toHaveBeenCalled();
});
