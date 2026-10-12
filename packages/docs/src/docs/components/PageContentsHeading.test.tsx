/** @vitest-environment jsdom */
import { cleanup, fireEvent, render, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { PageContentsHeading } from "./PageContentsHeading";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  history.replaceState(null, "", "/");
});

it("copies the reading section with the page's query, even when its URL hash is stale", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  history.replaceState(null, "", "/docs/forms?example=compact#previous");
  const view = render(<PageContentsHeading count={7} activeId="validation" />);
  fireEvent.click(view.getByRole("button", { name: "Copy page or section link" }));
  await waitFor(() =>
    expect(writeText).toHaveBeenLastCalledWith(
      `${location.origin}/docs/forms?example=compact#validation`,
    ),
  );
  expect(location.hash).toBe("#previous");
  view.rerender(<PageContentsHeading count={7} activeId="submission" />);
  fireEvent.click(view.getByRole("button", { name: "Copy page or section link" }));
  await waitFor(() =>
    expect(writeText).toHaveBeenLastCalledWith(
      `${location.origin}/docs/forms?example=compact#submission`,
    ),
  );
});

it("copies a clean page URL at the opening heading and preserves the heading's top link", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  history.replaceState(null, "", "/docs/packages?view=compact#old-section");
  const view = render(<PageContentsHeading count={1} activeId="page-title" />);
  fireEvent.click(view.getByRole("button", { name: "Copy page or section link" }));
  await waitFor(() =>
    expect(writeText).toHaveBeenCalledWith(`${location.origin}/docs/packages?view=compact`),
  );
  expect(view.getByLabelText("1 main page section")).toHaveTextContent("1 Page Section");
  const top = view.getByRole("link", { name: "On This Page" }) as HTMLAnchorElement;
  expect(new URL(top.href).hash).toBe("");
});
