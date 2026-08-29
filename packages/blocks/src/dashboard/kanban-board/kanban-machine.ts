import type { Column, KanbanAction, KanbanFilter, Task, TaskLocation } from "./types";

const cloneColumns = (columns: Column[]): Column[] =>
  columns.map((column) => ({ ...column, tasks: [...column.tasks] }));

export const findTask = (columns: Column[], taskId: string): TaskLocation | null => {
  for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
    const column = columns[columnIndex];
    if (!column) continue;
    const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex >= 0) {
      const task = column.tasks[taskIndex];
      if (task) return { column, columnIndex, task, taskIndex };
    }
  }
  return null;
};

export const moveTask = (
  columns: Column[],
  taskId: string,
  toColumnId: string,
  toIndex: number,
): Column[] => {
  const found = findTask(columns, taskId);
  const target = columns.find((column) => column.id === toColumnId);
  if (!found || !target) return columns;

  const next = cloneColumns(columns);
  const from = next[found.columnIndex];
  const to = next.find((column) => column.id === toColumnId);
  if (!from || !to) return columns;

  const [task] = from.tasks.splice(found.taskIndex, 1);
  if (!task) return columns;

  const sameColumn = from.id === to.id;
  let index = Math.max(0, Math.min(toIndex, to.tasks.length));
  if (sameColumn && found.taskIndex < index) index -= 1;
  to.tasks.splice(index, 0, task);
  return next;
};

export const reorderColumns = (columns: Column[], fromIndex: number, toIndex: number): Column[] => {
  if (fromIndex === toIndex) return columns;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= columns.length || toIndex >= columns.length) {
    return columns;
  }
  const next = cloneColumns(columns);
  const [column] = next.splice(fromIndex, 1);
  if (!column) return columns;
  next.splice(toIndex, 0, column);
  return next;
};

export const addTask = (columns: Column[], columnId: string, task: Task): Column[] =>
  columns.map((column) =>
    column.id === columnId ? { ...column, tasks: [...column.tasks, task] } : column,
  );

export const updateTask = (columns: Column[], taskId: string, patch: Partial<Task>): Column[] =>
  columns.map((column) => ({
    ...column,
    tasks: column.tasks.map((task) =>
      task.id === taskId ? { ...task, ...patch, id: task.id } : task,
    ),
  }));

export const removeTask = (columns: Column[], taskId: string): Column[] =>
  columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => task.id !== taskId),
  }));

export const toggleColumn = (columns: Column[], columnId: string): Column[] =>
  columns.map((column) =>
    column.id === columnId ? { ...column, collapsed: !column.collapsed } : column,
  );

export const addColumn = (columns: Column[], column: Column): Column[] => [...columns, column];

export const kanbanReducer = (columns: Column[], action: KanbanAction): Column[] => {
  switch (action.type) {
    case "move-task":
      return moveTask(columns, action.taskId, action.toColumnId, action.toIndex);
    case "reorder-column":
      return reorderColumns(columns, action.fromIndex, action.toIndex);
    case "add-task":
      return addTask(columns, action.columnId, action.task);
    case "update-task":
      return updateTask(columns, action.taskId, action.patch);
    case "remove-task":
      return removeTask(columns, action.taskId);
    case "toggle-column":
      return toggleColumn(columns, action.columnId);
    case "add-column":
      return addColumn(columns, action.column);
    default:
      return columns;
  }
};

export const taskMatches = (task: Task, filter: KanbanFilter): boolean => {
  const query = filter.query?.trim().toLowerCase() ?? "";
  if (query) {
    const haystack = [task.title, task.description, ...(task.tags ?? [])].join(" ").toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  if (filter.priority && filter.priority !== "all" && task.priority !== filter.priority) {
    return false;
  }
  if (filter.assigneeId && filter.assigneeId !== "all" && task.assigneeId !== filter.assigneeId) {
    return false;
  }
  return true;
};

export const filterColumns = (columns: Column[], filter: KanbanFilter): Column[] =>
  columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => taskMatches(task, filter)),
  }));

export const announceMove = (taskTitle: string, columnTitle: string): string =>
  `Moved ${taskTitle} to ${columnTitle}`;
