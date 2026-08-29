import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { previewAssignees, previewColumns } from "./fixtures";
import { KanbanBoard } from "./kanban-board";
import { findTask } from "./kanban-machine";

afterEach(() => cleanup());

describe("KanbanBoard", () => {
  it("moves a lifted card with the keyboard and announces the column", () => {
    const onColumnsChange = vi.fn();
    render(
      <KanbanBoard
        columns={previewColumns}
        onColumnsChange={onColumnsChange}
        assignees={previewAssignees}
      />,
    );
    const card = screen.getByText("Review calendar range").closest("[data-task-id]") as HTMLElement;
    card.focus();
    fireEvent.keyDown(card, { key: " " });
    fireEvent.keyDown(card, { key: "ArrowRight" });
    expect(onColumnsChange).toHaveBeenCalled();
    const next = onColumnsChange.mock.calls.at(-1)?.[0];
    expect(findTask(next, "task-calendar")?.column.id).toBe("doing");
    expect(screen.getByText(/Moved Review calendar range to In progress/)).toBeTruthy();
  });

  it("filters by search and toggles list view", () => {
    render(<KanbanBoard columns={previewColumns} assignees={previewAssignees} />);
    fireEvent.input(screen.getByLabelText("Search"), { target: { value: "docs" } });
    expect(screen.getByText("Write board docs")).toBeTruthy();
    expect(screen.queryByText("Keyboard move cards")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "List view" }));
    expect(screen.getByRole("button", { name: "List view" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("opens the add-task dialog and emits a new task", () => {
    const onColumnsChange = vi.fn();
    render(
      <KanbanBoard
        columns={previewColumns}
        onColumnsChange={onColumnsChange}
        assignees={previewAssignees}
        createTaskId={() => "task-created"}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Add task/ }));
    fireEvent.input(screen.getByLabelText("Title"), { target: { value: "New card" } });
    fireEvent.click(screen.getByRole("button", { name: "Create task" }));
    expect(onColumnsChange).toHaveBeenCalled();
    expect(findTask(onColumnsChange.mock.calls[0]?.[0], "task-created")?.task.title).toBe(
      "New card",
    );
  });

  it("hides mutations when read-only and shows error copy", () => {
    render(<KanbanBoard columns={previewColumns} readOnly status="error" errorMessage="Offline" />);
    expect(screen.queryByRole("button", { name: /Add task/ })).toBeNull();
    expect(screen.getByText("Offline")).toBeTruthy();
  });
});
