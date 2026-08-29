import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import type { Assignee, Column, Priority, Task } from "./types";

export type AddTaskDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  assignees: Assignee[];
  onAdd: (columnId: string, task: Task) => void;
  createTaskId?: () => string;
};

const priorities: Priority[] = ["low", "medium", "high", "urgent"];

export const AddTaskDialog = ({
  open,
  onOpenChange,
  columns,
  assignees,
  onAdd,
  createTaskId,
}: AddTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [columnId, setColumnId] = useState(columns[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assigneeId, setAssigneeId] = useState<string>("none");

  const reset = () => {
    setTitle("");
    setColumnId(columns[0]?.id ?? "");
    setPriority("medium");
    setAssigneeId("none");
  };

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed || !columnId) return;
    onAdd(columnId, {
      id: createTaskId?.() ?? `task-${Math.random().toString(36).slice(2, 10)}`,
      title: trimmed,
      priority,
      assigneeId: assigneeId === "none" ? undefined : assigneeId || undefined,
    });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add task</DialogTitle>
        </DialogHeader>
        <div class="grid gap-3">
          <div class="space-y-1">
            <Label for="kanban-new-title">Title</Label>
            <Input
              id="kanban-new-title"
              value={title}
              onInput={(event) => setTitle((event.target as HTMLInputElement).value)}
            />
          </div>
          <div class="space-y-1">
            <Label for="kanban-new-column">Column</Label>
            <Select value={columnId} onValueChange={setColumnId}>
              <SelectTrigger id="kanban-new-column" aria-label="Column">
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1">
            <Label for="kanban-new-priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
              <SelectTrigger id="kanban-new-priority" aria-label="Priority">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1">
            <Label for="kanban-new-assignee">Assignee</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger id="kanban-new-assignee" aria-label="Assignee">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {assignees.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={submit}>
            Create task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
