import type { JSX } from "preact";
import { useMemo, useState } from "preact/hooks";
import { useControllableState } from "../../shared";
import { announceMove, filterColumns, findTask, kanbanReducer } from "./kanban-machine";
import type {
  Assignee,
  Column,
  KanbanAction,
  KanbanFilter,
  KanbanView,
  Priority,
  Task,
} from "./types";

export type UseKanbanOptions = {
  columns?: Column[];
  onColumnsChange?: (columns: Column[]) => void;
  assignees?: Assignee[];
  view?: KanbanView;
  defaultView?: KanbanView;
  onViewChange?: (view: KanbanView) => void;
  filter?: KanbanFilter;
  defaultFilter?: KanbanFilter;
  onFilterChange?: (filter: KanbanFilter) => void;
  readOnly?: boolean;
};

export type DragState = {
  taskId: string;
  fromColumnId: string;
  fromIndex: number;
} | null;

export const useKanban = ({
  columns = [],
  onColumnsChange,
  assignees = [],
  view,
  defaultView = "board",
  onViewChange,
  filter,
  defaultFilter = { query: "", priority: "all", assigneeId: "all" },
  onFilterChange,
  readOnly = false,
}: UseKanbanOptions) => {
  const [currentView, setView] = useControllableState<KanbanView>({
    value: view,
    defaultValue: defaultView,
    onChange: onViewChange,
  });
  const [currentFilter, setFilter] = useControllableState<KanbanFilter>({
    value: filter,
    defaultValue: defaultFilter,
    onChange: onFilterChange,
  });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [dragging, setDragging] = useState<DragState>(null);
  const [announcement, setAnnouncement] = useState("");

  const visible = useMemo(() => filterColumns(columns, currentFilter), [columns, currentFilter]);

  const dispatch = (action: KanbanAction) => {
    if (readOnly) return;
    onColumnsChange?.(kanbanReducer(columns, action));
  };

  const selectedTask = selectedTaskId ? (findTask(columns, selectedTaskId)?.task ?? null) : null;

  const pickUp = (taskId: string) => {
    if (readOnly) return;
    const found = findTask(columns, taskId);
    if (!found) return;
    setDragging({
      taskId,
      fromColumnId: found.column.id,
      fromIndex: found.taskIndex,
    });
    setAnnouncement(`Picked up ${found.task.title}`);
  };

  const dropAt = (toColumnId: string, toIndex: number) => {
    if (!dragging) return;
    const task = findTask(columns, dragging.taskId)?.task;
    const column = columns.find((item) => item.id === toColumnId);
    dispatch({ type: "move-task", taskId: dragging.taskId, toColumnId, toIndex });
    if (task && column) setAnnouncement(announceMove(task.title, column.title));
    setDragging(null);
  };

  const cancelDrag = () => {
    if (!dragging) return;
    setAnnouncement("Move cancelled");
    setDragging(null);
  };

  const moveLifted = (direction: "left" | "right" | "up" | "down") => {
    if (!dragging || readOnly) return;
    const found = findTask(columns, dragging.taskId);
    if (!found) return;
    let toColumnId = found.column.id;
    let toIndex = found.taskIndex;
    if (direction === "left" || direction === "right") {
      const nextColumn = columns[found.columnIndex + (direction === "right" ? 1 : -1)];
      if (!nextColumn) return;
      toColumnId = nextColumn.id;
      toIndex = Math.min(found.taskIndex, nextColumn.tasks.length);
    } else {
      const nextIndex = found.taskIndex + (direction === "down" ? 1 : -1);
      if (nextIndex < 0 || nextIndex > found.column.tasks.length - 1) return;
      toIndex = nextIndex;
    }
    const nextColumns = kanbanReducer(columns, {
      type: "move-task",
      taskId: dragging.taskId,
      toColumnId,
      toIndex,
    });
    onColumnsChange?.(nextColumns);
    const nextFound = findTask(nextColumns, dragging.taskId);
    if (nextFound) {
      setDragging({
        taskId: dragging.taskId,
        fromColumnId: nextFound.column.id,
        fromIndex: nextFound.taskIndex,
      });
      setAnnouncement(announceMove(nextFound.task.title, nextFound.column.title));
    }
  };

  const onTaskKeyDown = (taskId: string, event: JSX.TargetedKeyboardEvent<HTMLElement>) => {
    if (readOnly) return;
    if ((event.key === " " || event.key === "Enter") && !dragging) {
      event.preventDefault();
      pickUp(taskId);
      return;
    }
    if (!dragging || dragging.taskId !== taskId) return;
    if (event.key === "Escape") {
      event.preventDefault();
      cancelDrag();
      return;
    }
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setAnnouncement(
        announceMove(
          findTask(columns, taskId)?.task.title ?? "Task",
          findTask(columns, taskId)?.column.title ?? "column",
        ),
      );
      setDragging(null);
      return;
    }
    const map = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
    } as const;
    const dir = map[event.key as keyof typeof map];
    if (dir) {
      event.preventDefault();
      moveLifted(dir);
    }
  };

  const addTask = (columnId: string, task: Task) => {
    dispatch({ type: "add-task", columnId, task });
    setAdding(false);
  };

  const setQuery = (query: string) => setFilter({ ...currentFilter, query });
  const setPriority = (priority: Priority | "all") => setFilter({ ...currentFilter, priority });
  const setAssignee = (assigneeId: string | "all") => setFilter({ ...currentFilter, assigneeId });

  return {
    columns,
    visible,
    assignees,
    currentView,
    setView,
    currentFilter,
    setQuery,
    setPriority,
    setAssignee,
    selectedTaskId,
    setSelectedTaskId,
    selectedTask,
    adding,
    setAdding,
    dragging,
    pickUp,
    dropAt,
    cancelDrag,
    onTaskKeyDown,
    announcement,
    dispatch,
    addTask,
    readOnly,
  };
};
