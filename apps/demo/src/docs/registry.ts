import { accordionDocPage } from "./pages/accordion-doc";
import { alertDocPage } from "./pages/alert-doc";
import { alertDialogDocPage } from "./pages/alert-dialog-doc";
import { aspectRatioDocPage } from "./pages/aspect-ratio-doc";
import { avatarDocPage } from "./pages/avatar-doc";
import { badgeDocPage } from "./pages/badge-doc";
import { breadcrumbDocPage } from "./pages/breadcrumb-doc";
import { buttonDocPage } from "./pages/button-doc";
import { buttonGroupDocPage } from "./pages/button-group-doc";
import { calendarDocPage } from "./pages/calendar-doc";
import { cardDocPage } from "./pages/card-doc";
import { carouselDocPage } from "./pages/carousel-doc";
import { chartDocPage } from "./pages/chart-doc";
import { checkboxDocPage } from "./pages/checkbox-doc";
import { collapsibleDocPage } from "./pages/collapsible-doc";
import { comboboxDocPage } from "./pages/combobox-doc";
import { commandDocPage } from "./pages/command-doc";
import { contextMenuDocPage } from "./pages/context-menu-doc";
import { dataTableDocPage } from "./pages/data-table-doc";
import { datePickerDocPage } from "./pages/date-picker-doc";
import { dialogDocPage } from "./pages/dialog-doc";
import { directionDocPage } from "./pages/direction-doc";
import { dropdownDocPage } from "./pages/dropdown-doc";
import { dropzoneDocPage } from "./pages/dropzone-doc";
import { drawerDocPage } from "./pages/drawer-doc";
import { emptyDocPage } from "./pages/empty-doc";
import { fieldDocPage } from "./pages/field-doc";
import { hoverCardDocPage } from "./pages/hover-card-doc";
import { imageDocPage } from "./pages/image-doc";
import { inputDocPage } from "./pages/input-doc";
import { inputGroupDocPage } from "./pages/input-group-doc";
import { inputOtpDocPage } from "./pages/input-otp-doc";
import { itemDocPage } from "./pages/item-doc";
import { kbdDocPage } from "./pages/kbd-doc";
import { labelDocPage } from "./pages/label-doc";
import { menubarDocPage } from "./pages/menubar-doc";
import { navigationMenuDocPage } from "./pages/navigation-menu-doc";
import { nativeSelectDocPage } from "./pages/native-select-doc";
import { paginationDocPage } from "./pages/pagination-doc";
import { popoverDocPage } from "./pages/popover-doc";
import { progressDocPage } from "./pages/progress-doc";
import { proseDocPage } from "./pages/prose-doc";
import { radioGroupDocPage } from "./pages/radio-group-doc";
import { scrollAreaDocPage } from "./pages/scroll-area-doc";
import { selectDocPage } from "./pages/select-doc";
import { sonnerDocPage } from "./pages/sonner-doc";
import { separatorDocPage } from "./pages/separator-doc";
import { sheetDocPage } from "./pages/sheet-doc";
import { sidebarDocPage } from "./pages/sidebar-doc";
import { skeletonDocPage } from "./pages/skeleton-doc";
import { sliderDocPage } from "./pages/slider-doc";
import { spinnerDocPage } from "./pages/spinner-doc";
import { switchDocPage } from "./pages/switch-doc";
import { tableDocPage } from "./pages/table-doc";
import { tabsDocPage } from "./pages/tabs-doc";
import { textareaDocPage } from "./pages/textarea-doc";
import { themeToggleDocPage } from "./pages/theme-toggle-doc";
import { themingDocPage } from "./pages/theming-doc";
import { toastDocPage } from "./pages/toast-doc";
import { toggleDocPage } from "./pages/toggle-doc";
import { toggleGroupDocPage } from "./pages/toggle-group-doc";
import { typographyDocPage } from "./pages/typography-doc";
import { tooltipDocPage } from "./pages/tooltip-doc";
import { videoDocPage } from "./pages/video-doc";
import { buildDocsPageSlugsLongestFirst } from "./doc-snippet-rewrite";
import type { ComponentOverviewItem, DocPageModule } from "./types";

export const docsPages: DocPageModule[] = [
  accordionDocPage,
  alertDocPage,
  alertDialogDocPage,
  aspectRatioDocPage,
  avatarDocPage,
  buttonDocPage,
  buttonGroupDocPage,
  calendarDocPage,
  cardDocPage,
  carouselDocPage,
  chartDocPage,
  checkboxDocPage,
  collapsibleDocPage,
  comboboxDocPage,
  commandDocPage,
  contextMenuDocPage,
  dataTableDocPage,
  datePickerDocPage,
  dialogDocPage,
  directionDocPage,
  dropdownDocPage,
  dropzoneDocPage,
  drawerDocPage,
  emptyDocPage,
  fieldDocPage,
  hoverCardDocPage,
  imageDocPage,
  inputDocPage,
  inputOtpDocPage,
  itemDocPage,
  badgeDocPage,
  breadcrumbDocPage,
  inputGroupDocPage,
  kbdDocPage,
  labelDocPage,
  menubarDocPage,
  navigationMenuDocPage,
  nativeSelectDocPage,
  paginationDocPage,
  popoverDocPage,
  progressDocPage,
  proseDocPage,
  radioGroupDocPage,
  scrollAreaDocPage,
  selectDocPage,
  sonnerDocPage,
  separatorDocPage,
  sheetDocPage,
  sidebarDocPage,
  skeletonDocPage,
  sliderDocPage,
  spinnerDocPage,
  switchDocPage,
  tableDocPage,
  tabsDocPage,
  textareaDocPage,
  themeToggleDocPage,
  themingDocPage,
  toastDocPage,
  toggleDocPage,
  toggleGroupDocPage,
  typographyDocPage,
  tooltipDocPage,
  videoDocPage,
];

/** Longest first so e.g. `navigation-menu` wins over shorter prefixes in import rewriting. */
export const docsPageSlugsLongestFirst: readonly string[] = buildDocsPageSlugsLongestFirst(
  docsPages.map((p) => p.slug),
);

export const docsBySlug = docsPages.reduce<Record<string, DocPageModule>>((acc, page) => {
  acc[page.slug] = page;
  return acc;
}, {});

/**
 * Shown with an "updated" badge in docs and kitchen sink nav.
 * Remove slugs here once the refresh is reflected in release notes so the badge stays meaningful.
 */
export const docsUpdatedComponentSlugs = new Set([
  "popover",
  "tooltip",
  "toggle",
  "toggle-group",
  "typography",
  "textarea",
  "spinner",
  "switch",
  "tabs",
]);

export const componentOverviewItems: ComponentOverviewItem[] = [
  { label: "Accordion", slug: "accordion" },
  { label: "Alert", slug: "alert" },
  { label: "Alert Dialog", slug: "alert-dialog" },
  { label: "Aspect Ratio", slug: "aspect-ratio" },
  { label: "Avatar", slug: "avatar" },
  { label: "Badge", slug: "badge" },
  { label: "Breadcrumb", slug: "breadcrumb" },
  { label: "Button", slug: "button" },
  { label: "Button Group", slug: "button-group" },
  { label: "Card", slug: "card" },
  { label: "Carousel", slug: "carousel" },
  { label: "Calendar", slug: "calendar" },
  { label: "Chart", slug: "chart" },
  { label: "Checkbox", slug: "checkbox" },
  { label: "Collapsible", slug: "collapsible" },
  { label: "Combobox", slug: "combobox" },
  { label: "Command", slug: "command" },
  { label: "Context Menu", slug: "context-menu" },
  { label: "Data Table", slug: "data-table" },
  { label: "Date Picker", slug: "date-picker" },
  { label: "Direction", slug: "direction" },
  { label: "Dialog", slug: "dialog" },
  { label: "Dropdown", slug: "dropdown" },
  { label: "Dropzone", slug: "dropzone" },
  { label: "Drawer", slug: "drawer" },
  { label: "Empty", slug: "empty" },
  { label: "Field", slug: "field" },
  { label: "Hover Card", slug: "hover-card" },
  { label: "Image", slug: "image" },
  { label: "Input", slug: "input" },
  { label: "Input Group", slug: "input-group" },
  { label: "Input OTP", slug: "input-otp" },
  { label: "Item", slug: "item" },
  { label: "Kbd", slug: "kbd" },
  { label: "Label", slug: "label" },
  { label: "Menubar", slug: "menubar" },
  { label: "Native Select", slug: "native-select" },
  { label: "Navigation Menu", slug: "navigation-menu" },
  { label: "Pagination", slug: "pagination" },
  { label: "Popover", slug: "popover" },
  { label: "Prose", slug: "prose" },
  { label: "Progress", slug: "progress" },
  { label: "Radio Group", slug: "radio-group" },
  { label: "Scroll Area", slug: "scroll-area" },
  { label: "Select", slug: "select" },
  { label: "Sonner", slug: "sonner" },
  { label: "Separator", slug: "separator" },
  { label: "Sheet", slug: "sheet" },
  { label: "Sidebar", slug: "sidebar" },
  { label: "Skeleton", slug: "skeleton" },
  { label: "Slider", slug: "slider" },
  { label: "Spinner", slug: "spinner" },
  { label: "Switch", slug: "switch" },
  { label: "Table", slug: "table" },
  { label: "Tabs", slug: "tabs" },
  { label: "Textarea", slug: "textarea" },
  { label: "Theme Toggle", slug: "theme-toggle" },
  { label: "Theming", slug: "theming" },
  { label: "Toast", slug: "toast" },
  { label: "Toggle", slug: "toggle" },
  { label: "Toggle Group", slug: "toggle-group" },
  { label: "Tooltip", slug: "tooltip" },
  { label: "Typography", slug: "typography" },
  { label: "Video", slug: "video" },
];
