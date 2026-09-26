import { buildDocsPageSlugsLongestFirst } from "./doc-snippet-rewrite";
import { docsShowMotion, isMotionDocSlug } from "./docs-feature-flags";
import { motionComponentEntries } from "./motion/motion-doc-config";
import { accordionDocPage } from "./pages/accordion-doc";
import { alertDialogDocPage } from "./pages/alert-dialog-doc";
import { alertDocPage } from "./pages/alert-doc";
import { aspectRatioDocPage } from "./pages/aspect-ratio-doc";
import { avatarDocPage } from "./pages/avatar-doc";
import { badgeDocPage } from "./pages/badge-doc";
import { breadcrumbDocPage } from "./pages/breadcrumb-doc";
import { bulkActionBarDocPage } from "./pages/bulk-action-bar-doc";
import { buttonDocPage } from "./pages/button-doc";
import { buttonGroupDocPage } from "./pages/button-group-doc";
import { calendarDocPage } from "./pages/calendar-doc";
import { cardDocPage } from "./pages/card-doc";
import { carouselDocPage } from "./pages/carousel-doc";
import { chartDocPage } from "./pages/chart-doc";
import { checkboxDocPage } from "./pages/checkbox-doc";
import { cnDocPage } from "./pages/cn-doc";
import { codeBlockDocPage } from "./pages/code-block-doc";
import { collapsibleDocPage } from "./pages/collapsible-doc";
import { comboboxDocPage } from "./pages/combobox-doc";
import { commandDocPage } from "./pages/command-doc";
import { contextMenuDocPage } from "./pages/context-menu-doc";
import { copyFieldDocPage } from "./pages/copy-field-doc";
import { dataTableDocPage } from "./pages/data-table-doc";
import { datePickerDocPage } from "./pages/date-picker-doc";
import { dateRangePickerDocPage } from "./pages/date-range-picker-doc";
import { descriptionListDocPage } from "./pages/description-list-doc";
import { dialogDocPage } from "./pages/dialog-doc";
import { directionDocPage } from "./pages/direction-doc";
import { drawerDocPage } from "./pages/drawer-doc";
import { dropdownDocPage } from "./pages/dropdown-doc";
import { dropzoneDocPage } from "./pages/dropzone-doc";
import { emptyDocPage } from "./pages/empty-doc";
import { fieldDocPage } from "./pages/field-doc";
import { fileUploadManagerDocPage } from "./pages/file-upload-manager-doc";
import { filterBarDocPage } from "./pages/filter-bar-doc";
import { formischDocPage } from "./pages/formisch-doc";
import { hooksDocPage } from "./pages/hooks-package-doc";
import { hoverCardDocPage } from "./pages/hover-card-doc";
import { i18nDocPage } from "./pages/i18n-package-doc";
import { iconsDocPage } from "./pages/icons-package-doc";
import { imageDocPage } from "./pages/image-doc";
import { inputDocPage } from "./pages/input-doc";
import { inputGroupDocPage } from "./pages/input-group-doc";
import { inputOtpDocPage } from "./pages/input-otp-doc";
import { itemDocPage } from "./pages/item-doc";
import { kbdDocPage } from "./pages/kbd-doc";
import { kpiCardDocPage } from "./pages/kpi-card-doc";
import { labelDocPage } from "./pages/label-doc";
import { localeSegmentGroupDocPage } from "./pages/locale-segment-group-doc";
import { menubarDocPage } from "./pages/menubar-doc";
import { motionAccordionDocPage } from "./pages/motion-accordion-doc";
import { motionAlertDialogDocPage } from "./pages/motion-alert-dialog-doc";
import { motionCollapsibleDocPage } from "./pages/motion-collapsible-doc";
import { motionDialogDocPage } from "./pages/motion-dialog-doc";
import { motionSheetDocPage } from "./pages/motion-sheet-doc";
import { motionTabsDocPage } from "./pages/motion-tabs-doc";
import { multiSelectDocPage } from "./pages/multi-select-doc";
import { nativeSelectDocPage } from "./pages/native-select-doc";
import { navigationMenuDocPage } from "./pages/navigation-menu-doc";
import { notificationCenterDocPage } from "./pages/notification-center-doc";
import { pageHeaderDocPage } from "./pages/page-header-doc";
import { paginationDocPage } from "./pages/pagination-doc";
import { popoverDocPage } from "./pages/popover-doc";
import { progressDocPage } from "./pages/progress-doc";
import { proseDocPage } from "./pages/prose-doc";
import { radioGroupDocPage } from "./pages/radio-group-doc";
import { resizableDocPage } from "./pages/resizable-doc";
import { saveStatusDocPage } from "./pages/save-status-doc";
import { scrollAreaDocPage } from "./pages/scroll-area-doc";
import { selectDocPage } from "./pages/select-doc";
import { selectableCardDocPage } from "./pages/selectable-card-doc";
import { separatorDocPage } from "./pages/separator-doc";
import { sheetDocPage } from "./pages/sheet-doc";
import { shortcutsHelpDocPage } from "./pages/shortcuts-help-doc";
import { sidebarDocPage } from "./pages/sidebar-doc";
import { signalsDocPage } from "./pages/signals-package-doc";
import { skeletonDocPage } from "./pages/skeleton-doc";
import { sliderDocPage } from "./pages/slider-doc";
import { sonnerDocPage } from "./pages/sonner-doc";
import { spinnerDocPage } from "./pages/spinner-doc";
import { stateDocPage } from "./pages/state-package-doc";
import { stepperDocPage } from "./pages/stepper-doc";
import { switchDocPage } from "./pages/switch-doc";
import { tableDocPage } from "./pages/table-doc";
import { tabsDocPage } from "./pages/tabs-doc";
import { tagInputDocPage } from "./pages/tag-input-doc";
import { textareaDocPage } from "./pages/textarea-doc";
import { themeToggleDocPage } from "./pages/theme-toggle-doc";
import { themingDocPage } from "./pages/theming-doc";
import { timelineDocPage } from "./pages/timeline-doc";
import { toastDocPage } from "./pages/toast-doc";
import { toggleDocPage } from "./pages/toggle-doc";
import { toggleGroupDocPage } from "./pages/toggle-group-doc";
import { tooltipDocPage } from "./pages/tooltip-doc";
import { treeDocPage } from "./pages/tree-doc";
import { typographyDocPage } from "./pages/typography-doc";
import { uiMotionDocPage } from "./pages/ui-motion-doc";
import { videoDocPage } from "./pages/video-doc";
import { wizardDocPage } from "./pages/wizard-doc";
import type { ComponentOverviewItem, DocPageModule } from "./types";

export const allDocsPages: DocPageModule[] = [
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
  cnDocPage,
  collapsibleDocPage,
  codeBlockDocPage,
  comboboxDocPage,
  copyFieldDocPage,
  commandDocPage,
  contextMenuDocPage,
  dataTableDocPage,
  datePickerDocPage,
  dateRangePickerDocPage,
  dialogDocPage,
  descriptionListDocPage,
  directionDocPage,
  dropdownDocPage,
  dropzoneDocPage,
  drawerDocPage,
  emptyDocPage,
  fieldDocPage,
  fileUploadManagerDocPage,
  filterBarDocPage,
  formischDocPage,
  hoverCardDocPage,
  imageDocPage,
  iconsDocPage,
  hooksDocPage,
  i18nDocPage,
  signalsDocPage,
  stateDocPage,
  inputDocPage,
  inputOtpDocPage,
  itemDocPage,
  kpiCardDocPage,
  badgeDocPage,
  breadcrumbDocPage,
  bulkActionBarDocPage,
  inputGroupDocPage,
  kbdDocPage,
  labelDocPage,
  localeSegmentGroupDocPage,
  menubarDocPage,
  multiSelectDocPage,
  motionAccordionDocPage,
  motionAlertDialogDocPage,
  motionCollapsibleDocPage,
  motionDialogDocPage,
  motionSheetDocPage,
  motionTabsDocPage,
  navigationMenuDocPage,
  nativeSelectDocPage,
  notificationCenterDocPage,
  pageHeaderDocPage,
  paginationDocPage,
  popoverDocPage,
  progressDocPage,
  proseDocPage,
  radioGroupDocPage,
  resizableDocPage,
  selectableCardDocPage,
  saveStatusDocPage,
  shortcutsHelpDocPage,
  scrollAreaDocPage,
  selectDocPage,
  sonnerDocPage,
  separatorDocPage,
  sheetDocPage,
  sidebarDocPage,
  skeletonDocPage,
  sliderDocPage,
  spinnerDocPage,
  stepperDocPage,
  switchDocPage,
  timelineDocPage,
  wizardDocPage,
  tableDocPage,
  tabsDocPage,
  tagInputDocPage,
  textareaDocPage,
  themeToggleDocPage,
  themingDocPage,
  toastDocPage,
  toggleDocPage,
  toggleGroupDocPage,
  treeDocPage,
  typographyDocPage,
  uiMotionDocPage,
  tooltipDocPage,
  videoDocPage,
];

export const docsPages: DocPageModule[] = docsShowMotion
  ? allDocsPages
  : allDocsPages.filter((page) => !isMotionDocSlug(page.slug) && page.navGroup !== "motion");

/** Longest first so e.g. `navigation-menu` wins over shorter prefixes in import rewriting. */
export const docsPageSlugsLongestFirst: readonly string[] = buildDocsPageSlugsLongestFirst(
  docsPages.map((p) => p.slug),
);

export const docsBySlug = docsPages.reduce<Record<string, DocPageModule>>((acc, page) => {
  acc[page.slug] = page;
  return acc;
}, {});

/** Package docs shown in the Packages sidebar section (not the component grid). */
export const packageDocPages = docsPages.filter((page) => page.navGroup === "packages");

/** Form docs shown before the long Components sidebar section. */
export const formDocPages = docsPages.filter((page) => page.navGroup === "forms");

/** Motion wrapper docs — own sidebar section between Forms and Components. */
export const motionDocPages = docsPages.filter((page) => page.navGroup === "motion");

/** Component docs for the alphabetical sidebar and overview grid. */
export const componentDocPages = docsPages.filter(
  (page) => !page.navGroup || page.navGroup === "components",
);

/**
 * Shown with an "updated" badge in docs and kitchen sink nav.
 * Remove slugs here once the refresh is reflected in release notes so the badge stays meaningful.
 */
export const docsUpdatedComponentSlugs = new Set([
  "popover",
  "tooltip",
  "toggle",
  "toggle-group",
  "tree",
  "typography",
  "textarea",
  "spinner",
  "switch",
  "tabs",
]);

/** Shown with a "new" badge in the Components sidebar and overview grid. */
export const docsNewComponentSlugs = docsShowMotion ? new Set(["ui-motion"]) : new Set<string>();

/** Shown with a "new" badge for package docs. */
export const docsNewPackageSlugs = new Set<string>();

/** Shown with a "new" badge for motion wrapper docs. */
export const docsNewMotionSlugs = docsShowMotion
  ? new Set(motionComponentEntries.map((entry) => entry.slug))
  : new Set<string>();

/** Shown with a "new" badge for form guides. */
export const docsNewFormSlugs = new Set<string>();

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
  { label: "Bulk Action Bar", slug: "bulk-action-bar" },
  { label: "Card", slug: "card" },
  { label: "Carousel", slug: "carousel" },
  { label: "Calendar", slug: "calendar" },
  { label: "Chart", slug: "chart" },
  { label: "Checkbox", slug: "checkbox" },
  { label: "Collapsible", slug: "collapsible" },
  { label: "Code Block", slug: "code-block" },
  { label: "cn Utility", slug: "cn" },
  { label: "Combobox", slug: "combobox" },
  { label: "Copy Field", slug: "copy-field" },
  { label: "Command", slug: "command" },
  { label: "Context Menu", slug: "context-menu" },
  { label: "Data Table", slug: "data-table" },
  { label: "Date Picker", slug: "date-picker" },
  { label: "Date Range Picker", slug: "date-range-picker" },
  { label: "Description List", slug: "description-list" },
  { label: "Direction", slug: "direction" },
  { label: "Dialog", slug: "dialog" },
  { label: "Dropdown", slug: "dropdown" },
  { label: "Dropzone", slug: "dropzone" },
  { label: "Drawer", slug: "drawer" },
  { label: "Empty", slug: "empty" },
  { label: "Field", slug: "field" },
  { label: "File Upload Manager", slug: "file-upload-manager" },
  { label: "Filter Bar", slug: "filter-bar" },
  { label: "Hover Card", slug: "hover-card" },
  { label: "Image", slug: "image" },
  { label: "Input", slug: "input" },
  { label: "Input Group", slug: "input-group" },
  { label: "Input OTP", slug: "input-otp" },
  { label: "Item", slug: "item" },
  { label: "Kbd", slug: "kbd" },
  { label: "KPI Card", slug: "kpi-card" },
  { label: "Label", slug: "label" },
  { label: "Locale Segment Group", slug: "locale-segment-group" },
  { label: "Menubar", slug: "menubar" },
  { label: "Multi Select", slug: "multi-select" },
  { label: "Native Select", slug: "native-select" },
  { label: "Navigation Menu", slug: "navigation-menu" },
  { label: "Notification Center", slug: "notification-center" },
  { label: "Page Header", slug: "page-header" },
  { label: "Pagination", slug: "pagination" },
  { label: "Popover", slug: "popover" },
  { label: "Prose", slug: "prose" },
  { label: "Progress", slug: "progress" },
  { label: "Radio Group", slug: "radio-group" },
  { label: "Resizable Panels", slug: "resizable" },
  { label: "Selectable Card", slug: "selectable-card" },
  { label: "Save Status", slug: "save-status" },
  { label: "Keyboard Shortcuts Help", slug: "shortcuts-help" },
  { label: "Scroll Area", slug: "scroll-area" },
  { label: "Select", slug: "select" },
  { label: "Sonner", slug: "sonner" },
  { label: "Separator", slug: "separator" },
  { label: "Sheet", slug: "sheet" },
  { label: "Sidebar", slug: "sidebar" },
  { label: "Skeleton", slug: "skeleton" },
  { label: "Slider", slug: "slider" },
  { label: "Spinner", slug: "spinner" },
  { label: "Stepper", slug: "stepper" },
  { label: "Switch", slug: "switch" },
  { label: "Timeline", slug: "timeline" },
  { label: "Wizard", slug: "wizard" },
  { label: "Table", slug: "table" },
  { label: "Tabs", slug: "tabs" },
  { label: "Tag Input", slug: "tag-input" },
  { label: "Textarea", slug: "textarea" },
  { label: "Theme Toggle", slug: "theme-toggle" },
  { label: "Theming", slug: "theming" },
  { label: "Toast", slug: "toast" },
  { label: "Toggle", slug: "toggle" },
  { label: "Toggle Group", slug: "toggle-group" },
  { label: "Tree", slug: "tree" },
  { label: "Tooltip", slug: "tooltip" },
  { label: "Typography", slug: "typography" },
  ...(docsShowMotion ? [{ label: "UI Motion", slug: "ui-motion" } as const] : []),
  { label: "Video", slug: "video" },
];

export const motionOverviewItems: ComponentOverviewItem[] = docsShowMotion
  ? motionComponentEntries.map((entry) => ({
      label: entry.navLabel,
      slug: entry.slug,
    }))
  : [];
