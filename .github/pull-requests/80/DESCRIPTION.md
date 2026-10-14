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
remains readable escaped text. It never evaluates supplied code.

The public composition model covers optional headers, useful source metadata,
controlled or uncontrolled reading preferences, and replaceable controls:

| Concern              | Public API and behavior                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Source and language  | code, language, inferLanguage, highlight, and the exported codeLanguages catalog.                                          |
| Appearance           | syntaxTheme, colorMode, and default/subtle/outline surface variants.                                                       |
| Header and identity  | showToolbar, filePath, renderFilePath, renderLanguage, toolbarContent, and renderToolbar.                                  |
| Wrapping             | wrapped/onWrappedChange or defaultWrapped, with optional overflow-based controls.                                          |
| Import folding       | importsCollapsed/onImportsCollapsedChange or defaultImportsCollapsed, applied to eligible complete leading static imports. |
| Replacement controls | renderImportControl, renderWrapControl, and renderCopyAction receive typed state, actions, IDs, and default controls.      |
| Content composition  | beforeCode, afterCode, loadingContent, and renderedContent.                                                                |
| Source navigation    | resolveReference or an inherited CodeReferenceProvider; null opts a reader out.                                            |

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

### Source appearance opposes the surrounding mode by default

The final source appearance contract is **colorMode="inverse"** by default.
Source surfaces appear dark in the nearest light scope and light in the nearest
dark scope. Consumers can choose **inherit**, **light**, or **dark** explicitly:

```tsx
import { Code } from "@kamod-ch/ui/code";

<Code code={source} language="tsx" />;
<Code code={source} language="tsx" colorMode="inherit" />;
<Code code={source} language="tsx" colorMode="dark" syntaxTheme="forest" />;
```

Only the source or rendered document receives this policy. Headers, copy actions,
import/wrap controls, before/after slots, and ordinary page content keep their
ambient appearance. Local light/dark scopes work independently of the page root,
including locally themed showcases inside the opposite site scheme.

The same CSS source marker supports raw preformatted fences without extra wrapper
DOM. Bare fences inside a rendered source document inherit that document's chosen
mode; explicitly configured nested Code instances retain their own mode. Source
semantic colors are resolved locally so rendered Markdown can use background,
foreground, muted, border, card, and related tokens consistently.

All eight syntax palettes—Default, Dusk, Forest, Monochrome, Okaidia, Tomorrow,
Twilight, and Solarized Light—adapt to both source modes. Palette changes are CSS
changes, not another tokenization pass. Inherited mode flags and color-mix select
paired endpoints without adding per-reader effects, observers, listeners, or a
new light-dark() browser requirement. Code's styles are split into reader layout,
Prism palettes, and source-mode resolution, and the package build copies all of
those CSS assets.

Source references use the exact primary endpoint for the selected source mode,
with reader-specific pair overrides taking precedence over generic theme pairs.
This preserves colored theme hues and makes neutral primary dashes visible on
the inverse canvas without changing source text colors or the global primary
token. The eight application presets expose their original paired endpoints for
this purpose.

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
same source characters. A single faint primary dashed cue strengthens on hover
or focus without an extra arrow or second underline.

### Shared controls retain their existing ownership

CopyButton centralizes clipboard writes, stale-operation guards, retry behavior,
timer cleanup, custom-control composition, and accessible success/error feedback.
It is reused by source viewers and existing block examples. The shared visual
feedback keeps its footprint, supports reduced motion, and retains glyph nodes
through state changes where layered presentation is appropriate.

Tabs gains an opt-in inset variant while default and line variants remain
available. AlertCallout adds a structured, non-live guidance composition with
semantic headings and a quiet shared default. TypeDefinition gains useful
source-reference metadata. Tooltip positioning and lazy resizing, bounded dropdown
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

The content changes span foundational controls, inputs, overlays, navigation,
data display, feedback, media, utilities, motion, Formisch, and theming. They add
practical composition and ownership guidance without describing ordinary prose
changes as new component APIs. Code receives a complete guide, live customization
and palette studies, source-mode examples, resolver integration, language details,
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

Desktop navigation content is reused in the responsive drawer with separate
expansion and scroll memories. Active destinations are revealed, page-title and
contents links share a consistent hierarchy, and topbar offsets keep anchored
headings visible. A site-only Light/Dark/System menu uses existing theme signals
and dropdown primitives without changing the public ThemeToggle API. Shared
selection surfaces, badges, neutral menu triggers, stationary navbar hover, and
persistent state glyphs make controls consistent across pages.

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
a time. Waiting previews can be canceled, but started documents retain entered
state. Readiness, failure, and unmount release the queue slot. Listener, observer,
timer, and stale-result cleanup is covered in focused tests.

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
and clear actions. Viewport-height flex layout, safe-area insets, internally
scrollable content, and short-window adaptations keep controls reachable on
narrow, short, and enlarged-text displays. Rendered recovery states are tested
separately from a static host's plain response to an unknown URL.

Performance review did not justify replacing iframe isolation, adding global
caches, or introducing another state layer. Diagnostic formatting measurements
are treated as measurements of their specific operation, not universal browser
latency promises. Remaining route and source size still matters, especially when
accessibility checks traverse a large highlighted document.

## Compatibility, distribution, and maintenance

The public changes are additive except for deliberate presentation differences:
the new Code reader defaults to inverse source appearance, callouts share a
quieter skin, and selected controls use the consolidated styling. Code consumers
can choose colorMode="inherit" or an explicit source mode. Existing default and
line tabs remain available, and the OpenUI adapter explicitly selects its intended
line treatment.

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

The final local audit covers the assembled product changes. All 153 distinct
focused production Chrome cases passed across the broad run and targeted reruns;
the local unit/build/static/package checks below passed as well. The live result
for the pushed revision belongs to [PR #80 checks](https://github.com/kamod-ch/kamod-ui/pull/80/checks).

| Check                                | Result                                                                                                      |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Workspace typecheck                  | Passed: `corepack pnpm typecheck`.                                                                          |
| Corrected clean-workspace CI command | Passed: `corepack pnpm test:ci`, 1,467 unit tests.                                                          |
| Unit breakdown                       | Themes 11; core 428; OpenUI 19; motion 25; blocks 194; docs 790.                                            |
| Full workspace build                 | Passed for all seven buildable packages in the eight-project workspace.                                     |
| Final production docs rebuild        | Passed.                                                                                                     |
| Oxlint                               | Passed without warnings.                                                                                    |
| Biome                                | Passed across 1,693 files with the supported configuration.                                                 |
| Oxfmt and diff hygiene               | Passed; both reports formatted.                                                                             |
| Dependency analysis and policy       | Passed; policy checked 900 entries.                                                                         |
| Frozen dependency installation       | Passed with the pinned patch and lockfile.                                                                  |
| Generated package README check       | Passed.                                                                                                     |
| Publint and Are the Types Wrong      | Passed for the three configured public ESM packages; intentional legacy modes remain excluded.              |
| Focused production browser matrix    | 153 distinct Chrome cases passed, including targeted reruns.                                                |
| Safari/WebKit                        | Local runner blocked before page creation by unknown `PushAPIEnabled` setting; no application pass claimed. |
| iPhone browser project               | Not separately validated; responsive Chrome coverage is included above.                                     |
| Remote checks                        | See the linked live checks for the pushed revision; local results do not predict remote status.             |

The browser scope covers source modes and palettes, reference navigation/help,
copying, stable glyphs, appearance, text rendering, package references,
loading/recovery states, responsive showcases, and home integration. Sleep-event
interruptions were rerun successfully. Three test assumptions were corrected
without weakening intended behavior: implicit light mode, the actual Markdown
sizing owner and scroll region, and full RGB transition completion. A missing
generated preview asset was handled by rebuilding production output before the
final checks. WebKit's local binary/protocol failure remains a validation limit.

New tests were warranted for stable menu indicators and selected-picker hover.
The added seven-case indicator suite checks identity, state, focus, and controlled
behavior; pointer-hover checks verify a subtle selected wash without changing the
selection plate, text, or check. Existing source, clipboard, lazy catalog,
reference, cleanup, and responsive suites cover their changed contracts.

## Review map

Start with **core Code and CopyButton**, then **theme scope/primary pairs** and
**the shell shared frame**. Continue through **docs references**, **showcase and
preview startup**, **runtime compatibility/catalog patch**, and **navigation and
page-state owners**. Review the content families and generated assets against
those implementations afterward. The detailed ledger's file-family table covers
the remaining component refinements, route/plugin changes, test suites, package
configuration, and contributor documents.

The branch preserves its existing published history and the two prior local
feature commits. Final refinements are grouped by shared UI, site/runtime/CI,
contributor guidance, and these two review documents, so the final push updates
the existing PR without rewriting its earlier feature history.

### Local WebKit runtime limitation

The machine runs macOS 14.8.9 on ARM64. Installed Playwright 1.63.0 selects its
frozen WebKit 2251 override for that platform; the matching browser is already
installed, and an install dry run selects that same archive. Its protocol lacks
`PushAPIEnabled`, which the driver sends before creating a page, so reinstalling
would not repair this mismatch. WebKit needs a supported current runner or an OS
upgrade; no dependency downgrade or protocol patch was introduced to conceal it.
