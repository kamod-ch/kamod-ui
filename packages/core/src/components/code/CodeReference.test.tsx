import { cleanup, render } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import { Code } from "./Code";
import { CodeReferenceProvider } from "./CodeReferenceProvider";
import type { CodeReferenceResolver } from "./code-references";

afterEach(cleanup);
const source =
  'import { Button } from "ui";\n\nexport const Example = () => <Button>Save</Button>;';
const resolve: CodeReferenceResolver = ({ imported }) =>
  imported ? "/reference/button" : "/reference/ui";

it("renders source links during SSR without waiting for grammars or browser APIs", () => {
  const html = renderToString(
    <CodeReferenceProvider resolve={resolve}>
      <Code code={source} highlight={false} />
    </CodeReferenceProvider>,
  );
  expect(html).toContain('class="kamod-code-reference" href="/reference/button"');
  expect(html).toContain('href="/reference/ui"');
  const node = document.createElement("div");
  node.innerHTML = html;
  expect(node.querySelector("pre code")?.textContent).toBe(source);
  expect(node.querySelectorAll("pre code a")).toHaveLength(4);
  const name = node.querySelector<HTMLAnchorElement>('a[href="/reference/button"]')!;
  expect(name.dataset.codeModule).toBe("ui");
  expect(name.dataset.codeImported).toBe("Button");
  expect(name.dataset.codeLocal).toBe("Button");
  expect(
    node.querySelector<HTMLAnchorElement>('a[href="/reference/ui"]')!.dataset.codeImported,
  ).toBeUndefined();
  expect(node.querySelector("pre code svg")).toBeNull();
});

it("inherits a stable resolver, skips repeat analysis on folding/wrapping and supports a panel opt-out", () => {
  const resolver = vi.fn(resolve);
  const panel = (props = {}) => (
    <CodeReferenceProvider resolve={resolver}>
      <Code code={source} highlight={false} {...props} />
    </CodeReferenceProvider>
  );
  const view = render(panel());
  expect(view.container.querySelectorAll("pre code a")).toHaveLength(4);
  const calls = resolver.mock.calls.length;
  view.rerender(panel({ wrapped: true, importsCollapsed: true }));
  expect(view.container.querySelectorAll("pre code a")).toHaveLength(2);
  expect(resolver).toHaveBeenCalledTimes(calls);
  expect(view.container.querySelector("pre code")?.textContent).toBe(
    "export const Example = () => <Button>Save</Button>;",
  );
  view.rerender(panel({ resolveReference: null }));
  expect(view.container.querySelector("pre code a")).toBeNull();
  view.rerender(panel());
  expect(view.container.querySelectorAll("pre code a")).toHaveLength(4);
});

it("keeps the library neutral without a resolver and does not scan a rendered document", () => {
  const resolver = vi.fn(resolve);
  const view = render(<Code code={source} highlight={false} />);
  expect(view.container.querySelector("pre code a")).toBeNull();
  view.rerender(
    <Code code={source} resolveReference={resolver} renderedContent={<p>Prepared content</p>} />,
  );
  expect(view.container.querySelector("pre")).toBeNull();
  expect(resolver).not.toHaveBeenCalled();
});
