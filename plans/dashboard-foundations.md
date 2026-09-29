# Plan: Dashboard Foundations — fünf UI-Primitives + Dashboard-Block

> **Executor instructions**: Diesen Plan vollständig lesen, bevor Code geändert wird. In diesem Schritt **nur analysieren und planen** — keine Implementierung. Folgeschritte: fünf Komponenten in `@kamod-ch/ui`, einen Dashboard-Block in `@kamod-ch/blocks`, Docs und Tests. Keine Veröffentlichung, kein Deployment, keine repositoryweiten Refactorings.

## Status

- **Priority:** P1
- **Effort:** L
- **Risk:** MED
- **Depends on:** —
- **Category:** components / dashboard
- **Planned at:** Repository-Snapshot, 2026-09-16

## Warum das relevant ist

Dashboard-Oberflächen wiederholen dieselben Muster: Seitenkopf, KPI-Kacheln, Schlüssel-Wert-Listen, Datumsbereich und Filterleiste. In `@kamod-ch/blocks` existieren bereits chart-lastige Dashboard-Blöcke (`metrics-grid`, `analytics-overview`, `dashboard-layout`), aber keine kleinen, wiederverwendbaren Primitives dafür. Die fünf geplanten Komponenten schließen diese Lücke in `@kamod-ch/ui`; der Dashboard-Block demonstriert die Zusammensetzung ohne Fetching, Router oder Store.

---

## 1. Bestandsaufnahme

### 1.1 Beitragsrichtlinien und Agent-Kontext

| Artefakt | Pfad | Befund |
| -------- | ---- | ------ |
| **AGENTS.md** | — | **Nicht vorhanden** im `kamod-ui`-Repository. |
| **CONTRIBUTING.md** | `CONTRIBUTING.md` | Verbindliche Richtlinien: pnpm-Monorepo, Preact, Library-Code in `packages/core`, Docs in `packages/docs`, Conventional Commits, `pnpm typecheck` / `pnpm lint` / Tests vor PR. |
| **Plans-Index** | `plans/README.md` | Bestehende Pläne 001–003 (Themes, OpenUI, A11y-CI). Dieser Plan ist **004**. |

### 1.2 Workspace-Struktur

```
kamod-ui/
├── package.json              # Root-Scripts: build, test, lint (oxlint), format (oxfmt)
├── pnpm-workspace.yaml       # packages: "packages/*"
├── pnpm-lock.yaml
├── CONTRIBUTING.md
├── plans/
│   ├── README.md
│   └── 001–003-*.md
└── packages/
    ├── core/                 # @kamod-ch/ui — veröffentlichte Primitives (tsup, Vitest)
    ├── blocks/               # @kamod-ch/blocks — private Blöcke + Registry-Metadaten
    ├── docs/                 # @kamod-ch/ui-docs — Kitchen Sink, Doc-Pages, Playwright E2E
    ├── themes/               # @kamod-ch/themes
    ├── motion/               # @kamod-ch/ui-motion
    ├── openui/               # @kamod-ch/openui
    └── typeset/              # @kamod-ch/typeset
```

**Package manager:** pnpm `11.25.0` (gepinnt in Root-`package.json`).

**Lint/Format:** `oxlint` + `oxfmt` bereits im Root und in `@kamod-ch/ui` / `@kamod-ch/blocks` konfiguriert — keine Ergänzung nötig.

### 1.3 UI-Package und öffentliche Exports

| Aspekt | Detail |
| ------ | ------ |
| Package | `@kamod-ch/ui` v1.3.0 |
| Quellpfad | `packages/core/src/` |
| Build | `packages/core/tsup.config.ts` — auto-discovery aller `src/components/*/index.ts` als Subpath-Exports |
| Hauptexport | `@kamod-ch/ui` → `packages/core/src/index.ts` |
| Utils | `@kamod-ch/ui/lib/utils` → `cn()` (`clsx` + `tailwind-merge`) |
| Theme-CSS | `@kamod-ch/ui/theme.css` |
| Peer deps | `preact`, `@preact/signals`, `@kamod-ch/themes` |

Neue Komponenten-Ordner unter `packages/core/src/components/<name>/` erzeugen automatisch `@kamod-ch/ui/<name>`-Exports (tsup + `package.json`-Exports-Mirror nach Build).

### 1.4 Styling-, Varianten- und Ref-Konventionen

| Konvention | Referenz | Details |
| ---------- | -------- | ------- |
| Klassen-Merge | `packages/core/src/lib/utils.ts` | `cn(...inputs: ClassValue[])` |
| Varianten | `tailwind-variants` (`tv`) | Exportierbare `*Variants`-Objekte (z. B. `card`, `button`, `badge`) |
| Props | Preact `class` (nicht `className`) | `JSX.HTMLAttributes<HTMLElement>` + `VariantProps` |
| Data-Slots | `data-slot="…"` | Debugging, Styling-Hooks (`group/card`, `has-data-[slot=…]`) |
| Refs | Callback-Refs + `...rest` | Kein `forwardRef`; DOM-Elemente spreaden `rest` (inkl. `ref`) |
| Compound API | Card, Breadcrumb, Field, Item | Mehrteilige Komponenten mit benannten Subkomponenten |
| Theme-Tokens | `theme.css`, Tailwind v4 | Semantische Tokens (`bg-card`, `text-muted-foreground`, `border-border`, Dark via `.dark`) |
| RTL | `Calendar.dir`, `DirectionProvider` | `dir="rtl"` auf Containern; logische Klassen bevorzugen (`ms-`, `me-`, `text-start`) |

### 1.5 Vorhandene Primitives (relevant für Dashboard)

| Primitive | Pfad | Dashboard-Relevanz |
| --------- | ---- | ------------------ |
| **Card** | `packages/core/src/components/card/` | Root, Header, Title, Description, Content, Footer, Action; `size: default \| sm` |
| **Breadcrumb** | `packages/core/src/components/breadcrumb/` | `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis` |
| **Button** | `packages/core/src/components/button/` | Varianten, Größen, `asChild`, Anchor-Support |
| **Badge** | `packages/core/src/components/badge/` | Trend-/Status-Badges (`success`, `warning`, `error`, …) |
| **Input** | `packages/core/src/components/input/` | Suchfeld in FilterBar; Größen `sm \| md \| lg` |
| **Calendar** | `packages/core/src/components/calendar/Calendar.tsx` | `mode: "single" \| "range"`, `DateRange`, `numberOfMonths: 1 \| 2`, `dir`, `locale`, `size: sm` |
| **DatePicker** | `packages/core/src/components/date-picker/DatePicker.tsx` | Nur **single**-Mode; `formatDatePickerDisplay`; Default-Placeholder `"Pick a date"` (bestehend, nicht ändern) |
| **Popover** | `packages/core/src/components/popover/` | Controlled `open` / `onOpenChange`; Trigger/Content/Close |
| **Skeleton** | `packages/core/src/components/skeleton/` | `variant: pulse \| shimmer \| glass` für KPI-Loading |
| **Separator** | `packages/core/src/components/separator/` | PageHeader-Trenner, FilterBar-Gruppen |
| **ToggleGroup** | `packages/core/src/components/toggle-group/` | Segment-Filter (`type: single \| multiple`) |
| **Select / NativeSelect** | `packages/core/src/components/select/`, `native-select/` | Dropdown-Filter |
| **Typography** | `packages/core/src/components/typography/` | Semantische Überschriften (`variant: h1–h4`, `muted`, …) |
| **Field / Label** | `packages/core/src/components/field/`, `label/` | Beschriftete Filtercontrols |
| **Item** | `packages/core/src/components/item/` | Listenzeilen (nicht semantisch für dl/dt/dd) |

**Nicht vorhanden (neu zu erstellen):** `PageHeader`, `KpiCard`, `DescriptionList`, `DateRangePicker`, `FilterBar`.

### 1.6 Dokumentation und Tests

| Bereich | Pfad | Werkzeug |
| ------- | ---- | -------- |
| Component-Doc-Pages | `packages/docs/src/docs/pages/*-doc.tsx` | `createGenericDocPage()` |
| Doc-Registry | `packages/docs/src/docs/registry.ts` | Slug → DocPageModule |
| Core-Unit-Tests | `packages/core/src/components/**/*.test.tsx` | Vitest + `@testing-library/preact` |
| Blocks-Tests | `packages/blocks/src/dashboard/registry.test.ts`, Block-spezifische Tests | Vitest |
| E2E / A11y | `packages/docs/e2e/` | Playwright; `pnpm test:a11y` |
| Doc-Snippets | `@/components/kamod-ui/*` Aliase | `scripts/rewrite-kamod-doc-imports.mjs` |

### 1.7 Registry / Copy-Paste-Mechanismus

| Mechanismus | Pfad | Verhalten |
| ----------- | ---- | --------- |
| Blocks-Registry | `packages/blocks/src/dashboard/registry.ts` | Metadaten: `id`, `files`, `uiComponents`, `props`, `usage`, `installCommand` |
| Blocks-Index | `packages/blocks/src/index.ts` | Re-exportiert Dashboard-Registry |
| Docs-UI | `packages/docs/src/blocks/BlocksDashboardContent.tsx` | Live-Preview + **Clipboard-Copy** von `installCommand` (z. B. `@kamod-ch/blocks/dashboard/metrics-grid`) |
| Catalog-URLs | `registry.ts` → `https://uipkge.dev/react/blocks/{id}` | Referenz-Links, kein automatisches Scaffold |

**Kein shadcn-CLI** im Repo — Copy-Paste erfolgt über Docs-Snippets und Block-`installCommand`.

### 1.8 Bestehende Dashboard-Blöcke (Kontext, nicht duplizieren)

| Block | Pfad | Abgrenzung |
| ----- | ---- | ---------- |
| `metrics-grid` | `packages/blocks/src/dashboard/metrics-grid/` | KPI + **Mini-Charts** (Pie/Bar SVG); chart-lastig |
| `dashboard-layout` | `packages/blocks/src/dashboard/dashboard-layout/` | **App-Shell** (Sidebar, sticky Topbar, Breadcrumb im Header) |
| `analytics-overview` | `packages/blocks/src/dashboard/analytics-overview/` | Komplexe Chart-Interaktion |
| `section-card` | `packages/blocks/src/dashboard/shared/section-card.tsx` | Einfache Card-Section-Hülle |

Referenz aus **kamod-ui-pro** (separates Repo, nicht portieren): `PageHeader` in `kamod-ui-pro/packages/blocks/page-layout/src/PageHeader.tsx`, `MetricCard` in `kamod-ui-pro/packages/blocks/metrics/src/MetricCard.tsx` — als API-Inspiration, aber Kamod-Konventionen (Compound, `cn`, `data-slot`) anwenden.

---

## 2. Zuordnung: fünf Komponenten → vorhandene Primitives

| Neue Komponente | Baut auf | Erweiterung vs. Neubau |
| --------------- | -------- | ---------------------- |
| **PageHeader** | `Breadcrumb*`, `Separator`, `Typography`, `Button` (Actions-Slot) | **Neu** — semantischer Seitenkopf (`<header>`), nicht App-Shell-Header |
| **KpiCard** | `Card*`, `Badge`, `Skeleton` | **Neu** — schlanke KPI-Kachel ohne Charts |
| **DescriptionList** | Semantisches `<dl>`, optional `Separator` | **Neu** — kein passendes dl/dt/dd-Primitive |
| **DateRangePicker** | `Popover*`, `Button`, `Calendar` (`mode="range"`) | **Neu als Geschwister** von `DatePicker` — Range-Logik existiert in `Calendar`, nicht in `DatePicker` |
| **FilterBar** | `Input`, `ToggleGroup*`, `Select`/`NativeSelect`, `Button`, `Separator`, `Badge` | **Neu** — Layout-Primitive mit Slots |

---

## 3. Vorgeschlagene öffentliche API

### 3.1 Zielpfade (Core)

| Komponente | Quellordner | Export |
| ---------- | ----------- | ------ |
| Page Header | `packages/core/src/components/page-header/` | `@kamod-ch/ui/page-header` |
| KPI Card | `packages/core/src/components/kpi-card/` | `@kamod-ch/ui/kpi-card` |
| Description List | `packages/core/src/components/description-list/` | `@kamod-ch/ui/description-list` |
| Date Range Picker | `packages/core/src/components/date-range-picker/` | `@kamod-ch/ui/date-range-picker` |
| Filter Bar | `packages/core/src/components/filter-bar/` | `@kamod-ch/ui/filter-bar` |

Zusätzlich Re-Export aus `packages/core/src/index.ts`.

### 3.2 PageHeader (Compound)

```tsx
// packages/core/src/components/page-header/index.ts
export {
  PageHeader,
  PageHeaderActions,
  PageHeaderBreadcrumbs,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderSeparator,
  PageHeaderTitle,
  pageHeader,
  pageHeaderTitle,
} from "./…";

// PageHeader — <header data-slot="page-header">
type PageHeaderProps = JSX.HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
  /** @default false — Separator unter dem Header rendern */
  separator?: boolean;
};

// PageHeaderTitle — rendert <h1> mit tv-Varianten
type PageHeaderTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
  size?: "default" | "sm"; // default: text-2xl; sm: text-xl
};

// PageHeaderDescription — <p class="text-muted-foreground text-sm">
// PageHeaderBreadcrumbs — Wrapper min-w-0 flex-1 (Consumer setzt Breadcrumb*)
// PageHeaderActions — flex shrink-0 gap-2
// PageHeaderContent — vertikaler Stack (Title + Description)
// PageHeaderSeparator — optional, rendert <Separator />
```

**Keine festen Titel/Breadcrumb-Texte** — alles über `children` oder Consumer-Props.

### 3.3 KpiCard (Compound, Card-basiert)

```tsx
// KpiCard — umschließt Card mit KPI-spezifischen data-slots
type KpiCardProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof kpiCard> & {
    loading?: boolean; // rendert Skeleton-Platzhalter statt Value/Description
  };
// kpiCard tv: size default | sm (an Card size angelehnt)

export { KpiCardLabel, KpiCardValue, KpiCardDescription, KpiCardTrend, KpiCardFooter };

// KpiCardLabel — text-muted-foreground text-xs font-medium
// KpiCardValue — text-2xl font-semibold tabular-nums
// KpiCardTrend — Badge-Wrapper; trendDirection?: "up" | "down" | "neutral" → Badge variant
// KpiCardDescription — text-muted-foreground text-xs
// KpiCardFooter — optional sparkline/icon slot (children only, kein Chart built-in)
```

Convenience-Prop-API **nicht** vorsehen — Compound hält Parität mit `Card` und erlaubt i18n-freie Slots.

### 3.4 DescriptionList (Compound, semantisch)

```tsx
// DescriptionList — <dl data-slot="description-list">
type DescriptionListProps = JSX.HTMLAttributes<HTMLDListElement> &
  VariantProps<typeof descriptionList> & {
    /** @default "1" — responsive grid columns at md+ */
    columns?: 1 | 2 | 3;
  };

export {
  DescriptionListItem,   // <div role="none"> wrapper für dt+dd Paar (Grid-Zelle)
  DescriptionTerm,       // <dt>
  DescriptionDetails,    // <dd>
};

// Alternativ flache items-Prop für einfache Fälle (optional, Phase 2):
type DescriptionListItemData = { id: string; term: ComponentChildren; details: ComponentChildren };
// items?: DescriptionListItemData[] — nur wenn Compound in Docs zu verbose ist
```

Layout: CSS Grid mit `gap-x-6 gap-y-4`; RTL via `dir` auf Root + logische Ausrichtung.

### 3.5 DateRangePicker (Geschwister von DatePicker)

```tsx
import type { DateRange } from "../calendar/Calendar"; // re-export

export const formatDateRangeDisplay = (
  range: DateRange | undefined,
  locale?: string,
  options?: Intl.DateTimeFormatOptions,
) => string;

type DateRangePickerProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (next: DateRange | undefined) => void;
  /** Kein Default — Consumer muss setzen (i18n) */
  placeholder?: string;
  /** Label wenn nur `from` gesetzt — Consumer muss setzen */
  partialPlaceholder?: string;
  closeOnComplete?: boolean; // @default true — schließt Popover wenn from+to gesetzt
  numberOfMonths?: 1 | 2;   // @default 2
  align?: "start" | "center" | "end";
  triggerIcon?: "chevron" | "calendar" | "none";
  format?: (range: DateRange | undefined) => string;
  locale?: string;
  dir?: "ltr" | "rtl";
  disabled?: CalendarDisabledProp;
  children?: ComponentChildren; // custom PopoverTrigger
};
```

Intern: `Popover` + `Button variant="outline"` + `Calendar mode="range"` — analog `DatePicker.tsx`, aber Range-Selektion und `formatDateRangeDisplay` exportieren.

### 3.6 FilterBar (Compound, slot-basiert)

```tsx
// FilterBar — <div role="toolbar" data-slot="filter-bar"> flex flex-wrap gap-2
type FilterBarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  /** Erforderlich für a11y wenn Toolbar sichtbar */
  "aria-label"?: string;
};

export { FilterBarGroup, FilterBarDivider, FilterBarSpacer };

// FilterBarGroup — inline-flex gap-1.5 (ToggleGroup, Select, DateRangePicker)
// FilterBarDivider — Separator orientation vertical
// FilterBarSpacer — ms-auto / grow für trailing Actions

// Kein eingebautes Search-Input — Consumer komponiert:
// <FilterBar aria-label={t('filters')}>
//   <Input type="search" placeholder={t('search')} … />
//   <FilterBarDivider />
//   <ToggleGroup …>…</ToggleGroup>
//   <FilterBarSpacer />
//   <DateRangePicker … />
// </FilterBar>
```

### 3.7 Dashboard-Block (Blocks-Package)

| Aspekt | Wert |
| ------ | ---- |
| ID | `dashboard-foundations` |
| Quellordner | `packages/blocks/src/dashboard/dashboard-foundations/` |
| Export | `@kamod-ch/blocks/dashboard/dashboard-foundations` |
| Install-Command | `@kamod-ch/blocks/dashboard/dashboard-foundations` |

```tsx
export type DashboardFoundationsProps = {
  /** PageHeader-Inhalt — vollständig über children/slots, keine festen Strings im Block */
  header?: ComponentChildren;
  /** FilterBar-Inhalt */
  filters?: ComponentChildren;
  /** KPI-Daten — Consumer liefert Labels/Werte (keine Demo-Defaults mit EN-Text) */
  kpis?: Array<{
    id: string;
    label: ComponentChildren;
    value: ComponentChildren;
    description?: ComponentChildren;
    trend?: ComponentChildren;
    trendDirection?: "up" | "down" | "neutral";
  }>;
  /** Description-List-Einträge */
  details?: Array<{
    id: string;
    term: ComponentChildren;
    details: ComponentChildren;
  }>;
  /** Optional: DateRangePicker-Slot (controlled vom Consumer) */
  dateRangeSlot?: ComponentChildren;
  locale?: string;
  class?: string;
};

export const DashboardFoundations = (props: DashboardFoundationsProps) => …;
```

**Preview-Modus** (Docs): Demo-Strings nur in `preview.tsx` / Doc-Beispiel, nicht in der exportierten Default-API (analog `kanban-board`-Pattern: leere/`undefined`-Defaults, Fixtures separat).

---

## 4. Umsetzungsschritte und Abnahmekriterien

### Phase A — Core-Primitives (je Komponente gleiches Muster)

| Schritt | Aktion | Abnahme |
| ------- | ------ | ------- |
| A1 | Ordner + Implementierung unter `packages/core/src/components/<name>/` | `data-slot`, `cn`, `tv`, Preact-only, SSR-sicher (kein `window` beim Import) |
| A2 | `index.ts` + Re-Export in `packages/core/src/index.ts` | `@kamod-ch/ui/<name>` nach Build |
| A3 | Unit-Tests `*.test.tsx` | Rendering, Varianten-Merge, kontrollierte States, Edge Cases |
| A4 | Doc-Page `packages/docs/src/docs/pages/<name>-doc.tsx` | Installation, Examples (inkl. RTL für DateRangePicker), API-Tabelle |
| A5 | Eintrag in `packages/docs/src/docs/registry.ts` | Slug erreichbar in Docs-App |

**Verifikation (Root):**

```bash
pnpm --filter @kamod-ch/ui test
pnpm --filter @kamod-ch/ui build
pnpm typecheck
pnpm lint
pnpm format:check
```

### Phase B — Kompatible Erweiterungen bestehender Komponenten

| Primitive | Erweiterung | Kompatibilität |
| --------- | ----------- | -------------- |
| `DatePicker` | **Keine Breaking Changes** | Single-Mode unverändert; Range als separates `DateRangePicker` |
| `Calendar` | Optional: Export `formatDateRangeDisplay`-Helfer aus `date-range-picker` (nicht Calendar ändern) | Bestehende `mode="range"`-API unverändert |
| `Card` | Keine Änderung nötig | KpiCard komponiert Card-Subkomponenten |
| `Badge` | Keine Änderung nötig | KpiCardTrend mappt `trendDirection` → Badge-`variant` |

### Phase C — Dashboard-Block

| Schritt | Aktion | Abnahme |
| ------- | ------ | ------- |
| C1 | `dashboard-foundations/dashboard-foundations.tsx` + `index.ts` | Komponiert alle fünf Primitives |
| C2 | `preview.tsx` mit Demo-Fixtures (nur Docs) | Live-Preview in Blocks-Dashboard |
| C3 | Registry-Eintrag in `packages/blocks/src/dashboard/registry.ts` | `dashboardBlocks`, `dashboardBlocksById` |
| C4 | tsup-Entry in `packages/blocks/tsup.config.ts` | Build-Export |
| C5 | `registry.test.ts` erweitern | Snapshot/Export-Test für neue Block-ID |
| C6 | `BlocksDashboardContent.tsx` — automatisch via Registry | Copy-Install-Command funktioniert |

**Verifikation:**

```bash
pnpm --filter @kamod-ch/blocks test
pnpm --filter @kamod-ch/blocks build
pnpm test:docs
```

### Phase D — plans/README.md

| Schritt | Aktion |
| ------- | ------ |
| D1 | Zeile **004 \| Dashboard Foundations** mit Status TODO hinzufügen |

### Gesamt-Abnahmekriterien

- [ ] Fünf neue `@kamod-ch/ui`-Exports buildbar und typisiert
- [ ] Kein React/React-DOM; nur Preact + bestehende Peer-Deps
- [ ] Keine hardcodierten DE/EN-Bedienungstexte in Primitives (Placeholder/aria via Props)
- [ ] Light/Dark via semantische Tokens; responsive Layouts (320px+ für KPI-Grid)
- [ ] RTL: DateRangePicker + DescriptionList mit `dir`-Support demonstriert
- [ ] Bestehende `DatePicker`- und `Calendar`-Tests weiter grün
- [ ] Dashboard-Block ohne Fetching/Router/Store
- [ ] `pnpm test:ci` grün (Scope: ui + blocks + docs unit)
- [ ] Keine Veröffentlichung

---

## 5. Notwendige kompatible Erweiterungen bestehender Komponenten

### 5.1 DateRangePicker (neues Geschwister, nicht DatePicker erweitern)

**Begründung:** `DatePicker` ist single-only mit Default-Placeholder `"Pick a date"`. Ein `mode`-Prop wäre API-Erweiterung mit Rückwärtskompatibilitäts-Risiko. `Calendar` hat Range bereits (`DateRange`, `mode="range"`, `numberOfMonths`).

**Umsetzung:** Neuer Ordner `date-range-picker/` spiegelt Popover-Trigger-Muster aus `DatePicker.tsx` (Zeilen 90–124), nutzt `Calendar mode="range"`.

**Docs-Referenz:** Range-Komposition existiert bereits in `packages/docs/src/docs/pages/date-picker-doc.tsx` (manuell) — DateRangePicker kapselt dieses Pattern.

### 5.2 KpiCard vs. metrics-grid

**Kein Refactor** von `metrics-grid`. Optional später: Block kann intern `KpiCard` für Headline-Zeilen nutzen — **out of scope** für ersten Slice.

### 5.3 PageHeader vs. dashboard-layout

**Kein Refactor** von `dashboard-layout`. Langfristig kann `dashboard-layout` optional `PageHeader` im Content-Bereich empfehlen — **out of scope**.

### 5.4 LocaleSegmentGroup-Hinweis

`LocaleSegmentGroup` hat Default `aria-label="Language"` und Default-Optionen `DE/EN` — **nicht ändern** in diesem Plan. FilterBar soll `aria-label` vom Consumer verlangen; keine Wiederverwendung von `LocaleSegmentGroup` für generische Filter.

### 5.5 Export-Helfer

| Helfer | Ort | Export |
| ------ | --- | ------ |
| `formatDateRangeDisplay` | `date-range-picker/DateRangePicker.tsx` | `@kamod-ch/ui/date-range-picker` + Root-Re-Export |
| `DateRange` (Type) | bereits in `@kamod-ch/ui/calendar` | Re-Export aus `date-range-picker` für DX |

---

## Abhängigkeiten und Risiken

| Risiko | Mitigation |
| ------ | ---------- |
| DateRangePicker TZ-Drift | `Calendar`-Konvention: noon-normalisierte Dates; Docs-Hinweis wie in `calendar-doc.tsx` |
| KPI-Grid vs. metrics-grid Verwechslung | Klare Docs-Abgrenzung: KpiCard = Primitive ohne Chart; metrics-grid = Block mit SVG |
| A11y Toolbar | FilterBar: `role="toolbar"` + required `aria-label` in Typen/Docs |
| Bundle-Größe | Tree-shakeable Subpath-Exports; keine neuen Runtime-Deps |

---

## Dateien-Checkliste (Implementierung)

### Neu (Core)

```
packages/core/src/components/page-header/
  PageHeader.tsx, index.ts, PageHeader.test.tsx
packages/core/src/components/kpi-card/
  KpiCard.tsx, index.ts, KpiCard.test.tsx
packages/core/src/components/description-list/
  DescriptionList.tsx, index.ts, DescriptionList.test.tsx
packages/core/src/components/date-range-picker/
  DateRangePicker.tsx, index.ts, DateRangePicker.test.tsx
packages/core/src/components/filter-bar/
  FilterBar.tsx, index.ts, FilterBar.test.tsx
```

### Neu (Docs)

```
packages/docs/src/docs/pages/page-header-doc.tsx
packages/docs/src/docs/pages/kpi-card-doc.tsx
packages/docs/src/docs/pages/description-list-doc.tsx
packages/docs/src/docs/pages/date-range-picker-doc.tsx
packages/docs/src/docs/pages/filter-bar-doc.tsx
```

### Neu (Blocks)

```
packages/blocks/src/dashboard/dashboard-foundations/
  dashboard-foundations.tsx
  preview.tsx
  index.ts
  dashboard-foundations.test.tsx  (optional, minimal)
```

### Geändert

```
packages/core/src/index.ts
packages/docs/src/docs/registry.ts
packages/blocks/src/dashboard/registry.ts
packages/blocks/src/dashboard/index.ts
packages/blocks/tsup.config.ts
plans/README.md
```
