import { fireEvent, render, screen } from "@testing-library/preact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index";

describe("Tabs", () => {
  it("links triggers and panels with aria-controls and aria-labelledby", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one</TabsContent>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>,
    );

    const one = screen.getByRole("tab", { name: "One" });
    const two = screen.getByRole("tab", { name: "Two" });

    expect(one).toHaveAttribute("aria-controls");
    expect(two).toHaveAttribute("aria-controls");

    const panelOne = screen.getByRole("tabpanel", { name: "One" });
    expect(panelOne).toHaveAttribute("aria-labelledby", one.id);
    expect(one.getAttribute("aria-controls")).toBe(panelOne.id);
  });

  it("activates tabs with arrow keys", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">Panel one</TabsContent>
        <TabsContent value="two">Panel two</TabsContent>
      </Tabs>,
    );

    const one = screen.getByRole("tab", { name: "One" });
    const two = screen.getByRole("tab", { name: "Two" });

    one.focus();
    fireEvent.keyDown(one, { key: "ArrowRight" });

    expect(two).toHaveFocus();
    expect(two).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel", { name: "Two" })).toBeVisible();
  });
});
