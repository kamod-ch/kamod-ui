import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  Button,
  Checkbox,
  DataTable,
  Dropdown,
  DropdownCheckboxItem,
  DropdownContent,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  Input,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@kamod-ui/core";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-preact";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const paymentRows: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@example.com" },
  { id: "derv1ws0", amount: 837, status: "processing", email: "Monserrat44@example.com" },
  { id: "5kma53ae", amount: 874, status: "success", email: "Silas22@example.com" },
  { id: "bhqecj4p", amount: 721, status: "failed", email: "carmella@example.com" },
];

type SortDir = "none" | "asc" | "desc";

type ColKey = "status" | "email" | "amount";

const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const HeaderSelectCheckbox = ({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: (next: boolean) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      data-slot="checkbox"
      class="peer size-5 appearance-auto rounded-sm border border-input bg-background align-middle accent-primary focus-visible:ring-3 focus-visible:ring-outline/50"
      checked={checked}
      aria-label="Select all"
      onChange={(e) => onChange((e.currentTarget as HTMLInputElement).checked)}
    />
  );
};

/** Mirrors the shadcn/ui data-table guide: toolbar, sorting, filtering, column visibility, row selection, pagination. */
export const PaymentsDataTableDemo = () => {
  const [sortDir, setSortDir] = useState<SortDir>("none");
  const [emailFilter, setEmailFilter] = useState("");
  const [visible, setVisible] = useState<Record<ColKey, boolean>>({
    status: true,
    email: true,
    amount: true,
  });
  const [selection, setSelection] = useState<Record<string, boolean>>({});
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 2;

  const filtered = useMemo(() => {
    const q = emailFilter.trim().toLowerCase();
    if (!q) return paymentRows;
    return paymentRows.filter((p) => p.email.toLowerCase().includes(q));
  }, [emailFilter]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    if (sortDir === "asc") rows.sort((a, b) => a.email.localeCompare(b.email));
    else if (sortDir === "desc") rows.sort((a, b) => b.email.localeCompare(a.email));
    return rows;
  }, [filtered, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(pageIndex, pageCount - 1);
  const pageRows = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);

  const toggleSort = () => {
    setSortDir((d) => (d === "none" ? "asc" : d === "asc" ? "desc" : "none"));
  };

  const allPageSelected = pageRows.length > 0 && pageRows.every((r) => selection[r.id]);
  const somePageSelected = pageRows.some((r) => selection[r.id]) && !allPageSelected;

  const toggleAllPage = (on: boolean) => {
    setSelection((prev) => {
      const next = { ...prev };
      for (const r of pageRows) {
        if (on) next[r.id] = true;
        else delete next[r.id];
      }
      return next;
    });
  };

  const selectedCount = sorted.filter((r) => selection[r.id]).length;
  const visibleCount =
    1 + (visible.status ? 1 : 0) + (visible.email ? 1 : 0) + (visible.amount ? 1 : 0) + 1;

  const setCol = (key: ColKey, v: boolean) => setVisible((prev) => ({ ...prev, [key]: v }));

  return (
    <div class="w-full max-w-full">
      <div class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Filter emails…"
          value={emailFilter}
          class="max-w-sm"
          onInput={(e) => {
            setEmailFilter((e.target as HTMLInputElement).value);
            setPageIndex(0);
          }}
        />
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="outline" class="sm:ms-auto">
              Columns
              <ChevronDown class="size-4 opacity-60" />
            </Button>
          </DropdownTrigger>
          <DropdownContent align="end" class="min-w-40">
            <DropdownGroup>
              <DropdownCheckboxItem
                checked={visible.status}
                onCheckedChange={(v) => setCol("status", v)}
              >
                status
              </DropdownCheckboxItem>
              <DropdownCheckboxItem
                checked={visible.email}
                onCheckedChange={(v) => setCol("email", v)}
              >
                email
              </DropdownCheckboxItem>
              <DropdownCheckboxItem
                checked={visible.amount}
                onCheckedChange={(v) => setCol("amount", v)}
              >
                amount
              </DropdownCheckboxItem>
            </DropdownGroup>
          </DropdownContent>
        </Dropdown>
      </div>

      <DataTable chrome>
        <TableHeader>
          <TableRow>
            <TableHead class="w-10">
              <HeaderSelectCheckbox
                checked={allPageSelected}
                indeterminate={somePageSelected}
                onChange={(on) => toggleAllPage(on)}
              />
            </TableHead>
            {visible.status ? <TableHead>Status</TableHead> : null}
            {visible.email ? (
              <TableHead>
                <Button variant="ghost" class="h-8 gap-1 px-2 font-normal" onClick={toggleSort}>
                  Email
                  <ArrowUpDown class="size-4 opacity-60" />
                </Button>
              </TableHead>
            ) : null}
            {visible.amount ? (
              <TableHead class="text-end">
                <span class="pe-4">Amount</span>
              </TableHead>
            ) : null}
            <TableHead class="w-10 text-end">
              <span class="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.length ? (
            pageRows.map((row) => (
              <TableRow
                key={row.id}
                data-state={selection[row.id] ? "selected" : undefined}
                class="data-[state=selected]:bg-muted/50"
              >
                <TableCell>
                  <Checkbox
                    checked={Boolean(selection[row.id])}
                    aria-label="Select row"
                    onChange={(e) => {
                      const on = (e.currentTarget as HTMLInputElement).checked;
                      setSelection((prev) => {
                        const next = { ...prev };
                        if (on) next[row.id] = true;
                        else delete next[row.id];
                        return next;
                      });
                    }}
                  />
                </TableCell>
                {visible.status ? (
                  <TableCell>
                    <span class="capitalize">{row.status}</span>
                  </TableCell>
                ) : null}
                {visible.email ? (
                  <TableCell>
                    <span class="lowercase">{row.email}</span>
                  </TableCell>
                ) : null}
                {visible.amount ? (
                  <TableCell class="text-end font-medium tabular-nums">
                    {formatUsd(row.amount)}
                  </TableCell>
                ) : null}
                <TableCell class="text-end">
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <Button variant="ghost" size="icon-xs" aria-label="Open menu">
                        <span class="sr-only">Open menu</span>
                        <MoreHorizontal class="size-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownContent align="end" class="w-40">
                      <DropdownGroup>
                        <DropdownLabel>Actions</DropdownLabel>
                        <DropdownItem
                          onClick={() => {
                            void navigator.clipboard?.writeText?.(row.id);
                          }}
                        >
                          Copy payment ID
                        </DropdownItem>
                      </DropdownGroup>
                      <DropdownSeparator />
                      <DropdownGroup>
                        <DropdownItem>View customer</DropdownItem>
                        <DropdownItem>View payment details</DropdownItem>
                      </DropdownGroup>
                    </DropdownContent>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={visibleCount} class="h-24 text-center text-muted-foreground">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </DataTable>

      <div class="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-end">
        <p class="text-muted-foreground text-sm sm:flex-1">
          {selectedCount} of {sorted.length} row(s) selected.
        </p>
        <div class="flex gap-2">
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
      </div>
    </div>
  );
};
