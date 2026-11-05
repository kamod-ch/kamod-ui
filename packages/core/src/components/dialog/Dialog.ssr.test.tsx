import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownContent } from "../dropdown/DropdownContent";
import { DropdownItem } from "../dropdown/DropdownItem";
import { DropdownTrigger } from "../dropdown/DropdownTrigger";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./index";

function DialogFixture() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Manage preferences.</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function TwoDropdownFixture() {
  return (
    <>
      <Dropdown defaultOpen>
        <DropdownTrigger>First</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>One</DropdownItem>
        </DropdownContent>
      </Dropdown>
      <Dropdown defaultOpen>
        <DropdownTrigger>Second</DropdownTrigger>
        <DropdownContent>
          <DropdownItem>Two</DropdownItem>
        </DropdownContent>
      </Dropdown>
    </>
  );
}

const parseHtml = (html: string) => new DOMParser().parseFromString(html, "text/html");

describe("SSR-stable component IDs", () => {
  it("renders the same dialog markup on repeated server renders", () => {
    const first = renderToString(<DialogFixture />);
    const second = renderToString(<DialogFixture />);
    expect(first).toBe(second);

    const doc = parseHtml(first);
    const title = doc.querySelector('[data-slot="dialog-title"]');
    const dialog = doc.querySelector('[role="dialog"]');
    expect(title?.id).toBeTruthy();
    expect(dialog?.getAttribute("aria-labelledby")).toBe(title?.id);
    expect(dialog?.getAttribute("aria-describedby")).toBe(
      doc.querySelector('[data-slot="dialog-description"]')?.id,
    );
  });

  it("renders the same dropdown trigger and content ids on repeated server renders", () => {
    const first = renderToString(<TwoDropdownFixture />);
    const second = renderToString(<TwoDropdownFixture />);
    expect(first).toBe(second);

    const doc = parseHtml(first);
    const triggers = [...doc.querySelectorAll('[data-slot="dropdown-trigger"]')];
    const menus = [...doc.querySelectorAll('[role="menu"]')];
    expect(triggers).toHaveLength(2);
    expect(menus).toHaveLength(2);
    expect(new Set(triggers.map((node) => node.id)).size).toBe(2);
    triggers.forEach((trigger, index) => {
      expect(trigger.getAttribute("aria-controls")).toBe(menus[index]?.id);
    });
  });
});
