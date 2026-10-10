/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { BrandLink } from "../../docs/components/brand/BrandText";
import { brandReferences } from "../../docs/components/brand/brand-references";
import { kamodReferenceHref } from "../../docs/components/brand/kamod-references";
import { PathDisplay } from "../../docs/components/PathDisplay";
import { ApplicationTooltips } from "./ApplicationTooltips";
import { inlineCodeExplanation } from "./inline-code-glossary";
import { connectInlineCode } from "./inline-code-targets";

const settle = () =>
  act(async () => {
    await Promise.resolve();
  });
const hover = (element: Element, pointerType = "mouse") => {
  const event = new Event("pointerover", { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(element, event);
  act(() => {
    vi.advanceTimersByTime(500);
  });
};
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("explains known prose while leaving snippets, unknown identifiers and authored hints intact", () => {
  const { container } = render(
    <>
      <ApplicationTooltips page="one" />
      <p>
        <code>cn</code> <code>unknownValue</code>
      </p>
      <pre>
        <code>cn</code>
      </pre>
      <div class="docs-code-wrap">
        <code>package.json</code>
      </div>
      <button>
        <code>disabled</code>
      </button>
      <div data-code-help="off">
        <code>clsx</code>
      </div>
      <code data-tooltip="An authored explanation">children</code>
    </>,
  );
  const code = container.querySelector("p code")!;
  expect(container.querySelectorAll("[data-inline-code-help]")).toHaveLength(1);
  expect(code.textContent).toBe("cn");
  hover(code);
  const help = screen.getByRole("dialog", { name: "cn explained" });
  expect(help).toHaveTextContent("resolves recognized Tailwind conflicts");
  expect(help.querySelector(".reference-help-description strong")).toHaveTextContent(
    "Combine Class Names.",
  );
  expect(screen.getByRole("link", { name: "Explore cn" })).toHaveAttribute(
    "href",
    "/docs/cn/installation",
  );
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("lets keyboard users reach help links, then dismiss and return to the term", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <code aria-describedby="other-help">cn</code>
    </>,
  );
  const code = screen.getByRole("button", { name: "cn" });
  act(() => code.focus());
  const help = screen.getByRole("dialog");
  expect(code).toHaveAttribute("aria-expanded", "true");
  fireEvent.scroll(document);
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(code).toHaveAttribute("aria-describedby", `other-help ${help.id}`);
  fireEvent.keyDown(code, { key: "Tab" });
  const link = screen.getByRole("link", { name: "@kamod-ch/ui/utils" });
  expect(link).toHaveFocus();
  fireEvent.pointerDown(link);
  expect(screen.getByRole("dialog")).toBeVisible();
  fireEvent.keyDown(link, { key: "Escape" });
  expect(code).toHaveFocus();
  expect(code).toHaveAttribute("aria-expanded", "false");
  expect(code).toHaveAttribute("aria-describedby", "other-help");
  expect(screen.queryByRole("dialog")).toBeNull();
  fireEvent.keyDown(code, { key: "Enter" });
  expect(screen.getByRole("dialog")).toBeVisible();
});

it("supports tap on plain code without changing existing link activation", () => {
  const navigate = vi.fn((event: Event) => event.preventDefault());
  render(
    <>
      <ApplicationTooltips page="one" />
      <code>cn</code>
      <a href="/guide" onClick={navigate}>
        <code>class</code>
      </a>
    </>,
  );
  const code = screen.getByRole("button", { name: "cn" });
  hover(code, "touch");
  expect(screen.queryByRole("dialog")).toBeNull();
  fireEvent.pointerDown(code);
  fireEvent.click(code);
  expect(screen.getByRole("dialog")).toBeVisible();
  fireEvent.click(code);
  expect(screen.queryByRole("dialog")).toBeNull();
  const link = screen.getByRole("link", { name: "class" });
  expect(link.querySelector("code")).not.toHaveAttribute("tabindex");
  expect(link).not.toHaveAttribute("role");
  hover(link);
  expect(screen.getByRole("dialog")).toHaveTextContent("CSS class names");
  fireEvent.click(link);
  expect(navigate).toHaveBeenCalledOnce();
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("enhances dynamic prose, updates changed terms, and releases removed nodes and attributes", async () => {
  const { unmount } = render(<ApplicationTooltips page="one" />);
  const prose = document.createElement("p");
  prose.innerHTML = "<code>cn</code>";
  document.body.append(prose);
  await settle();
  const code = prose.querySelector("code")!;
  expect(code).toHaveAttribute("tabindex", "0");
  hover(code);
  expect(screen.getByRole("dialog")).toBeVisible();
  code.textContent = "unknownIdentifier";
  await settle();
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(code).not.toHaveAttribute("data-inline-code-help");
  expect(code).not.toHaveAttribute("role");
  code.textContent = "class";
  await settle();
  expect(code).toHaveAttribute("data-inline-code-help", "class");
  prose.remove();
  await settle();
  expect(code).not.toHaveAttribute("tabindex");
  document.body.append(prose);
  await settle();
  unmount();
  expect(code).not.toHaveAttribute("data-inline-code-help");
  expect(vi.getTimerCount()).toBe(0);
  prose.remove();
});

it("keeps persistent terms prepared across routes while enhancing newly mounted prose", async () => {
  const { rerender } = render(
    <>
      <ApplicationTooltips page="one" />
      <code>cn</code>
    </>,
  );
  const term = screen.getByRole("button", { name: "cn" });
  const setAttribute = vi.spyOn(term, "setAttribute");
  const removeAttribute = vi.spyOn(term, "removeAttribute");
  rerender(
    <>
      <ApplicationTooltips page="two" />
      <code>cn</code>
      <p>
        <code>children</code>
      </p>
    </>,
  );
  await settle();
  expect(screen.getByRole("button", { name: "children" })).toHaveAttribute(
    "data-inline-code-help",
    "children",
  );
  expect(setAttribute).not.toHaveBeenCalled();
  expect(removeAttribute).not.toHaveBeenCalled();
  setAttribute.mockRestore();
  removeAttribute.mockRestore();
});

it("does not inspect unrelated prose when syntax highlighting replaces source tokens", async () => {
  const root = document.createElement("section");
  root.innerHTML = "<p><code>Button</code></p><pre><code>const value = 1;</code></pre>";
  document.body.append(root);
  const stop = connectInlineCode(document);
  const term = root.querySelector("p code")!;
  const connected = vi.spyOn(term, "isConnected", "get");
  try {
    const source = root.querySelector("pre code")!;
    for (let index = 0; index < 10; index++) {
      source.innerHTML = `<span class="token keyword">const</span> value = ${index};`;
      await settle();
    }
    expect(connected).not.toHaveBeenCalled();
    expect(term).toHaveAttribute("data-inline-code-help", "Button");
  } finally {
    connected.mockRestore();
    stop();
    root.remove();
  }
});

it("preserves brand links and accepts explicit glossary keys without guessing arbitrary names", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <code>
        <a href="https://preactjs.com/">Preact</a>
      </code>
      <code data-code-help="cn">mergeClasses</code>
    </>,
  );
  expect(screen.getByRole("link", { name: "Preact" })).toHaveAttribute(
    "data-inline-code-help",
    "Preact",
  );
  hover(screen.getByRole("button", { name: "mergeClasses" }));
  expect(screen.getByRole("dialog")).toHaveTextContent("Combine Class Names.");
  expect(inlineCodeExplanation("constructor")).toBeUndefined();
  expect(inlineCodeExplanation("my-file.tsx")).toBeUndefined();
  expect(inlineCodeExplanation("Tailwind CSS v4")).toBe(inlineCodeExplanation("Tailwind"));
});

it.each(Object.entries(brandReferences))(
  "explains the branded %s link with its official destination",
  (name, reference) => {
    render(
      <>
        <ApplicationTooltips page="brands" />
        <code>
          <BrandLink>{name}</BrandLink>
        </code>
      </>,
    );
    const trigger = screen.getByRole("link", { name });
    hover(trigger);
    const help = screen.getByRole("dialog", { name: `${name} explained` });
    expect(help).toHaveTextContent(reference.description);
    expect(help.querySelector(".reference-help-heading strong")).toHaveTextContent(name);
    expect(help.querySelector(".reference-help-action")).toHaveAccessibleName(
      `Open reference for ${name}`,
    );
    expect(help.querySelector(".reference-help-footer")).not.toHaveTextContent(
      "Visit Official Website",
    );
    expect(help.querySelector("a")).toHaveAttribute("href", reference.href);
    expect(trigger).toHaveAttribute("href", reference.href);
    expect(trigger).not.toHaveAttribute("title");
  },
);

it("shares resource help without changing the original link and releases keyboard focus on Escape", () => {
  render(
    <>
      <ApplicationTooltips page="resources" />
      <a
        href="https://example.com/docs"
        target="_blank"
        data-reference-title="Live Docs"
        data-reference-path="@kamod-ch/hooks"
        data-reference-description="Explore the documentation and examples."
      >
        Docs
      </a>
    </>,
  );
  const trigger = screen.getByRole("link", { name: "Docs" });
  act(() => trigger.focus());
  const help = screen.getByRole("dialog", { name: "Live Docs explained" });
  expect(help.querySelector(".reference-help-heading")).toHaveTextContent(
    "Live Docs/@kamod-ch/hooks",
  );
  expect(help.querySelectorAll(".reference-help-action")).toHaveLength(1);
  expect(help.querySelector(".reference-help-footer")).toHaveTextContent(
    "https://example.com/docs",
  );
  fireEvent.keyDown(trigger, { key: "Tab" });
  expect(help.querySelector("a")).toHaveFocus();
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute("target", "_blank");
  expect(screen.queryByRole("dialog")).toBeNull();
});

it.each([
  "@kamod-ch/ui",
  "@kamod-ch/ui/utils",
  "@kamod-ch/icons/tabler/outline",
  "@kamod-ch/signals",
  "@kamod-ch/themes",
  "@kamod-ch/blocks",
  "@/components/kamod-ui/accordion",
])("keeps %s source destinations and keyboard navigation intact", (path) => {
  render(
    <>
      <ApplicationTooltips page="sources" />
      <PathDisplay path={path} />
    </>,
  );
  const trigger = screen.getByRole("link", { name: path });
  act(() => trigger.focus());
  const help = screen.getByRole("dialog", { name: `${path} explained` });
  const link = help.querySelector("a")!;
  expect(link).toHaveAttribute("href", kamodReferenceHref(path));
  expect(trigger).toHaveAttribute("href", link.getAttribute("href"));
  expect(trigger.closest("code")).not.toHaveAttribute("title");
  expect(trigger.closest("code")).not.toHaveAttribute("tabindex");
  fireEvent.keyDown(trigger, { key: "Tab" });
  expect(link).toHaveFocus();
  fireEvent.keyDown(link, { key: "Escape" });
  expect(trigger).toHaveFocus();
  expect(screen.queryByRole("dialog")).toBeNull();
});

it.each([
  [
    "Button",
    "/docs/button/installation",
    "@/components/kamod-ui/button",
    "packages/core/src/components/button",
  ],
  [
    "SidebarProvider",
    "/docs/sidebar/installation",
    "@/components/kamod-ui/sidebar",
    "packages/core/src/components/sidebar",
  ],
  [
    "Application Shell 3",
    "/blocks/application-shell/application-shell-3",
    "packages/blocks/src/application-shell/application-shell-3",
    "packages/blocks/src/application-shell/application-shell-3",
  ],
  [
    "Components",
    "/docs/components",
    "packages/core/src/components",
    "packages/core/src/components",
  ],
  ["Blocks", "/blocks", "packages/blocks/src", "packages/blocks/src"],
  ["Packages", "/docs/packages", "packages", "packages"],
])(
  "explains %s with a linked source path without changing its navigation",
  (label, href, path, source) => {
    const { container } = render(
      <>
        <ApplicationTooltips page="references" />
        <p>
          <a href={href}>
            <code>{label}</code>
          </a>
        </p>
      </>,
    );
    const trigger = container.querySelector("p a") as HTMLAnchorElement;
    act(() => trigger.focus());
    const help = screen.getByRole("dialog", { name: `${label} explained` });
    const sourceLink = help.querySelector(".docs-code-explanation-path a")!;
    expect(sourceLink).toHaveTextContent(path);
    expect(sourceLink).toHaveAttribute(
      "href",
      `https://github.com/kamod-ch/kamod-ui/tree/main/${source}`,
    );
    expect(help.querySelector(".reference-help-description")).not.toBeEmptyDOMElement();
    expect(trigger).toHaveAttribute("href", href);
    expect(trigger.querySelector("code")).not.toHaveAttribute("tabindex");
    fireEvent.keyDown(trigger, { key: "Tab" });
    expect(sourceLink).toHaveFocus();
    fireEvent.keyDown(sourceLink, { key: "Escape" });
    expect(trigger).toHaveFocus();
  },
);

it("keeps authored component destinations and disambiguates Formisch fields", () => {
  expect(inlineCodeExplanation("Button", "/docs/button/installation#sizes")?.path?.label).toBe(
    "@/components/kamod-ui/button",
  );
  expect(inlineCodeExplanation("Field", "/docs/formisch/installation#anatomy")?.path?.label).toBe(
    "@formisch/preact",
  );
  expect(inlineCodeExplanation("Button", "https://example.com/custom-button")?.path?.href).toBe(
    "https://example.com/custom-button",
  );
});
