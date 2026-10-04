/** @vitest-environment jsdom */
import { act, cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { InlineCode, isDisplayPath, PathDisplay, splitDisplayPath } from "./PathDisplay";

afterEach(() => {
  cleanup();
  if (vi.isFakeTimers()) {
    // Flush Preact's scheduled effect frame before jsdom removes its browser globals.
    act(() => {
      vi.runOnlyPendingTimers();
    });
    vi.useRealTimers();
  }
});
it.each([
  ["src/components/forms/contact.tsx", "src/", "components/forms", "/contact.tsx"],
  [
    "@kamod-ch/blocks/application-shell/application-shell-1",
    "@kamod-ch/",
    "blocks/application-shell",
    "/application-shell-1",
  ],
  ["./src/components/Button.tsx", "./src/", "components", "/Button.tsx"],
  ["../src/forms/", "../src/", "", "forms/"],
  ["/usr/local/share/theme.css", "/usr/", "local/share", "/theme.css"],
  ["src/a/b/", "src/", "a", "/b/"],
  ["src/file.ts", "src/", "", "file.ts"],
  ["C:\\src\\components\\Button.tsx", "C:\\src\\", "components", "\\Button.tsx"],
  ["\\\\server\\share\\folder\\file.ts", "\\\\server\\", "share\\folder", "\\file.ts"],
  ["src//forms///file.ts", "src//", "forms//", "/file.ts"],
  ["src/", "src/", "", ""],
  ["Terminal", "", "", "Terminal"],
  ["", "", "", ""],
])("preserves exact path segments: %s", (path, root, middle, end) => {
  expect(splitDisplayPath(path)).toEqual({ root, middle, end });
  const { container } = render(<PathDisplay path={path} />);
  expect(container.textContent).toBe(path);
  expect(container.firstElementChild).toHaveAttribute("title", path);
});

it("keeps the filename's separator outside the truncating middle", () => {
  const { container } = render(<PathDisplay path="src/components/shared/Path.tsx" />);
  expect(container.querySelector('[data-path-part="root"]')).toHaveTextContent("src/");
  expect(container.querySelector('[data-path-part="end"]')).toHaveTextContent("/Path.tsx");
  expect(container.querySelector('[data-path-part="middle"]')).toHaveTextContent(
    "components/shared",
  );
});
it("supports plain file-tree labels without nested code elements", () => {
  const { container } = render(
    <PathDisplay as="span" class="file-label" path="assets/icons/brand.svg" />,
  );
  expect(container.firstElementChild?.tagName).toBe("SPAN");
  expect(container.firstElementChild).toHaveClass("path-display", "file-label");
});
it.each([
  "pnpm add @kamod-ch/ui",
  "https://example.com/path",
  'import { Button } from "@kamod-ch/ui"',
  "light/dark",
  "<Button />",
])("does not interpret source or ordinary prose as a path: %s", (value) => {
  expect(isDisplayPath(value)).toBe(false);
  const { container } = render(<InlineCode>{value}</InlineCode>);
  expect(container.querySelector(".path-display")).toBeNull();
  expect(container.textContent).toBe(value);
});
it("uses the same renderer for inline package references", () => {
  const { container } = render(<InlineCode>@kamod-ch/ui/lib/interactive</InlineCode>);
  expect(container.querySelector(".path-display")).toHaveTextContent(
    "@kamod-ch/ui/lib/interactive",
  );
});

it("renders the same path markup in guides and prompts without shortening copied text", async () => {
  const { parseGuide } = await import("../../blocks/guides/guide-markdown");
  const { renderPromptMarkdown } = await import("../../blocks/prompt-markdown");
  const path = "src/components/a&b.tsx";
  const guide = parseGuide(`## Example\n\nRead \`${path}\`.`)[0].parts[0];
  const htmls = [
    guide.kind === "html" ? guide.html : "",
    renderPromptMarkdown(`Read \`${path}\`.`),
  ];
  for (const html of htmls) {
    const root = document.createElement("div");
    root.innerHTML = html;
    expect(root.querySelector(".path-display")).toHaveTextContent(path);
    expect(root.querySelector('[data-path-part="end"]')).toHaveTextContent("/a&b.tsx");
  }
});

it("copies exact selected path text and leaves mixed prose selections alone", async () => {
  const { PathCopySupport } = await import("./PathCopySupport");
  vi.useFakeTimers();
  const { container, unmount } = render(
    <>
      <PathCopySupport />
      <p>
        Read <PathDisplay path="src/components/Button.tsx" /> now.
      </p>
    </>,
  );
  const range = document.createRange();
  range.selectNodeContents(container.querySelector(".path-display")!);
  const selection = document.getSelection()!;
  selection.removeAllRanges();
  selection.addRange(range);
  const copied: string[] = [];
  const clipboardData = { setData: (_: string, value: string) => copied.push(value) };
  const dispatch = () => {
    const event = new Event("copy", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: clipboardData });
    document.dispatchEvent(event);
    return event;
  };
  expect(dispatch().defaultPrevented).toBe(true);
  expect(copied).toEqual(["src/components/Button.tsx"]);
  range.selectNodeContents(container.querySelector("p")!);
  expect(dispatch().defaultPrevented).toBe(false);
  range.selectNodeContents(container.querySelector(".path-display")!);
  unmount();
  expect(dispatch().defaultPrevented).toBe(false);
  selection.removeAllRanges();
});
