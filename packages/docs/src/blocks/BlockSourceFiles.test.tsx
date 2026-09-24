/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlockSourceFiles } from "./BlockSourceFiles";

// The loader tests concern races and retry behavior, not Prism's highlighting.
vi.mock("../docs/components/CodeBlock", () => ({
  CodeBlock: ({ code }: { code: string }) => <pre>{code}</pre>,
}));
afterEach(cleanup);

const files = [{ label: "first.tsx" }, { label: "second.tsx" }];

describe("block source loading", () => {
  it("ignores a slow earlier request when the selected file changes", async () => {
    const resolvers = new Map<string, (code: string) => void>();
    const loadSource = vi.fn(
      (file: string) => new Promise<string>((resolve) => resolvers.set(file, resolve)),
    );
    const { rerender } = render(
      <BlockSourceFiles
        files={files}
        selectedFile="first.tsx"
        onSelect={() => {}}
        loadSource={loadSource}
      />,
    );
    expect(loadSource).toHaveBeenCalledWith("first.tsx");
    rerender(
      <BlockSourceFiles
        files={files}
        selectedFile="second.tsx"
        onSelect={() => {}}
        loadSource={loadSource}
      />,
    );
    await act(async () => {
      resolvers.get("second.tsx")!("Current file");
    });
    expect(screen.getByText("Current file")).toBeVisible();
    await act(async () => {
      resolvers.get("first.tsx")!("Stale file");
    });
    expect(screen.queryByText("Stale file")).not.toBeInTheDocument();
    expect(screen.getByText("Current file")).toBeVisible();
  });

  it("shows a recoverable error instead of a copyable empty or stale sample", async () => {
    const loadSource = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue("Recovered source");
    render(
      <BlockSourceFiles
        files={files}
        selectedFile="first.tsx"
        onSelect={() => {}}
        loadSource={loadSource}
      />,
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load the source file");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText("Recovered source")).toBeVisible();
    expect(loadSource).toHaveBeenCalledTimes(2);
  });
});
