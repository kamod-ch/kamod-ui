import {
  Label,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@kamod-ui/core";
import { createGenericDocPage } from "./create-generic-doc-page";

export const paginationDocPage = createGenericDocPage({
  slug: "pagination",
  title: "Pagination",
  usageLabel:
    "Pagination surfaces page navigation with optional chevrons, ellipsis, and compact table-style layouts — aligned with shadcn/ui patterns.",
  installationText: "Import Pagination primitives from `@/components/kamod-ui/pagination`.",
  usageText:
    "Compose Pagination with PaginationContent and PaginationItem wrappers. Use PaginationLink for numeric pages (outline when active, ghost otherwise). PaginationPrevious and PaginationNext add chevrons and hide link text on small screens; pass `text` for localization.",
  exampleSections: [
    {
      id: "pagination-demo",
      title: "Demo",
      text: "Full navigation: previous, page numbers with an active state, ellipsis, and next — matching the primary shadcn/ui example.",
      code: `import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/kamod-ui/pagination";

export const Example = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" isActive>
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">3</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);`,
      renderPreview: () => (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
    },
    {
      id: "pagination-simple",
      title: "Simple",
      text: "Numeric pages only — useful when previous/next live elsewhere or the range is small.",
      code: `import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/kamod-ui/pagination";

export const Example = () => (
  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationLink href="#">1</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" isActive>
          2
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">3</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">4</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">5</PaginationLink>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);`,
      renderPreview: () => (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">4</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">5</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
    },
    {
      id: "pagination-icons-only",
      title: "Icons only (with rows per page)",
      text: "Previous and next without page numbers, beside a rows-per-page select — typical for data tables.",
      code: `import { Label } from "@/components/kamod-ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/kamod-ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/kamod-ui/select";

export const Example = () => (
  <div class="flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-2">
      <Label class="text-sm whitespace-nowrap" for="select-rows-per-page">
        Rows per page
      </Label>
      <Select defaultValue="25" class="w-fit">
        <SelectTrigger class="w-20" id="select-rows-per-page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <Pagination class="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
);`,
      renderPreview: () => (
        <div class="flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <Label class="text-sm whitespace-nowrap" for="select-rows-per-page">
              Rows per page
            </Label>
            <Select defaultValue="25" class="w-fit">
              <SelectTrigger class="w-20" id="select-rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Pagination class="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )
    },
    {
      id: "pagination-rtl",
      title: "RTL labels",
      text: "Set `dir=\"rtl\"` on the nav and use the `text` prop on previous/next for translated strings (shadcn-style i18n hook optional).",
      code: `import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/kamod-ui/pagination";

export const Example = () => (
  <Pagination dir="rtl">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" text="السابق" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">١</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#" isActive>
          ٢
        </PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationLink href="#">٣</PaginationLink>
      </PaginationItem>
      <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#" text="التالي" />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
);`,
      renderPreview: () => (
        <Pagination dir="rtl">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" text="السابق" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">١</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                ٢
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">٣</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" text="التالي" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )
    }
  ],
  apiRows: [
    { prop: "PaginationLink isActive", type: "boolean", defaultValue: "false" },
    { prop: "PaginationLink size", type: "Button size token", defaultValue: '"default"' },
    { prop: "PaginationPrevious / PaginationNext text", type: "string", defaultValue: '"Previous" / "Next"' },
    {
      prop: "PaginationPrevious / PaginationNext children",
      type: "ComponentChildren",
      defaultValue: "chevron + hidden sm:text (or custom)"
    },
    { prop: "Pagination class", type: "string", defaultValue: '"mx-auto flex w-full justify-center"' }
  ],
  accessibilityText:
    "Active page uses `aria-current=\"page\"`. Previous and next expose `aria-label`. Ellipsis is decorative with `aria-hidden` and a screen-reader-only “More pages” label."
});
