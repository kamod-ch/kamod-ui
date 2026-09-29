import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("copies raw source without line numbers or labels", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const code = "pnpm install\npnpm test";

    render(
      <CodeBlock
        code={code}
        language="bash"
        filename="setup.sh"
        showLineNumbers
        copyLabel="Copy snippet"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy snippet" }));
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(code);
    });
    expect(screen.getByText("1")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders plaintext as text nodes without injecting HTML", () => {
    const { container } = render(
      <CodeBlock code={'<script>alert("x")</script>'} showCopyButton={false} />,
    );
    expect(container.querySelector("code")?.innerHTML).not.toContain("<script>");
    expect(screen.getByText('<script>alert("x")</script>')).toBeInTheDocument();
  });

  it("shows an error when copy fails", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("denied")),
      },
    });
    Object.defineProperty(document, "execCommand", {
      configurable: true,
      value: vi.fn().mockReturnValue(false),
    });

    render(<CodeBlock code={"echo hello"} copyLabel="Copy command" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy command" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "Copied" })).not.toBeInTheDocument();
  });
});
