import { ChevronsUpDownIcon } from "@kamod-ch/icons/lucide";
import { Button, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import type { JSX } from "preact";
import { TaskCard } from "./task-card";
import type { Assignee, Column, Task } from "./types";

export type BoardViewProps = {
  columns: Column[];
  assignees: Assignee[];
  liftedId: string | null;
  readOnly?: boolean;
  onOpenTask: (id: string) => void;
  onToggleColumn: (id: string) => void;
  onTaskKeyDown: (taskId: string, event: JSX.TargetedKeyboardEvent<HTMLElement>) => void;
  onGripPointerDown: (task: Task, event: JSX.TargetedPointerEvent<HTMLButtonElement>) => void;
  onColumnPointerUp: (columnId: string, index: number) => void;
};

export const BoardView = ({
  columns,
  assignees,
  liftedId,
  readOnly,
  onOpenTask,
  onToggleColumn,
  onTaskKeyDown,
  onGripPointerDown,
  onColumnPointerUp,
}: BoardViewProps) => {
  if (columns.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No columns</EmptyTitle>
          <EmptyDescription>
            Pass columns and onColumnsChange. The block does not persist.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div class="flex gap-3 overflow-x-auto pb-2">
      {columns.map((column) => (
        <section
          key={column.id}
          data-column-id={column.id}
          class="bg-muted/30 w-72 shrink-0 rounded-xl border p-2"
          onPointerUp={() => onColumnPointerUp(column.id, column.tasks.length)}
        >
          <header class="mb-2 flex items-center justify-between gap-2">
            <h3 class="text-sm font-medium">
              {column.title}{" "}
              <span class="text-muted-foreground font-normal">({column.tasks.length})</span>
            </h3>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-expanded={!column.collapsed}
              aria-label={`${column.collapsed ? "Expand" : "Collapse"} ${column.title}`}
              onClick={() => onToggleColumn(column.id)}
            >
              <ChevronsUpDownIcon size={14} />
            </Button>
          </header>
          {column.collapsed ? null : (
            <div class="grid gap-2">
              {column.tasks.map((task, index) => (
                <div
                  key={task.id}
                  onPointerUp={(event) => {
                    event.stopPropagation();
                    onColumnPointerUp(column.id, index);
                  }}
                >
                  <TaskCard
                    task={task}
                    assignees={assignees}
                    lifted={liftedId === task.id}
                    readOnly={readOnly}
                    onOpen={() => onOpenTask(task.id)}
                    onKeyDown={(event) => onTaskKeyDown(task.id, event)}
                    onPointerDown={(event) => onGripPointerDown(task, event)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};
