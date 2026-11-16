import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Collapsible, CollapsibleTrigger } from "../collapsible";
import { SidebarMenuButton } from "./SidebarMenu";
import { SidebarProvider } from "./SidebarProvider";

describe("SidebarMenuButton", () => {
  it("keeps row layout when a collapsible trigger forwards className", () => {
    render(
      <SidebarProvider>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton class="text-sidebar-foreground">Playground</SidebarMenuButton>
          </CollapsibleTrigger>
        </Collapsible>
      </SidebarProvider>,
    );
    const button = screen.getByRole("button", { name: "Playground" });
    expect(button.className).toContain("flex");
    expect(button.className).toContain("h-8");
    expect(button.className).toContain("items-center");
    expect(button.className).toContain("text-sidebar-foreground");
    expect(button).toHaveAttribute("data-sidebar", "menu-button");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
