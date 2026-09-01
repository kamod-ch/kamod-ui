import { Collapsible, CollapsibleTrigger } from "@kamod-ch/ui/collapsible";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { MotionCollapsibleContent } from "./index.js";

function mockReducedMotion(reduced = true) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

describe("MotionCollapsible", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    mockReducedMotion(false);
  });

  it("supports controlled open state with data-state and aria-expanded", async () => {
    render(
      <Collapsible open={true} onOpenChange={() => {}}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <MotionCollapsibleContent>Visible content</MotionCollapsibleContent>
      </Collapsible>,
    );

    const content = screen
      .getByText("Visible content")
      .closest('[data-slot="collapsible-content"]');
    expect(content).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("button", { name: "Toggle" })).toHaveAttribute("aria-expanded", "true");
  });

  it("toggles with click and updates data-state", async () => {
    render(
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <MotionCollapsibleContent>Hide me</MotionCollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
    expect(
      screen.getByText("Hide me").closest('[data-slot="collapsible-content"]'),
    ).toHaveAttribute("data-state", "open");
  });

  it("unmounts after close exit completes and nested controls are not focusable", async () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <MotionCollapsibleContent>
          <button type="button">Nested action</button>
        </MotionCollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByRole("button", { name: "Nested action" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Toggle" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Nested action" })).not.toBeInTheDocument();
    });
  });

  it("survives rapid open close open without stuck height styles", async () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Rapid</CollapsibleTrigger>
        <MotionCollapsibleContent>Rapid body</MotionCollapsibleContent>
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Rapid" });
    const outer = () =>
      screen.queryByText("Rapid body")?.closest('[data-slot="collapsible-content"]') as
        | HTMLElement
        | undefined;

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Rapid body")).toBeInTheDocument();
    });

    await waitFor(() => {
      const node = outer();
      expect(node).toBeTruthy();
      const style = node?.getAttribute("style") ?? "";
      expect(style).not.toMatch(/height:\s*0/i);
    });
  });

  it("honors prefers-reduced-motion without throwing", () => {
    mockReducedMotion(true);

    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <MotionCollapsibleContent>Reduced motion body</MotionCollapsibleContent>
      </Collapsible>,
    );

    expect(screen.getByText("Reduced motion body")).toBeInTheDocument();
  });
});
