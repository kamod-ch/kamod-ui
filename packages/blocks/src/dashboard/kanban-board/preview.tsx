import { useState } from "preact/hooks";
import { previewAssignees, previewColumns } from "./fixtures";
import { KanbanBoard } from "./kanban-board";
import type { Column } from "./types";

export const KanbanBoardPreview = () => {
  const [columns, setColumns] = useState<Column[]>(previewColumns);
  return (
    <div class="p-4">
      <KanbanBoard columns={columns} onColumnsChange={setColumns} assignees={previewAssignees} />
    </div>
  );
};
