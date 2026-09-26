import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useRef, useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../button/Button";
import { BulkActionBar } from "./BulkActionBar";
import { BulkActionBarActions } from "./BulkActionBarActions";
import { BulkActionBarClear } from "./BulkActionBarClear";
import { BulkActionBarCount } from "./BulkActionBarCount";
import { useBulkActionBar } from "./bulk-action-bar-context";

const ArchiveButton = ({ onArchive }: { onArchive?: () => void }) => {
  const { pending } = useBulkActionBar();

  return (
    <Button type="button" size="sm" variant="outline" disabled={pending} onClick={onArchive}>
      Archive
    </Button>
  );
};

const ToolbarFixture = ({
  selectedCount,
  pending = false,
  onClearSelection,
  onArchive,
}: {
  selectedCount: number;
  pending?: boolean;
  onClearSelection?: () => void;
  onArchive?: () => void;
}) => (
  <BulkActionBar
    selectedCount={selectedCount}
    pending={pending}
    onClearSelection={onClearSelection}
    aria-label="Bulk actions"
  >
    <BulkActionBarCount
      formatCount={(count) => (count === 1 ? "1 selected" : `${count} selected`)}
    />
    <BulkActionBarActions aria-label="Bulk commands">
      <ArchiveButton onArchive={onArchive} />
    </BulkActionBarActions>
    <BulkActionBarClear clearLabel="Clear selection" />
  </BulkActionBar>
);

describe("BulkActionBar", () => {
  it("hides when selectedCount is zero by default", () => {
    render(<ToolbarFixture selectedCount={0} />);
    expect(screen.queryByRole("toolbar", { name: "Bulk actions" })).toBeNull();
  });

  it("shows when selectedCount is greater than zero", () => {
    render(<ToolbarFixture selectedCount={2} />);
    expect(screen.getByRole("toolbar", { name: "Bulk actions" })).toBeTruthy();
    expect(screen.getByText("2 selected")).toBeTruthy();
  });

  it("renders singular count labels from formatCount", () => {
    render(<ToolbarFixture selectedCount={1} />);
    expect(screen.getByText("1 selected")).toBeTruthy();
  });

  it("calls onClearSelection from BulkActionBarClear", () => {
    const onClearSelection = vi.fn();
    render(<ToolbarFixture selectedCount={2} onClearSelection={onClearSelection} />);

    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it("blocks duplicate actions while pending", () => {
    const onArchive = vi.fn();
    render(<ToolbarFixture selectedCount={2} pending onArchive={onArchive} />);

    const archiveButton = screen.getByRole("button", { name: "Archive" });
    expect(archiveButton).toBeDisabled();
    expect(onArchive).not.toHaveBeenCalled();

    const clearButton = screen.getByRole("button", { name: "Clear selection" });
    expect(clearButton).toBeDisabled();
    expect(screen.getByRole("toolbar")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("group", { name: "Bulk commands" })).toHaveAttribute(
      "data-pending",
      "true",
    );
  });

  it("returns focus to a stable element after clearing selection", async () => {
    const Stateful = () => {
      const selectAllRef = useRef<HTMLButtonElement>(null);
      const [selection, setSelection] = useState<Record<string, boolean>>({ a: true });

      const selectedCount = Object.keys(selection).length;

      return (
        <div>
          <button
            ref={selectAllRef}
            type="button"
            aria-label="Select all on page"
            onClick={() => setSelection({ a: true, b: true })}
          >
            Select all
          </button>
          <BulkActionBar
            selectedCount={selectedCount}
            aria-label="Bulk actions"
            onClearSelection={() => {
              setSelection({});
              selectAllRef.current?.focus();
            }}
          >
            <BulkActionBarCount formatCount={(count) => `${count} selected`} />
            <BulkActionBarClear clearLabel="Clear selection" />
          </BulkActionBar>
        </div>
      );
    };

    render(<Stateful />);
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));

    await waitFor(() => {
      expect(screen.queryByRole("toolbar", { name: "Bulk actions" })).toBeNull();
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Select all on page" }),
      );
    });
  });

  it("keeps selection mapped to stable ids after sort order changes", () => {
    type Row = { id: string; email: string };

    const rows: Row[] = [
      { id: "m5gr84i9", email: "ken99@example.com" },
      { id: "3u1reuv4", email: "Abe45@example.com" },
      { id: "derv1ws0", email: "Monserrat44@example.com" },
    ];

    const SortableTable = () => {
      const [sortAsc, setSortAsc] = useState(true);
      const [selection] = useState<Record<string, boolean>>({ "3u1reuv4": true });

      const sorted = [...rows].sort((a, b) =>
        sortAsc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email),
      );

      const selectedCount = rows.filter((row) => selection[row.id]).length;

      return (
        <div>
          <button type="button" onClick={() => setSortAsc((value) => !value)}>
            Toggle sort
          </button>
          <table>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.id} data-selected={selection[row.id] ? "true" : "false"}>
                  <td>{row.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <BulkActionBar selectedCount={selectedCount} aria-label="Bulk actions">
            <BulkActionBarCount formatCount={(count) => `${count} selected`} />
          </BulkActionBar>
        </div>
      );
    };

    render(<SortableTable />);
    expect(screen.getByText("1 selected")).toBeTruthy();
    expect(document.querySelector('[data-selected="true"]')?.textContent).toContain(
      "Abe45@example.com",
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle sort" }));
    expect(screen.getByText("1 selected")).toBeTruthy();
    expect(document.querySelector('[data-selected="true"]')?.textContent).toContain(
      "Abe45@example.com",
    );
  });

  it("exposes pending state through useBulkActionBar", () => {
    const PendingReader = () => {
      const { pending } = useBulkActionBar();
      return <span data-testid="pending">{pending ? "yes" : "no"}</span>;
    };

    render(
      <BulkActionBar selectedCount={1} pending aria-label="Bulk actions">
        <PendingReader />
      </BulkActionBar>,
    );

    expect(screen.getByTestId("pending").textContent).toBe("yes");
  });
});
