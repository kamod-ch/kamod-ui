import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { Button } from "../button/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./index";

const renderDialog = (props?: { defaultOpen?: boolean; lockBodyScroll?: boolean }) =>
  render(
    <Dialog defaultOpen={props?.defaultOpen} lockBodyScroll={props?.lockBodyScroll}>
      <DialogTrigger>Open settings</DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Manage your preferences.</DialogDescription>
        <DialogClose>Done</DialogClose>
      </DialogContent>
    </Dialog>,
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
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Manage your preferences.")).toBeInTheDocument();
  });

  it("focuses the dialog panel when opened", async () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open settings" }));
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    await waitFor(() => expect(dialog).toHaveFocus());
  });

  it("traps focus within the dialog on Tab", async () => {
    renderDialog();
    fireEvent.click(screen.getByRole("button", { name: "Open settings" }));
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    await waitFor(() => expect(dialog).toHaveFocus());

    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(dialog.contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document.activeElement as Element, { key: "Tab" });
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("closes with the close button and returns focus to the trigger", () => {
    renderDialog();

    const trigger = screen.getByRole("button", { name: "Open settings" });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Done" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("does not dismiss on Escape or overlay click when dismissible is false", () => {
    render(
      <Dialog defaultOpen dismissible={false}>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your preferences.</DialogDescription>
          <DialogClose>Done</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();

    const overlay = document.querySelector('[data-slot="dialog-overlay"]');
    expect(overlay).toBeInTheDocument();
    fireEvent.pointerDown(overlay as Element);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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

  it("renders one button when the trigger delegates to Button", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
      </Dialog>,
    );
    expect(screen.getAllByRole("button", { name: "Open" })).toHaveLength(1);
  });

  it("focuses an autofocus control instead of the panel", async () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <input aria-label="Display name" data-autofocus />
          <DialogClose>Done</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    await waitFor(() =>
      expect(screen.getByRole("textbox", { name: "Display name" })).toHaveFocus(),
    );
  });

  it("adds the scrollbar width to the existing body padding", async () => {
    const stylesheet = document.createElement("style");
    stylesheet.textContent = "body { padding-right: 8px; }";
    document.head.append(stylesheet);
    vi.stubGlobal("innerWidth", 115);
    const descriptor = Object.getOwnPropertyDescriptor(document.documentElement, "clientWidth");
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      get: () => 100,
    });

    renderDialog({ defaultOpen: true });
    await waitFor(() => expect(document.body.style.paddingRight).toBe("23px"));

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(document.body.style.paddingRight).toBe("");
    stylesheet.remove();

    if (descriptor) {
      Object.defineProperty(document.documentElement, "clientWidth", descriptor);
    }
    vi.unstubAllGlobals();
  });

  it("closes only the nested popover on Escape and outside click, then restores the dialog trigger", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <Popover>
            <PopoverTrigger>Open popover</PopoverTrigger>
            <PopoverContent>Popover body</PopoverContent>
          </Popover>
          <DialogClose>Done</DialogClose>
        </DialogContent>
      </Dialog>,
    );

    const dialogTrigger = screen.getByRole("button", { name: "Open settings" });
    fireEvent.click(dialogTrigger);
    const dialog = screen.getByRole("dialog", { name: "Settings" });
    fireEvent.click(screen.getByRole("button", { name: "Open popover" }));
    expect(screen.getByText("Popover body")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open popover" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Open popover" }));
    fireEvent.pointerDown(document.body);
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
    expect(dialog).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Settings" })).not.toBeInTheDocument();
    expect(dialogTrigger).toHaveFocus();
  });

  it("closes a nested select before the dialog and returns focus to each trigger", () => {
    render(
      <Dialog>
        <DialogTrigger>Open settings</DialogTrigger>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <Select>
            <SelectTrigger aria-label="Framework">
              <SelectValue placeholder="Pick a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preact">Preact</SelectItem>
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>,
    );

    const dialogTrigger = screen.getByRole("button", { name: "Open settings" });
    fireEvent.click(dialogTrigger);
    const selectTrigger = screen.getByRole("button", { name: "Framework" });
    fireEvent.click(selectTrigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    expect(selectTrigger).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Settings" })).not.toBeInTheDocument();
    expect(dialogTrigger).toHaveFocus();
  });
});
