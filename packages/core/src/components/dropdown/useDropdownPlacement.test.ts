import { resolveFloatingPlacement } from "./useDropdownPlacement";

describe("resolveFloatingPlacement", () => {
  const rect = new DOMRect(40, 20, 80, 24);

  it("keeps start alignment on the physical left in LTR", () => {
    const placement = resolveFloatingPlacement(rect, 40, 20, 400, 300, {
      side: "bottom",
      align: "start",
      sideOffset: 4,
    });

    expect(placement.left).toBe(40);
    expect(placement.top).toBe(48);
    expect(placement.side).toBe("bottom");
    expect(placement.maxWidth).toBe(384);
    expect(placement.maxHeight).toBe(284);
  });

  it("mirrors start and end alignment for vertical sides in RTL", () => {
    const rtlStart = resolveFloatingPlacement(rect, 40, 20, 400, 300, {
      side: "bottom",
      align: "start",
      sideOffset: 4,
      dir: "rtl",
    });
    const ltrEnd = resolveFloatingPlacement(rect, 40, 20, 400, 300, {
      side: "bottom",
      align: "end",
      sideOffset: 4,
    });

    expect(rtlStart.left).toBe(ltrEnd.left);
    expect(rtlStart.left).toBe(80);
  });
});
