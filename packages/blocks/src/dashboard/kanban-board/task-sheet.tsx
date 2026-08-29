import {
  Badge,
  Button,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Textarea,
} from "@kamod-ch/ui";
import type { Assignee, Task } from "./types";

export type TaskSheetProps = {
  task: Task | null;
  assignees: Assignee[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  readOnly?: boolean;
  onPatch: (taskId: string, patch: Partial<Task>) => void;
};

export const TaskSheet = ({
  task,
  assignees,
  open,
  onOpenChange,
  readOnly,
  onPatch,
}: TaskSheetProps) => {
  const assignee = task ? assignees.find((item) => item.id === task.assigneeId) : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" class="overflow-y-auto">
        {task ? (
          <>
            <SheetHeader>
              <SheetTitle>{task.title}</SheetTitle>
              <SheetDescription>
                {assignee?.name ?? "Unassigned"}
                {task.priority ? ` · ${task.priority}` : ""}
              </SheetDescription>
            </SheetHeader>
            <div class="mt-4 space-y-4">
              <div class="space-y-1">
                <Label for="kanban-task-description">Description</Label>
                <Textarea
                  id="kanban-task-description"
                  value={task.description ?? ""}
                  disabled={readOnly}
                  onInput={(event) =>
                    onPatch(task.id, { description: (event.target as HTMLTextAreaElement).value })
                  }
                />
              </div>
              {task.tags?.length ? (
                <div class="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} size="sm" variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
              {task.subtasks?.length ? (
                <ul class="space-y-2">
                  {task.subtasks.map((subtask) => (
                    <li key={subtask.id} class="flex items-center gap-2 text-sm">
                      <input
                        id={`subtask-${subtask.id}`}
                        type="checkbox"
                        checked={subtask.done}
                        disabled={readOnly}
                        onChange={() =>
                          onPatch(task.id, {
                            subtasks: task.subtasks?.map((item) =>
                              item.id === subtask.id ? { ...item, done: !item.done } : item,
                            ),
                          })
                        }
                      />
                      <Label for={`subtask-${subtask.id}`}>{subtask.title}</Label>
                    </li>
                  ))}
                </ul>
              ) : null}
              {task.attachments?.length ? (
                <ul class="text-sm">
                  {task.attachments.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              ) : null}
              {task.comments?.length ? (
                <ul class="space-y-2 text-sm">
                  {task.comments.map((comment) => (
                    <li key={comment.id} class="rounded-md border p-2">
                      {comment.body}
                    </li>
                  ))}
                </ul>
              ) : null}
              {readOnly ? null : (
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};
