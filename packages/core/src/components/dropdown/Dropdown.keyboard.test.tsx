import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dropdown } from "./Dropdown";
import { DropdownContent } from "./DropdownContent";
import { DropdownItem } from "./DropdownItem";
import { DropdownTrigger } from "./DropdownTrigger";

afterEach(() => {
  cleanup();
});

describe("Dropdown keyboard and trigger click", () => {
  it("moves focus with arrow keys and skips disabled items", () => {
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>First</DropdownItem>
          <DropdownItem disabled>Hidden</DropdownItem>
          <DropdownItem>Last</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const menu = screen.getByRole("menu");
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "First" }));

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Last" }));

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "First" }));

    fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Last" }));

    fireEvent.keyDown(menu, { key: "Home" });
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "First" }));
  });

  it("activates the focused item with Enter and closes the menu", () => {
    const selected = vi.fn();
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onClick={selected}>Run</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Enter" });
    expect(selected).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("returns focus to the trigger on Escape", async () => {
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Item</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("invokes the consumer trigger onClick once when the capture fallback toggles", () => {
    const onClick = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger onClick={onClick}>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Item</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("menu")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
