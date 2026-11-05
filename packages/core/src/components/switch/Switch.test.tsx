import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("exposes the label text as the switch accessible name", () => {
    render(<Switch>Enable notifications</Switch>);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toBeInTheDocument();
  });

  it("toggles when the label text is clicked", () => {
    render(<Switch>Enable notifications</Switch>);
    const control = screen.getByRole("switch", { name: "Enable notifications" });
    expect(control).toHaveAttribute("aria-checked", "false");
    fireEvent.click(screen.getByText("Enable notifications"));
    expect(control).toHaveAttribute("aria-checked", "true");
  });
});
