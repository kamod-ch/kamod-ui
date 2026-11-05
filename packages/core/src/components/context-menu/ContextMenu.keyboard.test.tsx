import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContextMenu } from "./ContextMenu";
import { ContextMenuContent } from "./ContextMenuContent";
import { ContextMenuItem } from "./ContextMenuItem";
import { ContextMenuSub } from "./ContextMenuSub";
import { ContextMenuSubContent } from "./ContextMenuSubContent";
import { ContextMenuSubTrigger } from "./ContextMenuSubTrigger";
import { ContextMenuTrigger } from "./ContextMenuTrigger";

afterEach(() => {
  cleanup();
});

describe("ContextMenu keyboard", () => {
  it("opens from context menu and supports arrow navigation", () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Surface</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Cut</ContextMenuItem>
          <ContextMenuItem disabled>Paste</ContextMenuItem>
          <ContextMenuItem>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    const menu = screen.getByRole("menu");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Cut" }));
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Copy" }));
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Surface</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Cut</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    const trigger = screen.getByText("Surface");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("activates the focused item with Enter", () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Surface</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onSelect}>Cut</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Enter" });
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("opens a submenu with ArrowRight and ArrowLeft returns to the sub trigger", async () => {
    render(
      <ContextMenu defaultOpen>
        <ContextMenuTrigger>Surface</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem disabled>Blocked</ContextMenuItem>
              <ContextMenuItem>Link</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>,
    );
    const subTrigger = screen.getByRole("menuitem", { name: "Share" });
    subTrigger.focus();
    fireEvent.keyDown(subTrigger, { key: "ArrowRight" });
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Link" })),
    );
    fireEvent.keyDown(screen.getAllByRole("menu")[1]!, { key: "ArrowLeft" });
    await waitFor(() => expect(subTrigger).toHaveFocus());
    expect(screen.queryByRole("menuitem", { name: "Link" })).toBeNull();
  });
});
