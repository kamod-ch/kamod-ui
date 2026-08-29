import { GripVerticalIcon } from "@kamod-ch/icons/lucide";
import { Badge, cn } from "@kamod-ch/ui";
import type { JSX } from "preact";
import type { Assignee, Priority, Task } from "./types";

const priorityLabel: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const priorityVariant: Record<Priority, "outline" | "warning" | "destructive"> = {
  low: "outline",
  medium: "outline",
  high: "warning",
  urgent: "destructive",
};

export type TaskCardProps = {
  task: Task;
  assignees: Assignee[];
  lifted?: boolean;
  readOnly?: boolean;
  onOpen: () => void;
  onKeyDown: (event: JSX.TargetedKeyboardEvent<HTMLElement>) => void;
  onPointerDown?: (event: JSX.TargetedPointerEvent<HTMLButtonElement>) => void;
};

export const TaskCard = ({
  task,
  assignees,
  lifted,
  readOnly,
  onOpen,
  onKeyDown,
  onPointerDown,
}: TaskCardProps) => {
  const assignee = assignees.find((item) => item.id === task.assigneeId);
  const done = task.subtasks?.filter((item) => item.done).length ?? 0;
  const total = task.subtasks?.length ?? 0;

  return (
    <article
      data-task-id={task.id}
      tabIndex={0}
      aria-grabbed={lifted || undefined}
      class={cn(
        "bg-background rounded-lg border p-2 text-left shadow-xs outline-none",
        "focus-visible:ring-ring focus-visible:ring-2",
        lifted && "ring-primary ring-2",
      )}
      onKeyDown={onKeyDown}
      onClick={onOpen}
    >
      <div class="flex items-start gap-1">
        {readOnly ? null : (
          <button
            type="button"
            class="text-muted-foreground mt-0.5"
            aria-label={`Drag ${task.title}`}
            onPointerDown={onPointerDown}
            onClick={(event) => event.stopPropagation()}
          >
            <GripVerticalIcon size={14} />
          </button>
        )}
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium">{task.title}</p>
          {assignee ? <p class="text-muted-foreground text-xs">{assignee.name}</p> : null}
          <div class="mt-1 flex flex-wrap gap-1">
            {task.priority ? (
              <Badge size="sm" variant={priorityVariant[task.priority]}>
                {priorityLabel[task.priority]}
              </Badge>
            ) : null}
            {total > 0 ? (
              <Badge size="sm" variant="outline">
                {done}/{total}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
};
