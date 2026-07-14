import { createLibrary, type DefinedComponent, type Library } from "@openuidev/react-lang";
import {
  accordionComponent,
  alertComponent,
  alertDialogComponent,
  aspectRatioComponent,
  avatarComponent,
  badgeComponent,
  breadcrumbComponent,
  buttonComponent,
  buttonGroupComponent,
  calendarComponent,
  cardComponent,
  chartComponent,
  checkboxComponent,
  collapsibleComponent,
  comboboxComponent,
  commandComponent,
  contextMenuComponent,
  dataTableComponent,
  datePickerComponent,
  dialogComponent,
  dividerComponent,
  drawerComponent,
  dropdownComponent,
  emptyComponent,
  fieldComponent,
  formComponent,
  gridComponent,
  headingComponent,
  hoverCardComponent,
  imageComponent,
  inlineComponent,
  inputComponent,
  inputGroupComponent,
  inputOtpComponent,
  itemComponent,
  kbdComponent,
  labelComponent,
  linkComponent,
  localeSegmentGroupComponent,
  menubarComponent,
  navigationMenuComponent,
  paginationComponent,
  popoverComponent,
  progressComponent,
  proseComponent,
  radioGroupComponent,
  richSelectComponent,
  scrollAreaComponent,
  selectableCardComponent,
  selectComponent,
  sheetComponent,
  sidebarComponent,
  skeletonComponent,
  sliderComponent,
  sonnerComponent,
  spinnerComponent,
  stackComponent,
  submitButtonComponent,
  switchComponent,
  tableComponent,
  tabsComponent,
  textareaComponent,
  textComponent,
  themeToggleComponent,
  toastComponent,
  toggleComponent,
  toggleGroupComponent,
  tooltipComponent,
  videoComponent,
} from "../components";
import {
  type KamodOpenUISecurityPolicy,
  type ResolvedSecurityPolicy,
  resolveSecurityPolicy,
} from "../security/limits";
import type { NavigationPolicy } from "../security/navigation";

export type KamodOpenUIComponentKey =
  | "stack"
  | "inline"
  | "grid"
  | "card"
  | "heading"
  | "text"
  | "divider"
  | "alert"
  | "badge"
  | "progress"
  | "skeleton"
  | "spinner"
  | "empty"
  | "avatar"
  | "label"
  | "tooltip"
  | "button"
  | "link"
  | "tabs"
  | "accordion"
  | "collapsible"
  | "form"
  | "field"
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "radioGroup"
  | "submitButton"
  | "dialog"
  | "alertDialog"
  | "datePicker"
  | "combobox"
  | "richSelect"
  | "slider"
  | "table"
  | "dataTable"
  | "pagination"
  | "breadcrumb"
  | "popover"
  | "hoverCard"
  | "dropdown"
  | "drawer"
  | "sheet"
  | "scrollArea"
  | "image"
  | "video"
  | "inputOtp"
  | "inputGroup"
  | "selectableCard"
  | "item"
  | "buttonGroup"
  | "toggle"
  | "toggleGroup"
  | "command"
  | "calendar"
  | "chart"
  | "toast"
  | "sonner"
  | "sidebar"
  | "navigationMenu"
  | "menubar"
  | "contextMenu"
  | "aspectRatio"
  | "prose"
  | "themeToggle"
  | "kbd"
  | "localeSegmentGroup";

// OpenUI's DefinedComponent default props type is Record<string, unknown>; cast for the registry map.
const ALL_COMPONENTS: Record<KamodOpenUIComponentKey, DefinedComponent<any>> = {
  stack: stackComponent,
  inline: inlineComponent,
  grid: gridComponent,
  card: cardComponent,
  heading: headingComponent,
  text: textComponent,
  divider: dividerComponent,
  alert: alertComponent,
  badge: badgeComponent,
  progress: progressComponent,
  skeleton: skeletonComponent,
  spinner: spinnerComponent,
  empty: emptyComponent,
  avatar: avatarComponent,
  label: labelComponent,
  tooltip: tooltipComponent,
  button: buttonComponent,
  link: linkComponent,
  tabs: tabsComponent,
  accordion: accordionComponent,
  collapsible: collapsibleComponent,
  form: formComponent,
  field: fieldComponent,
  input: inputComponent,
  textarea: textareaComponent,
  select: selectComponent,
  checkbox: checkboxComponent,
  switch: switchComponent,
  radioGroup: radioGroupComponent,
  submitButton: submitButtonComponent,
  dialog: dialogComponent,
  alertDialog: alertDialogComponent,
  datePicker: datePickerComponent,
  combobox: comboboxComponent,
  richSelect: richSelectComponent,
  slider: sliderComponent,
  table: tableComponent,
  dataTable: dataTableComponent,
  pagination: paginationComponent,
  breadcrumb: breadcrumbComponent,
  popover: popoverComponent,
  hoverCard: hoverCardComponent,
  dropdown: dropdownComponent,
  drawer: drawerComponent,
  sheet: sheetComponent,
  scrollArea: scrollAreaComponent,
  image: imageComponent,
  video: videoComponent,
  inputOtp: inputOtpComponent,
  inputGroup: inputGroupComponent,
  selectableCard: selectableCardComponent,
  item: itemComponent,
  buttonGroup: buttonGroupComponent,
  toggle: toggleComponent,
  toggleGroup: toggleGroupComponent,
  command: commandComponent,
  calendar: calendarComponent,
  chart: chartComponent,
  toast: toastComponent,
  sonner: sonnerComponent,
  sidebar: sidebarComponent,
  navigationMenu: navigationMenuComponent,
  menubar: menubarComponent,
  contextMenu: contextMenuComponent,
  aspectRatio: aspectRatioComponent,
  prose: proseComponent,
  themeToggle: themeToggleComponent,
  kbd: kbdComponent,
  localeSegmentGroup: localeSegmentGroupComponent,
};

export type KamodOpenUIConfig = {
  components?: Partial<Record<KamodOpenUIComponentKey, boolean>>;
  security?: KamodOpenUISecurityPolicy;
  navigation?: NavigationPolicy;
  root?: string;
  extend?: DefinedComponent<any>[];
};

export type KamodOpenUILibrary = Library & {
  security: ResolvedSecurityPolicy;
  navigation: NavigationPolicy;
};

function selectComponents(config: KamodOpenUIConfig = {}): DefinedComponent<any>[] {
  const flags = config.components;
  const selected = (Object.keys(ALL_COMPONENTS) as KamodOpenUIComponentKey[])
    .filter((key) => flags?.[key] !== false)
    .map((key) => ALL_COMPONENTS[key]);

  if (config.extend?.length) {
    return [...selected, ...config.extend];
  }
  return selected;
}

/**
 * Create a Kamod OpenUI library. Does not mutate the default library.
 */
export function createKamodOpenUILibrary(config: KamodOpenUIConfig = {}): KamodOpenUILibrary {
  const components = selectComponents(config);
  const library = createLibrary({
    components,
    root: config.root ?? "Stack",
    componentGroups: [
      {
        name: "Layout",
        components: ["Stack", "Inline", "Grid", "Card", "ScrollArea", "AspectRatio"],
        notes: ["Prefer Stack for vertical sections. Avoid deep nesting beyond a few levels."],
      },
      {
        name: "Content",
        components: [
          "Heading",
          "Text",
          "Divider",
          "Label",
          "Avatar",
          "Empty",
          "Image",
          "Video",
          "Item",
          "Prose",
          "Kbd",
        ],
      },
      {
        name: "Feedback",
        components: [
          "Alert",
          "Badge",
          "Progress",
          "Skeleton",
          "Spinner",
          "Tooltip",
          "Toast",
          "Sonner",
          "Chart",
        ],
      },
      {
        name: "Actions",
        components: [
          "Button",
          "ButtonGroup",
          "Link",
          "Tabs",
          "Accordion",
          "Collapsible",
          "Toggle",
          "ToggleGroup",
          "ThemeToggle",
        ],
      },
      {
        name: "Overlays",
        components: [
          "Dialog",
          "AlertDialog",
          "Popover",
          "HoverCard",
          "Dropdown",
          "Drawer",
          "Sheet",
          "Command",
          "ContextMenu",
        ],
      },
      {
        name: "Navigation",
        components: [
          "Breadcrumb",
          "Pagination",
          "Sidebar",
          "NavigationMenu",
          "Menubar",
          "LocaleSegmentGroup",
        ],
      },
      {
        name: "Data",
        components: ["Table", "DataTable", "Calendar"],
      },
      {
        name: "Forms",
        components: [
          "Form",
          "Field",
          "Input",
          "Textarea",
          "Select",
          "RichSelect",
          "Combobox",
          "Checkbox",
          "Switch",
          "RadioGroup",
          "Slider",
          "DatePicker",
          "InputOtp",
          "InputGroup",
          "SelectableCard",
          "SubmitButton",
        ],
        notes: ["Use Form with named fields and a SubmitButton. No custom validators or regex."],
      },
    ],
  }) as KamodOpenUILibrary;

  library.security = resolveSecurityPolicy(config.security);
  library.navigation = config.navigation ?? { allowExternal: false };

  return library;
}

/** Default secure Kamod OpenUI library with the full component set. */
export const kamodOpenUILibrary = createKamodOpenUILibrary();

export { ALL_COMPONENTS };
