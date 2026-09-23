import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Dropdown } from "./Dropdown";
import { DropdownContent } from "./DropdownContent";
import { DropdownItem } from "./DropdownItem";
import { DropdownTrigger } from "./DropdownTrigger";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("dropdown content placement", () => {
  it("keeps existing dropdown content inline unless portal is requested", () => {
    const { container } = render(
      <Dropdown defaultOpen>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Account</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    expect(container).toContainElement(screen.getByRole("menu"));
  });

  it("portals without losing selection, dismissal or Escape focus return", async () => {
    const selected = vi.fn();
    const { container, unmount } = render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent portal>
          <DropdownItem onClick={selected}>Account</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(menu.parentElement).toBe(document.body);
    expect(container).not.toContainElement(menu);
    const item = screen.getByRole("menuitem", { name: "Account" });
    fireEvent.pointerDown(item);
    expect(screen.getByRole("menu")).toBe(menu);
    fireEvent.click(item);
    expect(selected).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(trigger);
    screen.getByRole("menuitem", { name: "Account" }).focus();
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    await waitFor(() => expect(trigger).toHaveFocus());

    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("menu")).toBeNull();
    fireEvent.click(trigger);
    unmount();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("clamps a low sidebar menu and updates its placement on scroll and resize", async () => {
    vi.stubGlobal("innerWidth", 768);
    vi.stubGlobal("innerHeight", 375);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(224);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(180);
    render(
      <Dropdown>
        <DropdownTrigger>More</DropdownTrigger>
        <DropdownContent portal side="right" align="start">
          <DropdownItem>Archived projects</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "More" });
    let rect = new DOMRect(8, 320, 32, 32);
    vi.spyOn(trigger, "getBoundingClientRect").mockImplementation(() => rect);
    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    await waitFor(() =>
      expect(menu).toHaveStyle({ position: "fixed", left: "44px", top: "187px" }),
    );

    rect = new DOMRect(8, 100, 32, 32);
    fireEvent.scroll(window);
    await waitFor(() => expect(menu).toHaveStyle({ top: "100px" }));

    vi.stubGlobal("innerWidth", 320);
    rect = new DOMRect(280, 100, 32, 32);
    fireEvent.resize(window);
    await waitFor(() => expect(menu).toHaveAttribute("data-side", "left"));
    expect(menu).toHaveStyle({ left: "52px", top: "100px" });
  });

  it("flips a bottom menu above its trigger when there is more room", async () => {
    vi.stubGlobal("innerWidth", 320);
    vi.stubGlobal("innerHeight", 375);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(224);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(180);
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent portal side="bottom" align="end">
          <DropdownItem>Account</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(new DOMRect(260, 320, 32, 32));
    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    await waitFor(() => expect(menu).toHaveAttribute("data-side", "top"));
    expect(menu).toHaveStyle({ left: "68px", top: "136px" });
  });

  it("repositions growing content and stops observing when closed", async () => {
    vi.stubGlobal("innerWidth", 768);
    vi.stubGlobal("innerHeight", 375);
    let height = 100;
    let notifyResize = () => {};
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          notifyResize = callback;
        }
        observe = observe;
        disconnect = disconnect;
      },
    );
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(() => height);
    render(
      <Dropdown>
        <DropdownTrigger>Actions</DropdownTrigger>
        <DropdownContent portal side="right">
          <DropdownItem>Account</DropdownItem>
        </DropdownContent>
      </Dropdown>,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(new DOMRect(8, 300, 32, 32));
    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    await waitFor(() => expect(menu).toHaveStyle({ left: "44px", top: "267px" }));
    expect(observe).toHaveBeenCalledWith(trigger);
    expect(observe).toHaveBeenCalledWith(menu);

    height = 200;
    act(() => notifyResize());
    await waitFor(() => expect(menu).toHaveStyle({ top: "167px" }));

    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).toBeNull();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
