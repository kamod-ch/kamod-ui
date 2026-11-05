import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./index";

describe("AlertDialog", () => {
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

  it("uses alertdialog semantics, focuses cancel on open, and returns focus after Escape", async () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete item</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const trigger = screen.getByRole("button", { name: "Delete item" });
    fireEvent.click(trigger);

    const alert = screen.getByRole("alertdialog", { name: "Delete this item?" });
    expect(alert).toHaveAttribute("aria-modal", "true");

    const cancel = screen.getByRole("button", { name: "Cancel" });
    await waitFor(() => expect(cancel).toHaveFocus());

    fireEvent.keyDown(alert, { key: "Escape" });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
