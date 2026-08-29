export type Priority = "low" | "medium" | "high" | "urgent";

export type Assignee = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Subtask = {
  id: string;
  title: string;
  done: boolean;
};

export type Attachment = {
  id: string;
  name: string;
  href?: string;
};

export type Comment = {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority?: Priority;
  assigneeId?: string;
  tags?: string[];
  dueAt?: string;
  subtasks?: Subtask[];
  attachments?: Attachment[];
  comments?: Comment[];
};

export type Column = {
  id: string;
  title: string;
  collapsed?: boolean;
  tasks: Task[];
};

export type KanbanView = "board" | "list";

export type KanbanStatus = "ready" | "loading" | "error";

export type KanbanFilter = {
  query?: string;
  priority?: Priority | "all";
  assigneeId?: string | "all";
};

export type KanbanAction =
  | { type: "move-task"; taskId: string; toColumnId: string; toIndex: number }
  | { type: "reorder-column"; fromIndex: number; toIndex: number }
  | { type: "add-task"; columnId: string; task: Task }
  | { type: "update-task"; taskId: string; patch: Partial<Task> }
  | { type: "remove-task"; taskId: string }
  | { type: "toggle-column"; columnId: string }
  | { type: "add-column"; column: Column };

export type TaskLocation = {
  column: Column;
  columnIndex: number;
  task: Task;
  taskIndex: number;
};
