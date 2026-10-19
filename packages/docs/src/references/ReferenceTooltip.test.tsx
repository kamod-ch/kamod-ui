/** @vitest-environment jsdom */
import { act, cleanup, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ReferenceTooltip } from "./ReferenceTooltip";
import type { CodeReferenceHelp, CodeReferenceHelpRequest } from "./types";

const load = vi.hoisted(() => vi.fn());
vi.mock("./help/loader", () => ({ loadCodeReferenceHelp: load }));
vi.mock("./help/code-reference-help", () => ({
  CodeReferenceHelpContent: ({ reference }: { reference: CodeReferenceHelp }) => (
    <div data-reference-kind={reference.kind}>
      <p>{reference.description}</p>
      <a href={reference.docs?.href}>Read {reference.name} reference</a>
    </div>
  ),
}));
afterEach(() => {
  cleanup();
  load.mockReset();
});

const request: CodeReferenceHelpRequest = {
  label: "Button",
  module: "@kamod-ch/ui/button",
  imported: "Button",
  href: "/docs/button/installation#api-reference",
};
const facts: CodeReferenceHelp = {
  name: "Button",
  module: request.module,
  kind: "component",
  description: "Verified button details.",
  docs: { label: "API reference", href: request.href },
};

it("shows loading immediately, never loads a dismissed result into a new request, and resets old content", async () => {
  let release!: (value: CodeReferenceHelp) => void;
  load.mockImplementationOnce(
    () =>
      new Promise<CodeReferenceHelp>((resolve) => {
        release = resolve;
      }),
  );
  load.mockResolvedValueOnce({ ...facts, name: "Card", description: "Verified card details." });
  const { container, rerender } = render(<ReferenceTooltip request={request} />);
  expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  await waitFor(() => expect(load).toHaveBeenCalledOnce());
  rerender(<ReferenceTooltip request={{ ...request, label: "Card", imported: "Card" }} />);
  expect(container.querySelector('[aria-busy="true"]')).not.toBeNull();
  release(facts);
  await screen.findByText("Verified card details.");
  expect(screen.queryByText("Verified button details.")).toBeNull();
});

it("keeps a usable destination after a failed optional request", async () => {
  load.mockRejectedValueOnce(new Error("Chunk unavailable"));
  render(<ReferenceTooltip request={request} />);
  expect(await screen.findByRole("link", { name: "Open the reference" })).toHaveAttribute(
    "href",
    request.href,
  );
});

it("keeps the request boundary and focus stable while retiring the loading announcement", async () => {
  let release!: (value: CodeReferenceHelp) => void;
  load.mockImplementationOnce(
    () =>
      new Promise<CodeReferenceHelp>((resolve) => {
        release = resolve;
      }),
  );
  const { container, getByRole } = render(
    <>
      <button type="button">Reference term</button>
      <ReferenceTooltip request={request} />
    </>,
  );
  const term = getByRole("button", { name: "Reference term" });
  term.focus();
  const boundary = container.querySelector(".code-reference-help-transition")!;
  expect(boundary).toHaveAttribute("data-reference-phase", "loading");
  expect(getByRole("status")).not.toBeNull();
  await waitFor(() => expect(load).toHaveBeenCalledOnce());
  await act(async () => release(facts));
  await screen.findByText(facts.description);
  expect(container.querySelector(".code-reference-help-transition")).toBe(boundary);
  expect(boundary).toHaveAttribute("data-reference-phase", "ready");
  const pending = boundary.querySelector(".code-reference-help-pending");
  expect(pending).toHaveAttribute("aria-hidden", "true");
  expect(pending).toHaveAttribute("inert");
  expect(boundary.querySelector('[aria-busy="true"]')).toBeNull();
  expect(screen.queryByRole("status")).toBeNull();
  expect(term).toHaveFocus();
  const destination = getByRole("link", { name: "Read Button reference" });
  expect(destination).toHaveAttribute("href", request.href);
  destination.focus();
  expect(destination).toHaveFocus();
});

it("ignores a failed request after another reference has replaced it", async () => {
  let reject!: (error: Error) => void;
  load.mockImplementationOnce(
    () =>
      new Promise<CodeReferenceHelp>((_, fail) => {
        reject = fail;
      }),
  );
  load.mockResolvedValueOnce({ ...facts, name: "Card", description: "Verified card details." });
  const { rerender } = render(<ReferenceTooltip request={request} />);
  await waitFor(() => expect(load).toHaveBeenCalledOnce());
  rerender(<ReferenceTooltip request={{ ...request, label: "Card", imported: "Card" }} />);
  await screen.findByText("Verified card details.");
  await act(async () => reject(new Error("Old request failed")));
  expect(screen.getByText("Verified card details.")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Open the reference" })).toBeNull();
});

it("does not mount resolved content after dismissal", async () => {
  let release!: (value: CodeReferenceHelp) => void;
  load.mockImplementationOnce(
    () =>
      new Promise<CodeReferenceHelp>((resolve) => {
        release = resolve;
      }),
  );
  const { container, unmount } = render(<ReferenceTooltip request={request} />);
  await waitFor(() => expect(load).toHaveBeenCalledOnce());
  unmount();
  await act(async () => release(facts));
  expect(container).toBeEmptyDOMElement();
  expect(screen.queryByText(facts.description)).toBeNull();
});

it("forwards the inline identity through the shared loading boundary", async () => {
  const inline = {
    label: "preact",
    module: "Preact",
    referenceId: "technology:preact",
    href: "https://preactjs.com/",
  };
  load.mockResolvedValueOnce({ ...facts, kind: "technology", description: "Technology details." });
  render(<ReferenceTooltip request={inline} />);
  await screen.findByText("Technology details.");
  expect(load).toHaveBeenCalledWith(expect.objectContaining(inline));
});
