import { KanbanIcon, LayoutGridIcon, ListIcon, PlusIcon, SearchIcon } from "@kamod-ch/icons/lucide";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Input,
  Label,
  Skeleton,
  ToggleGroup,
  ToggleGroupItem,
} from "@kamod-ch/ui";
import { useEffect } from "preact/hooks";
import { AddTaskDialog } from "./add-task-dialog";
import { BoardView } from "./board-view";
import { ListView } from "./list-view";
import { TaskSheet } from "./task-sheet";
import type { Assignee, Column, KanbanFilter, KanbanStatus, KanbanView, Priority } from "./types";
import { useKanban } from "./use-kanban";

export type KanbanBoardProps = {
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
  status?: KanbanStatus;
  errorMessage?: string;
  createTaskId?: () => string;
};

export const KanbanBoard = ({
  columns = [],
  onColumnsChange,
  assignees = [],
  view,
  defaultView,
  onViewChange,
  filter,
  defaultFilter,
  onFilterChange,
  readOnly = false,
  status = "ready",
  errorMessage = "Could not load the board.",
  createTaskId,
}: KanbanBoardProps) => {
  const board = useKanban({
    columns,
    onColumnsChange,
    assignees,
    view,
    defaultView,
    onViewChange,
    filter,
    defaultFilter,
    onFilterChange,
    readOnly,
  });

  useEffect(() => {
    if (!board.dragging) return;
    const node = document.querySelector<HTMLElement>(`[data-task-id="${board.dragging.taskId}"]`);
    node?.focus();
  }, [board.dragging, columns]);

  return (
    <div
      data-slot="block-kanban-board"
      class="bg-background text-foreground mx-auto w-full max-w-6xl space-y-3 rounded-xl border p-4"
    >
      <header class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <KanbanIcon size={18} aria-hidden="true" />
          <h2 class="text-base font-semibold">Board</h2>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <ToggleGroup
            type="single"
            value={board.currentView}
            onValueChange={(value) => {
              if (value === "board" || value === "list") board.setView(value);
            }}
            variant="outline"
            size="sm"
            aria-label="Board or list"
          >
            <ToggleGroupItem value="board" aria-label="Board view">
              <LayoutGridIcon size={14} />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <ListIcon size={14} />
            </ToggleGroupItem>
          </ToggleGroup>
          {readOnly ? null : (
            <Button type="button" size="sm" onClick={() => board.setAdding(true)}>
              <PlusIcon size={14} /> Add task
            </Button>
          )}
        </div>
      </header>

      <div class="flex flex-wrap items-end gap-2">
        <div class="min-w-40 flex-1 space-y-1">
          <Label for="kanban-search">Search</Label>
          <div class="relative">
            <SearchIcon
              size={14}
              class="text-muted-foreground pointer-events-none absolute top-1/2 left-2 -translate-y-1/2"
            />
            <Input
              id="kanban-search"
              class="ps-7"
              value={board.currentFilter.query ?? ""}
              onInput={(event) => board.setQuery((event.target as HTMLInputElement).value)}
            />
          </div>
        </div>
        <div class="space-y-1">
          <Label for="kanban-priority">Priority</Label>
          <select
            id="kanban-priority"
            class="border-input bg-background h-8 rounded-md border px-2 text-sm"
            value={board.currentFilter.priority ?? "all"}
            onChange={(event) =>
              board.setPriority((event.target as HTMLSelectElement).value as Priority | "all")
            }
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div class="space-y-1">
          <Label for="kanban-assignee">Assignee</Label>
          <select
            id="kanban-assignee"
            class="border-input bg-background h-8 rounded-md border px-2 text-sm"
            value={board.currentFilter.assigneeId ?? "all"}
            onChange={(event) => board.setAssignee((event.target as HTMLSelectElement).value)}
          >
            <option value="all">All</option>
            {assignees.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" ? (
        <div class="grid gap-2" aria-busy="true">
          <Skeleton class="h-40 w-full" />
        </div>
      ) : null}
      {status === "error" ? (
        <Alert>
          <AlertTitle>Board unavailable</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {status === "ready" && board.currentView === "board" ? (
        <BoardView
          columns={board.visible}
          assignees={assignees}
          liftedId={board.dragging?.taskId ?? null}
          readOnly={readOnly}
          onOpenTask={board.setSelectedTaskId}
          onToggleColumn={(id) => board.dispatch({ type: "toggle-column", columnId: id })}
          onTaskKeyDown={board.onTaskKeyDown}
          onGripPointerDown={(task, event) => {
            event.preventDefault();
            board.pickUp(task.id);
          }}
          onColumnPointerUp={(columnId, index) => {
            if (board.dragging) board.dropAt(columnId, index);
          }}
        />
      ) : null}

      {status === "ready" && board.currentView === "list" ? (
        <ListView
          columns={board.visible}
          assignees={assignees}
          liftedId={board.dragging?.taskId ?? null}
          onOpenTask={board.setSelectedTaskId}
          onTaskKeyDown={board.onTaskKeyDown}
        />
      ) : null}

      <p class="sr-only" aria-live="polite">
        {board.announcement}
      </p>

      <TaskSheet
        task={board.selectedTask}
        assignees={assignees}
        open={board.selectedTaskId !== null}
        onOpenChange={(open) => {
          if (!open) board.setSelectedTaskId(null);
        }}
        readOnly={readOnly}
        onPatch={(taskId, patch) => board.dispatch({ type: "update-task", taskId, patch })}
      />

      {readOnly ? null : (
        <AddTaskDialog
          open={board.adding}
          onOpenChange={board.setAdding}
          columns={columns}
          assignees={assignees}
          createTaskId={createTaskId}
          onAdd={board.addTask}
        />
      )}
    </div>
  );
};
