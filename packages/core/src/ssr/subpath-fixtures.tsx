import { type ComponentChildren, type ComponentType, h, type VNode } from "preact";
import { RadioGroup } from "../components/radio-group/RadioGroup";

export type ModuleNamespace = Record<string, unknown>;

type AnyComponent = ComponentType<Record<string, unknown>>;

export function componentNames(mod: ModuleNamespace): string[] {
  return Object.keys(mod)
    .filter((name) => /^[A-Z]/.test(name) && typeof mod[name] === "function")
    .sort();
}

function part(mod: ModuleNamespace, name: string): AnyComponent {
  const value = mod[name];
  if (typeof value !== "function") {
    throw new Error(`Export ${name} is not a component`);
  }
  return value as AnyComponent;
}

function el(
  mod: ModuleNamespace,
  name: string,
  props?: Record<string, unknown> | null,
  children?: ComponentChildren,
) {
  return h(part(mod, name), props ?? null, children);
}

const EXTRA: Record<string, Record<string, unknown>> = {
  AlertCallout: { title: "Note" },
  AspectRatio: { ratio: 16 / 9, children: "Media" },
  AvatarImage: { alt: "Ada" },
  BreadcrumbLink: { href: "#home" },
  Calendar: {},
  Chart: { title: "Usage" },
  Checkbox: { "aria-label": "Accept terms" },
  Code: { code: "const value = 1;" },
  CopyButton: { value: "copy me" },
  DropzoneFilesList: { files: [] },
  DatePicker: {},
  Image: { alt: "Preview" },
  Input: { "aria-label": "Email" },
  InputGroupInput: { "aria-label": "Search" },
  InputGroupTextarea: { "aria-label": "Notes" },
  LocaleSegmentGroup: { value: "en", onValueChange: () => {} },
  NativeSelect: { "aria-label": "Fruit" },
  PaginationLink: { href: "#page" },
  PaginationNext: { href: "#next" },
  PaginationPrevious: { href: "#prev" },
  Progress: { value: 40 },
  SidebarInput: { "aria-label": "Search" },
  Slider: { defaultValue: [30] },
  Switch: { "aria-label": "Notifications" },
  Textarea: { "aria-label": "Message" },
  Toggle: { "aria-label": "Bold" },
  TypeDefinition: { title: "Button", typeName: "ButtonProps", children: "type ButtonProps = {}" },
  Video: { "aria-label": "Preview" },
};

const VOID = new Set([
  "AvatarImage",
  "Checkbox",
  "Image",
  "Input",
  "InputGroupInput",
  "InputGroupTextarea",
  "NativeSelect",
  "Progress",
  "Separator",
  "SidebarInput",
  "Slider",
  "Spinner",
  "Switch",
  "Textarea",
]);

function standaloneTree(mod: ModuleNamespace): VNode<any> {
  return h(
    "div",
    null,
    componentNames(mod).map((name) => {
      const props = { ...EXTRA[name] };
      const children = props.children ?? (VOID.has(name) ? undefined : name);
      delete props.children;
      return h(part(mod, name), { ...props, key: name }, children as ComponentChildren);
    }),
  );
}

const compositions: Record<string, (mod: ModuleNamespace) => VNode<any>> = {
  accordion: (m) =>
    el(m, "Accordion", { type: "single", collapsible: true, defaultValue: "a" }, [
      el(m, "AccordionItem", { value: "a", key: "a" }, [
        el(m, "AccordionTrigger", null, "Section"),
        el(m, "AccordionContent", null, "Body"),
      ]),
    ]),
  "alert-dialog": (m) =>
    el(m, "AlertDialog", { defaultOpen: true, lockBodyScroll: false }, [
      el(m, "AlertDialogTrigger", null, "Delete"),
      el(m, "AlertDialogContent", { forceMount: true }, [
        el(m, "AlertDialogHeader", null, [
          el(m, "AlertDialogMedia", null, "Icon"),
          el(m, "AlertDialogTitle", null, "Delete item"),
          el(m, "AlertDialogDescription", null, "This cannot be undone."),
        ]),
        el(m, "AlertDialogFooter", null, [
          el(m, "AlertDialogCancel", null, "Cancel"),
          el(m, "AlertDialogAction", null, "Delete"),
        ]),
      ]),
    ]),
  avatar: (m) =>
    h("div", null, [
      el(m, "Avatar", { key: "one" }, [
        el(m, "AvatarImage", { alt: "Ada", src: "" }),
        el(m, "AvatarFallback", null, "A"),
        el(m, "AvatarBadge"),
      ]),
      el(m, "AvatarGroup", { key: "group" }, [
        el(m, "Avatar", { key: "member" }, el(m, "AvatarFallback", null, "B")),
        el(m, "AvatarGroupCount", null, "+2"),
      ]),
    ]),
  breadcrumb: (m) =>
    el(m, "Breadcrumb", null, [
      el(m, "BreadcrumbList", null, [
        el(
          m,
          "BreadcrumbItem",
          { key: "home" },
          el(m, "BreadcrumbLink", { href: "#home" }, "Home"),
        ),
        el(m, "BreadcrumbSeparator", { key: "sep" }),
        el(m, "BreadcrumbItem", { key: "docs" }, el(m, "BreadcrumbPage", null, "Docs")),
        el(m, "BreadcrumbItem", { key: "more" }, el(m, "BreadcrumbEllipsis")),
      ]),
    ]),
  carousel: (m) =>
    el(m, "Carousel", { label: "Slides", autoplay: false, plugins: [] }, [
      el(m, "CarouselContent", null, el(m, "CarouselItem", null, "Slide")),
      el(m, "CarouselPrevious"),
      el(m, "CarouselNext"),
      el(m, "CarouselAutoplayPause"),
    ]),
  collapsible: (m) =>
    el(m, "Collapsible", { defaultOpen: true }, [
      el(m, "CollapsibleTrigger", null, "Details"),
      el(m, "CollapsibleContent", null, "Hidden copy"),
    ]),
  code: (m) =>
    el(m, "CodeReferenceProvider", { resolve: () => undefined }, [
      el(m, "Code", { code: "const value = 1;\n" }),
      el(m, "CodeFileHeader", { path: "src/example.ts", code: "const value = 1;\n" }),
      el(m, "CodeSnippetLabel", {
        code: "const value = 1;",
        language: "typescript",
        importsOnly: false,
      }),
    ]),
  combobox: (m) => {
    const apple = { label: "Apple", value: "apple" };
    return h("div", null, [
      el(
        m,
        "Combobox",
        {
          key: "parts",
          items: [apple],
          liftedFilter: true,
          defaultOpen: true,
          itemKey: (item: { value: string }) => item.value,
          itemToStringValue: (item: { label: string }) => item.label,
        },
        [
          el(m, "ComboboxTrigger", null, el(m, "ComboboxValue", { placeholder: "Pick" })),
          el(m, "ComboboxInlineInput", { "aria-label": "Filter inline" }),
          el(m, "ComboboxContent", { forceMount: true }, [
            el(m, "ComboboxCommand", null, [
              el(m, "ComboboxInput", { "aria-label": "Filter" }),
              el(m, "ComboboxList", null, [
                el(m, "ComboboxEmpty", null, "None"),
                el(m, "ComboboxGroup", null, el(m, "ComboboxItem", { item: apple }, "Apple")),
                el(m, "ComboboxSeparator"),
              ]),
            ]),
          ]),
          el(m, "ComboboxChips", null, [
            el(m, "ComboboxChip", { key: "apple" }, "Apple"),
            el(m, "ComboboxChipsInput", { "aria-label": "Add" }),
          ]),
          el(m, "ComboboxClear"),
        ],
      ),
      el(m, "ComboboxSelect", { key: "preset", options: [apple] }),
    ]);
  },
  command: (m) =>
    h("div", null, [
      el(m, "Command", { key: "palette" }, [
        el(m, "CommandInput", { "aria-label": "Search commands" }),
        el(m, "CommandList", null, [
          el(m, "CommandEmpty", null, "No results"),
          el(m, "CommandGroup", { heading: "Actions" }, [
            el(m, "CommandItem", { value: "open" }, ["Open", el(m, "CommandShortcut", null, "⌘O")]),
          ]),
          el(m, "CommandSeparator"),
        ]),
      ]),
      el(m, "CommandDialog", { key: "dialog", defaultOpen: true }, "Search"),
    ]),
  "context-menu": (m) =>
    el(m, "ContextMenu", { defaultOpen: true }, [
      el(m, "ContextMenuTrigger", null, "Right click"),
      el(m, "ContextMenuContent", null, [
        el(m, "ContextMenuLabel", null, "Edit"),
        el(m, "ContextMenuGroup", null, [
          el(m, "ContextMenuItem", null, "Cut"),
          el(m, "ContextMenuCheckboxItem", { checked: true }, "Wrap"),
        ]),
        el(m, "ContextMenuSeparator"),
        el(m, "ContextMenuRadioGroup", { value: "sm" }, [
          el(m, "ContextMenuRadioItem", { value: "sm" }, "Small"),
        ]),
        el(m, "ContextMenuSub", null, [
          el(m, "ContextMenuSubTrigger", null, "Share"),
          el(m, "ContextMenuSubContent", null, el(m, "ContextMenuItem", { key: "email" }, "Email")),
        ]),
        el(m, "ContextMenuShortcut", null, "⌘C"),
      ]),
    ]),
  dialog: (m) =>
    el(m, "Dialog", { defaultOpen: true, lockBodyScroll: false }, [
      el(m, "DialogTrigger", null, "Open"),
      el(
        m,
        "DialogPortal",
        { forceMount: true },
        el(m, "DialogContent", { forceMount: true }, [
          el(m, "DialogHeader", null, [
            el(m, "DialogTitle", null, "Title"),
            el(m, "DialogDescription", null, "Description"),
          ]),
          el(m, "DialogFooter", null, el(m, "DialogClose", null, "Close")),
        ]),
      ),
    ]),
  drawer: (m) =>
    el(m, "Drawer", { defaultOpen: true, lockBodyScroll: false }, [
      el(m, "DrawerTrigger", null, "Open"),
      el(m, "DrawerContent", { forceMount: true }, [
        el(m, "DrawerHeader", null, [
          el(m, "DrawerTitle", null, "Drawer"),
          el(m, "DrawerDescription", null, "Details"),
        ]),
        el(m, "DrawerFooter", null, el(m, "DrawerClose", null, "Close")),
      ]),
    ]),
  dropdown: (m) =>
    el(m, "Dropdown", { defaultOpen: true }, [
      el(m, "DropdownTrigger", null, "Menu"),
      el(
        m,
        "DropdownPortal",
        null,
        el(m, "DropdownContent", { forceMount: true }, [
          el(m, "DropdownLabel", null, "Account"),
          el(m, "DropdownGroup", null, [
            el(m, "DropdownItem", null, ["Profile", el(m, "DropdownShortcut", null, "⌘P")]),
            el(m, "DropdownCheckboxItem", { checked: true }, "Show panel"),
          ]),
          el(m, "DropdownSeparator"),
          el(m, "DropdownRadioGroup", { value: "sm" }, [
            el(m, "DropdownRadioItem", { value: "sm" }, "Small"),
          ]),
          el(m, "DropdownSub", null, [
            el(m, "DropdownSubTrigger", null, "Share"),
            el(m, "DropdownSubContent", null, el(m, "DropdownItem", { key: "email" }, "Email")),
          ]),
        ]),
      ),
    ]),
  "hover-card": (m) =>
    el(m, "HoverCard", { defaultOpen: true }, [
      el(m, "HoverCardTrigger", null, "Ada"),
      el(m, "HoverCardContent", { "aria-label": "Profile" }, "Profile"),
    ]),
  item: (m) =>
    el(m, "ItemGroup", null, [
      el(m, "Item", { role: "listitem" }, [
        el(m, "ItemMedia", null, "M"),
        el(m, "ItemContent", null, [
          el(m, "ItemHeader", null, el(m, "ItemTitle", null, "Title")),
          el(m, "ItemDescription", null, "Description"),
        ]),
        el(m, "ItemActions", null, "Edit"),
        el(m, "ItemFooter", null, "Footer"),
      ]),
      el(m, "Item", { key: "divider", role: "listitem" }, el(m, "ItemSeparator")),
    ]),
  "input-otp": (m) =>
    el(m, "InputOTP", { maxLength: 4, "aria-label": "One time code" }, [
      el(m, "InputOTPGroup", null, [
        el(m, "InputOTPSlot", { index: 0, key: "0" }),
        el(m, "InputOTPSeparator"),
        el(m, "InputOTPSlot", { index: 1, key: "1" }),
      ]),
    ]),
  menubar: (m) =>
    el(m, "Menubar", null, [
      el(m, "MenubarMenu", null, [
        el(m, "MenubarTrigger", null, "File"),
        el(m, "MenubarLabel", null, "File"),
        el(m, "MenubarGroup", null, [
          el(m, "MenubarItem", null, ["New", el(m, "MenubarShortcut", null, "⌘N")]),
          el(m, "MenubarCheckboxItem", { checked: true }, "Autosave"),
        ]),
        el(m, "MenubarSeparator"),
        el(m, "MenubarRadioGroup", { value: "light" }, [
          el(m, "MenubarRadioItem", { value: "light" }, "Light"),
        ]),
        el(m, "MenubarSub", null, [
          el(m, "MenubarSubTrigger", null, "Share"),
          el(m, "MenubarSubContent", null, "Email"),
        ]),
        el(m, "MenubarContent"),
      ]),
    ]),
  "navigation-menu": (m) =>
    el(m, "NavigationMenu", null, [
      el(m, "NavigationMenuList", null, [
        el(m, "NavigationMenuItem", { value: "docs", key: "docs" }, [
          el(m, "NavigationMenuTrigger", null, "Docs"),
          el(
            m,
            "NavigationMenuContent",
            null,
            el(m, "NavigationMenuLink", { href: "#docs" }, "Guide"),
          ),
        ]),
      ]),
    ]),
  pagination: (m) =>
    el(m, "Pagination", null, [
      el(m, "PaginationContent", null, [
        el(m, "PaginationItem", { key: "prev" }, el(m, "PaginationPrevious", { href: "#prev" })),
        el(
          m,
          "PaginationItem",
          { key: "page" },
          el(m, "PaginationLink", { href: "#1", isActive: true }, "1"),
        ),
        el(m, "PaginationItem", { key: "more" }, el(m, "PaginationEllipsis")),
        el(m, "PaginationItem", { key: "next" }, el(m, "PaginationNext", { href: "#next" })),
      ]),
    ]),
  popover: (m) =>
    el(m, "Popover", { defaultOpen: true }, [
      el(m, "PopoverTrigger", null, "Open"),
      el(m, "PopoverContent", { forceMount: true }, [
        el(m, "PopoverHeader", null, [
          el(m, "PopoverTitle", null, "Title"),
          el(m, "PopoverDescription", null, "Description"),
        ]),
        el(m, "PopoverClose", null, "Close"),
      ]),
    ]),
  "radio-group": (m) =>
    el(m, "RadioGroup", { defaultValue: "a", "aria-label": "Choice" }, [
      el(m, "RadioGroupItem", { value: "a", key: "a" }, "A"),
    ]),
  "scroll-area": (m) =>
    el(m, "ScrollArea", null, [
      el(m, "ScrollBar", { key: "y" }),
      el(m, "ScrollAreaCorner"),
      "Content",
    ]),
  select: (m) =>
    el(m, "Select", { defaultValue: "apple" }, [
      el(
        m,
        "SelectTrigger",
        { "aria-label": "Fruit" },
        el(m, "SelectValue", { placeholder: "Fruit" }),
      ),
      el(m, "SelectSearch", { "aria-label": "Filter fruit" }),
      el(m, "SelectContent", { forceMount: true }, [
        el(m, "SelectGroup", null, [
          el(m, "SelectLabel", null, "Fruit"),
          el(m, "SelectItem", { value: "apple" }, "Apple"),
        ]),
        el(m, "SelectSeparator"),
      ]),
    ]),
  "selectable-card": (m) =>
    h(RadioGroup, { defaultValue: "card", "aria-label": "Plan" }, [
      el(m, "SelectableCard", { value: "card" }, "Card"),
    ]),
  sheet: (m) =>
    el(m, "Sheet", { defaultOpen: true, lockBodyScroll: false }, [
      el(m, "SheetTrigger", null, "Open"),
      el(m, "SheetContent", { forceMount: true }, [
        el(m, "SheetHeader", null, [
          el(m, "SheetTitle", null, "Sheet"),
          el(m, "SheetDescription", null, "Details"),
        ]),
        el(m, "SheetFooter", null, el(m, "SheetClose", null, "Close")),
      ]),
    ]),
  sidebar: (m) =>
    el(m, "SidebarProvider", { defaultOpen: true }, [
      el(m, "Sidebar", { collapsible: "none" }, [
        el(m, "SidebarHeader", null, el(m, "SidebarTrigger", { "aria-label": "Toggle sidebar" })),
        el(m, "SidebarContent", null, [
          el(m, "SidebarGroup", null, [
            el(m, "SidebarGroupLabel", null, "Group"),
            el(m, "SidebarGroupAction", { "aria-label": "Add" }, "+"),
            el(m, "SidebarGroupContent", null, [
              el(m, "SidebarInput", { "aria-label": "Search" }),
              el(m, "SidebarSeparator"),
              el(m, "SidebarMenu", null, [
                el(m, "SidebarMenuItem", null, [
                  el(m, "SidebarMenuButton", null, "Home"),
                  el(m, "SidebarMenuAction", { "aria-label": "More" }),
                  el(m, "SidebarMenuBadge", null, "3"),
                  el(m, "SidebarMenuSub", null, [
                    el(
                      m,
                      "SidebarMenuSubItem",
                      null,
                      el(m, "SidebarMenuSubButton", null, "Nested"),
                    ),
                  ]),
                ]),
                el(m, "SidebarMenuSkeleton"),
              ]),
            ]),
          ]),
        ]),
        el(m, "SidebarFooter", null, "Footer"),
        el(m, "SidebarRail"),
      ]),
      el(m, "SidebarInset", null, "Page"),
    ]),
  tabs: (m) =>
    el(m, "Tabs", { defaultValue: "one" }, [
      el(m, "TabsList", null, [
        el(m, "TabsTrigger", { value: "one", key: "one" }, "One"),
        el(m, "TabsTrigger", { value: "two", key: "two" }, "Two"),
      ]),
      el(m, "TabsContent", { value: "one" }, "Panel"),
    ]),
  "toggle-group": (m) =>
    el(m, "ToggleGroup", { type: "single", "aria-label": "Format" }, [
      el(m, "ToggleGroupItem", { value: "bold", "aria-label": "Bold" }, "B"),
    ]),
  tooltip: (m) =>
    el(m, "TooltipProvider", null, [
      el(m, "Tooltip", { defaultOpen: true }, [
        el(m, "TooltipTrigger", null, "Hint"),
        el(m, "TooltipContent", { forceMount: true }, "Help"),
      ]),
    ]),
  tree: (m) =>
    el(m, "TreeProvider", { defaultExpandedIds: ["docs"] }, [
      el(m, "Tree", { "aria-label": "Files" }, [
        el(m, "TreeItem", { nodeId: "docs", label: "Docs", endContent: "More" }, [
          el(m, "TreeItem", { nodeId: "readme", label: "README" }),
        ]),
      ]),
    ]),
};

export function fixtureFor(subpath: string, mod: ModuleNamespace): VNode<any> | null {
  if (componentNames(mod).length === 0) return null;
  const compose = compositions[subpath];
  return compose ? compose(mod) : standaloneTree(mod);
}
