import { Sheet, SheetDescription, SheetTitle, SheetTrigger } from "@kamod-ch/ui/sheet";
import { fireEvent, render, screen } from "@testing-library/preact";
import { MotionSheetContent } from "./index.js";

const sides = ["top", "right", "bottom", "left"] as const;

describe("MotionSheet", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it.each(sides)("renders %s sheet with side preset and overlay", async (side) => {
    render(
      <Sheet>
        <SheetTrigger>Open {side}</SheetTrigger>
        <MotionSheetContent side={side}>
          <SheetTitle class="capitalize">{side} sheet</SheetTitle>
          <SheetDescription>Preset for {side}.</SheetDescription>
        </MotionSheetContent>
      </Sheet>,
    );

    fireEvent.click(screen.getByRole("button", { name: `Open ${side}` }));

    const dialog = await screen.findByRole("dialog", { name: `${side} sheet` });
    expect(dialog).toHaveAttribute("data-side", side);
    expect(dialog).toHaveAttribute("data-state", "open");
    expect(document.querySelector('[data-slot="sheet-overlay"]')).toBeTruthy();
  });
});
