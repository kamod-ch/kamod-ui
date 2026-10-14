import { cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { Code, type CodeColorMode } from "./index";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it.each([undefined, "inverse", "inherit", "light", "dark"] as const)(
  "isolates SSR source appearance from toolbar and surrounding slots: %s",
  (colorMode: CodeColorMode | undefined) => {
    const source = '<script>const unsafe = "<markup>";</script>';
    const host = document.createElement("div");
    host.innerHTML = renderToString(
      <Code
        code={source}
        highlight={false}
        colorMode={colorMode}
        toolbarContent={<strong>Source header</strong>}
        beforeCode={<p>Before source</p>}
        afterCode={<p>After source</p>}
      />,
    );
    const pre = host.querySelector("pre")!;
    expect(pre.textContent).toBe(source);
    expect(host.querySelector("script")).toBeNull();
    expect(pre).toHaveAttribute("data-color-mode", colorMode ?? "inverse");
    expect(pre.tabIndex).toBe(0);
    expect(pre.previousElementSibling?.textContent).toBe("Before source");
    expect(pre.nextElementSibling?.textContent).toBe("After source");
    expect(host.querySelector("[data-slot=code-toolbar]")?.textContent).toContain("Source header");
    expect(host.querySelectorAll("[data-color-mode]")).toHaveLength(1);
    expect(pre.querySelector("[data-slot=code-copy]")).toBeNull();
    expect(host.querySelector("[data-slot=code]")).not.toHaveAttribute("data-color-mode");
  },
);

it("isolates arbitrary prepared document children while keeping complete source copying", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const source = "# Prepared heading\n\nDocument body";
  function DocumentHeading() {
    return <h3>Prepared heading</h3>;
  }
  const renderedContent = (
    <>
      <DocumentHeading />
      <p>Document body</p>
      {"Trailing text"}
    </>
  );
  const host = document.createElement("div");
  host.innerHTML = renderToString(
    <Code code={source} renderedContent={renderedContent} colorMode="dark" />,
  );
  const renderedDocument = host.querySelector("[data-slot=code-document]")!;
  expect(renderedDocument).toHaveAttribute("data-color-mode", "dark");
  expect(renderedDocument.querySelector("h3")?.textContent).toBe("Prepared heading");
  expect(renderedDocument.textContent).toContain("Trailing text");
  expect(host.querySelector("pre")).toBeNull();
  const view = render(
    <Code
      code={source}
      renderedContent={renderedContent}
      beforeCode={<p>Document introduction</p>}
      afterCode={<footer>Document footer</footer>}
    />,
  );
  const surface = view.container.querySelector("[data-slot=code-document]")!;
  expect(surface).toHaveAttribute("data-color-mode", "inverse");
  expect(surface).toContainElement(view.getByRole("heading", { name: "Prepared heading" }));
  expect(surface).not.toContainElement(view.getByText("Document introduction"));
  expect(surface).not.toContainElement(view.getByText("Document footer"));
  expect(surface).not.toContainElement(view.getByRole("button", { name: "Copy code" }));
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledExactlyOnceWith(source));
});
