# Complete the reusable Code reader, application-shell family, and documentation experience

This PR turns the documentation's separate code readers, copy actions, theme
controls, reference layouts, and showcase flows into reusable implementations. It
also adds seven application-shell compositions, completes their guides and source
delivery, and improves the site's navigation, first-load behavior, responsive
layouts, and recovery states.

The review covers the entire branch, including its earlier published commits and
the subsequent core, documentation, and audit refinements. The detailed
[change ledger](CHANGES.md) records individual features, integrations, tests,
generated assets, and a file-family coverage table; this description explains how
those changes fit together and what consumers and maintainers need to know.

## Why these changes belong together

The site had several implementations of the same source-reading and clipboard
behavior, while component and block guides repeated their own reference and API
layouts. Theme previews needed reliable local scopes, and loading a page or
scrolling through examples could initialize more work than was needed. New shell
variants also needed a complete path from catalog discovery to source, working
examples, integration guidance, and production checks.

The resulting ownership is explicit: core provides reusable readers and controls;
blocks compose application layouts and the controlled theme picker; themes own
palette values and scope application; docs owns its route catalog, explanations,
source destinations, and private contextual help. The public components remain
Preact-native and do not acquire a documentation router, authentication system,
React compatibility layer, or browser compiler dependency.

## Core reader and control APIs

### Code is a reusable source reader

Code is available from the package root and the focused
**@kamod-ch/ui/code** entrypoint. It accepts literal source, resolves supported
language hints and filenames, performs bounded inference when useful, and defers
Prism loading until syntax highlighting is needed. Initial and unsupported content
remains readable escaped text. A near-viewport grammar request temporarily pulses
source opacity between 5% and35%; completed or failed loading immediately restores
full ink. Offscreen idle snippets do not start that pulse, and reduced motion uses
a static35% while waiting. It never evaluates supplied code.

The public composition model covers optional headers, useful source metadata,
controlled or uncontrolled reading preferences, and replaceable controls:

| Concern              | Public API and behavior                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Source and language  | code, language, inferLanguage, highlight, and the exported codeLanguages catalog.                                         |
| Appearance           | syntaxTheme and default/subtle/outline surface variants.                                                                  |
| Header and identity  | showToolbar, filePath, renderFilePath, renderLanguage, toolbarContent, and renderToolbar.                                 |
| Wrapping             | wrapped/onWrappedChange or defaultWrapped for every language; readingControls selects overflow/always/imports visibility. |
| Import folding       | importsCollapsed/onImportsCollapsedChange or defaultImportsCollapsed, applied to complete leading JS/TS or CSS imports.   |
| Replacement controls | renderImportControl, renderWrapControl, and renderCopyAction receive typed state, actions, IDs, and default controls.     |
| Content composition  | beforeCode, afterCode, loadingContent, and renderedContent.                                                               |
| Source navigation    | resolveReference or an inherited CodeReferenceProvider; null opts a reader out.                                           |

Copying always uses the original complete source. Folding imports, wrapping lines,
changing a theme, replacing a button, or showing rendered Markdown does not modify
the clipboard text. Hidden controls retain the documented state behavior, and
source changes reset only the uncontrolled import preference as specified by its
default. Clipboard feedback stays local to the action instead of rerendering the
source viewer for every status transition.

The implementation separates language resolution, import parsing, wrapping,
highlighting, overflow detection, reference detection, and markup transformation.
Reading-preference changes reuse highlighted source. Async results are guarded
against source replacement and unmount, while plain text and custom document
views skip irrelevant grammar and formatting work.

### Scoped syntax palettes

Nine syntax choices are available: Default, Theme Tokens, Dusk, Forest, Monochrome,
Okaidia, Tomorrow, Twilight, and Solarized Light. The original four Kamod palettes
follow the nearest application appearance boundary, including alternating local
light/dark preview scopes; the opt-in Theme Tokens palette derives syntax
from the current preset’s primary and chart roles, mixed with foreground ink. The Prism
palettes retain their dedicated readable source canvases: dark for Okaidia, Tomorrow, and Twilight, and light for Solarized Light.
Headers and controls continue following the surrounding application theme.

Palette changes use CSS attributes and variables, without another tokenization
pass. Typography and token overrides remain local to the reader through the
existing Code variables. Custom rendered content keeps its caller-owned
presentation, and copying continues to use the original source string.

The later inverse Code/Markdown experiment has been rolled back completely. Its
color-mode prop and type, automatic inversion, source-boundary wrappers, paired
color variables, documentation routes, and dedicated tests are no longer part of
the resulting implementation. The generic Code API and all eight original syntax
palettes remain in place.

### Detailed theme and Prism guidance

The Theming reference now explains foundation selection, semantic values, Tailwind
mappings, inheritance, cascade precedence, surface/foreground pairs and the complete
sidebar role family. The existing installation, usage, CSS and token routes remain
stable. The block companion links to the canonical explanations instead of copying
the full discussion.

The Code reference follows a source string through Prism classification and CSS
painting, lists the nine token-variable groups, explains reader boundaries and
source-only overrides, and shows how to include or adapt an upstream Prism theme.
The examples cover scoped vendor selectors, a Dracula-family variable recipe,
licenses, shared preferences and verification against actual reading surfaces.

`syntaxTheme="theme"` uses existing semantic values without new state, listeners or
palette downloads. A local interactive study compares all eight application presets
in both appearances without writing page preferences or repeating highlighting.
The custom-product recipe explains mix weights, token fallbacks and application
versus reader ownership. The new **@kamod-ch/ui/code/styles.css** entry provides
reader/CopyButton styles without importing a second token foundation. It is excluded
from JavaScript-only type analysis in the same way as the existing theme CSS entry.

Authored prose fragments live under **packages/docs/.preactpress/content** and use
watched virtual string modules; they do not become standalone accidental routes.
GuideParts shares Markdown, code fences, heading levels and private reference-aware
inline prose between complete guides and embedded Code topics. Copyable full TSX
examples are typechecked against the real component API.

### Presets as complete design studies

All eight presets have normal page chapters with linked subsections, a concise
introduction and a local reading path. The outer cards and their decorative
washes are removed; swatches, specimens and working canvases retain useful frames.
Six static workspace/action/feature compositions still compare both appearances.

A core-color section presents eight large swatches with an independent Light/Dark
control and copy formats for CSS variables, resolved CSS, HEX and RGB. A separate
searchable reference covers all 43 semantic colors in both modes, plus Cursor
Warm's 13 extra colors and Watson's 63 source shades. Declarations and ownership
come from the shipped foundation/preset CSS, including inherited roles and alpha.
One hover/focus tooltip per active palette explains purpose, pairings and source;
a selected row opens its values and copy controls. HEX/RGB are labeled 8-bit sRGB
exports; resolved CSS retains the browser's color space. Unavailable conversions
cannot be copied. A near-viewport batch resolves colors once per preset.

Initial fragment and legacy section links wait for real layout boxes instead of
scrolling headings hidden by lazy hydration. Pending follows yield to reading
intent, route changes and history navigation; reload restoration stays intact.

Each chapter also provides a real local release workspace with editable text,
checklist/progress, appearance and content/loading/validation states, notification
preferences, publish feedback and chart roles. These controls do not change page
preferences or send messages. Skeleton animation requires explicit opt-in, pauses
offscreen/in hidden tabs and remains static under reduced motion. Local control
paint stays independent of the document's dark-mode utilities.

Typography, radius examples, design principles and practical checks retain the
preset-specific guidance. The complete scoped TSX example is always visible,
with the shared copy/download actions and lazy near-viewport source coloring.
Native disclosures remain for longer design advice. Exact preset CSS links,
existing route/heading identities and shared integration guidance stay intact.
Container layouts support narrow articles without changing the shipped palettes,
loading fonts or adding dependencies.

An expandable, searchable Prism index adds 24 saved syntax studies with TSX/CSS/JSON
specimens, token inspection, contrast hints and licensed CSS downloads. Pinned
sources retain credits and integrity hashes. Source paint stays local; nested
contents reveal direct destinations. Opening attribution and closing integration
notes crosslink the Code guide without changing its public palette API.

The surrounding theming guide removes repeated setup/control explanations and
folds optional configuration into CSS setup. A final recap, local review checklist
and component/block reading paths close the guide. Existing palette studies stay
unchanged.

### Source references stay generic in core

CodeReferenceProvider and resolveReference let a host connect imports, module
specifiers, and supported imported-symbol usages to verified destinations. Core
does not know the documentation route catalog. A small lexical parser recognizes
common import forms, aliases, literal dynamic imports, and require specifiers,
with conservative handling of common local shadowing; it is navigation assistance,
not complete compiler-level scope analysis.

Generated anchors preserve highlighted token colors and copied text. The resolver
accepts supported web/application destinations, rejects unsafe schemes, and
escapes generated attributes. Folding and wrapping keep links attached to the
same source characters. Source and inline references share a primary dashed cue,
resting at 35% in snippets and 55% in prose, then reaching full color on hover or
focus. Slow glyph-stroke emphasis preserves widths and Prism ink. Detected inline chips keep a steady 500 weight with no arrow, growth, stroke or
vertical movement; only their underline changes visibility.

### Shared controls retain their existing ownership

CopyButton centralizes clipboard writes, stale-operation guards, retry behavior,
timer cleanup, custom-control composition, and accessible success/error feedback.
It is reused by source viewers and existing block examples. The shared visual
feedback keeps its footprint, supports reduced motion, and retains glyph nodes
through state changes where layered presentation is appropriate.

Tabs gains an opt-in inset variant while default and line variants remain
available. AlertCallout adds a structured, non-live guidance composition with
semantic headings and a quiet shared default. TypeDefinition gains useful
source-reference metadata, with text-width declaration names so dashed cues end
at the identifier. Tooltip positioning and lazy resizing, bounded dropdown
portal retries, scrollbar drag cleanup, table-header typing, and touch-aware hover
rules receive focused corrections. Spinner rotation moves to an HTML wrapper
while its SVG and public accessibility contract remain unchanged.

## Blocks and application shells

Application Shells 2–8 extend the existing family with a shared frame and the
existing Sidebar, navigation, account-menu, and breadcrumb primitives:

| Variant | Layout                      | Additional responsibility                                                  |
| ------- | --------------------------- | -------------------------------------------------------------------------- |
| 2       | Inset Workspace             | Framed application content with grouped navigation.                        |
| 3       | Compact Navigation Rail     | Collapsed desktop rail with expandable labels and mobile sheet navigation. |
| 4       | Horizontal Workspace        | Top-level desktop destinations with a mobile sidebar path.                 |
| 5       | Right-Hand Navigation       | Right-side navigation and matching mobile sheet.                           |
| 6       | Split Workspace             | Optional responsive inspector and title.                                   |
| 7       | Sectioned Workspace         | Contextual section links separate from global navigation.                  |
| 8       | Persistent Action Workspace | Sticky status/actions footer for long forms.                               |

The blocks retain caller-owned brand, navigation data, account actions,
currentPath/onNavigate integration, and content. Header actions and variant slots
do not move routing, authentication, saving, or validation into the shell. Preview
fixtures remain separate from production components, and package exports,
entrypoints, registry metadata, source labels, and routes are aligned.

Every variant receives source, live preview, setup, usage, props, integration, and
reference guidance. Shell 3 additionally has a working-first downloadable source
folder containing its transitive helpers and license notices without demo files.
Its first example runs before the reader connects a router or application service.
Archive/source-closure tests and compile checks protect that copyable path.

Existing block guides and catalogs are refined alongside the new family. Shared
headers, source-backed APIs, installation panels, exact-file Code links, practical
usage sections, and reference cards keep discovery and implementation connected.
Updated shell/sidebar thumbnails and their manifests represent the current
compositions. Smaller example and branding adjustments across authentication,
commerce, communication, dashboards, marketing, and sidebars use the same shared
controls without adding new domain-service behavior.

The shared blocks ThemePicker is controlled and reusable: the host chooses the
target, values, and persistence. Palette samples, resource links, appearance
actions, keyboard behavior, and CSS distribution are shared between site and
preview consumers. Application themes now support explicit local scopes and
skip redundant application of an already selected preset or scheme.

## Documentation content and architecture

### Shared reading and API structure

Component, form, package, and block pages share section, heading, contents,
reference, callout, and page-ending components. Source-backed API extraction
reuses declared owners, direct field counts, required-field information, and the
same anchor IDs used by the rendered documentation. Browser API payloads can be
loaded per component while static rendering retains complete content.

Page-heading labels share a smaller, slightly stronger ApiBook icon and primary
foreground ink across guides, component/package pages, block collections/variants,
the home page and Kitchen Sink. Their subtle background reuses the exact sidebar
status-badge paint, resolved at appearance/palette boundaries. Existing label
padding, breadcrumbs, heading positions and responsive spacing remain unchanged.

The same validation also restores the established block overview/detail title and
lead sizing by excluding shared headers from generic variant-guide overrides.
Home palette metadata opts into its intended compact code size, preventing the
prose-scaling rule from clipping token labels at intermediate phone widths.

The content changes span foundational controls, inputs, overlays, navigation,
data display, feedback, media, utilities, motion, Formisch, and theming. They add
practical composition and ownership guidance without describing ordinary prose
changes as new component APIs. Code receives a complete guide, live customization
and palette studies, resolver integration, language details,
and focused deep-link routes. Examples and generated routes are checked against
their actual source definitions.

### Private reference help

The site's reference feature lives under **packages/docs/src/references/**.
Build-only plugins extract verified destinations and help facts from exports,
declarations, and documentation anchors. Lightweight destinations are separated
from detailed module facts and lazy card rendering, so ordinary source display
does not load every reference description.

Shared promises deduplicate pending work; completed data is reused, failures can
retry, and stale results cannot reopen dismissed help. Loading and unavailable
states retain their destination link. The same destination policy serves code,
inline references, highlighted prose, brand identities, and file paths through
shared delegated interaction rather than a listener on every token. This private
catalog and UI are intentionally absent from core's public package API.

Inline function and hook names retain their visible empty-call suffix while
resolving through the same reference as their bare identifiers. `cn()` opens its
API reference; `useTheme()` opens its appearance-controls section and receives
lazy declaration-backed function help. One package list drives both name indexing
and lazy loading, and declared function-valued exports retain their signatures.

Four additional inline families extend the original nine kinds: commands, blocks,
technologies and pages/sections. Named guides use the same Page / section category. The catalog includes 90 curated technology
labels, twenty CLI tools, registry-derived block identities, verified route titles
and real fragments. Aliases resolve conservatively; unknown or ambiguous labels
stay literal. Command parsing is bounded and rejects shell composition or expansion;
it never executes text. These additions do not broaden source-code detection into
arbitrary word matching.

The eager index contains lightweight identity/destination data. Four lazy family
modules provide descriptions and facts, sharing bounded promises and evicting
failures for retry. Kind icons, labels and optional contract headings have one
owner, and the kind badges share the page inline-code highlight and subtle 4px
corners. Existing stale-result and delegated-event boundaries remain in place.

### Reference identity and package source accuracy

Source-backed component display labels resolve to their canonical exports before
page-title aliases. `Theme Toggle` therefore shows `ThemeToggle` component props,
related types and its implementation; an explicit documentation path still means
a page. Named guides reuse canonical Page / section facts and one lazy family.
Unambiguous package/product names retain package identity, and an authored local
href cannot turn a real package specifier into a generic page reference. Explicit
navigation stays intact while tooltip resources are selected independently.

Configuration filenames, assets and consumer-local path labels remain plain.
They receive no automatic reference/glossary tooltip or detected underline,
including when an authored documentation link surrounds the code. Consumer alias
module strings are also plain in live readers and static Markdown fences. Actual
imported component/function symbols, published package entrypoints, registered
blocks and indexed repository sources retain their verified identities.

A shared map covers fifteen verified Kamod package owners and their workspace
folders, including the actual `kamod-ch/kamod-signals` repository where installed
metadata is stale. One build collector reads workspace/installed manifests and
verifies checked-out public export targets. `@kamod-ch/ui/theme.css` links to
`packages/core/src/theme.css`; other CSS exports likewise use their real files.
External monorepo links use declared directories with GitHub's `HEAD` alias;
unverified subpaths retain the package owner rather than an invented source file.

The authored Signals guide/ecosystem URLs now use that same canonical repository.
Motion package resources use the real `packages/motion` workspace and each adapter
source directory; the cn resource points directly to its implementation.

Package/module cards lead with source in their origin and final resource list, alongside an
independently chosen local integration link. The five reviewed Kamod packages use
their repository root as the preview’s main reference; exact subpath destinations
remain in a separate entrypoint note and the resources, without changing authored
inline navigation. Specific destinations cover global
CSS, Code stylesheet ownership, presets, tokens and known third-party integrations.
Stylesheet imports avoid unrelated JavaScript contracts. Private Blocks/Docs
workspaces are described honestly, factory-produced values remain constants, and
context Provider exports retain component help. These corrections add no browser
scraping, network lookup, per-token observer or new runtime dependency.

Catalogue tests audit all component display labels, all curated owners, filesystem
source targets and local route/fragment destinations. Production regressions cover
the reported examples, original authored links, Page / section consolidation,
source-first resources, keyboard flow and 320/1440px layouts in both appearances.

### ReferenceTooltip reading layout

The shared private tooltip has a linked title and technology/component icon, one
compact type badge, and an ExternalLinkIcon action matching the badge's 22px height,
background and ink. The smaller action icon uses a lighter stroke; the badge icon is
slightly larger. Other compact source actions use the main icon's subtle surface
and accent. Buttons remain stationary and change only their background on hover.
The title gains a small decorative compass. Its linked destination subline uses
the badge's background hue and an arrow. The independent fact sits at the opposite
right of the origin/context row with a matching info icon, vertically centered
with the highlighted path and slash-separated purpose. A tiny decorative chain separates the badge
and open action. The main icon has a more visible, still subtle background.
Verified technology logos remain confined to the main icon; the type badge keeps
the generic circuit-board mark.

The origin row preserves the exact copyable path and a one-line purpose after a
slash. Context, main description and right-side fact share10px/450 typography
and a slightly muted version of the badge background hue. Descriptions retain
source-backed prose with safe code, emphasis and local/HTTP(S) links. The smaller
8.5px postscript preserves useful alias, license and contract caveats
without a second badge or duplicate execution warning.

Substantive chapters reuse actual page components: BlockPropsTable for documented
props/defaults, core TypeDefinition for real source declarations, Code for source
excerpts, and Table for concise contextual facts. Build-time literal extraction
reads authored setup and API data without executing documentation pages or
mounting their demos. Components receive a combined installation/usage chapter
with the article's actual command, shared import snippet and authored text, then
documented props/defaults and source declaration cards. Component overviews retain
their actual composition table: Dialog includes all seven documented rows and
the page's data-type cards, beginning with DialogContextValue. Exact subcomponents
retain only their own rows and forward-owned declarations. Shared owner resolution
preserves type links, requirements and fallback descriptions; safe structural JSX
extraction retains Pagination's code, emphasis and real links without evaluating
page code. Blocks retain verified dependency, variant-import and source metadata.
Direct and inherited declarations remain explicitly distinguished.

Miniatures retain the source components' page colors, borders and hierarchy at a
much smaller local type scale. Excerpts, rows and disclosures are bounded; complete
content remains available through precise source links. Every borderless outer
card uses the current page background and foreground, as do its source miniatures;
external-site colors and the earlier pattern/purple overlay do not override it.
Very small linked headings and inset rules order the chapters. Each chapter joins
its heading, flush-width miniature and short, single-line continuation as one unit.
A visible primary text link with chain/arrow icons opens the complete section from
the right of its heading. Short contextual notes sit below the card; clipped tables,
code and type collections also have real continuation links with a down chevron.
Header, content stage and ending share the same base reading background.

One final **Useful resources** list replaces the grouped index and sticky action
footer. It includes every distinct verified contract, source, page and chapter
destination, placing the selected primary resource first with a secondary-hue
background at the badge's highlight strength. Small wrapping
links use one consistent text/icon scale; only the destination label is underlined,
leaving the `/` separator and resource-kind label plain. Native hints explain each
destination. A dot-separated keyword list truncates beside the heading, reserving
a constant12px gap before the centered total-reference count. No subgroup headings
or other footer content remain. Finished-reference text has a shared8.5px minimum,
including table metadata, notes and links; source-page colors/layout remain intact.

The local technology catalog contains 90 technologies with at least two authored
chapters each. Tailwind, Vite and Valibot each have three saved guide-based chapters,
with compact complete code examples and official continuation links reviewed on
2026-10-17. Tailwind covers installation, Vite/CSS integration and utilities; Vite
groups CLI commands, plugin setup and environments; Valibot covers installation,
runtime schemas and a typed login-validation example. Redundant Role facts are
removed while short categories remain in the origin row. All prose/examples stay
in the lazy technology family; the eager index retains identity and destination
data only. Opening a card performs no web lookup or page scraping.

Five additional lazy package profiles summarize the official Kamod UI, Hooks,
PreactPress, Signals and Icons READMEs in fifteen installation/usage/concept cards.
The saved provenance records review dates and exact README blob identities.
Examples use exports verified against installed packages. Bare package subpaths
share their owner's title, content and main repository link, while a compact
non-announcing note preserves the original entrypoint and its verified source.
When no file was verified, the note honestly links to repository search instead
of inventing a source path. Actual imported components, types, hooks and namespace
modules keep their specific source contracts. The package loading title already
uses the eventual root identity so it stays anchored during the handoff.

Long cards contain wheel scrolling at their boundaries, so scrolling to the end
cannot chain into a page-scroll dismissal. A 350ms departure grace permits crossing
the trigger/card gap and cancels on reentry. Unrelated pointer/focus departures and
native-scrollbar focus loss no longer dismiss the active reference. Escape,
route/outside-scroll dismissal, focus return and observer/timer cleanup remain
covered. The loading header uses the exact reference name, title typography and
main icon container of the finished card, with a16px spinner in that left slot.
“Following the reference...” sits beneath the title; the smaller informal note
uses the same badge-hued secondary ink. Solid subdued skeleton shapes replace
the reflective highlights. A shared CSS motion owner gives both tooltip and
page-opening skeletons the exact2.25-second cycle,45ms staggering and short5% rest.
Their paint stays local to each surface.

A420ms staged fade joins the loading and verified views at one fixed reading
width, keeping the name and icon frame steady while old bars leave before the
details appear. The outgoing layer immediately becomes inert/hidden from assistive tools,
retires its live status and stops every repeating animation, then becomes visually
hidden. Finite effects have no persistent fill; reduced motion switches directly.
The existing request key/active guard still rejects stale success and failure.
No transition timer, listener, observer, extra catalog lookup or state is added.

Source coloring stays optional and lazy. Actual Code miniatures disable copying,
reference recursion and layout-observer controls; a local error boundary preserves
literal text and navigation when the grammar chunk fails. Focused helpers own
source extraction, source-section selection, miniature rendering, compact chapter
structure and deduplicated resources. Shared deep link normalization applies each
deployment prefix once, including excerpt and owner destinations. Internal helpers
stay private; dependency checks require no unused-export suppressions. Browser coverage checks eight reference
families at 320/768/1440px in both appearances, alongside source navigation,
loading/failure, scroll containment, hover reentry and keyboard dismissal.

### Saved-reference validation

All **969 documentation tests in 104 files**, docs typecheck/production build, root
Oxlint/Oxfmt/Biome and Knip/Syncpack pass. All **22 affected production Chrome cases**
pass in one sequential final run. Coverage includes the reference-family matrix at
320/768/1440px in both appearances, exact header centering/page palette, loading
and reduced motion, keyboard/type-fragment navigation and scroll/departure
retention. The three technology profiles, five packages and two subpaths open
with external origins blocked and no outgoing request. Desktop Ocean/Kamod and
Cursor warm phone-dark captures were inspected at the beginning and end of their
reading regions; no card overflow or page errors occur. No new Safari/WebKit
result is claimed.

### Showcase Prompts and source downloads

All showcase Prompts start in Code, including block details and the home example.
Display switches remain local while mounted; obsolete persisted Prompt display
state is removed. Non-block compact layouts show icons for Plain Text/Code/Markdown,
while block details keep their narrower threshold. Setup/Adaptation Prompt text
and icons match the introduction heading, with tighter Source Included metadata.

A private reusable file action sits before Copy throughout the site's source
readers: showcase files, ordinary snippets, guide/type/source readers and live Code
demonstrations. It saves the original complete string, including folded imports,
whitespace and Unicode. Real source basenames retain their extensions; unnamed
snippets use the reader's resolved language. Prompt documents retain their named
Markdown download in every display format without duplicating the action.

The host composes this through the existing Copy slot, preserving custom controls
and the public core API. Readers without Copy or a toolbar remain action-free;
static nested fences and tooltip miniatures do not acquire downloads. Live core
demonstrations retain their original overflow policy and copyable public examples.

The action hands a native Blob link to the browser within the click gesture, then
shows finite downloading/downloaded feedback before resetting. Three persistent
glyphs and a purple version of the shared copy ring, orbit and glow avoid SVG
replacement glitches. Status text describes browser handoff, not disk completion.
Repeat clicks, source/name/MIME changes, failures and unmount clean up the single
timer and object URL. Compact controls match Copy's footprint and accessible names;
the spinner owns its reduced-motion-aware keyframes without a block-style dependency.

### Package guides and portable references

Icons, Hooks, Signals, State, and i18n use a shared practical guide structure with
package-specific examples and ownership advice. A portable workspace offers Text,
Code, and rendered Markdown views while copying and downloading the complete
Markdown document. Its initial text is SSR-readable, rendered views are deferred,
and only the latest prepared document is retained.

All five guides now share a source/attribution ending with distinct documentation,
repository/release-history, and registry purposes; three curated companion
connections; and a concrete next build. The downloaded reference contains those
same facts and canonical links. Existing Icons next-step anchors survive the
removal of its duplicate ending component.

### Home, guides, navigation, and appearance

The modular landing page includes a local interactive workspace with the shared
Preview/Code/Prompt flow, component credits, a responsive directory, and useful
continuation links. Getting Started provides a complete setup-to-verification
path. The ecosystem guide explains package roles, and the color-theme guide adds
scoped preset studies and practical responsive guidance.

The four ecosystem foundation cards retain their base shell but gain aligned
heading/context rows, top-right guide/source icon actions, useful entry-point and
ownership details, and honest package/source delivery footers. A finite divider
sweep and restrained perimeter feedback have keyboard/reduced-motion equivalents.
The page ends with three open reading rows, expanded practical guidance, useful
icon shortcuts and ordinary underlined links back to its example and map. Source
card headings also expose compact repository/issue actions. An optional DocsShell
footer slot keeps this conclusion page-owned. Shared component pages instead close
with an expanded setup/composition/review section with contextual internal links.

Desktop navigation content is reused in the responsive drawer with separate
expansion and scroll memories. Active destinations are revealed, page-title and
contents links share a consistent hierarchy, and topbar offsets keep anchored
headings visible. A site-only Light/Dark/System menu uses existing theme signals
and dropdown primitives without changing the public ThemeToggle API. Shared
selection surfaces, badges, neutral menu triggers, stationary navbar hover, and
persistent state glyphs make controls consistent across pages. Appearance choices
now have exactly three sample bars; palette choices retain four.

Both sidebar gutters are wider. Selected left sublinks retain the strongest
soft inline-code surface; selected main groups and pinned top/bottom destinations
use exactly two-thirds of that fill on desktop and mobile. Counts remain plain,
and Fresh/Updated/Planned badges use20% of the actual secondary role. Page labels
share that status-badge paint, compact padding,600 foreground ink, the smaller
ApiBook icon and 4px corners; compensating top spacing preserves page coordinates.

Right contents links distinguish the URL's chosen fragment from the section in
view. Incoming links, reloads, history and native/router clicks update the chosen
fill without rewriting scroll tracking. The chosen link matches the appearance
menus: foreground semibold text,8px corners and the same page base, neutral washes
and14% primary accent. Its subtle hover wash sits above that plate and beneath
the text. The reading destination uses the default main-group surface and a
straight marker trimmed just inside its corner radius.
Quieter hover paint stays beneath a slightly stronger rail with short fades and
a6px upper extension. A border-image keeps the marker visible through ellipsis;
only the viewed link can paint above the rail. Remove the heading divider while
retaining its position and enlarge its compass shortcut around the original
center. Reuse the existing navigation lifecycle and cleanup, adding no listeners,
observers, subscriptions or dependencies.

## Runtime, loading, and performance

This PR reduces unnecessary work at specific ownership boundaries. Route metadata
is compacted for the browser while SSR and fetched records remain complete;
route loads are shared; speculative prefetch has an idle budget and bounded
concurrency; and scroll restoration avoids stale writes. A guarded PreactPress
runtime bridge fails explicitly when an upstream implementation no longer matches
its expected compatibility boundary.

Showcase modules use an immediate fallback instead of an empty lazy-render window.
Markdown preparation follows the pending paint, source-width observers retain
unchanged state, and a shared idle queue starts one isolated component preview at
a time. Waiting previews can be canceled; started documents finish without being
interrupted. A pool ordinarily retains three recently used component previews,
protects visible/loading documents, and evicts older completed offscreen examples.
Recent input survives, while evicted examples intentionally reset on return.
Readiness, failure, and unmount release the queue slot. Completion-time eviction
cannot recreate a resize observer retaining the discarded document.

One shared viewport observer and visibility listener per document pause inactive
preview and placeholder CSS animation, including pseudo-elements. Visible pending
work resumes normally; the three permanent home status pulses are removed. An
eager block iframe that completes before hydration is recognized by its completed
document and matching URL, preventing a stuck animated loading overlay. These
changes include lifecycle and production browser regressions.

Pending showcases now use short secondary captions, “Setting the scene...” and
a smaller companion skeleton instead of a logo tile. Spinner-colored staggered
dots and a 3.8-second paired transform loop provide clear feedback with fewer
competing effects. Shared activity and reduced-motion rules stop all descendants
when appropriate; the redesign adds no timers or reactive progress state.

The first-paint overlay and route-loading screen now render one shared page-opening
component and stylesheet. Both use the same heading, explanatory copy, neutral
outline spinner, foreground semibold Kamod label, borderless skeleton and exact
Getting Started rocket. The caption ends with an ellipsis and shares its faint
ink and typography with “Made for Preact. Built to be yours.” beneath the skeleton.
Loading keeps the official home logo while removing header/footer rules and extra
navigation. Three quiet primary/accent radial fades surround the content. The
shared 2.25-second skeleton clock and 14-second flight respect reduced motion;
runtime flight activity uses the existing observer and cleans up on unmount.

Critical styles and server-rendered markup remain available before any client
request finishes, with neutral palette fallbacks. Startup markup omits route
headings, landmarks, IDs and state markers so its persistent hidden overlay cannot
become a second page in document queries. Logo assets and the home link use the
same deployment base in both phases. PreactPress retains readiness, timeout and
no-script behavior. Compact previews retain their smaller embedded layout.

A same-code development tour through all 15 Button examples measured collected
JavaScript heap of **93.70 MiB with unlimited retention versus 56.82 MiB with the
three-document budget** (39.4% lower). This is a measured retention improvement,
not a claim about total renderer memory or battery watts. Native Safari 17.6 also
reproduced the missed iframe-load event; Safari's reported automatic tab
termination itself has not been reproduced.

Route generation now writes only changed final output, formatting TypeScript
before comparison. An unchanged run touched zero files across the observed
1,021-file route/output inventory, avoiding unnecessary development watcher work.
Listener, observer, timer, and stale-result cleanup is covered in focused tests.

A separate pinned **PreactPress 2.2.1 patch** fixes a reproduced development
catalog race. Scans build a replacement privately and publish atomically; overlaps
are serialized; module output retains one snapshot; stale requests cannot replace
newer cache entries; and failed refreshes retain the last valid catalog. Invalid
initial builds still fail. The patch is registered through pnpm, documented for
removal when upstream supplies equivalent guarantees, and tested through the
installed plugin's real scan/load functions.

Documentation text uses native system stacks across theme scopes. Brand asset
synchronization removes external font imports reproducibly, the unused Inter font
dependency is removed, and browser tests assert that unexpected font requests are
absent. This deliberately trades per-preset web typography for stable immediate
text rendering on the documentation site; public theme font choices remain
available to consumers.

Loading and recovery pages share immediate critical styling, restrained motion,
and clear actions. Viewport-height flex layout and safe-area insets keep the
outer document at the screen height. The analytics image remains requested but
is explicitly 1px and positioned out of flow, removing the extra pixel after a
full-height page. Short loading screens use tighter decorative spacing and the
intended smaller skeleton footer, so the normal 320×568 view fits without an inner
scroll range. The 404 body is a single minimal unit: a plain decorative 404,
“Page not found,” one short sentence and two recovery links. It retains the shared
header/footer and fits the viewport without document or main-content scrolling.
Short wide windows place the number beside the message instead of stacking it.
The 404 header/footer and interrupted-load separators retain a quiet 8% neutral-ink rule.

Genuinely taller loading and interrupted-load copy remains accessible in its
reading scrollport on short or enlarged-text displays. Before startup is ready, the existing JavaScript-only
busy marker constrains the hidden SSR document while the fixed loading overlay
keeps its own scrolling. The rule clears at readiness and never locks no-JS
reading. Rendered recovery states are tested separately from a static host's
plain response to an unknown URL. Site-owned brand geometry is bundled in the
main stylesheet so 404/loading/error headers match even if external brand CSS is
unavailable, and only the appropriate light/dark symbol is visible. The ordinary
footer retains its existing generated brand resource.

Performance review did not justify replacing iframe isolation, adding global
caches, or introducing another state layer. Diagnostic formatting measurements
are treated as measurements of their specific operation, not universal browser
latency promises. Remaining route and source size still matters, especially when
accessibility checks traverse a large highlighted document.

## Compatibility, distribution, and maintenance

The retained public changes add reusable readers, controls, and composition
options. Code uses the pre-feature application-aware or named Prism presentation;
there is no automatic inversion or separate source color-mode API. Callouts share
a quieter skin and selected controls use the consolidated styling. Existing
default and line tabs remain available, and the OpenUI adapter explicitly selects
its intended line treatment.

Prism and its development types move from docs to the core package that owns
highlighting; core also declares its reusable-control icon dependency. Core and
blocks exports, source aliases, CSS copy steps, and build entrypoints are aligned.
Generated route stubs, manifests, and thumbnails are reviewed with their owning
definitions rather than as independent handwritten features.

The audit also corrects a real clean-checkout CI ordering problem: docs tests
could import **@kamod-ch/blocks/shared** before blocks had built runtime output.
The root CI command now builds the prerequisite theme/typeset and UI dependencies,
builds blocks, runs the blocks suite, and then runs docs tests. The documentation
build command also builds blocks before the site. Dependency analysis recognizes
the lazy home route, unused font exceptions are removed, and Biome configuration
uses the installed version's equivalent supported schema/settings.

Contributor instructions, preserved issue briefs, the fork workflow guide, and
the supplied logo are included as repository documentation/assets in the final
contribution scope. They are distinct from shipped product functionality. Public
instructions tolerate a fresh clone without private context files and describe
the current CI/build order and actual fork/upstream workflow. Private .docs
material and the protected .gitignore change remain excluded under the existing
contribution policy.

## Validation

The final audit checks the complete implementation, including the inverse-feature
rollback and all later reference, Prompt, performance, ecosystem, preset-study,
branding and navigation changes. The public color-mode prop/type, inversion
wrappers, paired theme values and mode-specific routes/tests are removed; the
nine supported syntax palettes and normal application appearance remain.

The theme guides pass **1,052 documentation tests in 112 files**, docs
typecheck/production build, root Oxlint/Oxfmt/Biome, dependency and authored-file
whitespace checks. Thirteen preceding production Chrome cases cover the 24 Prism
palettes, required widths, keyboard controls, exact copies/downloads and existing
app-theme/sidebar history. Five layout/control cases pass after visual refinement.
The latest guide cleanup passes four responsive cases in both appearances, the
incoming config route (plus three repeats) and its existing grammar regression.
Historical source `pre` colors remain excluded from contrast auditing; toolbar
and surrounding controls are checked. The preceding app-study audit covers all
eight presets, working playgrounds, bright actions and three block reload repeats.
No new Safari/WebKit result is claimed.

The loader-handoff follow-up passes **954 documentation tests in102 files**, docs
typecheck/production builds and root Oxlint/Oxfmt/Biome/Knip/Syncpack. All **36
combined production Chrome reference/page-state cases** pass together, with both
handoff cases passing again after the final staged fade. Pending/midpoint/ready
desktop/tablet/phone captures were inspected; icon/title paint, geometry, font and
content match, skeleton timing is shared, and no overflow/page errors occurred.
Reduced motion switches immediately; outgoing loops/status stop as soon as ready.
No new Safari/WebKit result is claimed.

The preceding flat-resource/header follow-up passes **951 documentation tests in102 files**,
docs typecheck/final production build and root Oxlint/Oxfmt/Biome/Knip/Syncpack.
All **16 affected production Chrome cases** pass together, including eight
reference families at320/768/1440px in both appearances, source classification,
native navigation, optional coloring failure, keyboard and scroll/pointer retention.
Desktop/tablet/phone captures confirm the8.5px minimum,12px resource gap, shared
summary/context/fact styling and no overflow/page errors. An earlier local-chunk
`ERR_NETWORK_CHANGED` was verified in its trace; the complete final run passes.
No new Safari/WebKit result is claimed.

The preceding page-opening refinement passes the same **946 documentation tests in101
files**, docs typecheck/production build and root Oxlint/Oxfmt/Biome. All **18
production Chrome page-state cases** pass together, covering pending full/compact
routes, both appearances, responsive/enlarged text, reduced motion, first paint
without site CSS and recovery navigation. Ocean desktop, Kamod tablet and Cursor
warm phone captures were inspected with aligned borderless skeletons, no overflow
and no page errors. No new Safari/WebKit result is claimed.

The preceding source-download follow-up passes **946 documentation tests in101 files**,
documentation typecheck and the production build, plus root Oxlint/Oxfmt/Biome,
Knip/Syncpack and whitespace checks. All **29 affected production Chrome cases**
pass together, covering exact source bytes/filenames, compact selected showcase
files in both appearances, custom Copy composition, hidden-action opt-outs,
existing Prompt downloads and clipboard/control feedback. Desktop-light and
phone-dark idle/completion captures were inspected without overflow or page errors.
This docs-host addition changes no public core API or dependency.

The preceding documented-table follow-up passes the full workspace `test:ci`
command (**1,583 tests**, including907 docs), followed by **908 documentation
tests in98 files** after the final deployment-prefix regression. Documentation
typecheck and the final production build, root Oxlint/Oxfmt/Biome,
Knip/Syncpack and whitespace checks pass. All **30 production Chrome reference
cases** pass together, including eight reference families at320/768/1440px in
both appearances, actual Dialog composition/default/owner/type-card content,
uniform index links, classification, optional grammar failure, native navigation,
keyboard/touch and scroll/pointer retention. Desktop/mobile/tablet source-specific
captures were inspected; no new Safari/WebKit result is claimed.

Earlier full audit (before the reference-source follow-up below):

| Check                | Final local result                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace typecheck  | `corepack pnpm typecheck` passed.                                                                                                      |
| Full workspace build | `corepack pnpm build` passed, including production docs.                                                                               |
| CI unit command      | `corepack pnpm test:ci` passed: **1,531 tests in 184 files**.                                                                          |
| Unit breakdown       | Themes 11; core 421; OpenUI 19; motion 25; blocks 194; docs 861.                                                                       |
| Static checks        | Root Oxlint, Biome, Oxfmt, README consistency and whitespace pass.                                                                     |
| Dependencies         | Knip and Syncpack pass.                                                                                                                |
| Package contracts    | Publint and Are the Types Wrong pass for configured packages.                                                                          |
| Production Chrome    | **165 distinct affected cases passed across the audit and focused reruns**; all 29 final appearance cases passed across recheck/retry. |
| Remote CI            | Passed: [CI #294](https://github.com/kamod-ch/kamod-ui/actions/runs/38790963363) on implementation `1f97720d`.                         |

Two browser cases were interrupted by Chrome `ERR_NETWORK_CHANGED` while loading
local assets; their traces identify that transport failure and both pass on focused
rerun. The production preview was restarted after the final CSS rebuild so its
server-rendered asset manifest matched the files being tested. These are combined
run results, not a claim that the initial full run had zero interruptions.

The review found existing meaningful coverage for observer/listener removal,
queued versus started preview work, bounded retention/eviction, stale async
results, pre-hydration readiness and Markdown download teardown. One missing
appearance case was added: adaptive Default/Dusk/Forest syntax colors now follow
the nearest explicit scope even inside alternating light/dark ancestors. The fix
uses an inherited private CSS weight and adds no public mode API, automatic
inversion, runtime state or listeners. Pure spacing/paint updates do not gain
redundant tests that only duplicate their CSS declarations.

The focused browser matrix exercises source customization, nine palettes, scoped
semantic tokens, private references, Prompt copy/download/defaults, lazy loading,
preview energy/retention, preferences, navigation, ecosystem cards/conclusion,
type declarations, exception states and responsive home/shared guides. Complete
authored TSX examples are also compiled against the real component API by the
documentation suite.

Earlier native Safari 17.6 tours covered every Button, Code and Skeleton example,
pre-hydration block readiness and offscreen suspension, plus a settled home page
with zero running animations during a visible 60-second idle check. Those are
historical measurements from the energy investigation, not a fresh full Safari
run. They did not reproduce automatic tab termination. Playwright WebKit and
physical iPhone coverage remain subject to the explicit platform limit below.

### Reference-source follow-up validation

Implementation `b3442111` passes workspace typecheck/build and a final documentation
rebuild/typecheck. The final `corepack pnpm test:ci` passes **1,545 tests in 185
files**, including **875 documentation tests in 92 files** (fourteen additional
unit cases). Root Oxlint, Oxfmt, Biome, README sync, Knip/Syncpack, Publint and ATTW
pass. All **16 production Chrome reference cases pass in one isolated final run**,
covering both appearances, narrow/desktop widths, lazy loading, original source,
keyboard flow and the reported examples. The committed build receives a final
focused rerun as well.

An earlier browser run collided with another audit while saving its trace file;
the final isolated run removes that harness conflict. It was not an application
assertion failure. The older Safari/WebKit limits above remain unchanged. Current
[PR checks](https://github.com/kamod-ch/kamod-ui/pull/80/checks) report CI for the
pushed follow-up rather than the historical implementation listed in the matrix.

### Tooltip redesign validation

The complete `corepack pnpm test:ci` passes **1,550 tests in 185 files**, including
**880 documentation tests in 92 files**. Documentation typecheck/build and root
Oxlint, Oxfmt and Biome pass. All **21 affected production Chrome cases** pass,
including seven families at 320/768/1440px in both appearances, keyboard return,
one-line locations, shared chip paint and a deliberately blocked optional syntax
module. Desktop/mobile component and stylesheet cards were visually inspected.
The earlier Safari/WebKit boundaries remain unchanged.

### Earlier merge-readiness review (before the reference follow-up)

The implementation head `1f97720d` is present on the fork and PR #80. After
refreshing both remotes, current upstream `main` (`c20aa880`) is already an ancestor
of the branch. GitHub reports a clean merge state and a non-draft PR; there are no
unresolved review threads or change-request reviews, and a maintainer approval is
recorded. Full-branch whitespace and conflict-marker checks also pass.

That earlier review recorded the implementation without changing code or
dependencies. The subsequent reference correction described above has separate
validation evidence; the current [PR checks](https://github.com/kamod-ch/kamod-ui/pull/80/checks) remain
the source for the latest documentation revision's CI result. Existing conditional
browser skips retain their documented feature/platform gates; no focused tests
or unmerged index entries were found.

## Color-theme guidance

The complete preset chapters described above share the existing gallery reading
path and palette-specific navigation. The following validation records cover
earlier refinements; the latest expanded-study checks are recorded separately.

### Visual-study validation

The full documentation suite passes **880 tests in 92 files**, including six
gallery tests. Final docs typecheck/build and root Oxlint, Oxfmt and Biome pass.
All **nine production Chrome theme-guide cases** pass with the final styling,
including 320/768/1024/1440px, both appearances, every applied preset, palette
isolation, label paint, keyboard disclosures, contrast, overflow and recipe
cleanup. Desktop light/mobile dark studies were also inspected visually. An
initial preview stalled before the cards were reached; restarting it after the
completed build restored startup, and the final isolated browser run passes.
No startup workaround was added. Earlier native Safari/WebKit coverage remains
as recorded above.

### Simpler preset-gallery introduction

The gallery's three explanatory step blocks are now a short, wrapping numbered
reading path. Its links lead to the first palette study, the existing type/shape
guidance and the application example, with visible keyboard focus and one quiet
separator. The shared description uses restrained emphasis, real `--primary` and
`--card` examples, and a link to the semantic foreground/surface pairings. The
existing runtime snippet remains available below; the introduction needs no new
reader, component state or animation. Short inline token examples stay together
on narrow screens. The six gallery tests, docs typecheck/build and root
Oxlint/Oxfmt/Biome pass; Chrome checks cover 320/768/1024/1440px in both appearances,
with a final 320/1440px rerun for the small text adjustment. Link targets, keyboard
focus and desktop/mobile screenshots were checked directly.

### Preset-colored gallery pills

The gallery jump links now preview their own presets: real backgrounds, three
overlapping primary/secondary/accent circles and declared primary font stacks.
Slightly smaller, semibold labels retain the primary hue with lightness adapted
for readable small text. CSS chooses an explicit local light/dark paint while
keeping a single accessible anchor, full name and exact subsection destination.
Changing the application preset cannot recolor or change the named fonts of the
other pills; neutral presets keep their native application/system direction.

Hover and keyboard focus reveal a quiet three-color wash, a tinted boundary and a
small shadow, with one finite secondary-to-primary gradient sweep. The arrow
moves from 45% opacity to the exact primary color at full opacity, grows 12% and
shifts just 1px toward the top right. The pill stays in place. Reduced motion
removes transitions, the sweep and arrow movement while preserving color/focus
feedback. There are no idle loops, extra fonts, listeners, observers, timers or
JavaScript animation. ThemePresetPill and its feature stylesheet own the markup
and paint; browser coverage checks palette/font isolation, matching source colors,
hover completion, keyboard navigation and reduced-motion behavior. The six gallery
tests, docs typecheck/build and root Oxlint/Oxfmt/Biome pass. Final Chrome checks
cover four viewport widths in both appearances and the new interaction case,
including 4.5:1 label contrast across all sixteen preset appearances. Default and
hover states were also inspected visually on desktop light and mobile dark.

### Subtle detected-inline-code feedback

All detected prose references and glossary hints share a 55% primary dashed
underline and a full-color hover/keyboard cue. Their text stays at500 weight with
no hover growth, stroke, recoloring, movement or arrow. Only the dashed cue changes
visibility; focus indication and reduced-motion support remain. Snippet tokens
retain their own35% cue and source ink. Detector-owned classes still restore on
teardown, with no added per-term behavior.

Ordinary prose code follows its actual parent text at94%, controlled by one shared
--inline-code-text-scale value. This includes page descriptions, subsection copy,
short continuation sentences and captions; nested links do not apply the reduction
twice. Heading names, source readers, file/control labels and private tooltip
content keep their own typography. Explicit compact/regular demonstration choices
remain available, while old context-based12/14px prose overrides are removed.

Plain and linked prose code share a compact text box with1.2 line height and a
small em-based inset. Each fitting token moves intact to the next sentence line;
oversized literals remain selectable in their own bounded horizontal scroll area.
Paths retain their atomic grid, middle shortening and emergency endpoint handling.
Standalone source-card package identities keep their existing font, inherited line
height and roomier highlight geometry. No text, destination, reference cue or
runtime navigation behavior changes.

### Shared page flow and route-local flight

Implementation/design reading notes and their cards now share a heading above
the pair. Icon/title, a dot-separated short context and the real source action align
on one row. Remove the former note icon column and duplicated card heading, keeping
existing fragment destinations. The expanded shared page ending connects setup,
adjacent components/blocks, semantic styling and a complete interaction review.

Getting Started places a transparent, foreground-ink rocket higher and farther
left in the heading corner without changing normal title flow. The vehicle makes
one gentle ascending pass over 14 seconds; fading at the ends hides its reset and
avoids backward flight. Six independent outline stars sparkle at subtly varied
sizes and choose new bounded positions only while invisible. Stable server-rendered
positions and a mid-flight start keep the illustration visible before hydration.
The shared viewport controller pauses the artwork offscreen or in a hidden tab
and removes its subscription on departure. The active pinned guide icon has a
smaller, slower flight only on the directly visible desktop sidebar. Reduced
motion leaves a static rocket and stars. No animation library, timer, JavaScript
frame loop or persistent state is added.

## Review map

Start with **core Code and CopyButton**, then **application theme scopes** and
**the shell shared frame**. Continue through **docs references**, **showcase and
preview startup**, **runtime compatibility/catalog patch**, and **navigation and
page-state owners**. Review the content families and generated assets against
those implementations afterward. The detailed ledger's file-family table covers
the remaining component refinements, route/plugin changes, test suites, package
configuration, and contributor documents.

The branch preserves its existing published history. Follow-up commits are scoped
by reader/theme contracts, detailed guides, preview lifetime, inline references,
Prompt delivery, ecosystem content and shared presentation, with these two review
documents committed together at the end. The push updates the existing PR branch
without rewriting earlier history.

### Local WebKit runtime limitation

The machine runs macOS 14.8.9 on ARM64. Installed Playwright 1.63.0 selects its
frozen WebKit 2251 override for that platform; the matching browser is already
installed, and an install dry run selects that same archive. Its protocol lacks
`PushAPIEnabled`, which the driver sends before creating a page, so reinstalling
would not repair this mismatch. WebKit needs a supported current runner or an OS
upgrade; no dependency downgrade or protocol patch was introduced to conceal it.
The later energy audit used system safaridriver successfully after remote automation
was enabled, providing the native Safari coverage described above without changing
this incompatible Playwright installation.
