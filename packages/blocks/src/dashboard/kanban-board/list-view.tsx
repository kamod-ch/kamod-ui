import { Badge, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import type { JSX } from "preact";
import type { Assignee, Column } from "./types";

export type ListViewProps = {
  columns: Column[];
  assignees: Assignee[];
  liftedId: string | null;
  onOpenTask: (id: string) => void;
  onTaskKeyDown: (taskId: string, event: JSX.TargetedKeyboardEvent<HTMLElement>) => void;
};

export const ListView = ({
  columns,
  assignees,
  liftedId,
  onOpenTask,
  onTaskKeyDown,
}: ListViewProps) => {
  const rows = columns.flatMap((column) => column.tasks.map((task) => ({ task, column })));

  if (rows.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No tasks</EmptyTitle>
          <EmptyDescription>Adjust filters or add a task.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul class="divide-border divide-y rounded-xl border">
      {rows.map(({ task, column }) => {
        const assignee = assignees.find((item) => item.id === task.assigneeId);
        return (
          <li key={task.id}>
            <button
              type="button"
              data-task-id={task.id}
              aria-grabbed={liftedId === task.id || undefined}
              class="hover:bg-muted/40 flex w-full items-center justify-between gap-3 px-3 py-2 text-left outline-none focus-visible:ring-2"
              onClick={() => onOpenTask(task.id)}
              onKeyDown={(event) => onTaskKeyDown(task.id, event)}
            >
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium">{task.title}</span>
                <span class="text-muted-foreground text-xs">{assignee?.name ?? "Unassigned"}</span>
              </span>
              <span class="flex items-center gap-2">
                {task.priority ? (
                  <Badge size="sm" variant="outline">
                    {task.priority}
                  </Badge>
                ) : null}
                <Badge size="sm" variant="secondary">
                  {column.title}
                </Badge>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};
