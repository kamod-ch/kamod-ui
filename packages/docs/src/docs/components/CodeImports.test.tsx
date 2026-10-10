/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";
import { ShowcaseCodePane } from "./ShowcaseCodePane";

const source =
  'import { Button } from "@kamod-ch/ui";\n\nexport const Example = () => <Button>Save</Button>;';
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("folds and restores highlighted imports while Copy always retains the original source", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const view = render(
    <ShowcaseCodePane filename="Example.tsx" filePath="src/Example.tsx" code={source} />,
  );
  const pre = view.container.querySelector("pre")!;
  const toggle = view.getByRole("button", { name: "Hide imports" });
  expect(toggle.getAttribute("aria-controls")).toBe(pre.id);
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(toggle.textContent).toContain("1 statement shown");
  expect(pre.textContent).toBe(source);
  fireEvent.click(toggle);
  expect(toggle.textContent).toContain("1 statement hidden");
  await waitFor(() => expect(pre.querySelector(".token")).not.toBeNull());
  expect(pre.textContent).toBe("export const Example = () => <Button>Save</Button>;");
  expect(view.getByRole("button", { name: "Show imports" }).getAttribute("aria-expanded")).toBe(
    "false",
  );
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(source));
  fireEvent.click(view.getByRole("switch", { name: "Wrap code lines" }));
  expect(view.container.querySelector(".docs-code-wrap")?.classList.contains("is-wrapped")).toBe(
    true,
  );
  fireEvent.click(toggle);
  expect(pre.textContent).toBe(source);
});

it("toggles wrapping from its whole label and keeps visible state labels in sync", () => {
  const view = render(<CodeBlock code={source} language="tsx" />);
  const wrap = view.getByRole("switch", { name: "Wrap code lines" });
  const state = view.container.querySelector(".docs-code-wrap-state")!;
  expect(wrap.getAttribute("aria-describedby")).toBe(state.id);
  expect(state.textContent).toBe("wrap disabled");
  fireEvent.click(view.container.querySelector(".docs-code-wrap-icon")!);
  expect(wrap.getAttribute("aria-checked")).toBe("true");
  expect(state.textContent).toBe("wrap enabled");
  fireEvent.click(state);
  expect(wrap.getAttribute("aria-checked")).toBe("false");
  fireEvent.click(view.container.querySelector(".docs-code-wrap-control")!);
  expect(wrap.getAttribute("aria-checked")).toBe("true");
  fireEvent.click(view.getByRole("button", { name: "Hide imports" }));
  expect(wrap.getAttribute("aria-checked")).toBe("true");
  fireEvent.click(wrap);
  expect(state.textContent).toBe("wrap disabled");
});

it("keeps disclosures independent and shows new source expanded", () => {
  const view = render(
    <>
      <CodeBlock code={source} language="tsx" />
      <CodeBlock code={source} language="tsx" filePath="Example.tsx" />
    </>,
  );
  fireEvent.click(view.getAllByRole("button", { name: "Hide imports" })[0]);
  expect(view.getAllByRole("button", { name: "Hide imports" })).toHaveLength(1);
  expect(view.container.querySelectorAll("pre")[1].textContent).toBe(source);
  view.rerender(<CodeBlock code={`${source}\n// Changed`} language="tsx" />);
  expect(view.getByRole("button", { name: "Hide imports" })).toBeTruthy();
});

it("omits import controls for prose and snippets without imports", () => {
  const view = render(
    <>
      <CodeBlock code={source} language="tsx" renderedContent={<p>Document</p>} />
      <CodeBlock code="const value = 1;" language="typescript" />
    </>,
  );
  expect(view.queryByRole("button", { name: /imports/i })).toBeNull();
});

it("server-renders the complete readable source with imports expanded", () => {
  const html = renderToString(<CodeBlock code={source} language="tsx" />);
  expect(html).toContain('aria-expanded="true"');
  expect(html).toContain("import { Button }");
});

it("keeps import-only snippets readable without an empty collapse state and copies exact source", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const code = 'import { cn } from "@kamod-ch/ui/utils";\n';
  const view = render(<CodeBlock code={code} language="tsx" />);
  expect(view.queryByRole("button", { name: /imports/i })).toBeNull();
  expect(view.container.querySelector(".docs-code-label")?.textContent).toBe(
    "Import Setup·TypeScript",
  );
  expect(view.container.querySelector("pre code")?.textContent).toBe(code);
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(code));
});

it("omits wrapping for commands while keeping it for code and preserving Copy", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const command = "pnpm add @kamod-ch/ui preact @preact/signals";
  const view = render(
    <>
      <CodeBlock code={command} language="bash" />
      <CodeBlock code="{}" language="json" />
    </>,
  );
  const switches = view.getAllByRole("switch", { name: "Wrap code lines" });
  expect(switches).toHaveLength(1);
  expect(
    view.container.querySelectorAll(".docs-code-wrap")[0].querySelector(".docs-code-actions"),
  ).toBeNull();
  fireEvent.click(switches[0]);
  expect(switches[0].getAttribute("aria-checked")).toBe("true");
  expect(view.container.querySelector("pre")?.textContent).toBe(command);
  fireEvent.click(view.getAllByRole("button", { name: "Copy code" })[0]);
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(command));
});
