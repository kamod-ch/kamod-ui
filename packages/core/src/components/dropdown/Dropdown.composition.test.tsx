import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import type { ButtonHTMLAttributes } from "preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dropdown } from "./Dropdown";
import { DropdownContent } from "./DropdownContent";
import { DropdownItem } from "./DropdownItem";
import { DropdownTrigger } from "./DropdownTrigger";

afterEach(() => {
  cleanup();
});

describe("Dropdown trigger composition", () => {
  it("calls trigger onClick once per click and toggles the menu", () => {
    const onClick = vi.fn();
    render(
      <Dropdown>
        <DropdownTrigger onClick={onClick}>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Item</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("menu")).toBeVisible();

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("calls asChild and trigger onClick once per click", () => {
    const childClick = vi.fn();
    const triggerClick = vi.fn();
    const Trigger = (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />;

    render(
      <Dropdown>
        <DropdownTrigger asChild onClick={triggerClick}>
          <Trigger onClick={childClick}>Actions</Trigger>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Item</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(trigger);
    expect(childClick).toHaveBeenCalledOnce();
    expect(triggerClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("menu")).toBeVisible();

    fireEvent.click(trigger);
    expect(childClick).toHaveBeenCalledTimes(2);
    expect(triggerClick).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("activates an item without calling the trigger onClick", () => {
    const onTriggerClick = vi.fn();
    const onItemClick = vi.fn();
    render(
      <Dropdown defaultOpen>
        <DropdownTrigger onClick={onTriggerClick}>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem onClick={onItemClick}>Run</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Run" }));
    expect(onItemClick).toHaveBeenCalledOnce();
    expect(onTriggerClick).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
