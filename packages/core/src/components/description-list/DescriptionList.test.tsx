import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { DescriptionList } from "./DescriptionList";
import { DescriptionListDetails } from "./DescriptionListDetails";
import { DescriptionListItem } from "./DescriptionListItem";
import { DescriptionListTerm } from "./DescriptionListTerm";

describe("DescriptionList", () => {
  it("renders semantic dl, dt, and dd elements", () => {
    render(
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListTerm>Email</DescriptionListTerm>
          <DescriptionListDetails>ada@example.com</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>,
    );

    expect(document.querySelector("dl[data-slot='description-list']")).not.toBeNull();
    expect(document.querySelector("dt")).not.toBeNull();
    expect(document.querySelector("dd")).not.toBeNull();
    expect(screen.getByText("ada@example.com")).toBeTruthy();
  });

  it("applies layout and column data attributes", () => {
    render(
      <DescriptionList layout="inline" columns={2} bordered>
        <DescriptionListItem>
          <DescriptionListTerm>Status</DescriptionListTerm>
          <DescriptionListDetails>Active</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>,
    );

    const list = document.querySelector("[data-slot='description-list']");
    expect(list).toHaveAttribute("data-layout", "inline");
    expect(list).toHaveAttribute("data-columns", "2");
    expect(list).toHaveAttribute("data-bordered", "true");
    expect(list?.className).toContain("md:grid-cols-2");
  });

  it("wraps long values with overflow-safe classes", () => {
    render(
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListTerm>ID</DescriptionListTerm>
          <DescriptionListDetails>
            org_01j9x4k2m8n0p3q5r7s9t1v3w5y7z9a1b3c5d7e9f0
          </DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>,
    );

    const details = document.querySelector("[data-slot='description-list-details']");
    expect(details?.className).toContain("min-w-0");
    expect(details?.className).toContain("[overflow-wrap:anywhere]");
  });

  it("does not duplicate values in visually hidden output", () => {
    render(
      <DescriptionList>
        <DescriptionListItem>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDetails>Ada Lovelace</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>,
    );

    expect(screen.getAllByText("Ada Lovelace")).toHaveLength(1);
    expect(document.querySelector(".sr-only")).toBeNull();
  });

  it("forwards native HTML attributes through rest props", () => {
    render(
      <DescriptionList id="customer-details">
        <DescriptionListItem>
          <DescriptionListTerm id="term-email">Email</DescriptionListTerm>
          <DescriptionListDetails>ada@example.com</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>,
    );

    expect(document.getElementById("customer-details")).not.toBeNull();
    expect(document.getElementById("term-email")).not.toBeNull();
  });
});
