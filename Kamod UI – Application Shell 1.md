# Kamod UI – Application Shell 1

## Ziel

Die Referenz **Application Shell 1** von Shadcnblocks wird als Preact-native Kamod-Komposition umgesetzt. Die Shell besteht aus:

- einer einklappbaren Desktop-Sidebar mit Icon-Modus
- einer mobilen Off-canvas-Sidebar
- gruppierter Navigation mit aufklappbaren Untermenüs
- Logo-/Produktbereich im Sidebar-Header
- Benutzerbereich mit Avatar und Dropdown im Sidebar-Footer
- Kopfzeile mit Sidebar-Trigger, Separator und Breadcrumbs
- frei belegbarem Content-Bereich

Referenz: https://www.shadcnblocks.com/block/application-shell1

## Architekturentscheidung

Die App-Shell gehört **nicht in `packages/core`**. Kamod UI enthält bereits die benötigten Primitives. Sie soll als zusammengesetzter Block unter `packages/blocks` entstehen. Falls `packages/blocks` auf dem aktuellen Branch noch nicht existiert, wird ein kleines Workspace-Paket `@kamod-ch/blocks` angelegt.

Der Block soll nicht nur einen statischen Screenshot nachbauen. Er erhält eine kleine, router-unabhängige Daten-API:

- `brand`
- `navigationGroups`
- `user`
- `breadcrumbs`
- `children`
- optional `currentPath`
- optional `onNavigate`
- optional kontrollierbarer Sidebar-Zustand, soweit die vorhandene Kamod-Sidebar-API dies bereits unterstützt

Keine neue State-Library ist nötig. Sidebar-Zustand und Overlays werden von den vorhandenen Kamod-Komponenten verwaltet; Navigation und Demo-Daten bleiben einfache Props beziehungsweise Konstanten.

## Bestehende Kamod-Bausteine

| Funktion                        | Kamod UI                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell und responsive Navigation | `SidebarProvider`, `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarInset`, `SidebarRail`, `SidebarTrigger`                 |
| Navigationsgruppen              | `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`                                                                         |
| Navigationseinträge             | `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuAction`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`                       |
| Untermenüs                      | `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`                                                                                         |
| Breadcrumbs                     | `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`                                       |
| Benutzerbereich                 | `Avatar`, `AvatarImage`, `AvatarFallback`, `Dropdown`, `DropdownTrigger`, `DropdownContent`, `DropdownItem`, `DropdownLabel`, `DropdownSeparator` |
| Trennung                        | `Separator`                                                                                                                                       |
| Icons                           | verifizierte Exports aus `@kamod-ch/icons`, bevorzugt ein einziges Set                                                                            |

Vor dem Import muss Cursor die Exports im aktuellen Checkout nochmals prüfen. Der Repository-Stand ist die Quelle der Wahrheit.

## Vorgeschlagene Struktur

Die exakten Verzeichnisse sind an die vorhandenen Konventionen anzupassen.

```text
packages/blocks/
  src/
    application-shell-1/
      application-shell-1.tsx
      app-sidebar.tsx
      nav-main.tsx
      nav-user.tsx
      types.ts
      demo-data.ts
      application-shell-1.test.tsx
      index.ts
    index.ts
  package.json
  tsconfig.json
  tsup.config.ts

packages/docs/
  ... vorhandene Blocks-Navigation und Seitenstruktur ...
  ... Application-Shell-1-Demo und Dokumentation ...
```

## Komponentenverantwortung

### `ApplicationShell1`

- besitzt nur die Layout-Komposition
- rendert `SidebarProvider`, `AppSidebar`, `SidebarInset`, Header und `children`
- erzeugt keine anwendungsspezifischen Routes
- enthält keine fest verdrahtete Authentifizierung
- verwendet `min-h-svh` beziehungsweise die vorhandene Sidebar-Höhenlogik

### `AppSidebar`

- rendert Brand, Navigationsgruppen, Benutzerbereich und Rail
- setzt den aktiven Link über `currentPath` oder explizites `active`
- behält im eingeklappten Zustand verständliche Tooltips/Accessible Names bei
- schließt auf Mobilgeräten nach Navigation, sofern die Kamod-API das vorsieht

### `NavMain`

- verarbeitet flache und verschachtelte Einträge
- nutzt `Collapsible` nur für Einträge mit Kindern
- markiert aktuelle Links mit `aria-current="page"`
- dreht das Chevron über den offenen Zustand beziehungsweise vorhandene Data-Attribute
- vermeidet eigene DOM-/Focus-Logik, wenn Kamod sie bereits bereitstellt

### `NavUser`

- zeigt Avatar, Name und E-Mail
- öffnet ein Dropdown mit `Account`, `Billing`, `Notifications` und `Log out`
- bietet Callback-Props statt fest verdrahteter Auth- oder Router-Aufrufe
- stellt Fallback-Initialen bereit

## Visuelle Vorgaben

- Sidebar-Breite ungefähr 16rem; Icon-Modus nach vorhandenem Kamod-Standard
- Header-Höhe ungefähr 3.5rem
- kompakte Abstände wie in der Referenz
- ausschließlich semantische Theme-Tokens (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, Sidebar-Tokens)
- keine fest kodierten Grauwerte
- Content-Demo mit vier großen, dezenten Placeholder-Flächen, damit die Shell im Gesamtlayout beurteilt werden kann
- Light und Dark Mode müssen ohne separate Block-Farbpalette funktionieren
- keine unnötige Animation; `prefers-reduced-motion` respektieren

## Responsive Verhalten

| Breite        | Verhalten                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| Mobil         | Sidebar als zugängliches Overlay/Sheet; Trigger im Header; Breadcrumb auf den wichtigsten Eintrag reduzieren |
| Tablet        | Off-canvas oder kompakte Sidebar entsprechend bestehender Kamod-Breakpoints                                  |
| Desktop       | Sidebar sichtbar und auf Icon-Modus einklappbar                                                              |
| Große Screens | Content wächst flexibel; kein zweiter horizontaler Scroll-Container                                          |

## Dokumentationsnavigation: Übersicht → Detail → Vorschau

Sidebar wurde in Commit `4743466` (02.09.2026, „ui updates“) von einer fortlaufenden Block-Liste auf Übersichtskarten und einzelne Detailseiten umgestellt. Login/Signup rendern in `BlocksAuthContent.tsx` weiterhin alle `BlockCard`-Einträge untereinander. Das ist eine unterschiedliche Implementierung der Docs-Seiten; der Commit dokumentiert keine weitere Designbegründung.

Für **Application Shell** wird ausdrücklich das Sidebar-Muster übernommen, auch wenn zunächst nur ein Block existiert:

Die allgemeine Vereinheitlichung aller sichtbaren Block-Kategorien wird separat in [BLOCKS-DOCUMENTATION-ISSUE.md](BLOCKS-DOCUMENTATION-ISSUE.md) vorgeschlagen. Falls deren gemeinsame Übersichts-/Detail-Komponenten bereits vorhanden sind, soll Application Shell sie verwenden; eigene `pageKind`-Zweige sind dann nicht nötig. Die folgenden Punkte beschreiben das Vorgehen auf dem aktuellen Stand. Die Migration von Login/Signup gehört in einen separaten PR.

1. In `packages/docs/src/blocks/block-nav-config.ts` einen sichtbaren Eintrag **Application Shell** mit Key `application-shell` und Ziel `/blocks/application-shell` ergänzen; nicht in `HIDDEN_BLOCK_NAV_KEYS` aufnehmen.
2. Drei Markdown-Routen nach dem Sidebar-Vorbild anlegen:
   - `packages/docs/blocks/application-shell.md` → Übersicht mit verlinkten Karten aus der Application-Shell-Registry; zunächst eine Karte „Application Shell 1“, keine vollständigen Demos.
   - `packages/docs/blocks/application-shell/application-shell-1/index.md` → Detailseite für genau diesen Block, mit Live-Demo, Quellcode, Usage/API und Rücklink zur Übersicht.
   - `packages/docs/blocks/application-shell/application-shell-1/preview.md` → eigenständige Vorschau für Vollbild und Mobile-/Tablet-Iframes.
3. `BlocksSidebarContent.tsx` als Vorlage nutzen: Übersicht mit `DocsShell`, `sidebarScope="blocks"` und `activeBlock="application-shell"`; Detailseite mit `DemoShell` ohne Docs-Seitenleiste. Eigene `pageKind`-Werte für Übersicht, Detail und Preview sowie `blockId` in den Frontmatter-Daten verwenden und in `packages/docs/.preactpress/theme/Layout.tsx` registrieren. Die bisherigen Sidebar-Renderer sind auf Sidebar-Blöcke festgelegt.
4. Block-Metadaten in `packages/blocks` pflegen, Exports/Build-Einstiegspunkte ergänzen und `BlockPreviewPanel`, bestehende Kartenstile und das `?raw`-Quellcode-Muster wiederverwenden. Alle internen URLs durch `withBasePath` führen, damit `/kamod-ui/` unterstützt wird. Der aktuelle `docs:routes`-Generator erzeugt Komponenten-Dokumentation, keine Block-Routen; die drei Markdown-Dateien wie bei Sidebar selbst anlegen.
5. Einen E2E-Smoke-Test für **Kategorie → Übersichtskarte → Detail → Zurück** sowie direkte Detail-/Preview-Aufrufe und Mobile-/Tablet-Vorschau vorsehen. Login/Signup bleiben außerhalb dieser Feature-Änderung.

## Akzeptanzkriterien

- Preact-only: kein `react`, `react-dom`, Radix oder React-only shadcn-Code
- Tailwind CSS 4 und bestehende Kamod Theme-Tokens
- alle Imports gegen den aktuellen Workspace verifiziert
- Desktop-Sidebar lässt sich ein- und ausklappen
- Mobile-Sidebar öffnet und schließt korrekt, inklusive Escape und Fokus-Rückgabe
- verschachtelte Navigation funktioniert per Maus und Tastatur
- aktiver Link und Breadcrumbs sind datengetrieben
- Benutzer-Dropdown ist tastaturbedienbar
- Shell funktioniert mit beliebigem `children`-Inhalt
- Light/Dark, 320px, 768px, 1024px und 1440px geprüft
- Typecheck, Oxlint, Oxfmt, Tests und Produktionsbuild erfolgreich
- Dokumentationsseite enthält Live-Demo, Installations-/Importbeispiel, Props beziehungsweise Datenmodell und kopierbaren Quellcode
- „Application Shell“ öffnet zunächst eine Kartenübersicht; „Application Shell 1“ besitzt eine eigene Detail- und Preview-Route nach dem oben beschriebenen Sidebar-Muster.

## Umsetzungsphasen

1. **Repository-Audit und Blocks-Paket:** aktuelle Workspace-Struktur, Exports, Docs-Registry und Tests prüfen; `packages/blocks` nur bei Bedarf minimal anlegen.
2. **Block implementieren:** Typen, Demo-Daten, Navigation, Benutzer-Menü und Shell-Komposition umsetzen.
3. **Dokumentation integrieren:** Block-Kategorie, Vollbild-Demo, responsive Preview, Quellcode und Nutzungsbeispiel ergänzen.
4. **Qualität absichern:** Unit-/Interaction-Tests, E2E-Smoke-Test, visuelle Viewports, Accessibility, Oxlint, Oxfmt, Typecheck und Build.

---

# Cursor-Prompt 1 – Repository prüfen und Blocks-Paket vorbereiten

```text
Arbeite im Repository kamod-ch/kamod-ui. Ziel ist die Vorbereitung eines neuen Preact/Kamod-Blocks „Application Shell 1“, inspiriert von:
https://www.shadcnblocks.com/block/application-shell1

Dieser Prompt ist Phase 1. Implementiere noch nicht die komplette App-Shell.

1. Lies zuerst vollständig:
   - AGENTS.md beziehungsweise alle Repository-Instruktionen
   - Root package.json, pnpm-workspace.yaml und pnpm-lock.yaml
   - tsconfig.base.json
   - .oxlintrc.json und .oxfmtrc.json
   - packages/core/package.json und packages/core/src/index.ts
   - die bestehende Sidebar-, Breadcrumb-, Collapsible-, Dropdown-, Avatar-, Separator- und Tooltip-Implementierung
   - packages/docs/package.json und die aktuelle Docs-Navigation/Registry
   - vorhandene Test- und E2E-Konventionen

2. Prüfe, ob `packages/blocks` auf diesem Branch bereits existiert.
   - Falls ja: verwende seine bestehende Architektur unverändert.
   - Falls nein: lege ein minimales Workspace-Paket `@kamod-ch/blocks` nach den Konventionen von `packages/core` und `packages/openui` an.
   - Das Paket soll Preact-native, ESM-only und tree-shakeable sein.
   - Verwende Workspace-Abhängigkeiten für `@kamod-ch/ui`; füge `@kamod-ch/icons` nur hinzu, wenn es im Repository oder der Paketstrategie tatsächlich vorgesehen ist.
   - Füge keine React-, React-DOM-, Radix- oder shadcn-Abhängigkeiten hinzu.

3. Lege nur das Grundgerüst für den Block an:
   - `application-shell-1/`
   - `types.ts`
   - `demo-data.ts`
   - `index.ts`
   - Paket-Root-Export
   Passe die Pfade an bestehende Repository-Konventionen an.

4. Definiere kleine, stabile Typen für:
   - Brand
   - Benutzer
   - Breadcrumb
   - NavigationGroup
   - NavigationItem mit optionalen Kindern, Icon, href, active und disabled
   - Callback für Navigation/User-Actions
   Icons dürfen nicht über `any` typisiert werden. Ermittle den korrekten Preact-Component-Typ aus dem aktuellen Projekt.

5. Erstelle realistische Demo-Daten entsprechend der Referenz:
   - Platform: Playground, Models, Documentation, Settings
   - Projects: Design Engineering, Sales & Marketing, Travel, More
   - Benutzer mit Name, E-Mail und Avatar-Fallback
   - Breadcrumbs: Building Your Application / Data Fetching

6. Stelle sicher, dass Root-Scripts und Workspace-Erkennung das neue Paket berücksichtigen. Verändere keine bestehenden Komponenten und formatiere keine fremden Dateien unnötig.

7. Validierung:
   - pnpm install nur falls erforderlich
   - Typecheck für das neue Paket
   - Oxlint auf dem relevanten Scope
   - Oxfmt für geänderte Dateien und anschließend Check-Modus
   - Paket-Build

Gib am Ende aus:
- welche bestehende Konvention du übernommen hast
- welche Dateien du erstellt/geändert hast
- welche Exports der aktuellen Kamod-Version für Phase 2 bestätigt wurden
- die exakten Prüfkommandos mit Ergebnis
- verbleibende Risiken oder offene API-Unterschiede
```

# Cursor-Prompt 2 – Application Shell implementieren

```text
Arbeite im bereits vorbereiteten kamod-ui-Workspace weiter. Implementiere jetzt „Application Shell 1“ als Preact-native Block in `packages/blocks` beziehungsweise im auf diesem Branch vorhandenen Blocks-Paket.

Designreferenz:
https://www.shadcnblocks.com/block/application-shell1

Erwartete Struktur der Referenz:
- einklappbare linke Sidebar
- Brand im Sidebar-Header
- gruppierte Navigation
- aufklappbare Untermenüs
- Benutzer-Dropdown im Sidebar-Footer
- Sidebar-Rail/Icon-Modus
- Header mit Sidebar-Trigger, Separator und Breadcrumbs
- flexibler Content-Bereich

Wichtige Regeln:
- Verwende ausschließlich Preact und öffentliche, im aktuellen Checkout verifizierte Kamod-Exports.
- Kein React, React DOM, Radix und kein kopierter React-only shadcn-Code.
- Bevor du Imports schreibst, verifiziere die exakten Exports in `packages/core/src/index.ts` und den jeweiligen Komponenten.
- Nutze die bestehenden Kamod-Komponenten, insbesondere Sidebar, Breadcrumb, Collapsible, Dropdown, Avatar, Separator und bei Bedarf Tooltip.
- Nutze ein einheitliches, tatsächlich vorhandenes Icon-Set aus `@kamod-ch/icons`. Falls das Paket nicht Bestandteil dieses Monorepos ist, prüfe seine installierte/öffentliche API; erfinde keine Icon-Namen.
- Verwende Tailwind CSS 4 und semantische Theme-Tokens. Keine hart codierten Neutral-/Grau-Farben.

Implementiere:

1. `ApplicationShell1`
   - Props: brand, navigationGroups, user, breadcrumbs, children, optional currentPath, optionale Navigation-/User-Callbacks und class/className nach Repository-Konvention.
   - Komponiere `SidebarProvider`, `AppSidebar`, `SidebarInset` und einen Header.
   - Der Content muss beliebige Children akzeptieren und darf keinen Router voraussetzen.

2. `AppSidebar`
   - Brand oben, Navigation in der Mitte, Benutzer unten, Rail vorhanden.
   - Desktop: ein-/ausklappbar bis zum Icon-Modus.
   - Mobile: vorhandenes responsives Sidebar-/Sheet-Verhalten nutzen.
   - Keine doppelte Quelle für Sidebar-State.

3. `NavMain`
   - Einträge ohne Kinder sind normale Links/Buttons.
   - Einträge mit Kindern verwenden `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` und Sidebar-Submenu-Komponenten.
   - Aktive Zustände stammen aus `active` oder `currentPath`.
   - Setze `aria-current="page"` am aktuellen Ziel.
   - Ein Chevron zeigt den offenen Zustand mit vorhandenen Data-Attributen/CSS an.
   - Links bleiben standardmäßig echte `<a href>`-Navigation; `onNavigate` darf Router-Integration ermöglichen, ohne den Block an einen Router zu binden.

4. `NavUser`
   - Avatar, Name, E-Mail und Chevron/More-Icon.
   - Dropdown mit Account, Billing, Notifications, Separator und Log out.
   - Aktionen über Callback melden; keine Auth-Implementierung fest verdrahten.
   - Dropdown-Position muss im expandierten und eingeklappten Zustand funktionieren.

5. Header und Breadcrumbs
   - Höhe ungefähr 3.5rem, untere Border, kompakte Abstände.
   - SidebarTrigger, vertikaler Separator und datengetriebene Breadcrumbs.
   - Auf sehr schmalen Screens nur den aktuellen Breadcrumb sinnvoll sichtbar halten.

6. Demo-Content
   - Lege eine separate Demo-Komponente mit vier dezenten Placeholder-Flächen an, ähnlich der Referenz.
   - Demo-Daten dürfen nicht Teil der generischen Shell-Logik werden.

7. Accessibility und Robustheit
   - sichtbare Fokuszustände
   - vollständige Tastaturbedienung
   - Accessible Names für Icon-Buttons
   - Escape/Fokus-Rückgabe beim mobilen Overlay und Dropdown über Kamod-Primitives
   - reduzierte Bewegung respektieren
   - kein ungeschützter Zugriff auf window/document/localStorage; SSR-safe bleiben

8. Tests
   - Shell rendert Brand, Navigation, User und Children
   - verschachtelte Navigation öffnet/schließt
   - aktiver Link erhält aria-current
   - Breadcrumbs werden aus Props gerendert
   - User-Dropdown öffnet und Callback wird ausgelöst
   - Sidebar-Trigger ist zugänglich
   Verwende die vorhandene Vitest-/Testing-Library-Konvention.

Validiere mit fokussierten Tests, Typecheck, Oxlint, Oxfmt und Paket-Build. Behebe alle neu verursachten Fehler. Verändere keine unabhängigen Dateien.

Berichte am Ende:
- Komponentenbaum und öffentliche API
- ausgewählte Kamod-Pakete und warum
- geänderte Dateien
- Prüfkommandos und Ergebnisse
- noch nicht visuell geprüfte Punkte
```

# Cursor-Prompt 3 – Dokumentation und Live-Demo

```text
Integriere den fertigen Block „Application Shell 1“ in `packages/docs` des kamod-ui-Repositories.

Referenz:
https://www.shadcnblocks.com/block/application-shell1

Lies zuerst die aktuelle Docs-Architektur und übernimm exakt die bestehenden Konventionen für:
- Routen beziehungsweise Seitenregistrierung
- Seitennavigation
- Block-Kategorien
- Live-Previews
- Code-Darstellung und Copy-Button
- responsive Preview-Container
- SEO-Metadaten
- Tests

Erfinde keine neue Docs-Infrastruktur, wenn bereits eine existiert.

Umsetzung:

1. Setze die oben beschriebene „Dokumentationsnavigation: Übersicht → Detail → Vorschau“ um: sichtbare Kategorie „Application Shell“, Kartenübersicht unter /blocks/application-shell, eigene Detailseite /blocks/application-shell/application-shell-1 und Vorschau unter deren /preview-Route. Auch bei nur einem Block bleibt die Übersicht erhalten.
2. Zeige eine echte interaktive Live-Demo aus dem Blocks-Paket, keine nachgebaute statische Kopie.
3. Die Standardvorschau soll genügend Höhe besitzen, damit Sidebar, Header, Footer und Content gemeinsam sichtbar sind.
4. Biete nach vorhandener Docs-Konvention:
   - Preview
   - Quellcode
   - Installations-/Importhinweis
   - kurzes Usage-Beispiel mit `children`
   - Beschreibung des Datenmodells für Brand, Navigation, User und Breadcrumbs
5. Ergänze Viewport-Prüfungen beziehungsweise Preview-Umschaltung für Mobile, Tablet und Desktop, falls das Docs-System dies unterstützt.
6. Nutze die Kamod-Demo-Imports/Aliase nur dort, wo sie im Docs-Paket tatsächlich vorgesehen sind. Der Nutzer-Code muss die publizierten Paketimporte zeigen.
7. Erkläre knapp:
   - router-unabhängige Links und `onNavigate`
   - aktive Navigation über `currentPath`/`active`
   - User-Actions über Callback
   - responsives Verhalten
8. Ergänze den Block in Suche, Navigation und gegebenenfalls generierte Komponenten-/Blocks-Metadaten. Nutze vorhandene Generatoren statt manuell generierte Dateien zu duplizieren.
9. Ergänze einen Docs-/E2E-Smoke-Test für Kategorie → Übersichtskarte → Detail → Zurück, direkte Detail-/Preview-Aufrufe sowie Titel, Live-Demo und Mobile-/Tablet-Vorschau.

Visuelle Abnahme:
- 320px: Header bleibt nutzbar, Breadcrumb überläuft nicht, Sidebar öffnet als Overlay
- 768px: keine überlagernden Flächen
- 1024px und 1440px: Desktop-Sidebar, Collapse und Content funktionieren
- Light und Dark Mode
- lange Navigationstitel und lange Benutzer-E-Mail
- Keyboard: Trigger, Untermenüs, Dropdown, Escape und Fokus-Rückgabe

Validierung:
- fokussierte Docs-Tests
- E2E-Smoke-Test, sofern eingerichtet
- Typecheck
- Oxlint
- Oxfmt auf geänderten Dateien plus Check-Modus
- Docs-Produktionsbuild

Berichte alle ausgeführten Kommandos mit Ergebnis und nenne visuelle Punkte, die mangels Browser nicht verifiziert werden konnten.
```

# Cursor-Prompt 4 – Abschließende QA und API-Härtung

```text
Führe eine abschließende Review des neuen Kamod-Blocks „Application Shell 1“ und seiner Dokumentation durch. Ändere nur Dinge, die zur App-Shell gehören.

Review-Checkliste:

1. API
   - Props sind klein, typisiert und router-/auth-unabhängig.
   - Demo-Daten sind nicht in der generischen Komponente fest verdrahtet.
   - Keine unnötige Abstraktion und kein `any`.
   - Alle öffentlichen Exports sind in Paket-Entry-Points und package.json korrekt erreichbar.

2. Kamod/Preact
   - keine React-, React-DOM-, Radix- oder shadcn-Runtime-Abhängigkeit
   - nur verifizierte öffentliche Kamod- und Kamod-Icons-Exports
   - keine duplizierte Sidebar-, Overlay-, Focus-Trap- oder Dropdown-Logik
   - Preact-konforme Event-, Ref- und JSX-Typen

3. Styling
   - Tailwind CSS 4
   - semantische Tokens statt fester Farben
   - Light/Dark korrekt
   - kein unnötiger horizontaler Scroll-Container
   - Sidebar, Header und Content nutzen `svh`/bestehende Höhenlogik korrekt
   - Reduced Motion wird respektiert

4. Accessibility
   - semantisches `<nav>`/`<main>` beziehungsweise vorhandene Kamod-Semantik
   - `aria-current` für aktive Links
   - Accessible Names für Icon-Buttons
   - Fokus sichtbar
   - komplette Tastaturbedienung
   - Escape und Fokus-Rückgabe für Overlay/Dropdown
   - Breadcrumbs besitzen eine sinnvolle Beschriftung

5. Responsive/Interaktion
   - 320, 768, 1024 und 1440px
   - mobile Sidebar öffnen, navigieren und schließen
   - Desktop-Sidebar ein-/ausklappen
   - verschachtelte Menüs in beiden Sidebar-Zuständen
   - User-Dropdown in expanded/collapsed/mobile
   - lange Labels und E-Mail

6. Tests und Build
   - ergänze fehlende fokussierte Tests nur dann, wenn eine reale Lücke besteht
   - führe die relevanten Unit-, Docs- und E2E-Tests aus
   - führe Typecheck aus
   - führe `oxlint` auf dem relevanten Scope aus
   - formatiere nur geänderte Dateien mit `oxfmt` und führe danach Check-Modus aus
   - führe Blocks- und Docs-Produktionsbuild aus
   - führe `git diff --check` aus

Behebe alle durch diese Änderung verursachten Fehler. Akzeptiere keine fehlgeschlagenen Checks als „bestehend“, ohne dies über den unveränderten Baseline-Stand nachzuweisen.

Liefere abschließend:
- kurze Zusammenfassung der finalen Architektur
- vollständige Liste der geänderten Dateien
- endgültige öffentliche Importbeispiele
- alle Prüfkommandos mit Pass/Fail
- dokumentierte Restabweichungen zur visuellen Referenz
```

## Empfohlene Reihenfolge

Die vier Prompts nacheinander in Cursor ausführen. Nach jedem Prompt den Diff prüfen und committen. Prompt 1 darf entfallen, wenn `packages/blocks` auf deinem Arbeitsbranch bereits sauber eingerichtet und in Workspace, Typecheck und Build integriert ist.
