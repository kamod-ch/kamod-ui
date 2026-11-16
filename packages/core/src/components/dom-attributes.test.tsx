import { fireEvent, render, screen } from "@testing-library/preact";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Button } from "./button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

describe("interactive data attributes", () => {
  it("marks a disabled button with data-disabled", () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-disabled", "true");
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-slot", "button");
  });

  it("uses open and active state values with orientation", () => {
    render(
      <Tabs defaultValue="account" orientation="vertical">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("data-state", "inactive");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute("data-disabled", "true");
  });

  it("uses open and closed accordion state and a shared disabled value", () => {
    render(
      <Accordion type="single" defaultValue="one">
        <AccordionItem value="one">
          <AccordionTrigger>One</AccordionTrigger>
          <AccordionContent>Panel</AccordionContent>
        </AccordionItem>
        <AccordionItem value="two" disabled>
          <AccordionTrigger>Two</AccordionTrigger>
          <AccordionContent>Hidden</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole("button", { name: "One" })).toHaveAttribute("data-state", "open");
    expect(screen.getByRole("button", { name: "Two" })).toHaveAttribute("data-state", "closed");
    expect(screen.getByRole("button", { name: "Two" })).toHaveAttribute("data-disabled", "true");
  });

  it("marks a disabled select item with data-disabled", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Framework">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vue" disabled>
            Vue
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Framework" }));
    expect(screen.getByRole("option", { name: "Vue" })).toHaveAttribute("data-disabled", "true");
    expect(screen.getByRole("listbox")).toHaveAttribute("data-state", "open");
  });
});
