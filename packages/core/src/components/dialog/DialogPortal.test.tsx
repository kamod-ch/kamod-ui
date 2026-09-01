import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { Dialog, DialogPortal, DialogTrigger, useDialog } from "./index";

function PortalProbe() {
  const dialog = useDialog();
  return (
    <DialogPortal forceMount>
      <div data-testid="portal-child" data-open={String(dialog.open.value)}>
        Portaled
      </div>
    </DialogPortal>
  );
}

describe("DialogPortal", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("portals children while forceMount is true after close", async () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <PortalProbe />
      </Dialog>,
    );

    expect(screen.getByTestId("portal-child")).toHaveAttribute("data-open", "true");

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.getByTestId("portal-child")).toHaveAttribute("data-open", "false");
    });
    expect(screen.getByTestId("portal-child")).toHaveTextContent("Portaled");
  });
});
