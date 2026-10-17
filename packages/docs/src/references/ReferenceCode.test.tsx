/** @vitest-environment jsdom */
import { cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ReferenceCode } from "./ReferenceCode";

const createObjectURL = vi.fn((_blob: Blob) => "blob:source-download");
const revokeObjectURL = vi.fn();
const downloadedNames: string[] = [];
beforeEach(() => {
  const OriginalURL = URL;
  vi.stubGlobal(
    "URL",
    class extends OriginalURL {
      static createObjectURL = createObjectURL;
      static revokeObjectURL = revokeObjectURL;
    },
  );
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloadedNames.push(this.download);
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  downloadedNames.length = 0;
});

const blobText = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });

it("downloads the exact complete source even while imports are folded and lines wrapped", async () => {
  const source =
    'import { Button } from "@kamod-ch/ui/button";\n\n// Ω — preserve spacing\nexport const Example = () => <Button>Save</Button>;  \n';
  const view = render(
    <ReferenceCode
      code={source}
      language="tsx"
      filePath="src/Example.tsx"
      highlight={false}
      defaultWrapped
      defaultImportsCollapsed
    />,
  );
  const download = view.getByRole("button", { name: "Download code", exact: true });
  const copy = view.getByRole("button", { name: "Copy code", exact: true });
  expect(download.compareDocumentPosition(copy) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(view.container.querySelector("pre code")).not.toHaveTextContent("import");
  expect(createObjectURL).not.toHaveBeenCalled();
  fireEvent.click(download);
  expect(downloadedNames).toEqual(["Example.tsx"]);
  expect(await blobText(createObjectURL.mock.calls[0][0])).toBe(source);
  expect(view.container.querySelector("pre code")).not.toHaveTextContent("import");
});

it("retains custom Copy composition and a format-independent Markdown download name", () => {
  const view = render(
    <ReferenceCode
      code="# Prompt"
      language="text"
      inferLanguage={false}
      downloadFileName="setup-prompt.md"
      highlight={false}
      renderCopyAction={({ defaultControl }) => <span data-custom-copy>{defaultControl}</span>}
    />,
  );
  expect(view.container.querySelector("[data-custom-copy] [data-slot=code-copy]")).not.toBeNull();
  const download = view.getByRole("button", { name: "Download Markdown", exact: true });
  expect(view.container.querySelectorAll("[data-slot=markdown-download]")).toHaveLength(1);
  fireEvent.click(download);
  expect(downloadedNames).toEqual(["setup-prompt.md"]);
  expect(createObjectURL.mock.calls[0][0].type).toBe("text/markdown;charset=utf-8");
});

it.each([
  { showCopy: false },
  { showToolbar: false },
  { renderCopyAction: () => null },
  { renderCopyAction: () => false },
])("does not create orphan download actions when Copy is omitted: %j", (props) => {
  const view = render(
    <ReferenceCode code="const value = 1;" language="typescript" highlight={false} {...props} />,
  );
  expect(view.queryByRole("button", { name: /^Download/ })).toBeNull();
  expect(createObjectURL).not.toHaveBeenCalled();
});

it("follows source-file replacement instead of downloading a stale selection", async () => {
  const view = render(<ReferenceCode code="first" filePath="first.ts" highlight={false} />);
  fireEvent.click(view.getByRole("button", { name: "Download code", exact: true }));
  view.rerender(
    <ReferenceCode code={"second — Ω\n"} filePath="nested/second.css" highlight={false} />,
  );
  expect(revokeObjectURL).toHaveBeenCalledTimes(1);
  fireEvent.click(view.getByRole("button", { name: "Download code", exact: true }));
  expect(downloadedNames).toEqual(["first.ts", "second.css"]);
  expect(await blobText(createObjectURL.mock.calls[1][0])).toBe("second — Ω\n");
});
