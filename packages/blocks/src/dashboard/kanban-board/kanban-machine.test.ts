import { describe, expect, it } from "vitest";
import { previewColumns } from "./fixtures";
import {
  addTask,
  filterColumns,
  findTask,
  kanbanReducer,
  moveTask,
  reorderColumns,
  updateTask,
} from "./kanban-machine";

describe("kanban-machine", () => {
  it("moves a task across columns and clamps the index", () => {
    const next = moveTask(previewColumns, "task-calendar", "doing", 99);
    expect(findTask(next, "task-calendar")?.column.id).toBe("doing");
    expect(findTask(next, "task-calendar")?.taskIndex).toBe(1);
    expect(findTask(previewColumns, "task-calendar")?.column.id).toBe("todo");
  });

  it("reorders within a column without duplicating", () => {
    const next = moveTask(previewColumns, "task-docs", "todo", 0);
    expect(next[0]?.tasks.map((task) => task.id)).toEqual(["task-docs", "task-calendar"]);
  });

  it("reorders columns, adds, updates, and ignores missing ids", () => {
    expect(reorderColumns(previewColumns, 0, 2).map((column) => column.id)).toEqual([
      "doing",
      "done",
      "todo",
    ]);
    expect(reorderColumns(previewColumns, 8, 0)).toBe(previewColumns);
    expect(moveTask(previewColumns, "missing", "todo", 0)).toBe(previewColumns);

    const added = addTask(previewColumns, "done", { id: "task-new", title: "New" });
    expect(findTask(added, "task-new")?.column.id).toBe("done");

    const updated = updateTask(previewColumns, "task-dnd", { title: "Moved by keyboard" });
    expect(findTask(updated, "task-dnd")?.task.title).toBe("Moved by keyboard");

    const reduced = kanbanReducer(previewColumns, { type: "remove-task", taskId: "task-docs" });
    expect(findTask(reduced, "task-docs")).toBeNull();
  });

  it("filters by query, priority, and assignee without dropping columns", () => {
    const filtered = filterColumns(previewColumns, {
      query: "calendar",
      priority: "medium",
      assigneeId: "ada",
    });
    expect(filtered).toHaveLength(3);
    expect(filtered[0]?.tasks.map((task) => task.id)).toEqual(["task-calendar"]);
    expect(filtered[1]?.tasks).toEqual([]);
  });
});
