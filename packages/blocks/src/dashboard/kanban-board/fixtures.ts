import type { Assignee, Column } from "./types";

export const previewAssignees: Assignee[] = [
  { id: "ada", name: "Ada Lovelace" },
  { id: "grace", name: "Grace Hopper" },
];

export const previewColumns: Column[] = [
  {
    id: "todo",
    title: "To do",
    tasks: [
      {
        id: "task-calendar",
        title: "Review calendar range",
        priority: "medium",
        assigneeId: "ada",
        tags: ["a11y"],
        description: "Shift-select and keyboard arrows must stay on civil dates.",
        subtasks: [
          { id: "st-1", title: "Arrow keys", done: true },
          { id: "st-2", title: "TZ cases", done: false },
        ],
      },
      {
        id: "task-docs",
        title: "Write board docs",
        priority: "low",
        assigneeId: "grace",
      },
    ],
  },
  {
    id: "doing",
    title: "In progress",
    tasks: [
      {
        id: "task-dnd",
        title: "Keyboard move cards",
        priority: "high",
        assigneeId: "ada",
        comments: [
          {
            id: "c1",
            authorId: "grace",
            body: "Space to lift, arrows to move.",
            createdAt: "2026-08-14T12:00:00.000Z",
          },
        ],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "task-models",
        title: "Export task models",
        priority: "urgent",
        assigneeId: "grace",
        attachments: [{ id: "a1", name: "models.ts" }],
      },
    ],
  },
];
