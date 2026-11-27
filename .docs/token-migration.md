# Token-Migration

Stand: 2026-11-27. Inventar für die Erweiterung des Token-Piloten (Button, Input, Badge, Card) auf alle öffentlichen UI-Komponenten. Diese Datei hält den Umfang, die Status und die Umsetzungsgruppen fest. Sie ändert keinen Komponenten-Code.

## Umfang

**70 öffentliche Komponenten** in `@kamod-ch/ui` (`packages/core`). Export, Quellordner und Docs-Seite stimmen überein. Dazu **6 Motion-Komponenten** (`@kamod-ch/ui-motion`), **Typeset** und **OpenUI**.

Blocks bleiben eine eigene Ebene. Ein Button in vielen Blocks zählt nicht als mehrere Komponentenmigrationen.

Quellpfade ohne Paketpräfix liegen unter `packages/core/src/components/`. Motion-Pfade liegen unter `packages/motion/`. Block-Pfade liegen unter `packages/blocks/src/`.

Unterkomponenten stecken in der Zeile der Komponente, wenn sie die Lücke tragen (`DialogOverlay`, `SelectTrigger`, `AvatarBadge`, `CalendarDateTimePanel`, `TabsList`). Portale gibt es bei Dialog, Sheet, Dropdown, Select und Context Menu. Der Overlay liegt auf dem portierten Knoten, die Variable muss also auf `html` beziehungsweise `.dark` stehen.

Fokus läuft bei den angebundenen Komponenten über `ring-ring` oder `ring-outline`. Platzhalter nutzen `placeholder:text-muted-foreground`. Fehler laufen über `aria-invalid` und `--error` beziehungsweise `--destructive`. Ausgewählte Einträge nutzen `--accent` oder `--foreground`.

## Status

78 Einträge (70 UI + 6 Motion + Typeset + OpenUI):

| Status             | Anzahl |
| ------------------ | ------ |
| Bereits angebunden | 43     |
| Migration nötig    | 25     |
| Bewusste Ausnahme  | 10     |

Blocks stehen darunter separat und zählen nicht in diese 78.

### Statusbedeutung

- **Bereits angebunden:** Die vorhandenen Klassen greifen auf passende Theme-Tokens zu.
- **Migration nötig:** Ein visueller Wert umgeht das Theme oder verwendet eine semantisch unpassende Rolle.
- **Bewusste Ausnahme:** Die Komponente hat keine eigene visuelle Gestaltung, verwendet eine technisch notwendige Konstante oder übernimmt einen vom Anwender gelieferten Wert.

## Gruppen für die Umsetzung

In dieser Reihenfolge, weil spätere Zeilen eine gemeinsame Rolle voraussetzen:

1. **Overlay-Scrim.** Eine gemeinsame Rolle `--overlay` zuerst. Watson hat sie schon als `--watson-overlay`. Danach Dialog, Alert Dialog, Sheet, Consent Manager und die drei Motion-Overlays. Der Drawer übernimmt den Scrim vom Sheet.
2. **Schwebende Fläche.** `--popover` und `--popover-foreground` gelten schon für Popover, Dropdown, Select-Inhalt, Menubar, Context Menu, Hover Card, Command und Navigation Menu. Der Tooltip schließt diese Gruppe ab.
3. **Feld.** `--field-height`, `--field-padding-inline`, `--field-font-size` und `--field-radius` existieren. Input nutzt sie. Textarea, Select, Native Select, Input Group und Input OTP folgen derselben Rolle.
4. **Statusfarben.** `--success`, `--info` und `--warning` existieren. Toast und der eine Block-Statuspunkt nutzen sie.
5. **Feste Paletten.** Selectable Card, Locale Segment, Slider, Calendar-Zeitpanel, Avatar-Ring, Tabs-Haarlinie, Skeleton, Prose, Code und Copy Button. Keine gemeinsame neue Rolle, jede Zeile bleibt lokal.

## Migration nötig (25)

| Komponente          | Quelldatei                                             | bereits verwendete Tokens                                                                                                                  | konkrete Lücke                                                                                    | vorgeschlagene Änderung                                                           | Gruppe für die Umsetzung |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------ |
| Dialog              | `dialog/DialogContent.tsx`                             | Panel `bg-background`                                                                                                                      | Overlay `bg-black/50`                                                                             | `bg-overlay` auf dem portierten Overlay                                           | Overlay-Scrim            |
| Alert Dialog        | `alert-dialog/AlertDialogContent.tsx`                  | Panel `bg-background`, Text `text-foreground`                                                                                              | Overlay `bg-black/50`                                                                             | dieselbe Overlay-Rolle                                                            | Overlay-Scrim            |
| Sheet               | `sheet/SheetContent.tsx`                               | Panel `bg-background`                                                                                                                      | Overlay `bg-black/50`                                                                             | dieselbe Overlay-Rolle                                                            | Overlay-Scrim            |
| Consent Manager     | `consent-manager/ConsentManagerContent.tsx`            | Panel `bg-background`, `border-border`                                                                                                     | Overlay `bg-black/50`                                                                             | dieselbe Overlay-Rolle                                                            | Overlay-Scrim            |
| Motion Dialog       | `motion/src/dialog/MotionDialogOverlay.tsx`            | Panel `bg-background`                                                                                                                      | Overlay `bg-black/50`                                                                             | dieselbe Overlay-Rolle                                                            | Overlay-Scrim            |
| Motion Alert Dialog | `motion/src/alert-dialog/MotionAlertDialogOverlay.tsx` | Panel `bg-background`                                                                                                                      | Overlay `bg-black/50`                                                                             | dieselbe Overlay-Rolle                                                            | Overlay-Scrim            |
| Motion Sheet        | `motion/src/sheet/MotionSheetContent.tsx`              | Panel `bg-background`                                                                                                                      | Overlay `bg-black/50`                                                                             | dieselbe Overlay-Rolle                                                            | Overlay-Scrim            |
| Tooltip             | `tooltip/TooltipContent.tsx`                           | Position per Inline-Style                                                                                                                  | Keine Fläche in der Komponente. Die Docs malen `data-slot="tooltip-content"` mit eigener Mischung | Standardfläche `bg-popover text-popover-foreground border-border`                 | Schwebende Fläche        |
| Textarea            | `textarea/Textarea.tsx`                                | `border-input`, `bg-background`, `text-foreground`, `placeholder:text-muted-foreground`, `aria-invalid:border-error`, Fokus `ring-outline` | Höhe und Radius bleiben `min-h-16` und `rounded-lg`                                               | `--field-*` wie beim Input                                                        | Feld                     |
| Select              | `select/SelectTrigger.tsx`                             | Inhalt `bg-popover text-popover-foreground`; Trigger `border-input`, `placeholder:text-muted-foreground`, Fokus `ring-outline`             | Trigger fest `h-8 px-3 rounded-md`                                                                | `--field-height`, `--field-padding-inline`, `--field-radius`                      | Feld                     |
| Native Select       | `native-select/NativeSelect.tsx`                       | `border-input`, `bg-input/30`, `text-foreground`, Fehler `border-error`                                                                    | Größe über `min-h-8` und `text-sm`                                                                | dieselben Feld-Tokens                                                             | Feld                     |
| Input Group         | `input-group/InputGroup.tsx`                           | `border-input`, `dark:bg-input/30`, Fokus `ring-outline`, Fehler `border-error`                                                            | Hülle fest `h-8`                                                                                  | `--field-height`                                                                  | Feld                     |
| Input OTP           | `input-otp/InputOTPSlot.tsx`                           | `border-input`, `bg-background`, Fokus `ring-ring`                                                                                         | Slot fest `size-10`                                                                               | Feldhöhe und Feldradius                                                           | Feld                     |
| Toast               | `toast/Toaster.tsx`                                    | Fläche `bg-popover`, Fehler `bg-destructive/15 text-destructive`                                                                           | Success, Info und Warning nutzen `emerald-500`, `sky-500`, `amber-500`                            | `success`, `info`, `warning`                                                      | Statusfarben             |
| Selectable Card     | `selectable-card/SelectableCard.tsx`                   | Ruhezustand `bg-background border-border`                                                                                                  | Auswahl und Punkt über `black`, `white`, `neutral-*`                                              | `foreground` und `background` für den Indikator, `accent` für die gewählte Fläche | Feste Paletten           |
| Locale Segment      | `locale-segment-group/LocaleSegmentGroup.tsx`          | keine                                                                                                                                      | Aktiv `bg-black text-white`, Ruhe `#f7f4ee` und `neutral-*`                                       | `bg-foreground text-background` und `bg-muted text-muted-foreground`              | Feste Paletten           |
| Slider              | `slider/Slider.tsx`                                    | Thumb-Rand `border-ring`, Fokus `ring-ring`                                                                                                | Thumb `bg-white`, Spur `bg-black` und `dark:bg-zinc-200`                                          | Thumb `bg-card`, Spur `bg-foreground`                                             | Feste Paletten           |
| Calendar            | `calendar/CalendarDateTimePanel.tsx`                   | Tag `bg-primary text-primary-foreground`, Fläche `bg-background`                                                                           | Zeitpanel erzwingt `#1a1a1a`, `#e0e0e0`, `neutral-*`, `text-white`                                | Auswahl über `primary`, Hover über `accent`                                       | Feste Paletten           |
| Avatar              | `avatar/AvatarBadge.tsx`                               | Fläche `bg-muted`, Bildrand `border-border`, Dark-Ring `ring-background`                                                                   | Light-Ring `ring-white`                                                                           | `ring-background` in beiden Modi                                                  | Feste Paletten           |
| Tabs                | `tabs/TabsList.tsx`, `TabsTrigger.tsx`                 | Aktiv `bg-foreground text-background`, Liste `bg-muted`                                                                                    | Haarlinie `ring-black/[0.04]` und `ring-white/[0.06]`, Schatten in `rgb(0 0 0)`                   | `ring-border` beziehungsweise `ring-foreground` mit Alpha                         | Feste Paletten           |
| Motion Tabs         | `motion/src/tabs/MotionTabsIndicator.tsx`              | `bg-background`                                                                                                                            | Dieselbe Haarlinie `ring-black` / `ring-white`                                                    | dieselbe Ring-Rolle wie Tabs                                                      | Feste Paletten           |
| Skeleton            | `skeleton/Skeleton.tsx`                                | Pulse `bg-muted`, Glasrand `border-border`                                                                                                 | Shimmer und Glas nutzen `hsl(var(--muted))`, die Tokens sind fertige Farben                       | `color-mix` mit `var(--muted)` und `var(--background)`                            | Feste Paletten           |
| Prose               | `prose/Prose.tsx`                                      | keine semantische Farbe                                                                                                                    | `prose-neutral` setzt eine eigene Grauskala                                                       | Fließtext auf `foreground`, `muted` und `border`                                  | Feste Paletten           |
| Code                | `code/code.css`, `code-prism-themes.css`               | Typeset und Theme kennen Leserrollen                                                                                                       | Öffentliche Stylesheet-Datei enthält feste Hexwerte                                               | Leserfarben an die vorhandene Code-Token-Palette hängen                           | Feste Paletten           |
| Copy Button         | `copy-button/copy-button.css`                          | Mischt `--success` und `--foreground`                                                                                                      | Fallback `#00bc7d`, `#16a34a`, `#000`, `#fff`                                                     | Nur `--success`, `--foreground`, `--background`                                   | Feste Paletten           |

## Bewusste Ausnahme (10)

| Komponente         | Quelldatei                     | bereits verwendete Tokens                             | konkrete Lücke                                                                 | vorgeschlagene Änderung | Gruppe für die Umsetzung |
| ------------------ | ------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------- | ------------------------ |
| Aspect Ratio       | `aspect-ratio/`                | keine Fläche                                          | Nur ein Seitenverhältnis, keine Fläche oder Schrift                            | keine                   | keine                    |
| Chart              | `chart/Chart.tsx`              | Rahmen `border`, Beschreibung `text-muted-foreground` | Die Serie liefert der Aufrufer; `--chart-1` … `--chart-5` bleiben dessen Werte | keine                   | keine                    |
| Collapsible        | `collapsible/`                 | keine Fläche                                          | Öffnet Inhalt, ohne eigene Farbe                                               | keine                   | keine                    |
| Direction          | `direction/`                   | keine Fläche                                          | Setzt die Schreibrichtung, ohne Fläche                                         | keine                   | keine                    |
| Image              | `image/`                       | keine Fläche                                          | Zeigt die gelieferte Quelle                                                    | keine                   | keine                    |
| Theme Toggle       | `theme-toggle/ThemeToggle.tsx` | keine Fläche                                          | Tauscht Icons im Button, ohne eigene Fläche                                    | keine                   | keine                    |
| Video              | `video/`                       | keine Fläche                                          | Spielt die gelieferte Quelle                                                   | keine                   | keine                    |
| Motion Accordion   | `motion/src/accordion/`        | keine eigene Farbe                                    | Animiert die Kernkomponente, ohne neue Farbe                                   | keine                   | keine                    |
| Motion Collapsible | `motion/src/collapsible/`      | keine eigene Farbe                                    | Animiert die Kernkomponente, ohne neue Farbe                                   | keine                   | keine                    |
| OpenUI             | `packages/openui`              | keine Fläche                                          | Adapter auf die UI-Komponenten, ohne eigene Fläche                             | keine                   | keine                    |

## Bereits angebunden (43)

Diese Klassen treffen die passenden Rollen. Eine weitere Token-Änderung ist dort nicht offen. Gruppe: abgeschlossen.

| Komponente      | Quelldatei                         | bereits verwendete Tokens                                                                  | konkrete Lücke | vorgeschlagene Änderung | Gruppe für die Umsetzung |
| --------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ | -------------- | ----------------------- | ------------------------ |
| Accordion       | `accordion/`                       | `border`, `bg-muted`, `ring-ring`                                                          | keine          | keine                   | abgeschlossen            |
| Alert           | `alert/`                           | `card`, `foreground`, `destructive`, `info`, `success`, `warning`, `primary`, `secondary`  | keine          | keine                   | abgeschlossen            |
| Badge           | `badge/Badge.tsx`                  | `--badge-*`, `foreground`, `primary`, `destructive`, `info`, `success`, `warning`, `error` | keine          | keine                   | abgeschlossen            |
| Breadcrumb      | `breadcrumb/`                      | `foreground`, `muted`                                                                      | keine          | keine                   | abgeschlossen            |
| Button          | `button/Button.tsx`                | `--button-*`, `primary`, `background`, `destructive`, `outline`, `ring`                    | keine          | keine                   | abgeschlossen            |
| Button Group    | `button-group/`                    | `border`, `muted`                                                                          | keine          | keine                   | abgeschlossen            |
| Card            | `card/`                            | `--card-*`, `bg-card`, `text-card-foreground`, `ring-border`                               | keine          | keine                   | abgeschlossen            |
| Carousel        | `carousel/`                        | Button-Variante `outline`                                                                  | keine          | keine                   | abgeschlossen            |
| Checkbox        | `checkbox/Checkbox.tsx`            | `foreground`, `input`, `background`, `ring`, `destructive`                                 | keine          | keine                   | abgeschlossen            |
| Combobox        | `combobox/`                        | `accent`, `secondary`, `input`, `ring`                                                     | keine          | keine                   | abgeschlossen            |
| Command         | `command/`                         | `popover`, `accent`, `muted`                                                               | keine          | keine                   | abgeschlossen            |
| Context Menu    | `context-menu/`                    | `popover`, `accent`, `destructive`; Portal                                                 | keine          | keine                   | abgeschlossen            |
| Data Table      | `data-table/`                      | `card`                                                                                     | keine          | keine                   | abgeschlossen            |
| Date Picker     | `date-picker/`                     | `muted`; das Zeitpanel gehört zum Calendar                                                 | keine          | keine                   | abgeschlossen            |
| Drawer          | `drawer/DrawerContent.tsx`         | Griff `bg-muted`; Overlay kommt vom Sheet                                                  | keine          | keine                   | abgeschlossen            |
| Dropdown        | `dropdown/`                        | `popover`, `accent`, `destructive`; Portal                                                 | keine          | keine                   | abgeschlossen            |
| Dropzone        | `dropzone/`                        | `background`, `muted`, `input`, `primary`                                                  | keine          | keine                   | abgeschlossen            |
| Empty           | `empty/`                           | `muted`                                                                                    | keine          | keine                   | abgeschlossen            |
| Field           | `field/`                           | `destructive`, `muted`                                                                     | keine          | keine                   | abgeschlossen            |
| Hover Card      | `hover-card/HoverCardContent.tsx`  | `popover`, `ring`                                                                          | keine          | keine                   | abgeschlossen            |
| Input           | `input/Input.tsx`                  | `--field-*`, `input`, `outline`, `error`, `muted`                                          | keine          | keine                   | abgeschlossen            |
| Item            | `item/`                            | `accent`, `muted`, `border`, `ring`                                                        | keine          | keine                   | abgeschlossen            |
| Kbd             | `kbd/Kbd.tsx`                      | `muted`, `border`                                                                          | keine          | keine                   | abgeschlossen            |
| Label           | `label/`                           | `foreground`                                                                               | keine          | keine                   | abgeschlossen            |
| Menubar         | `menubar/`                         | `background`, `popover`, `accent`, `destructive`                                           | keine          | keine                   | abgeschlossen            |
| Navigation Menu | `navigation-menu/`                 | `background`, `popover`, `accent`                                                          | keine          | keine                   | abgeschlossen            |
| Pagination      | `pagination/`                      | `muted`                                                                                    | keine          | keine                   | abgeschlossen            |
| Popover         | `popover/PopoverContent.tsx`       | `popover`, `ring-outline`                                                                  | keine          | keine                   | abgeschlossen            |
| Progress        | `progress/Progress.tsx`            | `primary`, `muted`, `border`                                                               | keine          | keine                   | abgeschlossen            |
| Radio Group     | `radio-group/`                     | `primary`, `input`, `background`, `destructive`, `ring`                                    | keine          | keine                   | abgeschlossen            |
| Scroll Area     | `scroll-area/`                     | `border`, `foreground`                                                                     | keine          | keine                   | abgeschlossen            |
| Separator       | `separator/Separator.tsx`          | `bg-border`; `1px` ist die Strichstärke                                                    | keine          | keine                   | abgeschlossen            |
| Sidebar         | `sidebar/`                         | `--sidebar-*`                                                                              | keine          | keine                   | abgeschlossen            |
| Sonner          | `sonner/Sonner.tsx`                | `popover`, `muted`                                                                         | keine          | keine                   | abgeschlossen            |
| Spinner         | `spinner/`                         | `primary`, `muted`; `text-current` übernimmt die Aufruferfarbe                             | keine          | keine                   | abgeschlossen            |
| Switch          | `switch/`                          | `primary`, `input`, `background`, `ring`, `destructive`                                    | keine          | keine                   | abgeschlossen            |
| Table           | `table/`                           | `muted`                                                                                    | keine          | keine                   | abgeschlossen            |
| Toggle          | `toggle/`                          | `accent`, `input`, `muted`, `ring`                                                         | keine          | keine                   | abgeschlossen            |
| Toggle Group    | `toggle-group/`                    | `accent`, `input`, `muted`, `ring`                                                         | keine          | keine                   | abgeschlossen            |
| Tree            | `tree/`                            | `accent`, `background`, `border`, `ring`                                                   | keine          | keine                   | abgeschlossen            |
| Type Definition | `type-definition/`                 | `foreground`, `muted`, `border`, `ring`                                                    | keine          | keine                   | abgeschlossen            |
| Typography      | `typography/`                      | `foreground`, `muted`                                                                      | keine          | keine                   | abgeschlossen            |
| Typeset         | `packages/typeset/src/typeset.css` | `--foreground`, `--background`, `--border`, `--radius`                                     | keine          | keine                   | abgeschlossen            |

## Blocks, separat

Die Block-Familien (Application Shell, Sidebar, App-Sidebar, Login, Signup, Auth, Dashboard, Marketing, Commerce, Communication) setzen die UI-Komponenten zusammen. Das ist keine zusätzliche Komponentenmigration.

| Komponente             | Quelldatei                            | bereits verwendete Tokens  | konkrete Lücke                                                | vorgeschlagene Änderung | Gruppe für die Umsetzung |
| ---------------------- | ------------------------------------- | -------------------------- | ------------------------------------------------------------- | ----------------------- | ------------------------ |
| Sidebar 06 Statuspunkt | `app-sidebar/sidebar-06`              | keine                      | Statuspunkt `bg-emerald-500`                                  | `bg-success`            | Statusfarben             |
| Kamod Icon             | `shared/branding/kamod-icon`          | Markenfarben der Wortmarke | Bewusste Ausnahme: feste Markenfarben                         | keine                   | keine                    |
| Kamod Icon Frame       | `shared/branding/kamod-icon-frame`    | weiße Logo-Platte          | Bewusste Ausnahme: die Platte ist der Logo-Grund              | keine                   | keine                    |
| Theme Picker           | `shared/theme-picker/ThemePicker.tsx` | Preset-Proben              | Bewusste Ausnahme: die Hexwerte sind die Preset-Proben selbst | keine                   | keine                    |

Blocks: **Migration nötig 1**, **Bewusste Ausnahme 3**.
