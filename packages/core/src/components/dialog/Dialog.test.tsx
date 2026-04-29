import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "./index";

const renderDialog = (props?: { defaultOpen?: boolean; lockBodyScroll?: boolean }) =>
  render(
    <Dialog defaultOpen={props?.defaultOpen} lockBodyScroll={props?.lockBodyScroll}>
      <DialogTrigger>Open settings</DialogTrigger>
      <DialogContent aria-labelledby="settings-title" aria-describedby="settings-description">
        <DialogTitle id="settings-title">Settings</DialogTitle>
        <DialogDescription id="settings-description">Manage your preferences.</DialogDescription>
        <DialogClose>Done</DialogClose>
      </DialogContent>
    </Dialog>
  );

describe("Dialog", () => {
  afterEach(() => {
    document.body.removeAttribute("data-kamod-scroll-lock-count");
    document.body.removeAttribute("data-kamod-scroll-lock-body-overflow");
    document.body.removeAttribute("data-kamod-scroll-lock-body-padding-right");
    document.documentElement.removeAttribute("data-kamod-scroll-lock");
    document.documentElement.removeAttribute("data-kamod-scroll-lock-html-overflow");
    document.documentElement.removeAttribute("data-kamod-scroll-lock-html-scrollbar-gutter");
    document.documentElement.style.overflow = "";
    document.documentElement.style.scrollbarGutter = "";
    document.documentElement.style.removeProperty("--kamod-scroll-lock-gutter");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  it("opens from the trigger and exposes modal semantics", () => {
    renderDialog();

    const trigger = screen.getByRole("button", { name: "Open settings" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Settings" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Manage your preferences.")).toBeInTheDocument();
  });

  it("closes with the close button and returns focus to the trigger", () => {
    renderDialog();

    const trigger = screen.getByRole("button", { name: "Open settings" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("dismisses on Escape", () => {
    renderDialog();
    const trigger = screen.getByRole("button", { name: "Open settings" });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("dismisses on outside pointer down", async () => {
    renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Open settings" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-kamod-scroll-lock"));

    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.pointerDown(overlay as Element);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not dismiss when pointer down hits the modal panel root (e.g. grid gap / padding chrome)", async () => {
    renderDialog();

    fireEvent.click(screen.getByRole("button", { name: "Open settings" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement).toHaveAttribute("data-kamod-scroll-lock"));

    fireEvent.pointerDown(dialog);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("locks document scroll while open and restores it after close", () => {
    renderDialog({ defaultOpen: true });

    expect(document.documentElement).toHaveAttribute("data-kamod-scroll-lock");
    expect(document.documentElement.style.overflow).toBe("hidden");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(document.documentElement).not.toHaveAttribute("data-kamod-scroll-lock");
    expect(document.documentElement.style.overflow).toBe("");
    expect(document.body.style.overflow).toBe("");
  });
});
