import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { Popover, PopoverContent, PopoverTrigger } from "./index";

describe("PopoverContent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("flips above the trigger when the bottom edge has less room", async () => {
    vi.stubGlobal("innerWidth", 320);
    vi.stubGlobal("innerHeight", 375);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(224);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(180);

    render(
      <Popover defaultOpen>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverContent side="bottom" align="end">
          Account
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Details" });
    vi.spyOn(trigger, "getBoundingClientRect").mockReturnValue(new DOMRect(260, 320, 32, 32));
    fireEvent.resize(window);

    const content = screen.getByRole("dialog");
    await waitFor(() => expect(content).toHaveAttribute("data-side", "top"));
    expect(content).toHaveStyle({ position: "fixed", left: "68px", top: "136px" });
  });
});
