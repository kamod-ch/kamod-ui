import { docsNavigation } from "../generated-navigation";
import { packageApiReferences } from "./package-api-references";

/** Public component names grouped by their documented entrypoint; no component runtime imports. */
export const componentReferenceNames: Record<string, string> = {
  accordion: "Accordion AccordionContent AccordionItem AccordionTrigger",
  alert: "Alert AlertAction AlertDescription AlertTitle",
  "alert-dialog":
    "AlertDialog AlertDialogAction AlertDialogCancel AlertDialogContent AlertDialogDescription AlertDialogFooter AlertDialogHeader AlertDialogMedia AlertDialogTitle AlertDialogTrigger",
  "aspect-ratio": "AspectRatio",
  avatar: "Avatar AvatarBadge AvatarFallback AvatarGroup AvatarGroupCount AvatarImage",
  badge: "Badge",
  breadcrumb:
    "Breadcrumb BreadcrumbEllipsis BreadcrumbItem BreadcrumbLink BreadcrumbList BreadcrumbPage BreadcrumbSeparator",
  button: "Button",
  "button-group": "ButtonGroup ButtonGroupSeparator ButtonGroupText",
  calendar: "Calendar CalendarDateTimePanel",
  card: "Card CardAction CardContent CardDescription CardFooter CardHeader CardTitle",
  carousel:
    "Carousel CarouselAutoplayPause CarouselContent CarouselItem CarouselNext CarouselPrevious",
  chart: "Chart",
  checkbox: "Checkbox",
  code: "Code CodeFileHeader CodeSnippetLabel",
  collapsible: "Collapsible CollapsibleContent CollapsibleTrigger",
  combobox:
    "Combobox ComboboxChip ComboboxChips ComboboxChipsInput ComboboxClear ComboboxCommand ComboboxContent ComboboxEmpty ComboboxGroup ComboboxInlineInput ComboboxInput ComboboxItem ComboboxList ComboboxSelect ComboboxSeparator ComboboxTrigger ComboboxValue",
  command:
    "Command CommandDialog CommandEmpty CommandGroup CommandInput CommandItem CommandList CommandSeparator CommandShortcut",
  "context-menu":
    "ContextMenu ContextMenuCheckboxItem ContextMenuContent ContextMenuGroup ContextMenuItem ContextMenuLabel ContextMenuRadioGroup ContextMenuRadioItem ContextMenuSeparator ContextMenuShortcut ContextMenuSub ContextMenuSubContent ContextMenuSubTrigger ContextMenuTrigger",
  "data-table": "DataTable",
  "date-picker": "DatePicker",
  dialog:
    "Dialog DialogClose DialogContent DialogDescription DialogFooter DialogHeader DialogPortal DialogTitle DialogTrigger",
  direction: "Direction DirectionProvider",
  drawer:
    "Drawer DrawerClose DrawerContent DrawerDescription DrawerFooter DrawerHeader DrawerTitle DrawerTrigger",
  dropdown:
    "Dropdown DropdownCheckboxItem DropdownContent DropdownGroup DropdownItem DropdownLabel DropdownPortal DropdownRadioGroup DropdownRadioItem DropdownSeparator DropdownShortcut DropdownSub DropdownSubContent DropdownSubTrigger DropdownTrigger",
  dropzone: "Dropzone DropzoneFilesList DropzoneLoadingIndicator DropzoneUploadIndicator",
  empty: "Empty EmptyContent EmptyDescription EmptyHeader EmptyMedia EmptyTitle",
  field:
    "Field FieldContent FieldDescription FieldError FieldGroup FieldLabel FieldLegend FieldSeparator FieldSet FieldTitle",
  "hover-card": "HoverCard HoverCardContent HoverCardTrigger",
  image: "Image",
  input: "Input",
  "input-group":
    "InputGroup InputGroupAddon InputGroupButton InputGroupInput InputGroupText InputGroupTextarea",
  "input-otp":
    "InputOTP InputOTPGroup InputOTPSeparator InputOTPSlot REGEXP_ONLY_DIGITS REGEXP_ONLY_DIGITS_AND_CHARS",
  item: "Item ItemActions ItemContent ItemDescription ItemFooter ItemGroup ItemHeader ItemMedia ItemSeparator ItemTitle",
  kbd: "Kbd KbdGroup",
  label: "Label",
  "locale-segment-group": "LocaleSegmentGroup",
  menubar:
    "Menubar MenubarCheckboxItem MenubarContent MenubarGroup MenubarItem MenubarLabel MenubarMenu MenubarRadioGroup MenubarRadioItem MenubarSeparator MenubarShortcut MenubarSub MenubarSubContent MenubarSubTrigger MenubarTrigger",
  "native-select": "NativeSelect NativeSelectOptGroup NativeSelectOption",
  "navigation-menu":
    "NavigationMenu NavigationMenuContent NavigationMenuItem NavigationMenuLink NavigationMenuList NavigationMenuTrigger",
  pagination:
    "Pagination PaginationContent PaginationEllipsis PaginationItem PaginationLink PaginationNext PaginationPrevious",
  popover:
    "Popover PopoverClose PopoverContent PopoverDescription PopoverHeader PopoverTitle PopoverTrigger",
  progress: "Progress",
  prose: "Prose",
  "radio-group": "RadioGroup RadioGroupItem",
  "scroll-area": "ScrollArea ScrollAreaCorner ScrollBar",
  select:
    "Select SelectContent SelectGroup SelectItem SelectLabel SelectSearch SelectSeparator SelectTrigger SelectValue",
  "selectable-card": "SelectableCard",
  separator: "Separator",
  sheet:
    "Sheet SheetClose SheetContent SheetDescription SheetFooter SheetHeader SheetTitle SheetTrigger",
  sidebar:
    "Sidebar SidebarContent SidebarFooter SidebarGroup SidebarGroupAction SidebarGroupContent SidebarGroupLabel SidebarHeader SidebarInput SidebarInset SidebarMenu SidebarMenuAction SidebarMenuBadge SidebarMenuButton SidebarMenuItem SidebarMenuSkeleton SidebarMenuSub SidebarMenuSubButton SidebarMenuSubItem SidebarProvider SidebarRail SidebarSeparator SidebarTrigger",
  skeleton: "Skeleton",
  slider: "Slider",
  sonner: "Sonner",
  spinner: "Spinner",
  switch: "Switch",
  table: "Table TableBody TableCaption TableCell TableFooter TableHead TableHeader TableRow",
  tabs: "Tabs TabsContent TabsList TabsTrigger",
  textarea: "Textarea",
  "theme-toggle": "ThemeToggle",
  toast: "Toaster",
  toggle: "Toggle",
  "toggle-group": "ToggleGroup ToggleGroupItem",
  tooltip: "Tooltip TooltipContent TooltipProvider TooltipTrigger",
  tree: "Tree TreeExpander TreeIcon TreeItem TreeLabel TreeLines TreeNode TreeNodeActions TreeNodeContent TreeNodeTrigger TreeProvider",
  "type-definition": "TypeDefinition",
  typography: "Typography",
  video: "Video",
};

export type InlineReference = {
  label: string;
  href: string;
  kind: "component" | "block" | "package" | "guide" | "external" | "api";
};
const references = new Map<string, InlineReference>();
function add(label: string, href: string, kind: InlineReference["kind"], ...aliases: string[]) {
  const reference = { label, href, kind };
  for (const name of [label, ...aliases]) references.set(name.toLowerCase(), reference);
}
for (const [slug, names] of Object.entries(componentReferenceNames)) {
  for (const name of names.split(" ")) add(name, `/docs/${slug}/installation`, "component");
}
for (const doc of docsNavigation) {
  if (doc.group === "motion" || references.has(doc.label.toLowerCase())) continue;
  add(
    doc.label,
    `/docs/${doc.slug}/installation`,
    doc.group === "components" ? "component" : "package",
  );
}
for (const [label, slug, count] of [
  ["Sidebar", "sidebar", 16],
  ["Login", "login", 5],
  ["Signup", "signup", 5],
  ["Application Shell", "application-shell", 6],
] as const) {
  for (let index = 1; index <= count; index++) {
    const padded = String(index).padStart(2, "0");
    const id = `${slug}-${slug === "application-shell" ? index : padded}`;
    add(
      `${label} ${index}`,
      `/blocks/${slug}/${id}`,
      "block",
      id,
      `${label.replaceAll(" ", "")}${padded}`,
      `${label.replaceAll(" ", "")}${index}`,
    );
  }
}
for (const [label, href] of Object.entries({
  Components: "/docs/components",
  "Component Library": "/docs/components",
  Blocks: "/blocks",
  "Block Collections": "/blocks",
  Forms: "/docs/forms",
  Packages: "/docs/packages",
  "Getting Started": "/docs/getting-started",
  "Getting Started Guide": "/docs/getting-started",
  "Theming Guide": "/docs/theming/installation",
  "Theme Tokens": "/docs/theming/installation",
  "Component Styles": "/blocks/styles",
  "Block Setup Guide": "/blocks/getting-started",
  "Hooks Guide": "/docs/hooks-package/installation",
  "Icon Guide": "/docs/icons-package/installation",
  "State Guide": "/docs/state-package/installation",
  "Signals Guide": "/docs/signals-package/installation",
  "CSS Guide": "/docs/theming/css-setup",
  "Block Styles": "/blocks/styles",
  "Theming Blocks": "/blocks/theming",
}))
  add(label, href, "guide");
for (const [label, slug] of Object.entries({
  "Kamod Icons": "icons-package",
  "Kamod Hooks": "hooks-package",
  "Kamod Signals": "signals-package",
  "Kamod State": "state-package",
  "Kamod i18n": "i18n-package",
  "UI Motion": "ui-motion",
}))
  add(label, `/docs/${slug}/installation`, "package");
add("Typeset", "https://github.com/kamod-ch/kamod-ui/tree/main/packages/typeset", "package");
add("OpenUI", "https://github.com/kamod-ch/kamod-ui/tree/main/packages/openui", "package");
add("Kamod Motion", "https://github.com/kamod-ch/kamod-motion", "package");
add("Kamod Charts", "https://github.com/kamod-ch/kamod-charts", "package");
add("@formisch/preact", "/docs/formisch/installation", "package");
add("@preact/signals", "https://preactjs.com/guide/v10/signals/", "package");
add("Formisch", "/docs/formisch/installation", "package");
// Companion APIs and third-party packages used by the guides. Technical spellings stay intact.
add("useForm", "/docs/formisch/installation#anatomy", "package");
add("Form", "/docs/formisch/installation#anatomy", "package");
add("FormischForm", "/docs/formisch/installation#anatomy", "package");
add("FormischField", "/docs/formisch/installation#anatomy", "package");
add("FieldArray", "/docs/formisch/installation#array-fields", "package");
add("clsx", "https://github.com/lukeed/clsx", "package");
add("tailwind-merge", "https://github.com/dcastil/tailwind-merge", "package");
add("Zod", "https://zod.dev", "external");
add("Lucide", "https://lucide.dev", "external");
add("Shadcn/ui", "https://ui.shadcn.com/docs/installation", "external", "shadcn");
add("Valibot", "https://valibot.dev/", "external");
add("PreactPress", "https://github.com/kamod-ch/preactpress", "external");
add("Kamod UI", "/docs/getting-started", "package");
add("cn", "/docs/cn/installation", "component");
for (const [label, { href }] of Object.entries(packageApiReferences)) add(label, href, "api");

export const inlineReferences = [...new Set(references.values())];

/** Standalone names only: preserve paths, expressions, literal props and unknown identifiers. */
export function inlineReference(label: string): InlineReference | undefined {
  return references.get(label.trim().toLowerCase());
}
const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// These also name ordinary concepts ("Source Tree", "Table of Contents", etc.).
// Link them in explicit code or authored anchors, rather than guessing from title case alone.
const ambiguousProseNames = new Set([
  "cn",
  "Tree",
  "Item",
  "Image",
  "Table",
  "Progress",
  "Direction",
  "Empty",
  "Field",
  "Label",
  "Prose",
  "Video",
  "Command",
  "Separator",
  "Typography",
  "Select",
  "State",
  "Form",
]);
// Prose uses explicit names, not generic lowercase nouns such as button, input, state or forms.
export const proseReferencePattern = new RegExp(
  `(?<![\\w@/.])(?:${[
    ...new Set(
      [...references.values()]
        .map(({ label }) => label)
        .concat([
          "shadcn",
          "shadcn/ui",
          "valibot",
          "formisch",
          "preactpress",
          "zod",
          "lucide",
          "typeset",
        ]),
    ),
  ]
    .filter((label) => !ambiguousProseNames.has(label))
    .sort((a, b) => b.length - a.length)
    .map(escapePattern)
    .join("|")})(?![\\w/]|\\.[\\w])`,
  "g",
);
