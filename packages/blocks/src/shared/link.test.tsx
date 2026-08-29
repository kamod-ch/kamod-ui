import { fireEvent, render } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { describe, expect, it } from "vitest";
import { NativeLink, renderBlockLink } from "./link";

describe("block link contract", () => {
  it("renders a native anchor by default", () => {
    const { container } = render(<NativeLink href="/docs">Docs</NativeLink>);
    const anchor = container.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("/docs");
    expect(anchor?.textContent).toBe("Docs");
  });

  it("uses a custom link component when provided", () => {
    const RouterLink = ({ href, children }: { href: string; children?: ComponentChildren }) => (
      <a data-router="true" href={href}>
        {children}
      </a>
    );
    const { container } = render(renderBlockLink(RouterLink, { href: "/app", children: "App" }));
    expect(container.querySelector("a")?.getAttribute("data-router")).toBe("true");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/app");
  });

  it("falls back to NativeLink when no adapter is passed", () => {
    const { container } = render(renderBlockLink(undefined, { href: "/x", children: "X" }));
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/x");
  });
});

describe("native link events", () => {
  it("forwards click handlers", () => {
    const clicks: string[] = [];
    const { container } = render(
      <NativeLink href="#gone" onClick={() => clicks.push("ok")}>
        Go
      </NativeLink>,
    );
    fireEvent.click(container.querySelector("a")!);
    expect(clicks).toEqual(["ok"]);
  });
});
