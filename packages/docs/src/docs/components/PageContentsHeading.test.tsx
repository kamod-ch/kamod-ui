/** @vitest-environment jsdom */
import { cleanup, render } from "@testing-library/preact";
import renderToString from "preact-render-to-string";
import { afterEach, expect, it } from "vitest";
import { PageContentsHeading } from "./PageContentsHeading";

afterEach(() => {
  cleanup();
  history.replaceState(null, "", "/");
});

it("links to the tracked section with a native shortcut, preserving the current route and query", () => {
  history.replaceState(null, "", "/docs/forms?example=compact#previous");
  const view = render(<PageContentsHeading count={10} activeId="validation" />);
  const shortcut = view.getByRole("link", {
    name: "Jump to the current section",
  }) as HTMLAnchorElement;
  expect(shortcut.href).toBe(`${location.origin}/docs/forms?example=compact#validation`);
  expect(shortcut).toHaveClass("sidebar-entry-action");
  expect(shortcut.querySelector("svg")).toHaveAttribute("width", "16");
  expect(view.getByLabelText("10 main page sections")).toHaveTextContent("10 Sections");
  expect(location.hash).toBe("#previous");
  view.rerender(<PageContentsHeading count={10} activeId="submission" />);
  expect(shortcut).toHaveAttribute("href", "#submission");
});

it("reuses the pinned left-row styles and retains semantic heading levels and the page-top link", () => {
  history.replaceState(null, "", "/docs/packages?view=compact#old-section");
  const view = render(
    <PageContentsHeading id="contents-heading" count={1} activeId="page-title" level="h3" />,
  );
  expect(view.getByRole("heading", { level: 3 })).toHaveAttribute("id", "contents-heading");
  expect(view.container.querySelector(".sidebar-entry-row > svg")).toHaveAttribute("width", "16");
  expect(view.container.querySelector(".sidebar-entry-caption")).toHaveTextContent("· 1 Section");
  expect(view.getByLabelText("1 main page section")).toHaveTextContent("1 Section");
  const top = view.getByRole("link", { name: "On This Page" }) as HTMLAnchorElement;
  expect(new URL(top.href).hash).toBe("");
  expect(view.getByRole("link", { name: "Jump to the current section" })).toHaveAttribute(
    "href",
    "#page-title",
  );
  const server = document.createElement("div");
  server.innerHTML = renderToString(<PageContentsHeading count={1} activeId="top" />);
  expect(server.querySelector(".page-contents-locate")).toHaveAttribute("href", "");
});
