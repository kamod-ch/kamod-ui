import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";
import { PageHeaderActions } from "./PageHeaderActions";
import { PageHeaderDescription } from "./PageHeaderDescription";
import { PageHeaderFooter } from "./PageHeaderFooter";
import { PageHeaderHeading } from "./PageHeaderHeading";
import { PageHeaderTitle } from "./PageHeaderTitle";

describe("PageHeader", () => {
  it("renders a semantic header with data-slot", () => {
    render(
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Projects</PageHeaderTitle>
        </PageHeaderHeading>
      </PageHeader>,
    );

    const header = screen.getByRole("banner");
    expect(header.tagName).toBe("HEADER");
    expect(header).toHaveAttribute("data-slot", "page-header");
  });

  it("renders h1 by default and supports h2/h3 levels", () => {
    const { rerender } = render(<PageHeaderTitle>Primary</PageHeaderTitle>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("data-level", "h1");

    rerender(<PageHeaderTitle as="h2">Secondary</PageHeaderTitle>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("data-level", "h2");

    rerender(<PageHeaderTitle as="h3">Tertiary</PageHeaderTitle>);
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute("data-level", "h3");
  });

  it("merges consumer classes on title and description", () => {
    render(
      <PageHeaderHeading>
        <PageHeaderTitle class="custom-title" size="sm">
          Title
        </PageHeaderTitle>
        <PageHeaderDescription class="custom-description">Description</PageHeaderDescription>
      </PageHeaderHeading>,
    );

    const title = screen.getByRole("heading", { level: 1 });
    expect(title.className).toContain("custom-title");
    expect(title.className).toContain("text-xl");
    expect(title).toHaveAttribute("data-size", "sm");

    const description = screen.getByText("Description");
    expect(description.className).toContain("custom-description");
    expect(description.className).toContain("text-muted-foreground");
  });

  it("uses container queries on the root for responsive layout", () => {
    render(
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Title</PageHeaderTitle>
        </PageHeaderHeading>
      </PageHeader>,
    );

    expect(screen.getByRole("banner").className).toContain("@container/page-header");
  });

  it("marks actions and footer slots for layout hooks", () => {
    render(
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Title</PageHeaderTitle>
        </PageHeaderHeading>
        <PageHeaderActions>
          <button type="button">Save</button>
        </PageHeaderActions>
        <PageHeaderFooter>
          <div>Tabs slot</div>
        </PageHeaderFooter>
      </PageHeader>,
    );

    expect(document.querySelector("[data-slot='page-header-actions']")).not.toBeNull();
    expect(document.querySelector("[data-slot='page-header-footer']")).not.toBeNull();
    expect(document.querySelector("[data-slot='page-header-heading']")).not.toBeNull();
  });

  it("forwards native HTML attributes through rest props", () => {
    render(
      <PageHeader id="projects-header" data-testid="page-header">
        <PageHeaderHeading>
          <PageHeaderTitle id="projects-title">Title</PageHeaderTitle>
        </PageHeaderHeading>
      </PageHeader>,
    );

    expect(screen.getByTestId("page-header")).toHaveAttribute("id", "projects-header");
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute("id", "projects-title");
  });

  it("breaks long titles without fixed width overflow classes", () => {
    render(
      <PageHeaderHeading>
        <PageHeaderTitle>
          An extraordinarily long dashboard title that should wrap naturally on narrow screens
        </PageHeaderTitle>
      </PageHeaderHeading>,
    );

    const title = screen.getByRole("heading", { level: 1 });
    expect(title.className).toContain("min-w-0");
    expect(title.className).toContain("break-words");
    expect(title.className).toContain("text-balance");
  });
});
