/** @vitest-environment jsdom */
import { cleanup, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ReferenceTooltip } from "./ReferenceTooltip";
import type { CodeReferenceHelp, CodeReferenceHelpRequest } from "./types";

const load = vi.hoisted(() => vi.fn());
vi.mock("./help/loader", () => ({ loadCodeReferenceHelp: load }));
vi.mock("./help/code-reference-help", () => ({
  CodeReferenceHelpContent: ({ reference }: { reference: CodeReferenceHelp }) => (
    <div data-reference-kind={reference.kind}>{reference.description}</div>
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
