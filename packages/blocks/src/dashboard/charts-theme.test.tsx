import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalyticsOverview } from "./analytics-overview";
import { ConversionFunnel } from "./conversion-funnel";
import { CostBreakdown } from "./cost-breakdown";
import { MetricsGrid } from "./metrics-grid";
import { ThemeCustomize } from "./theme-customize";

afterEach(() => cleanup());

const memoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
};

describe("dashboard chart and theme blocks", () => {
  it("filters analytics drill-down from click and keyboard", () => {
    const onSelectedRouteChange = vi.fn();
    const routes = [
      {
        id: "r1",
        label: "NODE A → NODE B",
        volumes: { ALPHA: 90, BETA: 25 },
        overlay: 12,
      },
      {
        id: "r2",
        label: "NODE C → NODE D",
        volumes: { ALPHA: 4, BETA: 100 },
        overlay: 14,
      },
    ];
    const drillSeries = [
      { id: "ALPHA", label: "ALPHA", values: [22, 25, 20] },
      { id: "GAMMA", label: "GAMMA", values: [19, 17, 18] },
    ];
    const { rerender } = render(
      <AnalyticsOverview
        selectedRouteId={null}
        onSelectedRouteChange={onSelectedRouteChange}
        partners={["ALPHA", "BETA"]}
        routes={routes}
        drillSeries={drillSeries}
      />,
    );

    expect(screen.getByRole("heading", { name: "Drill-down · all routes" })).toBeTruthy();
    expect(screen.getByRole("table", { name: "Drill-down series" }).textContent).toContain("GAMMA");

    fireEvent.click(screen.getByRole("button", { name: /NODE A/ }));
    expect(onSelectedRouteChange).toHaveBeenCalledWith("r1");

    rerender(
      <AnalyticsOverview
        selectedRouteId="r1"
        onSelectedRouteChange={onSelectedRouteChange}
        partners={["ALPHA", "BETA"]}
        routes={routes}
        drillSeries={drillSeries}
      />,
    );
    expect(screen.getByRole("heading", { name: "Drill-down · NODE A → NODE B" })).toBeTruthy();
    expect(screen.getByRole("table", { name: "Drill-down series" }).textContent).toContain("ALPHA");
    expect(screen.getByRole("table", { name: "Drill-down series" }).textContent).not.toContain(
      "GAMMA",
    );

    const second = screen.getByRole("button", { name: /NODE C/ });
    second.focus();
    fireEvent.keyDown(second, { key: "Enter" });
    expect(onSelectedRouteChange).toHaveBeenCalledWith("r2");

    fireEvent.keyDown(second, { key: "Escape" });
    expect(onSelectedRouteChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole("table", { name: "Route volume by partner" })).toBeTruthy();
  });

  it("validates funnel stage counts and keeps zero-safe ratios in the table", () => {
    const { rerender } = render(<ConversionFunnel stages={[{ id: "a", label: "A", value: 10 }]} />);
    expect(screen.getByText("Need 3–6 stages")).toBeTruthy();

    rerender(
      <ConversionFunnel
        stages={[
          { id: "a", label: "A", value: 0 },
          { id: "b", label: "B", value: 4 },
          { id: "c", label: "C", value: 2 },
        ]}
      />,
    );
    expect(screen.getByRole("table", { name: "Funnel stages" })).toBeTruthy();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("treats empty or negative cost data as an empty state", () => {
    const { rerender } = render(
      <CostBreakdown weeks={[]} series={[]} byLane={[]} byCarrier={[]} />,
    );
    expect(screen.getByText("No spend to chart")).toBeTruthy();

    rerender(
      <CostBreakdown
        weeks={[{ id: "w1", label: "W1", values: { detention: -40 } }]}
        series={[{ id: "detention", label: "Detention" }]}
        byLane={[{ id: "lane", label: "Lane", value: -1 }]}
        byCarrier={[{ id: "carrier", label: "Carrier", value: Number.NaN }]}
      />,
    );
    expect(screen.getByText("No spend to chart")).toBeTruthy();
  });

  it("keeps metrics-grid cards in a single column from 320px", () => {
    const { container } = render(<MetricsGrid />);
    const grid = container.querySelector(".min-\\[320px\\]\\:grid-cols-1");
    expect(grid).toBeTruthy();
    expect(
      container.querySelectorAll("[data-slot='block-metrics-grid'] .min-w-0").length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("Uptime")).toBeTruthy();
  });

  it("persists theme scheme and radius only when persist is on", () => {
    const storage = memoryStorage();
    const host = document.createElement("div");
    document.body.append(host);

    const { rerender, unmount } = render(
      <ThemeCustomize
        persist
        storage={storage}
        target={host}
        scheme="light"
        radius={0.5}
        defaultPreset="kamod"
      />,
    );

    expect(host.style.getPropertyValue("--radius")).toBe("0.5rem");
    expect(storage.getItem("theme-radius")).toBe("0.5");
    expect(storage.getItem("theme")).toBe("light");

    rerender(
      <ThemeCustomize
        persist
        storage={storage}
        target={host}
        scheme="dark"
        radius={1}
        defaultPreset="ocean"
        preset="ocean"
      />,
    );
    expect(host.classList.contains("dark")).toBe(true);
    expect(host.getAttribute("data-theme")).toBe("ocean");
    expect(storage.getItem("theme")).toBe("dark");
    expect(storage.getItem("theme-preset")).toBe("ocean");
    expect(storage.getItem("theme-radius")).toBe("1");

    unmount();
    host.remove();
  });

  it("does not copy CSS on mount and only copies after a user click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<ThemeCustomize persist={false} />);
    expect(writeText).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Customize theme" }));
    fireEvent.click(await screen.findByRole("button", { name: "Copy CSS" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText.mock.calls[0]?.[0]).toContain("--radius:");
  });

  it("imports chart and theme modules without touching window at load time", async () => {
    const charts = await import("./analytics-overview");
    const funnel = await import("./conversion-funnel");
    const cost = await import("./cost-breakdown");
    const metrics = await import("./metrics-grid");
    const theme = await import("./theme-customize");
    expect(typeof charts.AnalyticsOverview).toBe("function");
    expect(typeof funnel.ConversionFunnel).toBe("function");
    expect(typeof cost.CostBreakdown).toBe("function");
    expect(typeof metrics.MetricsGrid).toBe("function");
    expect(typeof theme.ThemeCustomize).toBe("function");
  });
});
