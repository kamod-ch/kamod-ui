import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { highlightCode } from "./highlight-code";
import {
  Code,
  type CodeCopyActionContext,
  type CodeImportControlContext,
  type CodeWrapControlContext,
  codeLanguages,
  normalizeCodeLanguage,
} from "./index";

const source = 'import { Button } from "ui";\n\nexport const Save = () => <Button>Save</Button>;';
const body = "export const Save = () => <Button>Save</Button>;";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it("server-renders headerless escaped source with slots and a selected syntax theme", () => {
  const code = '<script>alert("unsafe")</script>\n<img src=x onerror=alert(1)>';
  const host = document.createElement("div");
  host.innerHTML = renderToString(
    <Code
      code={code}
      highlight={false}
      showToolbar={false}
      showWrapControl={false}
      syntaxTheme="forest"
      beforeCode={<p>Before source</p>}
      afterCode={<p>After source</p>}
    />,
  );
  expect(host.querySelector("pre code")?.textContent).toBe(code);
  expect(host.querySelector("script, img")).toBeNull();
  expect(host.querySelector('[data-slot="code"]')).toHaveAttribute("data-syntax-theme", "forest");
  expect(host.querySelector("pre")?.previousElementSibling?.textContent).toBe("Before source");
  expect(host.querySelector("pre")?.nextElementSibling?.textContent).toBe("After source");
  expect(host.querySelector('[data-slot="code-toolbar"], [role="status"]')).toBeNull();
});

it.each([source, body])(
  "retains reading controls when the complete toolbar is hidden: %s",
  (code) => {
    const toolbar = vi.fn();
    const copyAction = vi.fn();
    const view = render(
      <Code
        code={code}
        showToolbar={false}
        renderToolbar={toolbar}
        renderCopyAction={copyAction}
      />,
    );
    const row = view.container.querySelector('[data-slot="code-imports"]');
    expect(row).toContainElement(view.getByRole("switch", { name: "Wrap code lines" }));
    expect(view.queryByRole("button", { name: "Copy code" })).toBeNull();
    expect(view.queryByRole("status")).toBeNull();
    expect(toolbar).not.toHaveBeenCalled();
    expect(copyAction).not.toHaveBeenCalled();
    fireEvent.click(view.getByRole("switch"));
    expect(view.container.querySelector('[data-slot="code"]')).toHaveClass("is-wrapped");
    if (code === source) {
      fireEvent.click(view.getByRole("button", { name: "Hide imports" }));
      expect(view.container.querySelector("pre")?.textContent).toBe(body);
    }
  },
);

it("honors controlled wrap/import state and only reports requested changes", () => {
  const onWrappedChange = vi.fn();
  const onImportsCollapsedChange = vi.fn();
  const props = { code: source, onWrappedChange, onImportsCollapsedChange };
  const view = render(<Code {...props} wrapped={false} importsCollapsed={false} />);
  fireEvent.click(view.getByRole("switch"));
  fireEvent.click(view.getByRole("button", { name: "Hide imports" }));
  expect(onWrappedChange).toHaveBeenCalledExactlyOnceWith(true);
  expect(onImportsCollapsedChange).toHaveBeenCalledExactlyOnceWith(true);
  expect(view.getByRole("switch")).not.toBeChecked();
  expect(view.container.querySelector("pre")?.textContent).toBe(source);
  view.rerender(<Code {...props} wrapped importsCollapsed />);
  expect(view.getByRole("switch")).toBeChecked();
  expect(view.container.querySelector("pre")?.textContent).toBe(body);
  const next = source.replaceAll("Save", "Next");
  view.rerender(<Code {...props} code={next} wrapped importsCollapsed />);
  expect(view.container.querySelector("pre")?.textContent).toBe(body.replaceAll("Save", "Next"));
  expect(onImportsCollapsedChange).toHaveBeenCalledOnce();
});

it("retains uncontrolled wrap choices and resets imports on source changes without notifying", () => {
  const onWrappedChange = vi.fn();
  const onImportsCollapsedChange = vi.fn();
  const props = { code: source, onWrappedChange, onImportsCollapsedChange };
  const view = render(<Code {...props} defaultWrapped defaultImportsCollapsed />);
  fireEvent.click(view.getByRole("switch"));
  fireEvent.click(view.getByRole("button", { name: "Show imports" }));
  view.rerender(<Code {...props} defaultWrapped={false} defaultImportsCollapsed={false} />);
  expect(view.getByRole("switch")).not.toBeChecked();
  expect(view.container.querySelector("pre")?.textContent).toBe(source);
  view.rerender(
    <Code
      {...props}
      code={source.replaceAll("Save", "Next")}
      defaultWrapped
      defaultImportsCollapsed
    />,
  );
  expect(view.getByRole("switch")).not.toBeChecked();
  expect(view.container.querySelector("pre")?.textContent).toBe(body.replaceAll("Save", "Next"));
  expect(onWrappedChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(onImportsCollapsedChange).toHaveBeenCalledExactlyOnceWith(false);
});

it("supplies working custom reading controls with source IDs and import counts", () => {
  const renderWrapControl = ({ codeId, wrapped, onWrappedChange }: CodeWrapControlContext) => (
    <button
      type="button"
      aria-controls={codeId}
      aria-pressed={wrapped}
      onClick={() => onWrappedChange(!wrapped)}
    >
      Custom wrap
    </button>
  );
  const renderImportControl = ({
    codeId,
    collapsed,
    count,
    onCollapsedChange,
  }: CodeImportControlContext) => (
    <button
      type="button"
      aria-controls={codeId}
      aria-expanded={!collapsed}
      onClick={() => onCollapsedChange(!collapsed)}
    >
      {count} imports
    </button>
  );
  const view = render(
    <Code
      code={source}
      renderWrapControl={renderWrapControl}
      renderImportControl={renderImportControl}
    />,
  );
  const wrap = view.getByRole("button", { name: "Custom wrap" });
  const imports = view.getByRole("button", { name: "1 imports" });
  expect(wrap).toHaveAttribute("aria-controls", view.container.querySelector("pre")!.id);
  expect(imports).toHaveAttribute("aria-controls", view.container.querySelector("pre")!.id);
  fireEvent.click(wrap);
  fireEvent.click(imports);
  expect(wrap).toHaveAttribute("aria-pressed", "true");
  expect(imports).toHaveAttribute("aria-expanded", "false");
  expect(view.container.querySelector("pre")?.textContent).toBe(body);
});

it("can decorate default reading controls and omit replacements without empty rows", () => {
  const view = render(
    <Code
      code={source}
      renderWrapControl={({ defaultControl }) => (
        <section aria-label="Wrap settings">{defaultControl}</section>
      )}
      renderImportControl={({ defaultControl }) => (
        <section aria-label="Import settings">{defaultControl}</section>
      )}
    />,
  );
  expect(view.getByRole("region", { name: "Wrap settings" })).toContainElement(
    view.getByRole("switch"),
  );
  expect(view.getByRole("region", { name: "Import settings" })).toContainElement(
    view.getByRole("button", { name: "Hide imports" }),
  );
  view.rerender(
    <Code
      code={source}
      defaultImportsCollapsed
      renderWrapControl={() => null}
      renderImportControl={() => null}
    />,
  );
  expect(view.container.querySelector('[data-slot="code-imports"]')).toBeNull();
  expect(view.queryByRole("switch")).toBeNull();
});

it("keeps custom clipboard feedback local and preserves full source, slots excluded", async () => {
  let finish!: () => void;
  const writeText = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  const toolbar = vi.fn((actions) => <header>{actions}</header>);
  const onCopy = vi.fn();
  const renderCopyAction = ({ status, statusId, copy }: CodeCopyActionContext) => (
    <button
      type="button"
      aria-describedby={statusId}
      disabled={status === "copying"}
      onClick={() => void copy()}
    >
      Custom copy {status}
    </button>
  );
  const view = render(
    <Code
      code={source}
      defaultImportsCollapsed
      renderToolbar={toolbar}
      renderCopyAction={renderCopyAction}
      onCopy={onCopy}
      beforeCode={<p>Before</p>}
      afterCode={<p>After</p>}
    />,
  );
  toolbar.mockClear();
  fireEvent.click(view.getByRole("button", { name: "Custom copy idle" }));
  expect(view.getByRole("button", { name: "Custom copy copying" })).toBeDisabled();
  await act(async () => finish());
  await waitFor(() =>
    expect(view.getByRole("button", { name: "Custom copy copied" })).not.toBeDisabled(),
  );
  expect(view.getByRole("status")).toHaveTextContent("Code copied to clipboard.");
  expect(writeText).toHaveBeenCalledExactlyOnceWith(source);
  expect(onCopy).toHaveBeenCalledExactlyOnceWith(source);
  expect(toolbar).not.toHaveBeenCalled();
  view.rerender(<Code code="replacement" renderCopyAction={renderCopyAction} />);
  expect(view.getByRole("button", { name: "Custom copy idle" })).toBeVisible();
  expect(view.getByRole("status")).toHaveTextContent("");
});

it("retains copy error announcements when the copy button is replaced", async () => {
  const error = new Error("denied");
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(error) } });
  const onCopyError = vi.fn();
  const view = render(
    <Code
      code={source}
      onCopyError={onCopyError}
      renderCopyAction={({ defaultControl }) => <div>{defaultControl}</div>}
    />,
  );
  fireEvent.click(view.getByRole("button", { name: "Copy code" }));
  await waitFor(() => expect(onCopyError).toHaveBeenCalledWith(error));
  expect(view.getByRole("status")).toHaveTextContent("Could not copy code.");
});

it.each(codeLanguages)("publishes only supported canonical language values: %s", (language) => {
  expect(normalizeCodeLanguage(language)).toBe(language);
  if (language !== "text") {
    expect(() => highlightCode("const value = 1;", language)).not.toThrow();
  }
});

it("decorates a resolved language without changing source or explicit file headers", () => {
  const renderLanguage = vi.fn((language, label) => <a href={`#${language}`}>{label}</a>);
  const source = "export const ready = true;";
  const view = render(<Code code={source} language="ts" renderLanguage={renderLanguage} />);
  expect(view.getByRole("link", { name: "TypeScript" })).toHaveAttribute("href", "#typescript");
  expect(view.container.querySelector("pre code")?.textContent).toBe(source);
  renderLanguage.mockClear();
  view.rerender(<Code code={source} filePath="example.ts" renderLanguage={renderLanguage} />);
  expect(renderLanguage).not.toHaveBeenCalled();
});
