import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@kamod-ch/ui/alert-dialog";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import {
  MotionAlertDialogContent,
  MotionAlertDialogOverlay,
  MotionAlertDialogPortal,
  MotionAlertDialogViewport,
} from "./index.js";

describe("MotionAlertDialog", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  const renderAlert = () =>
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open alert</AlertDialogTrigger>
        <MotionAlertDialogPortal>
          <MotionAlertDialogOverlay />
          <MotionAlertDialogViewport>
            <MotionAlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete item</AlertDialogTitle>
                <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </MotionAlertDialogContent>
          </MotionAlertDialogViewport>
        </MotionAlertDialogPortal>
      </AlertDialog>,
    );

  it("opens with alertdialog semantics and aria wiring", async () => {
    renderAlert();
    fireEvent.click(screen.getByRole("button", { name: "Open alert" }));

    const dialog = await screen.findByRole("alertdialog", { name: "Delete item" });
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-describedby");
  });

  it("does not dismiss on overlay outside click", async () => {
    renderAlert();
    fireEvent.click(screen.getByRole("button", { name: "Open alert" }));
    await screen.findByRole("alertdialog", { name: "Delete item" });

    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]');
    expect(overlay).toBeTruthy();
    fireEvent.pointerDown(overlay!);

    expect(screen.getByRole("alertdialog", { name: "Delete item" })).toBeInTheDocument();
  });

  it("closes with Escape and returns focus to trigger", async () => {
    renderAlert();
    const trigger = screen.getByRole("button", { name: "Open alert" });
    fireEvent.click(trigger);

    await screen.findByRole("alertdialog", { name: "Delete item" });
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});
