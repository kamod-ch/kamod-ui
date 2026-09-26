import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  BulkActionBar,
  BulkActionBarActions,
  BulkActionBarClear,
  BulkActionBarCount,
  Button,
  Checkbox,
  DataTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ch/ui";
import { ArrowUpDown } from "lucide-preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { type Payment, paymentRows } from "./data-table-payments-demo";

type SortDir = "none" | "asc" | "desc";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const formatSelectedLabel = (count: number) =>
  count === 1 ? "1 payment selected" : `${count} payments selected`;

/** Data table + bulk bar: selection by stable row ids; select-all applies to the current page only. */
export const BulkActionTableDemo = () => {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Payment[]>(() => [...paymentRows]);
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const [sortDir, setSortDir] = useState<SortDir>("none");
  const [pageIndex, setPageIndex] = useState(0);
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const pageSize = 2;

  const sorted = useMemo(() => {
    const next = [...rows];
    if (sortDir === "asc") next.sort((a, b) => a.email.localeCompare(b.email));
    else if (sortDir === "desc") next.sort((a, b) => b.email.localeCompare(a.email));
    return next;
  }, [rows, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(pageIndex, pageCount - 1);
  const pageRows = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const selectedIds = useMemo(
    () => rows.filter((row) => selection[row.id]).map((row) => row.id),
    [rows, selection],
  );
  const selectedCount = selectedIds.length;

  const allPageSelected = pageRows.length > 0 && pageRows.every((row) => selection[row.id]);
  const somePageSelected = pageRows.some((row) => selection[row.id]) && !allPageSelected;

  const toggleAllPage = (on: boolean) => {
    setSelection((prev) => {
      const next = { ...prev };
      for (const row of pageRows) {
        if (on) next[row.id] = true;
        else delete next[row.id];
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelection({});
    selectAllRef.current?.focus();
  };

  const runArchive = async () => {
    if (pending || selectedCount === 0) return;
    setPending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setRows((current) =>
      current.map((row) => (selection[row.id] ? { ...row, status: "processing" as const } : row)),
    );
    setPending(false);
  };

  const runDelete = async () => {
    if (pending || selectedCount === 0) return;
    setPending(true);
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    setRows((current) => current.filter((row) => !selection[row.id]));
    setSelection({});
    setPending(false);
    setDeleteOpen(false);
    selectAllRef.current?.focus();
  };

  useEffect(() => {
    if (safePage !== pageIndex) setPageIndex(safePage);
  }, [pageIndex, safePage]);

  return (
    <div class="relative w-full max-w-full space-y-3">
      <p class="text-muted-foreground text-sm">
        Select-all affects only the <strong>visible page</strong> ({pageSize} rows). Selection is
        stored by payment id and survives sorting.
      </p>

      <BulkActionBar
        selectedCount={selectedCount}
        pending={pending}
        onClearSelection={clearSelection}
        aria-label="Payment bulk actions"
        variant="sticky"
      >
        <BulkActionBarCount formatCount={formatSelectedLabel} />
        <BulkActionBarActions aria-label="Payment bulk commands">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => void runArchive()}
          >
            Archive
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            disabled={pending}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </BulkActionBarActions>
        <BulkActionBarClear clearLabel="Clear selection" />
      </BulkActionBar>

      <DataTable chrome>
        <TableHeader>
          <TableRow>
            <TableHead class="w-10">
              <Checkbox
                ref={selectAllRef}
                checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
                aria-label="Select all on this page"
                onCheckedChange={(checked) => toggleAllPage(checked === true)}
              />
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                class="h-8 gap-1 px-2 font-normal"
                onClick={() =>
                  setSortDir((dir) => (dir === "none" ? "asc" : dir === "asc" ? "desc" : "none"))
                }
              >
                Email
                <ArrowUpDown class="size-4 opacity-60" />
              </Button>
            </TableHead>
            <TableHead class="text-end">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.map((row) => (
            <TableRow
              key={row.id}
              data-state={selection[row.id] ? "selected" : undefined}
              class="data-[state=selected]:bg-muted/50"
            >
              <TableCell>
                <Checkbox
                  checked={Boolean(selection[row.id])}
                  aria-label={`Select ${row.email}`}
                  onCheckedChange={(checked) => {
                    setSelection((prev) => {
                      const next = { ...prev };
                      if (checked === true) next[row.id] = true;
                      else delete next[row.id];
                      return next;
                    });
                  }}
                />
              </TableCell>
              <TableCell class="capitalize">{row.status}</TableCell>
              <TableCell class="lowercase">{row.email}</TableCell>
              <TableCell class="text-end font-medium tabular-nums">
                {formatUsd(row.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </DataTable>

      <div class="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={safePage <= 0}
          onClick={() => setPageIndex(safePage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={safePage >= pageCount - 1}
          onClick={() => setPageIndex(safePage + 1)}
        >
          Next
        </Button>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected payments?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {selectedCount === 1 ? "1 payment" : `${selectedCount} payments`} from
              the table preview. Confirmation lives in AlertDialog — not inside BulkActionBar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={() => void runDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
