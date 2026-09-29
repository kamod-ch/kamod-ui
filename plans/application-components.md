# Plan: Application Components — elf UI-Primitives + Anwendungs-Block

> **Executor instructions**: Diesen Plan vollständig lesen, bevor Code geändert wird. In diesem Schritt **nur analysieren und planen** — keine Implementierung. Folgeschritte: Primitives in `@kamod-ch/ui`, zusammengesetzte Beispiele in `@kamod-ch/blocks`, Docs und Tests. Keine Veröffentlichung, kein Deployment, keine repositoryweiten Refactorings.

## Status

- **Priority:** P1
- **Effort:** XL (11 Komponenten-Bereiche, schrittweise umsetzbar)
- **Risk:** MED–HIGH (Resizable Panels, File Upload Manager, Keyboard-Global-Listener)
- **Depends on:** Plan 004 (Dashboard Foundations) — Core-Primitives **shipped** (`PageHeader`, `KpiCard`, `DescriptionList`, `DateRangePicker`, `FilterBar`); Dashboard-Block noch **pending**; keine harte Blockade
- **Category:** components / application
- **Planned at:** Repository-Snapshot, 2026-09-16

## Warum das relevant ist

Anwendungsoberflächen (Admin, SaaS, interne Tools) wiederholen Muster jenseits von Dashboard-KPIs: Mehrfachauswahl-Aktionen, geführte Flows, Aktivitätsverläufe, Benachrichtigungen, Uploads, Inline-Bearbeitung, Tags, geteilte Layouts, Copy-to-Clipboard, Speicherstatus und Tastaturhilfe. In `@kamod-ch/blocks` existieren bereits einzelne Blöcke (z. B. `notifications-popover`, `command-palette`), aber keine kleinen, wiederverwendbaren Primitives dafür. Die elf geplanten Bereiche schließen diese Lücke in `@kamod-ch/ui`; ein Anwendungs-Block demonstriert die Zusammensetzung ohne Fetching, Router oder globalen Store.

---

## 1. Bestandsaufnahme

### 1.1 Beitragsrichtlinien und Agent-Kontext

| Artefakt | Pfad | Befund |
| -------- | ---- | ------ |
| **AGENTS.md** | — | **Nicht vorhanden** im `kamod-ui`-Repository (auch workspace-weit kein UI-spezifisches AGENTS.md). |
| **CONTRIBUTING.md** | `CONTRIBUTING.md` | Verbindlich: pnpm-Monorepo, Preact, Library-Code in `packages/core`, Docs in `packages/docs`, Conventional Commits, `pnpm typecheck` / `pnpm lint` / Tests vor PR. |
| **Plans-Index** | `plans/README.md` | Pläne 001–004; dieser Plan ist **005**. |
| **Referenzplan** | `plans/dashboard-foundations.md` | Detaillierte Konventionen (Exports, tv, data-slot, i18n, SSR) — hier nicht wiederholen, sondern übernehmen. |

### 1.2 Workspace-Struktur

```
kamod-ui/
├── package.json              # Root: build, test, lint (oxlint), format (oxfmt), typecheck
├── pnpm-workspace.yaml       # packages: "packages/*"
├── CONTRIBUTING.md
├── plans/
│   ├── README.md
│   ├── dashboard-foundations.md
│   └── 001–004-*.md
└── packages/
    ├── core/                 # @kamod-ch/ui — veröffentlichte Primitives (tsup, Vitest)
    ├── blocks/               # @kamod-ch/blocks — private Blöcke + Registry-Metadaten
    ├── docs/                 # @kamod-ch/ui-docs — PreactPress Kitchen Sink, Doc-Pages, Playwright E2E
    ├── themes/               # @kamod-ch/themes
    ├── motion/               # @kamod-ch/ui-motion
    ├── openui/               # @kamod-ch/openui
    └── typeset/              # @kamod-ch/typeset
```

**Package manager:** pnpm (gepinnt in Root-`package.json`).

**Lint/Format:** `oxlint` + `oxfmt` bereits konfiguriert — keine Ergänzung vorgesehen, außer bei neuen Dateien formatieren/linten.

### 1.3 UI-Package und öffentliche Exports

| Aspekt | Detail |
| ------ | ------ |
| Package | `@kamod-ch/ui` |
| Quellpfad | `packages/core/src/` |
| Build | `packages/core/tsup.config.ts` — auto-discovery aller `src/components/*/index.ts` als Subpath-Exports |
| Hauptexport | `@kamod-ch/ui` → `packages/core/src/index.ts` |
| Utils | `@kamod-ch/ui/lib/utils` → `cn()`; `@kamod-ch/ui/lib/signals` → `createControllableSignal` |
| Theme-CSS | `@kamod-ch/ui/theme.css` |
| Peer deps | `preact`, `@preact/signals`, `@kamod-ch/themes` |

Neue Ordner unter `packages/core/src/components/<name>/` erzeugen automatisch `@kamod-ch/ui/<name>`-Exports.

### 1.4 Styling-, Varianten- und Ref-Konventionen

Siehe `plans/dashboard-foundations.md` §1.4. Kurz: `cn`, `tailwind-variants`, Preact `class`, `data-slot`, Callback-Refs, Compound APIs, semantische Tokens, RTL via `dir` + logische Klassen, controlled State via Props/`createControllableSignal`.

### 1.5 i18n-Konventionen

| Aspekt | Detail |
| ------ | ------ |
| UI-Primitives | **Keine hardcodierten Bedienungstexte** — Labels, Placeholder, `aria-label`, Empty-States über Props/`children`. |
| Docs-Teaser | `packages/docs/src/docs/pages/i18n-package-doc.tsx` verweist auf `@kamod-ch/i18n` (separates Paket). |
| Blocks | Demo-Strings in `preview.tsx` / Doc-Fixtures erlaubt; exportierte Default-APIs ohne EN/DE-Festtexte (vgl. `kanban-board`-Pattern). |
| Datum/Zeit | `Intl` + optionale `locale`/`timeZone`-Props; Blocks nutzen `packages/blocks/src/shared/datetime.ts` (`formatDayLabel`, `formatTime`, `classifyDayGroup`). |

### 1.6 Dokumentation und Tests

| Bereich | Pfad | Werkzeug |
| ------- | ---- | -------- |
| Component-Doc-Pages | `packages/docs/src/docs/pages/*-doc.tsx` | `createGenericDocPage()` |
| Doc-Registry | `packages/docs/src/docs/registry.ts` | Slug → DocPageModule |
| Core-Unit-Tests | `packages/core/src/components/**/*.test.tsx` | Vitest + `@testing-library/preact` |
| Blocks-Tests | `packages/blocks/src/**/registry.test.ts` | Vitest |
| E2E / A11y | `packages/docs/e2e/` | Playwright; `pnpm test:a11y` |
| Doc-Snippets | `@/components/kamod-ui/*` Aliase | `scripts/rewrite-kamod-doc-imports.mjs` |

**Hinweis Docs-only:** `packages/docs/src/docs/components/CodeBlock.tsx` nutzt Prism + Clipboard — **nicht** Teil von `@kamod-ch/ui`; ein Core-`CodeBlock` darf Prism **nicht** ohne explizite technische Notwendigkeit einführen.

### 1.7 Registry / Copy-Paste-Mechanismus

| Mechanismus | Pfad | Verhalten |
| ----------- | ---- | --------- |
| Blocks-Registry (Dashboard) | `packages/blocks/src/dashboard/registry.ts` | Metadaten: `id`, `files`, `uiComponents`, `props`, `usage`, `installCommand` |
| Weitere Registries | `sidebar/`, `signup/`, `marketing/`, … | Gleiches `CatalogBlockDefinition`-Schema |
| Docs-UI | `packages/docs/src/blocks/Blocks*Content.tsx` | Live-Preview + Clipboard-Copy von `installCommand` |

Kein shadcn-CLI — Copy-Paste über Docs-Snippets und Block-`installCommand`.

### 1.8 Bereits umgesetzte Dashboard-Primitives (Plan 004 — teilweise)

Plan 004 Core-Primitives sind **shipped** (`packages/core/src/index.ts`); der zusammengesetzte Dashboard-Block fehlt noch in `packages/blocks/src/dashboard/registry.ts`:

| Komponente | Status |
| ---------- | ------ |
| `PageHeader` | ✅ vorhanden |
| `KpiCard` | ✅ vorhanden |
| `DescriptionList` | ✅ vorhanden |
| `DateRangePicker` | ✅ vorhanden |
| `FilterBar` | ✅ vorhanden |
| Block `dashboard-foundations` / `dashboard-workbench` | ⬜ pending |

Diese Primitives sind **Wiederverwendungsbasis** für Application Components (z. B. `PageHeader` + `SaveStatus`, `FilterBar` + Bulk Selection).

---

## 2. Übersicht: elf Bereiche — Bestand vs. Neubau

| # | Bereich | Core-Primitive | Block / Demo | Empfehlung |
| - | ------- | -------------- | ------------ | ---------- |
| 1 | Bulk Action Bar | ❌ | 🔄 Auswahl in `data-table-payments-demo.tsx` | **Neu** — schlanke Toolbar/Bar |
| 2 | Stepper / Wizard | ❌ | 🔄 Drawer-Demo (ad-hoc Stepper) | **Neu** — Stepper + optional Wizard-Shell |
| 3 | Timeline / Activity Feed | ❌ | 🔄 `event-list` (Kalender, nicht Activity) | **Neu** — Timeline-Compound |
| 4 | Notification Center | 🔄 Popover/Tabs/Empty | ✅ `notifications-popover` | **Neu Core** + Block refactoren |
| 5 | File Upload Manager | 🔄 `Dropzone*` | ❌ | **Erweitern** Dropzone-Familie |
| 6 | Inline Edit | ❌ | ❌ | **Neu** |
| 7 | Tag Input / Multi Select | ✅ `Combobox*` multi | 🔄 Combobox-Docs | **Wrapper/Alias** oder Docs-only |
| 8 | Resizable Panels | ❌ | ❌ | **Neu** (höchstes Risiko) |
| 9 | Copy Field / Code Block | 🔄 InputGroup, Kbd | 🔄 Docs `CodeBlock` (Prism) | **Neu Core** ohne Prism |
| 10 | Save Status | ❌ | ❌ | **Neu** |
| 11 | Keyboard Shortcuts Help | 🔄 Command/Kbd | ✅ `command-palette` | **Neu Core** ShortcutsHelp |

Legende: ✅ vorhanden · 🔄 teilweise / nur Block oder Demo · ❌ fehlt

---

## 3. Komponenten-Pläne (Detail)

### 3.1 Bulk Action Bar

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| `DataTable` | `packages/core/src/components/data-table/` | Nur Chrome-Wrapper um `Table` |
| Payments-Demo | `packages/docs/src/docs/pages/data-table-payments-demo.tsx` | Checkbox-Selektion, `selectedCount`-Text — **keine** schwebende Bulk-Bar |
| `FilterBar` | `packages/core/src/components/filter-bar/` | Toolbar-Layout, Chips, Search — analoges Flex-Muster |
| `Button`, `ButtonGroup` | core | Aktionen |
| `Checkbox` | core | Row-Select (Demo nutzt natives `<input type="checkbox">` — Core-`Checkbox` bevorzugen) |

#### API-Vorschlag (Compound)

**Zielpfad:** `packages/core/src/components/bulk-action-bar/` → `@kamod-ch/ui/bulk-action-bar`

```tsx
// BulkActionBar — fixed/sticky bar when selection > 0
type BulkActionBarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Controlled visible state; when omitted, derived from selectedCount > 0 */
  open?: boolean;
  selectedCount?: number;
  /** Consumer-localized, e.g. t('bulk.selected', { count }) */
  label?: ComponentChildren;
  onClearSelection?: () => void;
  /** Clear button accessible name — required when onClearSelection set */
  clearLabel?: string;
};

export {
  BulkActionBar,
  BulkActionBarActions,   // flex gap-2 trailing actions
  BulkActionBarCount,     // tabular-nums count slot
  BulkActionBarDismiss,   // optional close/clear
};
```

**Verhalten:** `role="toolbar"`, `aria-label` vom Consumer; Animation via CSS (`translate-y`, `opacity`); SSR-sicher (kein `window` beim Import). **Kein** Row-Selection-State — nur Darstellung; Selektion bleibt in App/Demo.

**Wiederverwendung:** `FilterBar`-Varianten (`filter-bar-variants.ts`), `Button`, `Separator`, semantische Tokens.

**Block-Beispiel:** `packages/blocks/src/dashboard/bulk-actions-table/` — erweitert Payments-Demo-Muster mit `BulkActionBar`.

---

### 3.2 Stepper / Wizard

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| `Progress` | `packages/core/src/components/progress/` | Fortschrittsbalken, indeterminate |
| `Tabs` | core | Visuell ähnlich, semantisch falsch für Wizard |
| Drawer-Doc | `packages/docs/src/docs/pages/drawer-doc.tsx` | Ad-hoc „Goal stepper“ — **kein** exportiertes Primitive |
| `Button` | core | Back / Next |

#### API-Vorschlag

**Zielpfad:** `packages/core/src/components/stepper/` → `@kamod-ch/ui/stepper`

```tsx
type StepperStep = {
  id: string;
  label: ComponentChildren;
  description?: ComponentChildren;
  optional?: boolean;
};

type StepperProps = JSX.HTMLAttributes<HTMLElement> & {
  steps: StepperStep[];
  /** Controlled active step id */
  value?: string;
  defaultValue?: string;
  onValueChange?: (stepId: string) => void;
  orientation?: "horizontal" | "vertical";
  size?: "default" | "sm";
};

export {
  Stepper,
  StepperList,       // ol role="list"
  StepperItem,       // li
  StepperTrigger,    // button, aria-current="step"
  StepperIndicator,  // number/check icon
  StepperSeparator,
  StepperContent,    // panel for active step (optional compound)
};

// Wizard — thin composition helper (optional same folder or wizard/index.ts)
type WizardProps = {
  steps: StepperStep[];
  value?: string;
  onValueChange?: (stepId: string) => void;
  onComplete?: () => void;
  /** Slot props for back/next/finish — all labels from consumer */
  labels?: { back?: string; next?: string; finish?: string };
  children?: (ctx: { stepId: string; isFirst: boolean; isLast: boolean }) => ComponentChildren;
};
```

**Abgrenzung:** Stepper = Navigation + Status; Wizard = Stepper + Footer-Navigation — **kein** Form-State, **kein** Validierungs-Framework.

**Wiederverwendung:** `Progress` optional unter Stepper; `Badge` für „optional“; RTL: horizontale Liste mit logischen Abständen.

**Block:** `packages/blocks/src/dashboard/onboarding-wizard/` — 3-Schritte-Flow mit lokalisierten Labels in Preview only.

---

### 3.3 Timeline / Activity Feed

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| `Item`, `ItemMedia`, `ItemContent` | core | Zeilen-Layout für Einträge |
| `Avatar`, `Badge`, `Separator` | core | Actor, Status, Trenner |
| `event-list` Block | `packages/blocks/src/dashboard/event-list/` | **Kalender-Events**, nicht generischer Activity Feed |
| Datetime-Helfer | `packages/blocks/src/shared/datetime.ts` | Gruppierung nach Tag — **nach Core portieren oder duplizieren vermeiden**: Helfer optional in `@kamod-ch/ui` unter `lib/datetime` **ohne** neue Dependency |
| `notifications-popover` | blocks | Gruppierte Listen — Pattern, nicht API |

#### API-Vorschlag

**Zielpfad:** `packages/core/src/components/timeline/` → `@kamod-ch/ui/timeline`

```tsx
type TimelineProps = JSX.HTMLAttributes<HTMLOListElement> & {
  orientation?: "vertical" | "horizontal";
};

export {
  Timeline,            // ol data-slot="timeline"
  TimelineItem,        // li
  TimelineSeparator,   // line + dot
  TimelineHeader,      // meta row (time, actor)
  TimelineTitle,
  TimelineDescription,
  TimelineContent,
  TimelineIcon,        // slot for Avatar/icon
};

// Optional convenience — grouping stays consumer-side
type ActivityFeedProps = TimelineProps & {
  /** When set, renders TimelineItem children from data; labels via render props */
  items?: Array<{
    id: string;
    timestamp: Date | string;
    title: ComponentChildren;
    description?: ComponentChildren;
    icon?: ComponentChildren;
  }>;
  locale?: string;
  timeZone?: string;
  formatTimestamp?: (date: Date) => ComponentChildren;
};
```

**Semantik:** `<ol>` für chronologische Liste; `time` mit `dateTime` wenn Consumer ISO liefert.

**Wiederverwendung:** `Item`-Spacing als Referenz, nicht zwingend als Dependency; `ScrollArea` für lange Feeds.

**Block:** `packages/blocks/src/dashboard/activity-feed/` — komponiert `Timeline` + Demo-Fixtures.

---

### 3.4 Notification Center

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| **`notifications-popover`** | `packages/blocks/src/dashboard/notifications-popover/` | ✅ Vollständiger Block: Popover, Tabs All/Unread, Gruppierung, Dismiss, Mark all read |
| `Popover`, `Tabs`, `Empty`, `Badge`, `Button` | core | Bausteine des Blocks |
| `Sonner`, `Toaster`, `useToast` | core | **Toast**-Benachrichtigungen — anderes UX-Muster |
| `classifyDayGroup`, `groupBy` | blocks/shared | Datums-Gruppierung |

#### API-Vorschlag (Core primitive)

**Zielpfad:** `packages/core/src/components/notification-center/` → `@kamod-ch/ui/notification-center`

```tsx
export type NotificationRecord = {
  id: string;
  title: ComponentChildren;
  body?: ComponentChildren;
  createdAt: Date | string;
  read?: boolean;
  href?: string;
  /** Optional action slot id — consumer renders actions */
};

type NotificationCenterProps = {
  items: NotificationRecord[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
  /** All UI strings from consumer */
  labels: {
    title: string;
    markAllRead: string;
    tabAll: string;
    tabUnread: string;
    emptyAll: string;
    emptyUnread: string;
    dismissItem: (item: NotificationRecord) => string;
  };
  locale?: string;
  timeZone?: string;
  trigger?: ComponentChildren | ((state: { unreadCount: number }) => ComponentChildren);
};
```

**Strategie:** Logik/UI aus Block in Core extrahieren; Block wird dünner Wrapper mit Preview-Defaults. **Kein** WebSocket/Polling.

**Wiederverwendung:** Bestehender Block-Code als Startpunkt; `Popover*`, `Tabs*`, `Empty*`.

---

### 3.5 File Upload Manager

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| **`Dropzone`** | `packages/core/src/components/dropzone/Dropzone.tsx` | Drag/drop + hidden file input; `onFilesChange` |
| `DropzoneFilesList` | core | Einfache `<ul>` mit Dateinamen |
| `DropzoneUploadIndicator`, `DropzoneLoadingIndicator` | core | Visuelle Zustände |
| `Progress`, `Button`, `Badge` | core | Upload-Fortschritt, Remove, Status |

#### API-Vorschlag (Erweiterung)

**Bestehenden Ordner erweitern** — kein paralleles Upload-API.

```tsx
// Neue Typen — UploadItem ist rein presentational
export type UploadFileItem = {
  id: string;
  name: string;
  size?: number;
  status?: "pending" | "uploading" | "complete" | "error";
  progress?: number; // 0–100
  errorMessage?: ComponentChildren;
};

// DropzoneUploadList — ersetzt/ergänzt DropzoneFilesList
type DropzoneUploadListProps = {
  items: UploadFileItem[];
  onRemove?: (id: string) => void;
  labels?: { remove?: string; error?: string };
};

// DropzoneUploadManager — Compound root (optional)
// Dropzone + DropzoneUploadList + Empty state
```

**Kein** `fetch`, kein XMLHttpRequest — Consumer setzt `items`/`progress` controlled.

**Wiederverwendung:** Alle bestehenden `Dropzone*`-Komponenten; `Progress` pro Datei; `Item` für Zeilen.

**Block:** `packages/blocks/src/dashboard/file-upload-panel/`.

---

### 3.6 Inline Edit

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| `Input`, `Textarea` | core | Edit-Felder |
| `Button` | core | Save / Cancel |
| `Field`, `Label` | core | Beschriftung |
| `DescriptionList` | core | Explizit **ohne** Edit-Mode (Docs) |

#### API-Vorschlag

**Zielpfad:** `packages/core/src/components/inline-edit/` → `@kamod-ch/ui/inline-edit`

```tsx
type InlineEditProps = {
  value: string;
  defaultEditing?: boolean;
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  multiline?: boolean;
  disabled?: boolean;
  /** Display when not editing */
  children?: ComponentChildren;
  labels?: { edit?: string; save?: string; cancel?: string };
  placeholder?: string;
};
```

**Verhalten:** Click-to-edit oder explicit Edit-Button; Enter speichert (single-line), Escape bricht ab; Focus-Management SSR-sicher in Effects/Hooks, nicht beim Import.

**Wiederverwendung:** `Input`/`Textarea`, `Button variant="ghost"`, `Kbd` optional für Hint.

**Block:** Inline-Titel in `PageHeader`-Demo oder kleiner `settings-inline-form` Block.

---

### 3.7 Tag Input / Multi Select

#### Bestand — **größtenteils vorhanden**

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| **`Combobox`** | `packages/core/src/components/combobox/` | `multiple`, controlled `value`/`onValueChange` |
| **`ComboboxSelect`** | core | Preset für `{ label, value }[]` + multi |
| **`ComboboxChips`**, **`ComboboxChip`**, **`ComboboxChipsInput`** | core | Tag-UI |
| **`Select`** | core | Native single — **nicht** multi |
| Combobox-Docs | `packages/docs/src/docs/pages/combobox-doc.tsx` | Multi-Select-Beispiele |

#### Empfehlung

| Option | Aufwand | Nutzen |
| ------ | ------- | ------ |
| **A: `TagInput` als Thin Alias** | S | Ergonomische API `options` + `value[]` → intern `ComboboxSelect multiple` |
| **B: Nur Docs + Block** | XS | „Tag Input“-Sektion in Combobox-Doc + Block `tag-input-field` |
| **C: Dediziertes Primitive** | L | Duplikat — **abgelehnt** |

**Bevorzugt: Option A** — Ordner `tag-input/` re-exportiert/wrappt Combobox mit festen `data-slot="tag-input"`-Styles.

```tsx
type TagInputProps = {
  options: { label: string; value: string }[];
  value?: string[];
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  maxTags?: number;
  labels?: { removeTag?: string };
};
```

**Keine neue Dependency.** Tests: Delegation zu Combobox + Chip-Remove.

---

### 3.8 Resizable Panels

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| `Sidebar`, `SidebarRail` | core | **Collapse/Toggle**, kein proportionaler Resize (`SidebarRail` = Toggle) |
| `ScrollArea` | core | Panel-Inhalt |
| — | — | **Kein** `PanelGroup` / Splitter |

#### API-Vorschlag

**Zielpfad:** `packages/core/src/components/resizable/` → `@kamod-ch/ui/resizable`

```tsx
type ResizablePanelGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  direction?: "horizontal" | "vertical";
  /** Persisted sizes 0–100; controlled */
  sizes?: number[];
  defaultSizes?: number[];
  onSizesChange?: (sizes: number[]) => void;
};

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,   // separator, keyboard resize, aria-valuenow
};
```

**Implementierung:** Pointer Events + Keyboard (Pfeiltasten); **kein** `react-resizable-panels`; minimaler eigener Code (~150–250 LOC). SSR: Default-Sizes aus Props, Listener nur nach Mount.

**Risiko:** A11y, RTL, Touch — dedizierte Tests + Docs-Beispiel.

**Wiederverwendung:** `Separator`-Styles für Handle; `cn`, semantische Tokens.

**Block:** `packages/blocks/src/dashboard/resizable-workbench/` — Sidebar + Main + Inspector.

---

### 3.9 Copy Field / Code Block

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| **`CodeBlock`** | `packages/docs/src/docs/components/CodeBlock.tsx` | Docs-only; **Prism** + Clipboard |
| `InputGroup`, `InputGroupButton`, `InputGroupInput` | core | Copy-Button-Pattern in Docs |
| `Kbd` | core | Shortcut-Darstellung |
| `Typography` (`inline-code`) | core | Inline-Code-Styling |
| `Prose` | core | Prosa-Container — **kein** Syntax-Highlight |

#### API-Vorschlag

**Zielpfad Copy Field:** `packages/core/src/components/copy-field/` → `@kamod-ch/ui/copy-field`

```tsx
type CopyFieldProps = {
  value: string;
  label?: ComponentChildren;
  /** Consumer-localized */
  copyLabel?: string;
  copiedLabel?: string;
  maskValue?: boolean;
  readOnly?: boolean;
};
```

**Zielpfad Code Block:** `packages/core/src/components/code-block/` → `@kamod-ch/ui/code-block`

```tsx
type CodeBlockProps = {
  code: string;
  language?: string; // für class only, kein Prism
  showLineNumbers?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
};
```

**Clipboard:** `navigator.clipboard` nur in Event-Handler (SSR-sicher). **Kein Prism** — statisches `<pre><code>` mit `font-mono`, optional einfache Zeilennummern via CSS.

**Wiederverwendung:** `InputGroup`-Layout für Copy Field; `Button`/`InputGroupButton` für Copy.

**Block:** `packages/blocks/src/dashboard/api-key-copy/` — Copy Field + CodeBlock für Webhook-Snippet.

---

### 3.10 Save Status

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| `Spinner` | core | Loading |
| `Badge` | core | Status-Chip |
| `Alert` | core | Fehlerhinweis |
| — | — | **Kein** dediziertes Save-Status-Primitive |

#### API-Vorschlag

**Zielpfad:** `packages/core/src/components/save-status/` → `@kamod-ch/ui/save-status`

```tsx
type SaveStatusState = "idle" | "dirty" | "saving" | "saved" | "error";

type SaveStatusProps = JSX.HTMLAttributes<HTMLDivElement> & {
  status: SaveStatusState;
  /** All strings from consumer — no defaults with EN text */
  labels: {
    idle?: ComponentChildren;
    dirty?: ComponentChildren;
    saving?: ComponentChildren;
    saved?: ComponentChildren;
    error?: ComponentChildren;
  };
  errorMessage?: ComponentChildren;
  /** Auto-hide "saved" after ms; 0 = no auto-hide */
  savedVisibleMs?: number;
  live?: boolean; // aria-live polite when saving/saved/error
};
```

**Wiederverwendung:** `Spinner` bei `saving`; `Badge variant` für `dirty`/`saved`; `role="status"` + `aria-live`.

**Block:** Kopfzeilen-Slot in `PageHeader`-Beispiel oder `dashboard-layout`-Integration (nur Docs).

---

### 3.11 Keyboard Shortcuts Help

#### Bestand

| Artefakt | Pfad | Relevanz |
| -------- | ---- | -------- |
| **`Command`**, **`CommandDialog`**, **`CommandShortcut`** | core | Palette + Shortcut-Spalte |
| **`Kbd`**, **`KbdGroup`** | core | Tasten-Darstellung |
| **`command-palette`** Block | `packages/blocks/src/dashboard/command-palette/` | ⌘K-Palette mit Gruppen — **kein** Help-Overlay |
| Sidebar-06 | blocks | Global key listener Pattern (`canUseDOM`, `isEditableTarget`) |

#### API-Vorschlag

**Zielpfad:** `packages/core/src/components/shortcuts-help/` → `@kamod-ch/ui/shortcuts-help`

```tsx
export type ShortcutDefinition = {
  id: string;
  label: ComponentChildren;
  keys: string[]; // e.g. ["⌘", "K"] → rendered via KbdGroup
  group?: string;
};

type ShortcutsHelpProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  shortcuts: ShortcutDefinition[];
  labels: { title: string; description?: string; close?: string };
  /** When true, registers ⌘/ / ? listener — only after mount */
  enableHotkey?: boolean;
  hotkey?: string; // default "?" with shift optional
};
```

**Implementierung:** `CommandDialog` + gruppierte Liste; **kein** globales Command-Bus. Hotkey-Registrierung optional und dokumentiert (vgl. Block-SSR-Helfer `canUseDOM`).

**Wiederverwendung:** `CommandDialog`, `CommandList`, `CommandGroup`, `CommandItem`, `Kbd`, `DialogTitle`.

**Block:** `packages/blocks/src/dashboard/shortcuts-help/` — öffnet Help neben `command-palette`.

---

## 4. Anwendungs-Block (Blocks-Package)

| Aspekt | Wert |
| ------ | ---- |
| ID | `application-workbench` |
| Quellordner | `packages/blocks/src/dashboard/application-workbench/` |
| Export | `@kamod-ch/blocks/dashboard/application-workbench` |
| Install-Command | `@kamod-ch/blocks/dashboard/application-workbench` |

**Komposition (Preview):** `PageHeader` + `SaveStatus` · `BulkActionBar` über selektierbarer Tabelle · `Timeline` · `NotificationCenter` Trigger · `FileUploadManager` · `InlineEdit` · `TagInput` · `ResizablePanelGroup` · `CopyField` · `ShortcutsHelp`.

**Props:** Vollständig slot-/children-basiert; Demo-Daten nur in `preview.tsx`. Kein Fetching.

**Registry:** Eintrag in `packages/blocks/src/dashboard/registry.ts` + `tsup.config.ts` + `registry.test.ts`.

---

## 5. Umsetzungsschritte und Abnahmekriterien

### Phase 0 — Planung (dieser Schritt)

- [x] Bestand analysiert
- [x] `plans/application-components.md` erstellt
- [ ] `plans/README.md` — Zeile **005** hinzufügen (beim Start der Implementierung)

### Phase 1 — Niedriges Risiko, hohe Wiederverwendung

| # | Komponente | Abnahme |
| - | ---------- | ------- |
| 1.1 | `SaveStatus` | States, aria-live, i18n labels, Light/Dark |
| 1.2 | `BulkActionBar` | Toolbar a11y, sichtbar bei selection, RTL |
| 1.3 | `CopyField` | Clipboard in Handler, copied feedback |
| 1.4 | `TagInput` (Alias) | Parität mit Combobox multi |

### Phase 2 — Mittleres Risiko

| # | Komponente | Abnahme |
| - | ---------- | ------- |
| 2.1 | `CodeBlock` | Copy, line numbers, **ohne** Prism |
| 2.2 | `InlineEdit` | Keyboard, cancel, controlled editing |
| 2.3 | `Stepper` (+ optional `Wizard`) | aria-current, horizontal/vertical, RTL |
| 2.4 | `Timeline` / `ActivityFeed` | ol semantics, responsive |

### Phase 3 — Erweiterungen & Extraktion

| # | Komponente | Abnahme |
| - | ---------- | ------- |
| 3.1 | `Dropzone` upload manager pieces | Controlled items, progress display |
| 3.2 | `NotificationCenter` | Feature-Parität mit Block; Block refactored |
| 3.3 | `ShortcutsHelp` | CommandDialog composition, optional hotkey |

### Phase 4 — Hohes Risiko

| # | Komponente | Abnahme |
| - | ---------- | ------- |
| 4.1 | `ResizablePanelGroup` | Pointer + keyboard, RTL, SSR default sizes |

### Phase 5 — Blocks, Docs, QA

| Schritt | Aktion |
| ------- | ------ |
| 5.1 | Pro Primitive: `*-doc.tsx` + `registry.ts` |
| 5.2 | `application-workbench` Block + Registry |
| 5.3 | Unit-Tests pro Primitive; Interaktions- und Fehlerfälle |
| 5.4 | Verifikation Root |

```bash
pnpm --filter @kamod-ch/ui test
pnpm --filter @kamod-ch/ui build
pnpm --filter @kamod-ch/blocks test
pnpm --filter @kamod-ch/blocks build
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test:docs
```

### Gesamt-Abnahmekriterien

- [ ] Elf Bereiche abgedeckt (Tag Input als Alias/Wrap akzeptiert)
- [ ] Kein React/React-DOM; nur Preact + bestehende Peer-Deps
- [ ] Keine hardcodierten Bedienungstexte in Primitives
- [ ] Light/Dark, responsive (320px+), RTL-Beispiele wo sinnvoll
- [ ] SSR-sicher — kein Browserzugriff beim Modulimport
- [ ] Kein Fetching/globaler Store in Darstellungskomponenten
- [ ] Keine neuen Dependencies ohne dokumentierte Notwendigkeit
- [ ] `pnpm test:ci` grün
- [ ] Keine Veröffentlichung

---

## 6. Abhängigkeiten und Risiken

| Risiko | Mitigation |
| ------ | ---------- |
| `ResizablePanelGroup` A11y/Touch | Früh Prototyp + Playwright-Interaktion; Keyboard-Resize |
| Notification Center vs. Block-Duplikat | Block auf Core migrieren, Block nur Preview-Defaults |
| Tag Input vs. Combobox | Alias, keine zweite Implementierung |
| CodeBlock vs. Docs CodeBlock | Core ohne Prism; Docs kann weiter Prism für Markdown nutzen |
| Global shortcut Konflikte | `isEditableTarget`; Hotkey opt-in; Docs-Warnung |
| Upload „Manager“ Scope Creep | Strikt presentational; Upload-Logik beim Consumer |
| Plan 004 README-Status | Plan 004 als DONE markieren wenn `dashboard-foundations` Block fehlt noch |

---

## 7. Dateien-Checkliste (Implementierung)

### Neu (Core) — pro Komponente

```
packages/core/src/components/bulk-action-bar/
packages/core/src/components/stepper/
packages/core/src/components/timeline/
packages/core/src/components/notification-center/
packages/core/src/components/inline-edit/
packages/core/src/components/tag-input/          # optional thin wrap
packages/core/src/components/resizable/
packages/core/src/components/copy-field/
packages/core/src/components/code-block/
packages/core/src/components/save-status/
packages/core/src/components/shortcuts-help/
```

### Erweitert (Core)

```
packages/core/src/components/dropzone/           # UploadList, UploadManager compound
```

### Neu (Docs)

```
packages/docs/src/docs/pages/<component>-doc.tsx   # je Primitive
```

### Neu (Blocks)

```
packages/blocks/src/dashboard/application-workbench/
packages/blocks/src/dashboard/bulk-actions-table/          # optional
packages/blocks/src/dashboard/activity-feed/             # optional
packages/blocks/src/dashboard/file-upload-panel/         # optional
packages/blocks/src/dashboard/resizable-workbench/       # optional
packages/blocks/src/dashboard/shortcuts-help/            # optional
```

### Geändert

```
packages/core/src/index.ts
packages/docs/src/docs/registry.ts
packages/blocks/src/dashboard/registry.ts
packages/blocks/src/dashboard/notifications-popover/   # refactor auf Core
packages/blocks/tsup.config.ts
plans/README.md
```

---

## 8. Zusammenfassung Wiederverwendung

| Primitive | Primäre Wiederverwendung |
| --------- | ------------------------ |
| Bulk Action Bar | `FilterBar`, `Button`, `ButtonGroup`, `Checkbox`, `Separator` |
| Stepper / Wizard | `Progress`, `Button`, `Badge` |
| Timeline | `Item`, `Avatar`, `Badge`, `ScrollArea`; Datetime-Pattern aus blocks/shared |
| Notification Center | Block-Code, `Popover*`, `Tabs*`, `Empty*`, `Badge` |
| File Upload | `Dropzone*`, `Progress`, `Button`, `Item` |
| Inline Edit | `Input`, `Textarea`, `Button`, `Field` |
| Tag Input | **`ComboboxSelect` + `ComboboxChips*` (vorhanden)** |
| Resizable Panels | `Separator`, `ScrollArea` |
| Copy Field / Code Block | `InputGroup*`, `Kbd`, `Button` |
| Save Status | `Spinner`, `Badge`, `Alert` |
| Shortcuts Help | `CommandDialog`, `Command*`, `Kbd`, Block-SSR-Helfer |
