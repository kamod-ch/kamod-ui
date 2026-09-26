import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { KpiCard } from "./KpiCard";
import { KpiCardTrend } from "./KpiCardTrend";

describe("KpiCard", () => {
  it("renders numeric zero without treating it as missing", () => {
    render(<KpiCard label="Active users" value={0} />);
    expect(screen.getByText("0")).toBeTruthy();
    expect(document.querySelector("[data-slot='kpi-card-value']")).not.toHaveAttribute(
      "data-empty",
    );
  });

  it("renders an em dash when value is omitted", () => {
    render(<KpiCard label="Pending jobs" />);
    const value = document.querySelector("[data-slot='kpi-card-value']");
    expect(value).toHaveAttribute("data-empty", "true");
    expect(value?.textContent).toBe("—");
  });

  it("sets aria-busy while loading", () => {
    render(
      <KpiCard
        label="Revenue"
        loading
        trend={{ direction: "up", sentiment: "positive", label: "+4%" }}
      />,
    );
    expect(document.querySelector("[data-slot='kpi-card']")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("+4%")).toBeNull();
  });

  it("keeps a sensible minimum width in flex layouts", () => {
    render(<KpiCard label="Revenue" value="€128,400" />);
    const card = document.querySelector("[data-slot='kpi-card']");
    expect(card?.className).toContain("w-full");
    expect(card?.className).toContain("min-w-[12rem]");
  });

  it("does not make the card focusable by default", () => {
    render(<KpiCard label="Errors" value="12" />);
    const card = document.querySelector("[data-slot='kpi-card']");
    expect(card?.getAttribute("tabindex")).toBeNull();
    expect(card?.getAttribute("role")).toBeNull();
  });

  it("separates trend direction from sentiment", () => {
    render(
      <KpiCard
        label="Error rate"
        value="2.4%"
        trend={{ direction: "up", sentiment: "negative", label: "+0.6 pp" }}
      />,
    );

    const trend = document.querySelector("[data-slot='kpi-card-trend']");
    expect(trend).toHaveAttribute("data-direction", "up");
    expect(trend).toHaveAttribute("data-sentiment", "negative");
    expect(screen.getByText("+0.6 pp")).toBeTruthy();
    expect(trend?.querySelector("svg")).not.toBeNull();
  });

  it("supports down direction with positive sentiment", () => {
    render(<KpiCardTrend direction="down" sentiment="positive" label="-€12k" />);

    const trend = document.querySelector("[data-slot='kpi-card-trend']");
    expect(trend).toHaveAttribute("data-direction", "down");
    expect(trend).toHaveAttribute("data-sentiment", "positive");
    expect(screen.getByText("-€12k")).toBeTruthy();
  });
});
