import { Accordion, AccordionItem, AccordionTrigger } from "@kamod-ch/ui/accordion";
import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { MotionAccordionContent } from "./index.js";

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

describe("MotionAccordion", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    mockReducedMotion(false);
  });

  it("toggles open state with data-state and aria-expanded on trigger", async () => {
    render(
      <Accordion type="single" collapsible defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Section one</AccordionTrigger>
          <MotionAccordionContent>Panel one</MotionAccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Section two</AccordionTrigger>
          <MotionAccordionContent>Panel two</MotionAccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const triggerOne = screen.getByRole("button", { name: "Section one" });
    const triggerTwo = screen.getByRole("button", { name: "Section two" });
    const content = screen.getByText("Panel one").closest('[data-slot="accordion-content"]');

    expect(content).toHaveAttribute("data-state", "open");
    expect(triggerOne).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(triggerOne);
    await waitFor(() => {
      expect(content).toHaveAttribute("data-state", "closed");
    });
    expect(triggerOne).toHaveAttribute("aria-expanded", "false");

    triggerTwo.focus();
    fireEvent.click(triggerTwo);
    await waitFor(() => {
      expect(
        screen.getByText("Panel two").closest('[data-slot="accordion-content"]'),
      ).toHaveAttribute("data-state", "open");
    });
    expect(triggerTwo).toHaveAttribute("aria-expanded", "true");
  });

  it("removes content from the tab order after exit completes", async () => {
    render(
      <Accordion type="single" collapsible defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <MotionAccordionContent>
            <button type="button">Inside panel</button>
          </MotionAccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "Inside panel" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Trigger" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Inside panel" })).not.toBeInTheDocument();
    });
  });

  it("clears inline height after open close open without stale styles", async () => {
    render(
      <Accordion type="single" collapsible defaultValue="x">
        <AccordionItem value="x">
          <AccordionTrigger>Toggle</AccordionTrigger>
          <MotionAccordionContent>Body</MotionAccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const outer = () =>
      screen.getByText("Body").closest('[data-slot="accordion-content"]') as HTMLElement;
    const trigger = screen.getByRole("button", { name: "Toggle" });

    await waitFor(() => {
      expect(outer()?.style.height === "" || outer()?.style.height === "auto").toBe(true);
    });

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.queryByText("Body")).not.toBeInTheDocument();
    });

    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Body")).toBeInTheDocument();
    });

    await waitFor(() => {
      const style = outer()?.getAttribute("style") ?? "";
      expect(style).not.toMatch(/height:\s*0/i);
    });
  });

  it("honors prefers-reduced-motion without throwing", () => {
    mockReducedMotion(true);

    render(
      <Accordion type="single" defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <MotionAccordionContent>Reduced motion body</MotionAccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByText("Reduced motion body")).toBeInTheDocument();
  });
});
