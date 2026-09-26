import { fireEvent, render, screen, within } from "@testing-library/preact";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./index";

function SyncedTabs({ syncKey }: { syncKey: string }) {
  return (
    <Tabs defaultValue="one" syncKey={syncKey}>
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel one</TabsContent>
      <TabsContent value="two">Panel two</TabsContent>
    </Tabs>
  );
}

function tabsIn({ container }: { container: Element }) {
  return within(container.querySelector<HTMLElement>('[data-slot="tabs"]')!);
}

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

  it("keeps remaining subscribers working and releases shared state after the last unmount", () => {
    const first = render(<SyncedTabs syncKey="unmount-test" />);
    const second = render(<SyncedTabs syncKey="unmount-test" />);
    const firstTabs = tabsIn(first);
    const secondTabs = tabsIn(second);
    fireEvent.click(firstTabs.getByRole("tab", { name: "Two" }));
    expect(secondTabs.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");

    first.unmount();
    for (const name of ["One", "Two"]) {
      fireEvent.click(secondTabs.getByRole("tab", { name }));
      expect(secondTabs.getByRole("tabpanel", { name })).toBeVisible();
    }
    second.unmount();

    const fresh = render(<SyncedTabs syncKey="unmount-test" />);
    expect(tabsIn(fresh).getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("unsubscribes from the previous sync key when it changes", () => {
    const view = render(<SyncedTabs syncKey="previous-key" />);
    fireEvent.click(tabsIn(view).getByRole("tab", { name: "Two" }));
    view.rerender(<SyncedTabs syncKey="next-key" />);
    expect(tabsIn(view).getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");

    const previous = render(<SyncedTabs syncKey="previous-key" />);
    expect(tabsIn(previous).getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    fireEvent.click(tabsIn(previous).getByRole("tab", { name: "Two" }));
    expect(tabsIn(view).getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });
});
