import { render, screen, waitFor } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./index";

describe("Accordion", () => {
  it("toggles aria-expanded and settles without remounting open content", async () => {
    render(
      <Accordion type="single" collapsible defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>Section one</AccordionTrigger>
          <AccordionContent>Panel one body</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two">
          <AccordionTrigger>Section two</AccordionTrigger>
          <AccordionContent>Panel two body</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const first = screen.getByRole("button", { name: "Section one" });
    const second = screen.getByRole("button", { name: "Section two" });
    const firstContent = screen
      .getByText("Panel one body")
      .closest('[data-slot="accordion-content"]');

    expect(first.getAttribute("aria-expanded")).toBe("true");
    expect(second.getAttribute("aria-expanded")).toBe("false");
    expect(firstContent).not.toBeNull();

    first.click();
    await waitFor(() => expect(first.getAttribute("aria-expanded")).toBe("false"));
    expect(screen.queryByText("Panel one body")).toBeNull();

    first.click();
    await waitFor(() => expect(first.getAttribute("aria-expanded")).toBe("true"));
    const reopened = screen
      .getByText("Panel one body")
      .closest('[data-slot="accordion-content"]') as HTMLElement;

    await waitFor(() => {
      expect(reopened.style.height === "auto" || reopened.style.height === "").toBe(true);
      expect(reopened.style.maxHeight === "none" || reopened.style.maxHeight === "").toBe(true);
    });

    second.click();
    await waitFor(() => {
      expect(second.getAttribute("aria-expanded")).toBe("true");
      expect(first.getAttribute("aria-expanded")).toBe("false");
    });
  });

  it("rapidly toggling the same panel settles open without runaway inline height updates", async () => {
    render(
      <Accordion type="single" collapsible defaultValue="only">
        <AccordionItem value="only">
          <AccordionTrigger>Toggle me</AccordionTrigger>
          <AccordionContent>Tall panel content for height animation</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle me" });

    trigger.click();
    trigger.click();

    await waitFor(() => expect(trigger.getAttribute("aria-expanded")).toBe("true"));

    const content = screen
      .getByText("Tall panel content for height animation")
      .closest('[data-slot="accordion-content"]') as HTMLElement;

    await waitFor(() => {
      expect(content.style.height === "auto" || content.style.height === "").toBe(true);
    });

    const heightAfterSettle = content.style.height;
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(content.style.height).toBe(heightAfterSettle);
  });
});
