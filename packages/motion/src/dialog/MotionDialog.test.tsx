import { Dialog, DialogClose, DialogTitle, DialogTrigger } from "@kamod-ch/ui/dialog";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { MotionDialogContent, MotionDialogOverlay, MotionDialogPortal } from "./index.js";

describe("MotionDialog", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const renderMotionDialog = () =>
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <MotionDialogPortal>
          <MotionDialogOverlay />
          <MotionDialogContent>
            <DialogTitle>Motion dialog</DialogTitle>
            <DialogClose>Close</DialogClose>
          </MotionDialogContent>
        </MotionDialogPortal>
      </Dialog>,
    );

  it("opens with modal semantics and motion content", async () => {
    renderMotionDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const dialog = await screen.findByRole("dialog", { name: "Motion dialog" });
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeTruthy();
  });

  it("handles rapid close and reopen", async () => {
    renderMotionDialog();
    const trigger = screen.getByRole("button", { name: "Open" });

    fireEvent.click(trigger);
    await screen.findByRole("dialog", { name: "Motion dialog" });

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Motion dialog" })).toHaveAttribute(
        "data-state",
        "open",
      );
    });
  });

  it("closes with Escape and returns focus to trigger", async () => {
    renderMotionDialog();
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog", { name: "Motion dialog" });
    fireEvent.keyDown(dialog, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});
