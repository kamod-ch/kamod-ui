import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@kamod-ch/ui/pagination";
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod";
import { fireOpenUIAction, optionalActionSchema } from "../security/action";

function buildPageList(page: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  if (page <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (page >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && current - prev > 1) {
      result.push("ellipsis");
    }
    result.push(current);
  }
  return result;
}

export const paginationComponent = defineComponent({
  name: "Pagination",
  description:
    "Page navigation. Args: page (1-based), totalPages, optional action (host receives payload {page}).",
  props: z.object({
    page: z.number().int().min(1).default(1),
    totalPages: z.number().int().min(1).max(500),
    action: optionalActionSchema,
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    const page = Math.min(props.page, props.totalPages);
    const goTo = (next: number) => {
      if (next < 1 || next > props.totalPages || next === page) return;
      fireOpenUIAction(triggerAction, `Page ${next}`, props.action, { page: next });
    };
    const pages = buildPageList(page, props.totalPages);

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page <= 1 ? true : undefined}
              onClick={(event) => {
                event.preventDefault();
                goTo(page - 1);
              }}
            />
          </PaginationItem>
          {pages.map((item, index) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <span class="px-2 text-muted-foreground">…</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page >= props.totalPages ? true : undefined}
              onClick={(event) => {
                event.preventDefault();
                goTo(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  },
});
