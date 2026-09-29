import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import type { KeyboardShortcutDefinition } from "./shortcuts-help-types";
import { useKeyboardShortcuts } from "./use-keyboard-shortcuts";

const SHORTCUTS: KeyboardShortcutDefinition[] = [
  { id: "palette", label: "Open command palette", category: "General", keys: ["mod", "k"] },
  {
    id: "save",
    label: "Save document",
    category: "Editing",
    keys: ["mod", "s"],
    description: "Persists the current draft",
  },
  { id: "help", label: "Show shortcuts", category: "General", keys: ["shift", "/"] },
];

const LABELS = {
  title: "Keyboard shortcuts",
  description: "Available shortcuts for this demo.",
  searchPlaceholder: "Search shortcuts",
  emptySearch: "No matches",
  empty: "No shortcuts configured",
};

const ControlledHelp = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open help
      </button>
      <KeyboardShortcutsHelp
        open={open}
        onOpenChange={setOpen}
        shortcuts={SHORTCUTS}
        labels={LABELS}
        platform="windows"
      />
    </>
  );
};

describe("KeyboardShortcutsHelp", () => {
  it("groups shortcuts under category headings", () => {
    render(
      <KeyboardShortcutsHelp
        defaultOpen
        shortcuts={SHORTCUTS}
        labels={LABELS}
        platform="windows"
      />,
    );

    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Editing")).toBeInTheDocument();
    expect(screen.getByText("Open command palette")).toBeInTheDocument();
    expect(screen.getByText("Save document")).toBeInTheDocument();
  });

  it("filters shortcuts via search input", () => {
    render(
      <KeyboardShortcutsHelp
        defaultOpen
        shortcuts={SHORTCUTS}
        labels={LABELS}
        platform="windows"
      />,
    );

    fireEvent.input(screen.getByRole("textbox", { name: "Search shortcuts" }), {
      target: { value: "save" },
    });

    expect(screen.getByText("Save document")).toBeInTheDocument();
    expect(screen.queryByText("Open command palette")).not.toBeInTheDocument();
    expect(screen.queryByText("No matches")).not.toBeInTheDocument();

    fireEvent.input(screen.getByRole("textbox", { name: "Search shortcuts" }), {
      target: { value: "zzzz" },
    });
    expect(screen.getByText("No matches")).toBeInTheDocument();
  });

  it("renders platform-specific modifier keys", () => {
    const { rerender } = render(
      <KeyboardShortcutsHelp
        defaultOpen
        shortcuts={[SHORTCUTS[0]!]}
        labels={LABELS}
        platform="mac"
      />,
    );
    expect(screen.getByText("⌘")).toBeInTheDocument();

    rerender(
      <KeyboardShortcutsHelp
        defaultOpen
        shortcuts={[SHORTCUTS[0]!]}
        labels={LABELS}
        platform="windows"
      />,
    );
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
  });

  it("shows an empty state when no shortcuts are provided", () => {
    render(<KeyboardShortcutsHelp defaultOpen shortcuts={[]} labels={LABELS} platform="windows" />);
    expect(screen.getByText("No shortcuts configured")).toBeInTheDocument();
  });

  it("focuses the dialog panel and dismisses on Escape", async () => {
    render(<ControlledHelp />);

    fireEvent.click(screen.getByRole("button", { name: "Open help" }));
    const dialog = await screen.findByRole("dialog", { name: "Keyboard shortcuts" });
    await waitFor(() => expect(dialog).toHaveFocus());

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("useKeyboardShortcuts integration", () => {
  const ShortcutHarness = ({
    onTrigger,
    withEditable = false,
  }: {
    onTrigger: () => void;
    withEditable?: boolean;
  }) => {
    useKeyboardShortcuts({
      platform: "windows",
      shortcuts: [{ id: "demo", keys: ["mod", "k"], onTrigger }],
    });

    return (
      <div>
        <input aria-label="Notes" />
        {withEditable ? (
          <div contentEditable="true" data-testid="editable-host">
            <span>Nested</span>
          </div>
        ) : null}
      </div>
    );
  };

  it("invokes handlers for global shortcuts outside editable fields", () => {
    const onTrigger = vi.fn();
    render(<ShortcutHarness onTrigger={onTrigger} />);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it("skips handlers when focus is inside inputs or nested editables", () => {
    const onTrigger = vi.fn();
    render(<ShortcutHarness onTrigger={onTrigger} withEditable />);

    const input = screen.getByRole("textbox", { name: "Notes" });
    input.focus();
    fireEvent.keyDown(input, { key: "k", ctrlKey: true });
    expect(onTrigger).not.toHaveBeenCalled();

    const editableHost = screen.getByTestId("editable-host");
    editableHost.focus();
    fireEvent.keyDown(editableHost, { key: "k", ctrlKey: true });
    expect(onTrigger).not.toHaveBeenCalled();
  });

  it("ignores repeated keydown events", () => {
    const onTrigger = vi.fn();
    render(<ShortcutHarness onTrigger={onTrigger} />);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true, repeat: true });
    expect(onTrigger).not.toHaveBeenCalled();
  });
});
