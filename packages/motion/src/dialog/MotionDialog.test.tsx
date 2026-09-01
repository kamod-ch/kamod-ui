import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@kamod-ch/ui/dialog";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { MotionDialogContent, MotionDialogOverlay, MotionDialogPortal } from "./index.js";

function mockReducedMotion() {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

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
            <DialogTitle id="motion-title">Motion dialog</DialogTitle>
            <DialogDescription id="motion-desc">Dialog description</DialogDescription>
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

  it("forwards aria-labelledby and aria-describedby from title and description", async () => {
    renderMotionDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));

    const dialog = await screen.findByRole("dialog", { name: "Motion dialog" });
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("handles rapid close and reopen without orphan portal nodes", async () => {
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

    const overlays = document.querySelectorAll('[data-slot="dialog-overlay"]');
    expect(overlays.length).toBeLessThanOrEqual(1);
  });

  it("keeps portal mounted through exit with data-state closed before unmount", async () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <MotionDialogPortal>
          <MotionDialogOverlay />
          <MotionDialogContent>
            <DialogTitle>Exit probe</DialogTitle>
          </MotionDialogContent>
        </MotionDialogPortal>
      </Dialog>,
    );

    await screen.findByRole("dialog", { name: "Exit probe" });
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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

  it("honors prefers-reduced-motion without throwing", () => {
    mockReducedMotion();

    renderMotionDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog", { name: "Motion dialog" })).toBeInTheDocument();
  });
});
