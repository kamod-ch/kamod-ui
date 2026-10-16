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
| Appearance           | syntaxTheme and default/subtle/outline surface variants.                                                                   |
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

All eight color presets now have a structured design study with four small,
static compositions: a workspace and action card in both light and dark. The
sketches use the real shipped roles and corner values, while their surrounding
frames gain a restrained wash and three-role signature from their own preset,
with explanatory text remaining in the page palette. Four labeled swatches give an immediate comparison; native
disclosures reveal additional surface, navigation and feedback roles.

Each study explains its direction, two practical design principles, declared
body/display/mono stacks, radius family and a focused review before shipping.
Each preset also provides three suggested contexts and an actionable task/check.
Exact typography and corner facts stay visible, while longer advice uses native
disclosures; an optional local-scope recipe mounts its source reader only while open. Direct
links reach the actual preset CSS, and shared next steps cover persistence,
token pairs, sidebar roles, typography, syntax colors and complete layouts.

The Theming introduction gains four reading paths, the gallery gains compact
preset links, and ten generated subsection routes preserve the real heading
hierarchy. Nested section URLs now recognize descendant headings when opening
without a fragment. Container-based layout stacks comparison and advice on
narrow articles, with secondary text strengthened locally for readable contrast
without changing the underlying palettes or adding downloaded fonts. A balanced
introduction/comparison row and compact guidance remove unused space; observed
wide studies became approximately 9–15% shorter despite the additional guidance.

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
resting at 35% in snippets and 65% in prose, then reaching full color on hover or
focus. Slow glyph-stroke emphasis preserves widths and Prism ink. Inline chips
add a tiny arrow and barely visible lift, with their cue above the highlight.

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
technologies and pages/sections. Named guides use the same Page / section category. The catalog includes 76 curated technology
labels, twenty CLI tools, registry-derived block identities, verified route titles
and real fragments. Aliases resolve conservatively; unknown or ambiguous labels
stay literal. Command parsing is bounded and rejects shell composition or expansion;
it never executes text. These additions do not broaden source-code detection into
arbitrary word matching.

The eager index contains lightweight identity/destination data. Four lazy family
modules provide descriptions and facts, sharing bounded promises and evicting
failures for retry. Kind icons, labels and optional contract headings have one
owner, and the kind badges share the page inline-code highlight and subtle 3px
corners. Existing stale-result and delegated-event boundaries remain in place.

### Reference identity and package source accuracy

Source-backed component display labels resolve to their canonical exports before
page-title aliases. `Theme Toggle` therefore shows `ThemeToggle` component props,
related types and its implementation; an explicit documentation path still means
a page. Named guides reuse canonical Page / section facts and one lazy family.
Unambiguous package/product names retain package identity, and an authored local
href cannot turn a real package specifier into a generic page reference. Explicit
navigation stays intact while tooltip resources are selected independently.

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

Package/module cards lead with source in their origin and footer, alongside an
independently chosen local integration link. Specific destinations cover global
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

The shared private tooltip retains its icon/name heading with one larger type
badge and a square compass link to the chosen main destination. The badge and
exact path share the ordinary page inline-code highlight and 3px corners; the
badge uses 12px, medium-weight text and a slightly smaller matching outline icon.
Technology uses a familiar lightbulb symbol. The compass reuses the application's
standard icon-action hover, focus and reduced-motion behavior, with inverse-card
paint; it is omitted when no verified destination exists. The redundant origin
badge and its derivation are removed. Up to two verified, deduplicated shortcuts
follow immediately with slash separators; the row stays on one line and yields to
narrow screens without losing its underlying text or destinations.

Descriptions retain source-backed content and support safe code, emphasis and
explicit HTTP(S)/local links. Smaller, quieter supporting detail explains aliases,
licenses or the limits of a declaration summary. Contract fields, reference facts
and related reading each have their own compact bordered panel. Required/optional
labels, actual counts, highlighted types and role captions make the content easier
to scan. Related resources use two columns when space allows and stack on narrow
screens; a bare props type name stays an inline chip instead of a nested code box.

The footer has one primary link on the right and a subtle family-specific context
note on the left. It stays visible when long contents scroll, while secondary
source/guide resources remain in the location row or related panel. Existing
package-source priority, accessible names, top-frame navigation, focus return and
failure/loading behavior remain intact.

Tiny declarations reuse the existing grammar in a separate lazy module, requested
only for references with a contract. Literal text is the immediate fallback, and
these fragments mount no reader toolbar, observers or token-level listeners.
A local error boundary retains plain code and navigation if the optional syntax
chunk fails, keeping that failure away from the page boundary.
Focused presentation helpers own resource selection, safe prose, contracts and
related reading. Production checks cover seven families at 320/768/1440px in both
appearances, plus the existing loading, source, keyboard and dismissal cases.

### Showcase Prompts and download feedback

All showcase Prompts start in Code, including block details and the home example.
Display switches remain local while mounted; obsolete persisted Prompt display
state is removed. Non-block compact layouts show icons for Plain Text/Code/Markdown,
while block details keep their narrower threshold. Setup/Adaptation Prompt text
and icons match the introduction heading, with tighter Source Included metadata.

A private reusable Markdown action sits before Copy and downloads the complete
original document in every display mode. It hands a native Blob link to the browser
within the click gesture, then shows finite downloading/downloaded feedback before
resetting. Three persistent glyphs and a purple version of the shared copy ring,
orbit and glow avoid SVG replacement glitches. Status text describes browser
handoff, not unverifiable disk completion. Repeat clicks, source changes, errors
and unmount release timers/object URLs; compact controls retain accessible names.

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
The page ends with three concrete continuation paths and links back to its example
and map. An optional DocsShell footer slot keeps that conclusion page-owned; its
contents anchor and responsive one/two/three-column layout share existing patterns.

Desktop navigation content is reused in the responsive drawer with separate
expansion and scroll memories. Active destinations are revealed, page-title and
contents links share a consistent hierarchy, and topbar offsets keep anchored
headings visible. A site-only Light/Dark/System menu uses existing theme signals
and dropdown primitives without changing the public ThemeToggle API. Shared
selection surfaces, badges, neutral menu triggers, stationary navbar hover, and
persistent state glyphs make controls consistent across pages. Appearance choices
now have exactly three sample bars; palette choices retain four.

Both sidebar gutters are wider and link hover fills are easier to see. Page labels
use a softened inline-code surface, compact padding and 2px corners; an equal
reduction in their preceding gap preserves title/content coordinates. The same
surface paints selected groups, nested links and pinned left destinations on
desktop/mobile. Numeric counts have no background; Fresh/Updated/Planned badges
use 20% of the actual secondary role with readable text/icon ink. These changes
are shared CSS, without additional subscriptions or animation loops.

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
and clear actions. Viewport-height flex layout, safe-area insets, internally
scrollable content, and short-window adaptations keep controls reachable on
narrow, short, and enlarged-text displays. Rendered recovery states are tested
separately from a static host's plain response to an unknown URL. Site-owned brand
geometry is bundled in the main stylesheet so 404/loading/error headers match even
if external brand CSS is unavailable, and only the appropriate light/dark symbol
is visible. The ordinary footer retains its existing generated brand resource.

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

## Visual-first color-theme studies

Each of the eight individual preset studies now opens with a quieter frame and a
clear color-system section. Its two explicit appearances each show eight larger,
labeled semantic swatches before the same Workspace, Action Card and new Feature
sketches. Primary, secondary, accent, canvas, card, muted, danger and sidebar
colors come from the shipped theme CSS; text stays on a readable surface below
each fill. Supporting foreground pairs, focus, boundaries and feedback remain in
an expandable role list. The frame wash is reduced from 9%/6% to 3%/2% so that the
actual palette samples provide the color emphasis.

A shorter direction/use row, icon-led subheadings, a token-guide link and thin
separators make the study easier to scan. A compact native-font specimen and the
source-backed font-stack labels sit alongside larger corner-family samples. The
complete palette narrative, design principles, task and review remain available
under **Design notes & practical checks**, rather than extending the default view.
Preset-specific type/shape notes and copyable scoped recipes retain their own
native disclosures. The main section now shows more visual information with less
always-visible prose.

`PaletteSketch` owns the three static compositions, and `ThemeStudyNotes` owns the
longer reading. The gallery retains its original preset/scheme persistence,
hydration-safe selection, local appearance boundaries, subsection routes, source
links and lazy recipe cleanup. No font downloads, animated skeletons, timers,
observers, dependencies or additional background activity are introduced.
Container queries adapt the swatches and paired appearances to the available
content width. Existing regression tests now cover the eight main roles, six
sketches per preset, closed notes, keyboard expansion, swatch dimensions and
palette isolation, with 1024px added to the existing 320/768/1440px browser matrix.

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

All detected prose references and glossary hints now share a 65% primary dashed
underline and full-color hover/keyboard cue. A tiny empty-content CSS-mask arrow
uses the same underline color at 18% opacity normally and 100% on interaction.
Original code strings, copy output, accessible names and reference metadata stay
unchanged. The icon reserves its space in both states, and no icon DOM nodes are
inserted into prose.

A 0.08px glyph stroke carries the optional 45% underline-color tint, with a 0.12px, 12%-opacity
ink shadow for barely visible weight/visibility feedback. A quarter-pixel upward
offset is similarly restrained; emphasis transitions over 520ms and movement over
320ms. Reduced motion removes transitions and the lift. A dedicated inline cue
stylesheet covers authored, detected, glossary and legacy nested shapes, leaving
the existing delegated help controller and source snippet styles intact. No new
JavaScript, timers, listeners, observers, fonts or perpetual effects are introduced.
Short glossary chips stay atomic so their highlight and arrow cannot orphan at a
line break. The 58 focused reference tests, docs typecheck/build and root
Oxlint/Oxfmt/Biome pass. All fourteen affected production Chrome cases pass,
including exact text/navigation, lazy help, source-snippet regressions, touch and
keyboard operation, legacy links, both appearances, narrow/desktop bounds,
hover-width stability and reduced motion. Final default/hover screenshots were
inspected on desktop light and mobile dark.

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
