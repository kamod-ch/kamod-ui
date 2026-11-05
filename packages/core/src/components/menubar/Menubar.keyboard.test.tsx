import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Menubar } from "./Menubar";
import { MenubarContent } from "./MenubarContent";
import { MenubarItem } from "./MenubarItem";
import { MenubarMenu } from "./MenubarMenu";
import { MenubarSub } from "./MenubarSub";
import { MenubarSubContent } from "./MenubarSubContent";
import { MenubarSubTrigger } from "./MenubarSubTrigger";
import { MenubarTrigger } from "./MenubarTrigger";

afterEach(() => {
  cleanup();
});

describe("Menubar keyboard", () => {
  it("opens with ArrowDown and roves through enabled items", () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
            <MenubarItem disabled>Unavailable</MenubarItem>
            <MenubarItem>Quit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    const trigger = screen.getByRole("button", { name: "File" });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const menu = screen.getByRole("menu");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "New" }));

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Quit" }));
  });

  it("closes on Escape and refocuses the menu trigger", async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    const trigger = screen.getByRole("button", { name: "File" });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("activates the focused item with Space", () => {
    const onSelect = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onSelect}>New</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    fireEvent.keyDown(screen.getByRole("menu"), { key: " " });
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens a submenu with ArrowRight and Escape keeps the parent menu", async () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem disabled>Blocked</MenubarItem>
                <MenubarItem>Email</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>,
    );
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    const subTrigger = screen.getByRole("menuitem", { name: "Share" });
    subTrigger.focus();
    fireEvent.keyDown(subTrigger, { key: "ArrowRight" });
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Email" })),
    );
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(subTrigger).toHaveFocus());
    expect(screen.getAllByRole("menu")).toHaveLength(1);
  });
});
