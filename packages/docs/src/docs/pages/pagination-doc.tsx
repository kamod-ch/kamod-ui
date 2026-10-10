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
  SelectValue,
} from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
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
      text: "**Keep the Current Location and Available Destinations Clear.** Compose previous/next links, numbered pages and an ellipsis around the active page. The pagination presents the available destinations, while your routing or data layer supplies the records belonging to each page.\n\nBuild the visible range from your dataset, distinguish ellipsis from selectable pages, and define what happens at the first and last page before connecting remote results.",
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
      ),
    },
    {
      id: "pagination-simple",
      title: "Simple",
      text: "**Use a Compact Range When Every Page Can Remain Visible.** Use numbered page links alone when the range is short or previous/next controls already exist elsewhere. Mark the current page clearly so the compact layout still communicates where the reader is within the result set.\n\nGive the navigation a useful accessible name, keep the current page explicit, and switch patterns before the list becomes too long for narrow screens.",
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
      ),
    },
    {
      id: "pagination-icons-only",
      title: "Icons Only (with Rows per Page)",
      text: "**Keep Navigation Distinct from Page Size.** Pair icon-only previous/next controls with a rows-per-page selector for a compact table footer. The controls change which records are displayed, while accessible names explain their direction without requiring visible button labels.\n\nGive icon-only links descriptive accessible names, reset or clamp the current page when page size changes, and expose a readable result summary so users can tell where they are.",
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
      ),
    },
    {
      id: "pagination-rtl",
      title: "RTL Labels",
      text: '**Check the Whole Pattern in Its Reading Direction.** Set `dir="rtl"` on the navigation and provide translated `text` for previous and next controls. Keep the meaning of each destination consistent with the reading direction rather than only reversing the visual order.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.',
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
      ),
    },
  ],
  apiRows: [
    {
      prop: "PaginationLink isActive",
      type: "boolean",
      defaultValue: "false",
      description: (
        <>
          <strong>Mark the Current Page.</strong> Sets <code>aria-current="page"</code> and switches
          the link from <code>ghost</code> to <code>outline</code> styling. Update it from your own
          page state; it does not change the destination. See the{" "}
          <a href="#pagination-demo">Full Navigation Example</a>.
        </>
      ),
    },
    {
      prop: "PaginationLink size",
      type: "Button size token",
      defaultValue: '"default"',
      description: (
        <>
          Uses the shared{" "}
          <a href={withBasePath("/docs/button/installation#api-reference")}>Button Size Tokens</a>.
          Pagination also applies <code>h-9</code>, <code>min-w-9</code> and its own horizontal
          padding, so the token alone does not determine every dimension. Keep page links{" "}
          <strong>Consistently Sized</strong>.
        </>
      ),
    },
    {
      prop: "PaginationPrevious / PaginationNext text",
      type: "string",
      defaultValue: '"Previous" / "Next"',
      description: (
        <>
          <strong>Localize the Visible Label.</strong> The default label appears from the{" "}
          <code>sm</code> breakpoint while the chevron remains visible on smaller screens. Also
          supply a translated <code>aria-label</code>; changing <code>text</code> does not replace
          the English accessible name. Compare the <a href="#pagination-rtl">RTL Example</a>.
        </>
      ),
    },
    {
      prop: "PaginationPrevious / PaginationNext children",
      type: "ComponentChildren",
      defaultValue: "undefined",
      description: (
        <>
          Replace the <strong>Entire Link Content</strong> with your own icon or label. When{" "}
          <code>children</code> is <code>undefined</code> or <code>null</code>, the component
          renders its chevron and responsive <code>text</code> label. Keep a meaningful{" "}
          <code>aria-label</code> for <a href="#pagination-icons-only">Icon-Only Navigation</a>.
        </>
      ),
    },
    {
      prop: "Pagination class",
      type: "string",
      defaultValue: '"mx-auto flex w-full justify-center"',
      description: (
        <>
          Merge classes into the outer <code>nav</code> to adjust{" "}
          <strong>Alignment and Width</strong>. For example, <code>mx-0 w-auto</code> fits
          pagination beside a rows-per-page control. These layout defaults remain unless conflicting
          classes override them; see the <a href="#pagination-icons-only">Compact Table Layout</a>.
        </>
      ),
    },
  ],
  accessibilityText:
    'Active page uses `aria-current="page"`. Previous and next expose `aria-label`. Ellipsis is decorative with `aria-hidden` and a screen-reader-only “More pages” label.',
});
