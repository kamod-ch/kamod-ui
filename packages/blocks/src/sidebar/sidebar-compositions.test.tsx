import { Sidebar, SidebarProvider } from "@kamod-ch/ui";
import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import { sidebarBlocks } from "./registry";
import { NavDocs } from "./shared/nav-docs";
import { NavMain } from "./shared/nav-main";
import { NavMainDropdowns } from "./shared/nav-main-dropdowns";
import { TeamSwitcher } from "./shared/team-switcher";

const originalMatchMedia = window.matchMedia;
afterEach(() => {
  cleanup();
  window.matchMedia = originalMatchMedia;
});

function desktop() {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => true,
  });
}

describe("explicit sidebar compositions", () => {
  for (const block of sidebarBlocks) {
    it(`${block.id} renders independently`, () => {
      desktop();
      const Component = block.component;
      render(<Component />);
      if (block.id === "sidebar-13")
        expect(screen.getByRole("button", { name: "Open settings" })).toBeTruthy();
      else expect(screen.getAllByRole("main")).toHaveLength(1);
    });
  }

  it("keeps disclosure state in the core component and accepts custom navigation", () => {
    desktop();
    render(
      <SidebarProvider>
        <Sidebar>
          <NavMain
            items={[
              {
                title: "Projects",
                url: "/projects",
                icon: "frame",
                items: [{ title: "Recent", url: "/recent" }],
              },
            ]}
          />
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Projects" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("link", { name: "Recent" }).getAttribute("href")).toBe("/recent");
  });

  it("renders expanded submenu links without disclosure controls", () => {
    desktop();
    render(
      <SidebarProvider>
        <Sidebar>
          <NavMain
            collapsible={false}
            items={[
              {
                title: "Projects",
                url: "/projects",
                icon: "frame",
                items: [{ title: "Recent", url: "/recent" }],
              },
            ]}
          />
        </Sidebar>
      </SidebarProvider>,
    );
    expect(screen.getByRole("link", { name: "Projects" }).getAttribute("href")).toBe("/projects");
    expect(screen.getByRole("link", { name: "Recent" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Projects" })).toBeNull();
  });

  it("renders a dropdown-mode leaf as a link instead of an empty menu", () => {
    desktop();
    render(
      <SidebarProvider>
        <Sidebar>
          <NavMainDropdowns
            items={[
              {
                title: "Projects",
                url: "/projects",
                icon: "frame",
              },
            ]}
          />
        </Sidebar>
      </SidebarProvider>,
    );
    expect(screen.getByRole("link", { name: "Projects" }).getAttribute("href")).toBe("/projects");
    expect(screen.queryByRole("button", { name: "Projects" })).toBeNull();
  });

  it("prevents placeholder navigation but leaves real documentation URLs usable", () => {
    desktop();
    render(
      <SidebarProvider>
        <Sidebar>
          <NavDocs
            groups={[
              {
                title: "Documentation",
                items: [
                  { title: "Demo", url: "#" },
                  { title: "Actual page", url: "/actual", isActive: true },
                ],
              },
            ]}
          />
        </Sidebar>
      </SidebarProvider>,
    );
    expect(fireEvent.click(screen.getByRole("link", { name: "Demo" }))).toBe(false);
    const destination = screen.getByRole("link", { name: "Actual page" });
    let preventedByComponent = true;
    destination.addEventListener(
      "click",
      (event) => {
        preventedByComponent = event.defaultPrevented;
        // Inspect the component's decision, then stop JSDOM's unsupported page navigation.
        event.preventDefault();
      },
      { once: true },
    );
    fireEvent.click(destination);
    expect(preventedByComponent).toBe(false);
    expect(screen.getByRole("link", { name: "Actual page" }).getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("connects dropdown destinations to real anchor links", () => {
    desktop();
    render(
      <SidebarProvider>
        <Sidebar>
          <NavMainDropdowns
            items={[
              {
                title: "Projects",
                url: "/projects",
                icon: "frame",
                items: [{ title: "Recent", url: "/recent" }],
              },
            ]}
          />
        </Sidebar>
      </SidebarProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(screen.getByRole("menuitem", { name: "Recent" }).getAttribute("href")).toBe("/recent");
  });

  it("updates the selected workspace and handles replaced or empty team data", () => {
    desktop();
    const teams = [
      { name: "Alpha", logo: "A", plan: "Team" },
      { name: "Beta", logo: "B", plan: "Pro" },
    ];
    const view = (value: typeof teams) => (
      <SidebarProvider>
        <Sidebar>
          <TeamSwitcher teams={value} />
        </Sidebar>
      </SidebarProvider>
    );
    const { rerender } = render(view(teams));
    fireEvent.click(screen.getByRole("button", { name: /Alpha/ }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Beta/ }));
    expect(screen.getByRole("button", { name: /Beta/ })).toBeTruthy();
    rerender(view([teams[0]]));
    expect(screen.getByRole("button", { name: /Alpha/ })).toBeTruthy();
    rerender(view([]));
    expect(screen.queryByRole("button")).toBeNull();
  });
});
