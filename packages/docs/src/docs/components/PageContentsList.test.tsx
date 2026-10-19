/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import renderToString from "preact-render-to-string";
import { afterEach, expect, it, vi } from "vitest";
import type { DocContentsSection } from "../types";
import { flattenContents, PageContentsList } from "./PageContentsList";

const entries: DocContentsSection[] = [
  { id: "installation", label: "Installation" },
  {
    id: "prism-color-themes",
    label: "Prism syntax themes",
    collapsible: true,
    children: [
      { id: "prism-theme-light", label: "Light" },
      {
        id: "prism-theme-dark",
        label: "Dark",
        children: [{ id: "prism-theme-dark-source", label: "Source" }],
      },
    ],
  },
];

afterEach(async () => {
  await act(async () => cleanup());
  history.replaceState(null, "", "/");
  vi.restoreAllMocks();
});

it("leaves ordinary contents lists expanded and preserves flattened document order", () => {
  const ordinary = entries.map((entry) => ({ ...entry, collapsible: undefined }));
  const view = render(<PageContentsList entries={ordinary} activeId="installation" />);
  expect(view.queryByRole("button")).toBeNull();
  expect(view.getAllByRole("link")).toHaveLength(5);
  expect(view.getByRole("link", { name: "Installation" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  expect(view.getByRole("link", { name: "Source" })).toHaveAttribute("data-contents-depth", "3");
  expect(flattenContents(entries).map(({ id }) => id)).toEqual([
    "installation",
    "prism-color-themes",
    "prism-theme-light",
    "prism-theme-dark",
    "prism-theme-dark-source",
  ]);
});

it("server-renders closed children without removing their links and opens a known active descendant", () => {
  const server = document.createElement("div");
  server.innerHTML = renderToString(<PageContentsList entries={entries} activeId="installation" />);
  const toggle = server.querySelector("button")!;
  const panel = server.querySelector(".page-contents-disclosure-panel")!;
  expect(panel).toHaveAttribute("id", toggle.getAttribute("aria-controls"));
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(panel).toHaveAttribute("hidden");
  expect(panel.querySelectorAll("a")).toHaveLength(3);
  server.innerHTML = renderToString(
    <PageContentsList entries={entries} activeId="prism-theme-dark-source" />,
  );
  expect(server.querySelector("button")).toHaveAttribute("aria-expanded", "true");
  expect(server.querySelector(".page-contents-disclosure-panel")).not.toHaveAttribute("hidden");
});

it("keeps the parent link independent and retains keyboard focus when the native button toggles", () => {
  const view = render(
    <PageContentsList
      entries={entries}
      activeId="installation"
      getHref={(id) => `/docs/theming/installation#${id}`}
    />,
  );
  const link = view.getByRole("link", { name: "Prism Syntax Themes" });
  const toggle = view.getByRole("button", { name: "Toggle Prism Syntax Themes sections" });
  const panel = document.getElementById(toggle.getAttribute("aria-controls")!)!;
  expect(link).toHaveAttribute("href", "/docs/theming/installation#prism-color-themes");
  expect(toggle).toHaveAttribute("type", "button");
  expect(link.parentElement).toBe(toggle.parentElement);
  toggle.focus();
  fireEvent.click(toggle, { detail: 0 });
  expect(document.activeElement).toBe(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(panel).not.toHaveAttribute("hidden");
  expect(view.getByRole("link", { name: "Source" })).toHaveAttribute("data-contents-depth", "3");
  fireEvent.click(toggle, { detail: 0 });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  expect(panel).toHaveAttribute("hidden");
  expect(panel.querySelector('a[href$="#prism-theme-dark-source"]')).not.toBeNull();
  expect(location.hash).toBe("");
});

it("reveals a newly active descendant while respecting manual closure for the same reading position", async () => {
  const view = render(<PageContentsList entries={entries} activeId="installation" />);
  const toggle = view.getByRole("button");
  view.rerender(<PageContentsList entries={entries} activeId="prism-theme-dark-source" />);
  await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "true"));
  fireEvent.click(toggle);
  view.rerender(
    <PageContentsList entries={structuredClone(entries)} activeId="prism-theme-dark-source" />,
  );
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  view.rerender(<PageContentsList entries={entries} activeId="prism-theme-light" />);
  await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "true"));
});

it("reveals initial and history fragments without rewriting the URL or taking focus", async () => {
  history.replaceState(
    null,
    "",
    "/docs/theming/installation?view=compact#prism-theme-dark%2Dsource",
  );
  const view = render(<PageContentsList entries={entries} activeId="installation" />);
  const toggle = view.getByRole("button");
  const destination = location.href;
  await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "true"));
  expect(location.href).toBe(destination);
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  history.replaceState(null, "", "/docs/theming/installation?view=compact#prism-theme-light");
  fireEvent(window, new HashChangeEvent("hashchange"));
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(document.activeElement).not.toBe(toggle);
});

it("reveals same-document followed links, ignoring modified clicks and different documents", async () => {
  history.replaceState(null, "", "/docs/theming/installation?view=compact#prism-theme-light");
  const view = render(<PageContentsList entries={entries} activeId="installation" />);
  const toggle = view.getByRole("button");
  const outside = document.createElement("a");
  outside.textContent = "Open the dark source";
  outside.addEventListener("click", (event) => event.preventDefault());
  view.container.append(outside);
  // Wait until incoming-link listeners are attached.
  await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "true"));
  fireEvent.click(toggle);
  outside.href = "/docs/other?view=compact#prism-theme-dark-source";
  fireEvent.click(outside);
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  outside.href = "/docs/theming/installation?view=different#prism-theme-dark-source";
  fireEvent.click(outside);
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  outside.href = "/docs/theming/installation/?view=compact#prism-theme-dark-source";
  fireEvent.click(outside, { ctrlKey: true });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(outside);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
  expect(location.hash).toBe("#prism-theme-light");
  outside.remove();
});

it("releases incoming-link and hash listeners when an opted-in group unmounts", async () => {
  const documentAdd = vi.spyOn(document, "addEventListener");
  const documentRemove = vi.spyOn(document, "removeEventListener");
  const windowAdd = vi.spyOn(window, "addEventListener");
  const windowRemove = vi.spyOn(window, "removeEventListener");
  const view = render(<PageContentsList entries={entries} activeId="installation" />);
  await waitFor(() => expect(windowAdd).toHaveBeenCalledWith("hashchange", expect.any(Function)));
  const click = documentAdd.mock.calls.filter(([event]) => event === "click").at(-1)![1];
  const hash = windowAdd.mock.calls.filter(([event]) => event === "hashchange").at(-1)![1];
  await act(async () => {
    view.unmount();
  });
  expect(documentRemove).toHaveBeenCalledWith("click", click);
  expect(windowRemove).toHaveBeenCalledWith("hashchange", hash);
});
