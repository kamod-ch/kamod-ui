import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { SaveStatus } from "./SaveStatus";

const LABELS = {
  pristine: "No changes",
  dirty: "Unsaved changes",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
  offline: "Offline",
  retry: "Retry",
};

describe("SaveStatus", () => {
  it("renders text labels and icons for each state", () => {
    const { rerender } = render(<SaveStatus status="dirty" labels={LABELS} />);
    expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes");

    rerender(<SaveStatus status="saving" labels={LABELS} />);
    expect(screen.getByRole("status")).toHaveTextContent("Saving…");

    rerender(<SaveStatus status="offline" labels={LABELS} />);
    expect(screen.getByRole("status")).toHaveTextContent("Offline");
  });

  it("shows dirty instead of saved when unsaved changes remain", () => {
    render(
      <SaveStatus
        status="saved"
        hasUnsavedChanges
        labels={LABELS}
        lastSavedAt="2026-08-14T10:15:00.000Z"
        formatOptions={{ locale: "en-US", timeZone: "UTC" }}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Unsaved changes");
  });

  it("shows retry action and error message in error state", () => {
    const onRetry = vi.fn();
    render(
      <SaveStatus
        status="error"
        labels={LABELS}
        errorMessage="Network unavailable"
        onRetry={onRetry}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalled();
    expect(screen.getByText("Network unavailable")).toBeInTheDocument();
  });

  it("supports compact presentation", () => {
    render(<SaveStatus status="dirty" labels={LABELS} size="compact" data-testid="status" />);
    expect(screen.getByTestId("status")).toHaveAttribute("data-size", "compact");
  });
});
