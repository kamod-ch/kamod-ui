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

  it.each(["default", "line"] as const)(
    "keeps vertical %s tabs keyboard accessible and skips disabled triggers",
    (variant) => {
      render(
        <Tabs defaultValue="one" orientation="vertical">
          <TabsList variant={variant}>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two" disabled>
              Two
            </TabsTrigger>
            <TabsTrigger value="three">Three</TabsTrigger>
          </TabsList>
          <TabsContent value="one">Panel one</TabsContent>
          <TabsContent value="three">Panel three</TabsContent>
        </Tabs>,
      );

      const one = screen.getByRole("tab", { name: "One" });
      const three = screen.getByRole("tab", { name: "Three" });
      expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
      one.focus();
      fireEvent.keyDown(one, { key: "ArrowDown" });
      expect(three).toHaveFocus();
      expect(three).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel", { name: "Three" })).toBeVisible();
      fireEvent.keyDown(three, { key: "ArrowUp" });
      expect(one).toHaveFocus();
      expect(one).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel", { name: "One" })).toBeVisible();
    },
  );
});
