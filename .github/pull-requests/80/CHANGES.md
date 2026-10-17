# PR #80 — Complete change ledger

This document inventories the complete PR: its published history and all subsequent
implementation, documentation, visual and audit refinements. It describes the
resulting behavior rather than superseded experiments. The companion
[DESCRIPTION.md](DESCRIPTION.md) explains the architecture, compatibility,
performance evidence, review order and final validation as a connected narrative.

The comparison starts at **c20aa8802fcffa50aa8c86868d3e667a1492ea80**. Review the
final branch tree against that base; intermediate commit/file totals are omitted
because they do not describe the final contribution. Private `.docs/` material and
the protected local `.gitignore` edit remain outside the commits.

## 1. Reusable core Code component

### Public component and package entrypoints

- **Reusable source reader.** Add Code as a Preact-native core component for read-only source, terminal commands, and text. The component owns source presentation while applications retain the source string and surrounding application state.
- **Focused imports.** Export the reader through the package root and the dedicated @kamod-ch/ui/code entrypoint. Provide @kamod-ch/ui/code/highlight for consumers that need the shared highlighting helper without the complete viewer composition.
- **Typed component contract.** Publish CodeProps and the typed contexts used by replacement controls. API comments explain source fidelity, controlled state, slot placement, and the distinction between hidden controls and disabled behavior.
- **Shared filename presentation.** Add CodeFileHeader for source paths and complete-source line counts. The metadata adapts to constrained widths and is reused by ordinary snippets, file browsers, and home workspace source views.
- **Shared snippet labeling.** Add CodeSnippetLabel for descriptive unnamed-snippet headings. Language metadata and filename information remain available to inference even when their visible presentation is customized.
- **HTML attribute integration.** Forward appropriate root attributes while reserving properties whose semantics belong to the reader. Expose root classes and preClassName separately, retaining className as a documented deprecated source-element alias.
- **Distributed stylesheets.** Import Code styles from the core theme and copy every code-prefixed stylesheet into the built package. Syntax palettes and reader layout remain separate maintainable stylesheet owners.

### Source fidelity and deferred highlighting

- **Literal source handling.** Treat the supplied code as data and escape it before presentation. The viewer does not evaluate source and never derives clipboard content from rendered markup.
- **Supported language catalog.** Export codeLanguages for text, TypeScript, TSX, JavaScript, JSX, JSON, CSS, markup, Markdown, Bash, YAML, and diff. The catalog corresponds to grammars actually supported by the shared highlighter.
- **Explicit hint precedence.** Resolve supported explicit language names, common aliases, and filename hints before using syntax inference. Preserve the resolved language for labels and control eligibility independently of syntax coloring.
- **Bounded inference.** Infer missing or generic hints from filenames and bounded source checks. Unrecognized or ambiguous input remains readable plain text instead of requiring a language guess to succeed.
- **Lazy grammar work.** Defer Prism loading until a viewer needs syntax coloring. Plain text and custom rendered documents avoid unnecessary grammar loading and source-formatting work.
- **Disabled highlighting.** Allow highlight=false to retain escaped source, inferred metadata, and eligible reading controls. Disabling syntax color does not remove content or silently disable copying.
- **Readable initial output.** Preserve useful plain source during server rendering and deferred initialization. A highlighting failure falls back to readable source rather than leaving an empty panel.
- **Pending presentation.** Support loadingContent for hosts that want a deliberate pending view while deferred source formatting is prepared. Plain-text readers and custom document views bypass irrelevant syntax-loading placeholders.
- **Stale-result protection.** Ignore asynchronous highlighting results that belong to an older source or an unmounted reader. Changes to source, language, or enabled state cannot restore obsolete highlighted output.
- **Stable highlighted markup.** Keep full highlighted source separate from visible import folding and line layout. Reading-preference changes reuse tokenization instead of scheduling another grammar pass.
- **Safe token transformation.** Maintain escaped text and token boundaries while adding readable line markup and optional references. Tests cover source text containing markup-sensitive characters and nested syntax spans.

### Reading controls and modular composition

- **Optional automatic header.** Support showToolbar to remove the automatic header and its copy action. Eligible import and wrapping controls retain their own reading row when the header is hidden.
- **Header composition.** Retain toolbarContent, renderToolbar, renderFilePath, and renderLanguage for host-specific metadata and actions. Applications can replace presentation without maintaining a parallel source reader.
- **Before and after slots.** Add beforeCode and afterCode for explanatory content around the source or document. These slots remain outside copied content and can use the surrounding application presentation.
- **Controlled wrapping.** Expose wrapped and onWrappedChange alongside defaultWrapped. Controlled consumers own the value, while uncontrolled readers retain their current preference after the initial default is applied.
- **Fixed wrapping without a switch.** Allow wrapping behavior to remain active when showWrapControl is false. This supports prose-like source or a fixed presentation without rendering a redundant preference control.
- **Overflow-based controls.** Show reading controls only when the complete unwrapped source would overflow the available width. Measure the original readable content rather than treating already-folded imports as the complete document.
- **Source-oriented eligibility.** Keep command snippets and unfiled prose out of automatic source wrapping controls. File context can make otherwise plain content eligible for the source-reading model.
- **Whole-control activation.** Make the wrapping label and switch one usable control. Preserve accessible naming, keyboard use, and the code-element relationship through aria-controls.
- **Import detection.** Fold complete leading static JavaScript and TypeScript import statements when a nonempty source body remains. The parser respects multiline statements and avoids treating partial imports or unrelated text as a foldable preamble.
- **Controlled import folding.** Expose importsCollapsed and onImportsCollapsedChange beside defaultImportsCollapsed. Source changes reset the uncontrolled import preference using the current default without reporting a user-request callback.
- **Original-source copying.** Keep imports in the copied text even when they are folded in the displayed source. Wrapping, header changes, and custom controls likewise leave clipboard content untouched.
- **Paired reading row.** Present eligible imports and wrapping together as compact reading preferences. A lone wrapping control remains aligned correctly when there is no header or import control.
- **Replacement import control.** Expose renderImportControl with code ID, collapse state, import count, change action, and the standard control. Returning null suppresses the control without creating a second folding implementation.
- **Replacement wrap control.** Expose renderWrapControl with code ID, current wrapping preference, change action, and the standard control. The replacement participates in the same controlled or uncontrolled state model.
- **Replacement copy action.** Expose renderCopyAction with status, status-region ID, copy action, and the standard control. The reader retains clipboard ownership and its live region when a host supplies different button markup.
- **Surface variants.** Provide default, subtle, and outline reader treatments. These change the surrounding surface presentation without changing source handling or reading-control semantics.
- **Custom document rendering.** Accept renderedContent for rendered Markdown or another caller-owned document view. Copy still uses the complete supplied source, while unused highlighting and source-reading controls are skipped.
- **Local transient state.** Keep clipboard feedback in the copy action instead of rerendering the entire source viewer for every status transition. This avoids repeating source work during copying feedback.

## 2. Nine scoped syntax palettes

### Palette behavior

- **Default token palette.** Provide a semantic default palette for the standard reader. Token colors remain independently customizable from reader surfaces and typography.
- **Dusk palette.** Add a distinct dusk syntax treatment that follows the application scheme. It changes source presentation without altering header or toolbar appearance.
- **Forest palette.** Add a forest syntax treatment using its own token choices. The same source and highlighted markup can switch to it through a CSS-backed attribute.
- **Monochrome palette.** Provide a restrained monochrome alternative with explicit token emphasis. Its restrained colors and token emphasis provide another reading style without changing source text.
- **Prism-derived palettes.** Add Okaidia, Tomorrow, Twilight, and Solarized Light as scoped choices. Preserve the upstream MIT attribution with the dedicated Prism theme stylesheet.
- **Dedicated Prism canvases.** Keep Okaidia, Tomorrow, and Twilight on their dark source canvases and Solarized Light on its light canvas. Headers and controls continue following the surrounding application theme.
- **No retokenization on theme changes.** Implement palette selection through data attributes and CSS custom properties. Switching syntaxTheme reuses existing highlighted source and does not load another grammar.
- **Scoped palette styles.** Scope named palette token colors and canvases to the selected reader. Neighboring viewers can compare different palettes without importing competing global Prism themes.

## 3. Optional source-reference navigation

### Generic core resolver

- **Resolver provider.** Add CodeReferenceProvider so a host can supply one source-reference policy to a group of readers. The core package remains independent of any documentation route or destination catalog.
- **Per-reader override.** Let resolveReference override an inherited provider, and let null explicitly disable source links for one viewer. Omitting the property preserves provider inheritance.
- **Typed reference contract.** Export the reference and resolver types used by the provider and Code props. Keep source detection, destination resolution, and displayed markup separate so hosts can supply their own verified links.
- **Static import references.** Recognize default imports, named imports, aliases, namespace imports, and type-only imports in JavaScript and TypeScript source. Module strings and imported bindings can resolve independently where appropriate.
- **Literal loader references.** Recognize literal dynamic-import and require module specifiers. Nonliteral expressions remain ordinary source instead of guessing a destination from runtime values.
- **Imported binding usages.** Follow supported imported symbols into later source usages. Conservatively skip common locally shadowed bindings and parameters rather than promising compiler-level scope analysis.
- **Lightweight lexical parsing.** Keep reference detection in focused lexical helpers. The browser does not acquire a TypeScript compiler or full language-service dependency for navigation assistance.
- **Safe destinations.** Accept verified HTTP(S), application paths, and fragment destinations. Reject executable URL schemes and protocol-relative links before generating anchors.
- **Escaped reference attributes.** Escape generated href and metadata attributes while preserving the source text. Resolver output cannot inject markup through an attribute value.
- **Native navigation.** Render ordinary anchors so keyboard and browser link behavior remain available. Reference navigation targets the top document when source is displayed inside an isolated preview.
- **Token-preserving links.** Map source offsets onto existing highlighted markup instead of recoloring the linked symbol. Folding and wrapping retain references around the same underlying source characters.
- **Memoized source annotation.** Recompute detection and linked markup only when their actual inputs change. A palette switch or copy status transition does not rescan every imported symbol.
- **Subtle reference cues.** Use one dashed source underline with faint resting primary paint and full primary paint on hover or focus. Avoid extra arrows, double underlines, and syntax-ink replacement inside code.

### Documentation-owned destinations and help

- **Dedicated private feature area.** Move documentation references into src/references with reader, inline-link, resolver, request, and help responsibilities. The site-specific catalog and tooltip implementation do not enter the public core API.
- **Verified destination extraction.** Build reference destinations from checked-in exports, rendered documentation/API anchors, and installed package declarations. Symbols prefer their local API; package roots and import subpaths prefer verified source files or package directories, with independent local documentation links.
- **Shared API anchor generation.** Reuse component API IDs between extraction and rendered reference sections. Links to props and types use the same anchor contract as their actual destination page.
- **Small initial destination catalog.** Separate lightweight destinations from detailed help facts and card rendering. Rendering an ordinary source block does not load the full description for every documented symbol.
- **On-demand help.** Request detailed reference metadata only when a user opens the corresponding help. Keep the lazy card module separate from the everyday source reader import path.
- **Shared pending requests.** Deduplicate manifest and module requests, cache completed facts, and retry failed requests. Multiple references to one module do not each start independent metadata loads.
- **Stale help guards.** Ignore requests that complete after their tooltip has closed or been superseded. Late data cannot reopen an unrelated popup.
- **Useful failure states.** Retain a usable destination link while help is loading or unavailable. A metadata failure does not prevent normal source navigation.
- **Kind-specific explanations.** Present thirteen kinds through a compact common structure: components, exports, types, functions, constants, icons, modules, packages, files, commands, blocks, technologies, and pages/sections. Include the available signature, description, source, documentation, and related-type facts for each kind.
- **Shared rendering entrypoints.** Apply the same private reference behavior to Code readers, static fences, highlighted prose, inline code, brand references, and displayed paths. Avoid separate route maps for each entrypoint.
- **Inline empty-call references.** Resolve recognized functions and hooks with a trailing () like their bare identifiers, preserving the visible call syntax and shared lazy help. Link cn() to its API reference and useTheme() to its documented appearance controls, indexing theme exports from their installed declarations.
- **Shared declaration registration.** Use one package list for reference-name indexing, lazy help loaders, and dependency validation. Theme references receive their detailed facts only when help opens, following the same loading boundary as other package exports.
- **Declared callable classification.** Recognize exported function types written as declared constants and retain their complete signatures. Ordinary constants keep their existing classification; hooks such as useTheme receive function help instead of a generic export card.
- **Delegated interaction.** Reuse the existing application tooltip event connection instead of attaching a listener to every token. Measure and observe help content only while it is actually open.
- **Bounded help layout.** Clamp long paths and URLs, keep resource actions usable, and preserve viewport bounds. Compact typography and restrained emphasis keep detailed help readable without overwhelming the source.
- **Verified module locations.** Carry verified sourcePath metadata for repository directories and single-file utilities. Missing metadata does not produce an invented repository-root source destination.
- **Reference card hierarchy.** Give supported reference kinds distinct icon-led badges and shared subsection dividers. Related types and resources use compact neutral chips with restrained dashed cues.
- **Inline cue paint order.** Paint inline reference dashes above the highlighted code chip through a pointer-inert pseudo-element. The chip background cannot cover the cue, and the original token ink remains unchanged.
- **Private typography boundary.** Exclude private help contents from broad application inline-code sizing rules. Signatures, paths, types, and related links retain the help layout's deliberate compact scale.
- **Incremental prose enhancement.** Annotate eligible prose through one shared enhancement controller. Preserve unknown identifiers and literal source instead of rewriting every code-like word into a link.

## 4. Copy feedback and shared core controls

### CopyButton and clipboard lifecycle

- **Shared CopyButton.** Add a core button for exact text copying with consistent success and failure feedback. Reuse it in Code, documentation actions, chat examples, and theme customization.
- **Focused copy entrypoint.** Export CopyButton and its typed context from @kamod-ch/ui/copy-button and the package root. Distribute its stylesheet with the core theme and package output.
- **One clipboard implementation.** Centralize clipboard writes and the fallback path in a focused helper. Consumers no longer need independent write, timeout, and feedback implementations for the same action.
- **Success and failure semantics.** Distinguish idle, copying, copied, and error states. Report success only after the current value is copied, and expose onCopyError when access is unavailable or rejected.
- **Accessible feedback.** Retain an accessible name for icon-only actions and a separate live status region. Custom controls receive the status-region ID so their description remains connected to feedback.
- **Custom button composition.** Expose renderControl with the standard control, current status, status ID, and copy action. A consumer can change placement or markup without starting another clipboard lifecycle.
- **Stale operation guards.** Ignore obsolete completion after the copied value changes or the control unmounts. Clear feedback timers and keep retry behavior available after errors.
- **Shared visual phases.** Use a compact outgoing-icon turn, midpoint confirmation handoff, settling check, and green feedback halo. Refresh completion reuses the appropriate shared action-feedback styling.
- **Stable glyph painting.** Keep existing glyph nodes stable during state changes where the control supports layered presentation. Avoid replacing SVG subtrees at the moment feedback begins or ends.
- **Reduced motion.** Preserve an understandable success state when motion is reduced. Feedback does not rely on translation, rotation, or glow to communicate that copying succeeded.

### Tabs, callouts, placement, and semantics

- **Inset tabs variant.** Add an opt-in inset TabsList presentation with rounded triggers, an inset underline, and a small active marker. Existing default and line variants remain available for compact control groups.
- **Faint selected tab fill.** Give selected triggers a restrained baseline fill with the same hover increment used by inactive triggers. Prevent the moving indicator from adding a second accidental wash under the selected item.
- **Stable underline geometry.** Inset the horizontal tab indicator, strengthen its line, and round its ends. Hover does not translate the underline or change the active tab's layout.
- **Tab interaction preservation.** Keep keyboard activation, disabled states, focus indicators, nested tab lists, and SSR behavior under the existing tab state owner. The new styles do not introduce a second tab-selection model.
- **Explicit OpenUI tab style.** Set the OpenUI Tabs adapter to the line variant. This preserves its intended compact appearance as the core tab styling becomes more expressive.
- **Reusable AlertCallout.** Add a structured callout with title, optional icon, eyebrow, metadata, content, and footer. It reuses Alert rather than creating a separate unrelated alert primitive.
- **Non-live guidance semantics.** Default AlertCallout to a note role and associate it with its heading. Optional heading IDs and levels support real document structure while urgent status remains the responsibility of ordinary Alert usage.
- **Quiet default callout skin.** Make subtle neutral surfaces, a light border, plain muted icon, inset separator, and compact spacing the shared callout default. Remove duplicated temporary documentation skins so direct and wrapped consumers match.
- **TypeDefinition metadata.** Extend type-definition headings and trigger hints for compact source-backed summaries. Required fields, declared owners, direct field counts, and deep links remain visible in the shared API presentation.
- **Tooltip collision correction.** Clamp from the intended trigger-relative position and account for alignment offsets. Keep the arrow aimed at the trigger when the panel is adjusted near viewport edges.
- **Lazy tooltip resizing.** Observe the open tooltip content when asynchronous help changes its size. Disconnect on close or unmount and avoid rerendering when placement and arrow measurements are unchanged.
- **Bounded dropdown mount retry.** Retry portal placement once when Preact commits the portal after the parent layout effect. A missing or removed trigger cannot cause an endless microtask-render loop.
- **Scrollbar state reuse.** Preserve the existing thumb state when repeated measurements produce identical geometry. Content mutations no longer force a scrollbar rerender solely because a new state object was allocated.
- **Scrollbar drag cleanup.** Retain the actual thumb node and pointer ID for drag completion. Remove pointer listeners and release capture safely on cancellation, replacement drag, or component unmount.
- **Composited spinner motion.** Rotate an inner HTML wrapper while keeping the SVG itself static. Preserve the public size, tone, stroke, status, label, and reduced-motion behavior.
- **Persistent menu indicators.** Stabilize checkbox and radio glyphs in context menus, dropdowns, and menubars. Selection changes keep the accessible semantics while avoiding unnecessary SVG replacement.
- **Stable ThemeToggle glyphs.** Preserve the existing public ThemeToggle behavior while retaining its icon nodes across appearance changes. The documentation's three-mode menu remains a separate site composition.
- **Touch-aware hover rules.** Use supported Tailwind hover variants for calendar and item links and restrict typeset link hover paint to a fine hover pointer. Touch interaction does not inherit desktop-only sticky hover treatment.
- **Correct table-header attributes.** Type TableHead with Preact's dedicated table-header attribute interface. Consumers can supply valid header-specific attributes without an unnecessary generic-attribute restriction.
- **Preact terminology.** Correct DirectionProvider documentation to describe Preact children. The public implementation remains Preact-native throughout these changes.

## 5. Application theme scopes and reusable theme picking

### Theme runtime and tokens

- **Local theme isolation.** Reset semantic token ownership at explicit data-theme-scope boundaries. A preview can use its own preset and light/dark scheme without inheriting unrelated page palette values.
- **Eight preset scopes.** Update Kamod, Shadcn, Ocean, Sunset, Cursor Warm, Voltage, Watson, and Professional styles for local light and dark scopes. The same preset files support both global application selection and isolated previews.
- **No-op preset application.** Return early when applyThemePreset already matches the requested target appearance. Multiple hydrated consumers avoid repeating the same theme mutation and switching work.
- **No-op color-scheme application.** Avoid redundant updates when applyColorScheme receives the currently applied scheme. Preserve the existing signals, provider, and system-preference resolution behavior.

### Shared ThemePicker and appearance menus

- **Controlled ThemePicker block.** Export ThemePicker, ThemePickerActions, and useSystemColorScheme from the shared blocks entrypoint. The caller owns the selected values, target element, and persistence.
- **Explicit stylesheet distribution.** Ship the shared theme-picker stylesheet as a package asset. Document the stylesheet import and mark the relevant asset as side-effectful for consumers.
- **Palette previews.** Show four representative colors for each preset and a clear available-preset count. The palette samples stay useful while the picker itself follows the current ambient appearance.
- **Compact active state.** Combine the shared selection surface, active marker, and check with readable labels. Preserve contrast in difficult presets such as dark Professional.
- **Host extension slots.** Support descriptions, trigger classes, label presentation, side placement, and additional host controls. Theme customization can add radius and copy actions without forking the picker.
- **Resource destinations.** Include relevant theme documentation and resource actions in the shared picker presentation. Resolve documentation links through a host-provided base-path function when necessary.
- **Consistent appearance choices.** Reuse shared Light, Dark, and System option parts in site and local appearance menus. Selection checks and sample glyphs retain stable nodes during changes.
- **CSS system samples.** Render light and dark palette samples for System and select their visibility through the preference media query. This preview does not add another JavaScript media listener.
- **Complete menu keyboard path.** Include header actions, appearance choices, and resource links in the menu's keyboard navigation. Escape returns focus to the trigger while selecting a mode leaves the menu available for continued comparison.
- **Appearance resource footer.** Link directly to CSS setup, token customization, palette comparison, appearance checks, and runtime APIs. Shared compact actions keep the destinations usable without creating another navigation dropdown.
- **Site-only mode menu.** Add a compact Light/Dark/System dropdown using the existing theme signals and dropdown primitives. Preserve SSR safety, keyboard selection, Escape behavior, focus return, and system preference updates.
- **Independent preview preferences.** Keep a showcase's local appearance separate from the site's persistent appearance. Changing the preview theme does not silently recolor or persist the documentation shell.
- **Selection motion and hover.** Share the restrained selection glide and selected-hover treatment across picker controls. Reduced-motion settings and fixed control footprints remain supported.

## 6. Seven additional application-shell blocks

### Shared architecture and public delivery

- **Extended shell family.** Add Application Shells 2 through 8 alongside the existing Shell 1. Each variant has a public component, focused index entrypoint, preview, registry metadata, documentation route, and source listing.
- **Shared shell frame.** Compose the additional layouts through shared shell-frame, navigation, and breadcrumb helpers. Reuse the existing Sidebar, account menu, navigation model, and accessibility behavior instead of introducing parallel primitives.
- **Router-independent inputs.** Retain caller-supplied brand, navigation groups, user, breadcrumbs, currentPath, onNavigate, and children. Routing and authentication remain application concerns rather than hidden block dependencies.
- **Header actions slot.** Extend the shared frame contract with caller-owned headerActions. Layouts can host useful page actions without coupling the shell to a specific business workflow.
- **Controlled sidebar integration.** Keep sidebar state under the existing primitive's supported controlled and uncontrolled behavior. Desktop collapse and mobile overlays continue using its established keyboard and focus handling.
- **Component-free metadata.** Separate shell metadata from component imports so catalog discovery does not eagerly load every preview. Registry paths and source labels align with the documentation source map.
- **Aligned package exports.** Update blocks package exports, root family exports, and tsup entrypoints together. Consumers can import the shell family or an individual variant through the declared package contract.
- **Separate preview data.** Keep fixture navigation, user details, and demonstration content outside production layout components. Previews illustrate integration without making demo state part of the reusable shell API.
- **Accurate attribution.** Preserve the original Shell 1 source attribution and distinguish the additional repository-owned compositions. References do not imply that all variants were copied from the same external design.

### Variant behaviors

- **Shell 2: inset workspace.** Add a framed inset content surface with grouped navigation and account actions. The layout keeps ordinary application content inside the shell's existing main landmark.
- **Shell 3: compact rail.** Start with an icon navigation rail that can expand into full labels. The compact desktop treatment becomes normal mobile sheet navigation at narrow widths.
- **Shell 4: horizontal workspace.** Place top-level destinations across a horizontal header with a centered content region. Retain a mobile sidebar navigation path when the available width cannot support the desktop arrangement.
- **Shell 5: right-hand navigation.** Move navigation and account tools to the right for a content-first workspace. Use a matching right-side mobile sheet instead of retaining an unrelated left-side overlay.
- **Shell 6: split workspace.** Add an optional inspector that can sit beside the main content or stack below it responsively. Expose inspector and inspectorTitle without taking ownership of the inspected domain state.
- **Shell 7: contextual sections.** Add sectionLinks and sectionLabel for flat contextual navigation beneath the header. Keep this landmark distinct from global sidebar navigation and omit it for an empty section list.
- **Shell 8: persistent actions.** Add a sticky wrapping footer with footerStatus and footerActions for long forms. Saving, validation, request state, and form submission remain caller-owned.
- **Form-associated footer actions.** Demonstrate submit controls that target a form through the native form attribute. The sticky footer does not require moving domain form state into the shell.
- **Shared breadcrumb behavior.** Reuse a single breadcrumb helper with responsive treatment for long paths. Breadcrumb rendering remains consistent across the new layouts and previews.
- **Navigation integration examples.** Demonstrate active paths, real links, callback-driven navigation, and account actions with application-owned handlers. The examples make placeholder behavior explicit before production integration.

## 7. Shell documentation, downloads, and release guidance

- **Complete variant detail pages.** Add documentation and standalone preview routes for Shells 2 through 8. Each page explains its layout, source composition, setup, usage, API, integration, and references.
- **Variant-specific guide profiles.** Share guide structure while keeping each variant's purpose and workflow examples specific. The new pages do not repeat the same generic shell description under different numbers.
- **Source-backed shell APIs.** Present shared frame types and variant-only props through the reusable API view. Inspectors, section navigation, and persistent actions appear only where those slots are supported.
- **Practical usage examples.** Include render, adapt, and connect guidance for the selected layout. Keep examples aligned with the actual exported types and source files.
- **Production integration guide.** Explain routing, account actions, controlled state, application content, and deployment concerns in the context of the shell. Separate demonstration values from decisions the consuming application must make.
- **Guided release checks.** Present production review as concrete acceptance checks with useful outcomes. Cover navigation, narrow screens, keyboard behavior, focus, long content, and theme integration without pretending the demo is a complete application.
- **Shell 3 working-first setup.** Give the compact-rail variant a focused download-and-render path. Its initial example needs no router adapter or extra state wrapper before a first screen can be shown.
- **Self-contained Shell 3 archive.** Generate a source ZIP containing the shell and its transitive helpers and license notices. Exclude preview/demo-only files so the downloaded folder is ready to place in a consumer application.
- **Explicit dependency prerequisites.** Explain the existing UI exports needed by the local source, including dropdown and roving-focus facilities. Missing-export errors point readers toward a compatible installed UI version instead of an invented shell package.
- **Copy-ready style setup.** Document Tailwind v4 setup and explicit source detection for package output and the copied shell folder. Keep paths relative to the consumer stylesheet and link to the shared CSS setup guide.
- **Download closure checks.** Test the generated archive's required files and internal source dependencies. Validate the working example against the same assembled source rather than a separate handwritten approximation.
- **Preview thumbnails.** Generate light and dark shell thumbnails at the existing responsive asset sizes. Connect the manifest and metadata to the catalog so the new variants are discoverable before opening a live preview.

## 8. Existing block catalog and installation refinements

- **Shared block headers.** Align overview and detail headers, breadcrumbs, variant labels, and descriptions through common components. Preserve native heading links and the existing block navigation destinations.
- **Compact catalog presentation.** Refine category introductions, overview cards, counts, and reference actions around a shared reading hierarchy. Keep previews prominent without relying on large decorative containers.
- **Shared collection canvas.** Reuse the showcase background treatment for block collection previews and thumbnails. The catalog and detail pages present the same block against a coherent surrounding canvas.
- **Practical block guides.** Expand sidebar, authentication, and catalog usage explanations with source-aware setup and adaptation guidance. Preserve category-specific behavior while reusing common document sections.
- **Sidebar installation presentation.** Refine the existing download panel, source-file disclosure, extraction path, and dependency guidance. Keep included filenames linked to the exact file in the Code tab.
- **Sidebar source closure.** Include required shared branding helpers in installation manifests. Source downloads remain tied to the actual reusable composition rather than leaving consumers to discover missing imports.
- **Sidebar usage structure.** Explain composition before rendering, then describe adaptation and application connections. Preserve each variant's navigation expansion model in the examples.
- **Sidebar references.** Add useful source and design context without confusing the shadcn and Shadcnblocks projects. Keep attribution compact and connected to the files a reader will inspect.
- **Auth guide integration.** Align login and signup examples with the shared guide and callout presentation. Keep their existing form behavior and application integration responsibilities intact.
- **Catalog fixture refresh.** Update selected branding, heading, and example fixtures across authentication, communication, commerce, dashboard, marketing, and sidebar blocks. These are presentation and example consistency changes, not new domain-service integrations.
- **Shared chat copying.** Replace duplicated chat copy feedback with the core CopyButton. The example retains its existing code presentation while sharing clipboard feedback and lifecycle behavior.
- **Theme-customization composition.** Refactor the dashboard customization example around the shared theme picker and copy action. Preserve host-owned theme and radius choices instead of duplicating picker internals.
- **Chart theme expectations.** Update chart and catalog tests to the resulting theme and label contracts. Keep the examples compatible with the isolated local appearance model.
- **Refreshed sidebar thumbnails.** Replace the relevant generated sidebar preview assets and update their manifest references. The capture script and checked-in assets describe the current source presentation together.
- **Capture tooling maintenance.** Extend the thumbnail-generation workflow for the new and updated previews. Keep capture inputs, responsive sizes, scheme selection, and metadata reproducible.

## 9. Shared showcase and source-browser architecture

### Preview, Code, and Prompt composition

- **Common showcase vocabulary.** Reuse Preview, Code, and Prompt panels across component examples, blocks, forms, library overviews, and the home workspace. Shared controls and loading states replace repeated page-specific implementations.
- **Core Code adapters.** Reduce documentation CodeBlock to site-specific labels, metadata, and private reference integration. Source reading, tokenization, clipboard state, and modular controls remain owned by core Code.
- **Consistent source bars.** Align filename headers, language labels, copy positions, and line counts between Code and Prompt views. Remove duplicate block-source line-count markup in favor of CodeFileHeader.
- **Native source scrolling.** Preserve normal scrolling for long code and Markdown source, including the home workspace. The panel framing does not force source text into a decorative non-scrolling container.
- **Compact secondary references.** Use compact inline reference sizing in Code/Prompt introductions and related secondary text. Do not apply those prose rules to source tokens, filenames, or editable input.
- **Display-format choices.** Share Text, Code, and rendered Markdown options where a document can be read in multiple ways. Display changes preserve the exact complete source used for copy and download.
- **Local preview settings.** Pass each showcase's appearance into its preview and loading owner. The page canvas and local preview appearance remain deliberately distinct responsibilities.
- **Viewport controls.** Share narrow and full-width viewing controls and explanatory footer labels. Keep the existing responsive width state and avoid introducing a second measurement model.
- **Refresh lifecycle.** Reuse reset/pending/completion feedback across examples with the existing refresh owner. Disabled states and accessible labels describe whether a preview is still refreshing.
- **Rounded control groups.** Restore a consistent compact group style for Preview/Code/Prompt and related selectors. Selected controls retain their fill during hover and ordinary content tabs remain independently styled.

### File browsing and source selection

- **Shared source explorer.** Use the same file-browser structure for block source files and related source-backed examples. Keep folder expansion and selected-file state explicit and testable.
- **Exact file permalinks.** Preserve encoded source paths in showcase links and direct navigation. Validate selections against the registered file set before loading a requested file.
- **Source folder emphasis.** Use theme-primary paint for folder names, separators, and folder/chevron icons. Keep count text secondary and align its compact icon, baseline, and row height without transforms.
- **Source selection feedback.** Keep selected files visible and provide immediate pending content when a different file is requested. A late response cannot replace the currently selected source.
- **Complete-file copy.** Copy the full selected file regardless of wrapping, folded imports, or a truncated display label. File metadata is not inserted into the copied source.
- **Source loading errors.** Provide explicit unavailable-source feedback and a usable recovery path. Preserve panel structure while a request fails instead of collapsing the surrounding showcase.

## 10. Deferred showcase work and measured performance fixes

- **Immediate lazy fallback.** Add a small Preact-native lazyShowcase helper for deferred Code, Prompt, and related content modules. It renders the supplied fallback immediately while sharing the module request and resolved component.
- **Unmount-safe lazy completion.** Ignore completion for consumers that have unmounted. A deferred module cannot restore a panel the user has already left.
- **Width-only showcase updates.** Compare measured showcase width before updating state. Import folding and other height-only changes no longer rerender the entire showcase through an unnecessary width notification.
- **Deferred Markdown preparation.** Let pending content paint before preparing rendered prompt Markdown. Retain only the most recent prepared result instead of caching every visited source bundle indefinitely.
- **Reserved pending footprint.** Maintain deliberate reading-panel space while lazy content is pending. First selection into Code or Prompt receives useful immediate feedback rather than an empty commit window.
- **One preview startup at a time.** Add a shared idle queue for isolated component-preview documents. Limit concurrent startup work while leaving ordinary navigation outside that speculative queue.
- **Viewport-aware queue cancellation.** Drop waiting previews that leave the activation area before they start. Already-started documents finish without interruption and recent documents retain their input through the bounded preview pool.
- **Queue-slot release.** Release startup ownership on readiness, failure, and unmount. A removed or failed frame cannot block every later example in the shared queue.
- **Idle fallback handling.** Support environments without requestIdleCallback or IntersectionObserver. Cancel scheduled idle work correctly even when the browser returns an ID of zero.
- **Safe deferred frame source.** Keep inactive frames at about:blank and ignore their initial blank load event. Start the actual isolated document only when activation owns a queue slot.
- **Invalid document feedback.** Detect invalid preview documents and show a useful error. Do not leave the loader pending indefinitely because an expected readiness signal will never arrive.
- **Unchanged measurement reuse.** Avoid repeated inactive-state writes and unchanged tooltip placement objects. Local state updates correspond to real presentation changes rather than repeated observer notifications.
- **Measured spinner correction.** Move continuous rotation away from the SVG after profiling showed repeated idle layout work. The retained implementation changes the animation target while preserving visual and accessibility contracts.
- **Performance claims bounded to evidence.** Keep diagnostic profile results separate from universal speed promises. Production readiness, iframe startup, highlighting, and stylesheet size still depend on route, device, cache, and browser conditions.
- **Bounded live preview documents.** Retain three recently used component previews, protecting visible and still-loading documents. Older completed offscreen examples return to about:blank and recreate on demand; their entered state deliberately resets.
- **Measured memory reduction.** A same-code development comparison visiting all 15 Button examples reduced collected JavaScript heap from 93.70 MiB to 56.82 MiB, with 15 versus three live example documents. This measures that workload's retained JavaScript, rather than total browser memory or battery consumption.
- **Shared viewport activity.** Use one intersection observer and one visibility listener per document for preview and loading activity. Remove subscriptions, listeners, and observers when their last consumer unmounts, without polling.
- **Offscreen motion suspension.** Pause CSS animations in inactive component and block previews, including pseudo-elements, and resume them when the section becomes usable again. Scope this policy to documentation previews rather than changing public core component behavior.
- **Inline usage motion ownership.** Give the small Button, ButtonGroup, and Tabs usage compositions the same shared viewport activity policy. The Button guide's inline Generating spinner now pauses offscreen instead of running outside the iframe budget.
- **Loading motion ownership.** Animate pending placeholders only near the viewport and in visible tabs. Make pause rules survive more specific animation shorthands so individual skeleton strokes cannot keep running unnoticed.
- **Static home status marks.** Remove three permanent decorative status-pulse loops while retaining the existing labels and dots. A settled home page no longer needs those continuous animation timelines.
- **Preloaded block readiness.** Handle an eager server-rendered iframe completing before hydration attaches its load listener. Check the completed document URL, reject blank/stale documents, and clear the stuck loading overlay through the normal completion path.
- **Eviction cleanup ordering.** Stop completion processing when a preview is evicted as it becomes ready. Do not create a new resize observer retaining the discarded document after suspension cleanup has already run.
- **Home readiness after suspension.** Clear the matching home-preview readiness marker when its document is suspended. Returning to an evicted example displays loading feedback until its replacement is ready.
- **Idempotent route generation.** Compare final generated output before writing route pages, manifests, and llms.txt; format TypeScript in memory first. An unchanged run touched zero files across the 1,021-file observed route/output inventory.
- **Energy and lifecycle regressions.** Cover bounded retention, eviction/reload, offscreen pause/resume, hidden-document behavior, listener cleanup, pre-hydration completion, stale-document rejection, and completion-time observer ownership. Production browser checks exercise both narrow and wide component articles.

## 11. Shared documentation structure and source-backed APIs

- **Reusable document sections.** Share guide article, section, description, heading, contents, and page-ending components. Component, package, form, and block pages no longer need separate copies of the same reading structure.
- **Consistent page titles.** Give documentation families a page-title permalink and matching first contents entry. Component, package, form, overview, and block detail pages use the same top-level navigation contract.
- **Source and design cards.** Present implementation and design references in compact shared cards with clear resource actions. Explain how to read the source and adapt it before linking the next useful step.
- **Source-backed API extraction.** Extend build-time component API extraction instead of maintaining a second handwritten prop database. Render direct fields, required entries, source owners, and declared types from verified source metadata.
- **Per-component API loading.** Load the selected component's API information lazily in the browser. Preserve complete static rendering without shipping every component's reference payload with the first route.
- **Shared type presentation.** Reuse the block TypeDefinition view for component APIs. Keep field counts and fragment targets aligned across the generated data and rendered rows.
- **Composition guidance.** Explain behavior, application ownership, and surrounding primitives in shared component detail sections. Related-component links help readers compose a real interface from the documented building block.
- **Accessibility profiles.** Supply component-context guidance for inputs, overlays, feedback, Code, Formisch, and type definitions. The content names the relevant interaction and verification tasks rather than repeating one generic warning.
- **Shared Markdown reading.** Reuse guide parsing, tables, sections, and highlighted prose across theming, block, and package content. Preserve literal source and deployment-base-aware links in both rendered and portable views.
- **Path display helpers.** Share filename, directory, package-path, and inline-code presentation. Keep path spacing and truncation useful without changing the underlying destination or source identifier.
- **Inline reference sizes.** Define exactly two shared inline-code reference sizes. Compact secondary content and normal reading prose use the appropriate scale without accumulating per-page size variants.
- **Brand references.** Use the Kamod and GitHub reference treatment consistently for package and repository identities. Keep visible names and linked destinations meaningful rather than replacing them with decoration alone.
- **Quiet introductions.** Refine introductory emphasis and inline-code treatment across page families. Explanatory copy remains readable without oversized code chips or unnecessary header slogans.
- **Shared callout use.** Route documentation callouts through the reusable core composition. Specialized guides keep their content while inheriting one quiet shared layout and semantic contract.

## 12. Component and form documentation content

- **Foundational component pages.** Refine Accordion, Alert, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Card, Collapsible, Empty, Item, Separator, Skeleton, and Typography documentation. Connect examples, behavior, API ownership, and related components using the shared page structure.
- **Input and selection pages.** Update Calendar, Checkbox, Combobox, Date Picker, Field, Input, Input Group, Input OTP, Label, Native Select, Radio Group, Select, Selectable Card, Slider, Switch, Textarea, Toggle, and Toggle Group guidance. Keep practical control composition and accessibility notes aligned with the existing components.
- **Overlay and menu pages.** Refine Alert Dialog, Command, Context Menu, Dialog, Drawer, Dropdown, Hover Card, Menubar, Navigation Menu, Popover, Sheet, and Tooltip examples and explanations. Preserve the documented focus, keyboard, and application-state responsibilities.
- **Navigation and data pages.** Improve Carousel, Chart, Data Table, Pagination, Scroll Area, Sidebar, Table, Tabs, and Tree documentation. Reuse source-backed APIs and meaningful integration examples instead of changing their public behavior solely for documentation.
- **Feedback and media pages.** Refresh Progress, Sonner, Spinner, Toast, Dropzone, Image, and Video guidance. Keep loading, feedback, media behavior, and example state understandable in context.
- **Utility and platform pages.** Update cn, Direction, Kbd, Locale Segment Group, OpenUI, Prose, Theme Toggle, Theming, Typeset, and TypeDefinition pages. Tie utility usage and theming decisions back to verified package APIs.
- **Formisch integration.** Improve approach selection, example walkthroughs, state ownership, and integration review around existing Preact form examples. Preserve the actual form library and validation flow rather than substituting React-specific guidance.
- **Motion documentation.** Refine motion Accordion, Alert Dialog, Collapsible, Dialog, Sheet, and Tabs pages and examples. Keep reduced-motion guidance and the existing motion package boundaries explicit.
- **Composition example tabs.** Use the standard intended tab style for composition examples. Keep tab labels, source views, and exported documentation aligned with what the live page renders.
- **Updated badges.** Preserve upstream Updated statuses and add contributor updates only for meaningful variants or API changes. Do not mark every prose edit as a new component feature.
- **Code component discovery.** Register Code in component navigation, generated manifests, and both public LLM indexes. The new component can be found through ordinary browsing as well as direct links.

## 13. Complete Code documentation and live studies

- **Working reader first.** Start the Code guide with plain source display and language selection. Introduce optional headers and reader controls only after the basic component is understandable.
- **Installation and usage.** Provide import, stylesheet, and first-render guidance for the public package entrypoints. Examples use the real exported API and preserve the user's source string.
- **Language reference.** Document supported grammars, aliases, explicit-hint precedence, filename inference, and fallback behavior. Explain when a command, prose snippet, or source file receives reading controls.
- **Controlled examples.** Demonstrate controlled wrapping and import folding with application-owned values. Explain initial defaults and source-reset behavior so consumers do not infer a different state contract.
- **Visible-parts playground.** Add an interactive example for toolbar, copy, wrapping, imports, and other optional reader parts. Pair it with a reference table that distinguishes hiding a control from changing the underlying reading behavior.
- **Replacement controls.** Show the typed import, wrap, and copy render callbacks in practical examples. Reuse supplied actions and default controls rather than copying the implementation into documentation.
- **Document rendering examples.** Explain renderedContent alongside plain and highlighted Markdown source. Keep complete-source copy behavior visible when a rendered document is on screen.
- **Syntax palette gallery.** Provide live studies for all nine source palettes. Use shared palette-choice state so color changes can be compared without retokenizing the example.
- **Reference resolver integration.** Document provider inheritance, per-reader override, explicit opt-out, and destination precedence. Show generic host integration without exposing the site's private metadata catalog as a core requirement.
- **Performance and SSR guidance.** Describe lazy highlighting, plain initial output, local state, and source fidelity. Explain the deliberate boundaries instead of promising every renderer or language is automatically cheap.
- **Troubleshooting guidance.** Cover missing colors, hidden controls, unsupported language hints, source references, and clipboard failures. Point each symptom to the relevant public option or integration condition.
- **Focused topic routes.** Generate deep-link routes for the guide's source, controls, themes, references, and integration topics. Keep route metadata tied to the shared guide definitions.
- **Executable documentation checks.** Test the rendered guide and compile relevant examples against actual exports. Avoid validating a second independent copy of the examples that readers never see.

## 14. Companion-package guides and portable references

### Shared practical guidance

- **Five package guide owners.** Share the guide structure for Icons, Hooks, Signals, State, and i18n. Keep each package's capabilities, examples, ownership rules, and integration decisions specific to its role.
- **Environment checks.** Explain installed versions, peer dependencies, package-manager use, and stylesheet or runtime prerequisites where relevant. Direct readers to the package documentation for exact signatures instead of inventing local substitutes.
- **Practical usage recipes.** Add readable setup and first-use examples, with particularly expanded Hooks guidance. Explain where the example belongs in an application and which state should remain local or shared.
- **State and lifetime guidance.** Separate persistent preferences, domain state, transient interface state, and translated messages. Package connections describe ownership boundaries so multiple tools do not become competing writers of the same fact.
- **Troubleshooting sections.** Give each guide concrete checks for environment, lifecycle, version, and integration mismatches. Preserve relevant documentation, source, and published-package destinations nearby.
- **Accessibility review.** Turn release guidance into checks against real content and keyboard interaction. Keep labels, pending states, errors, and focus behavior connected to what the consuming application exposes.
- **Icons integration review.** Explain finished control quality, accessible naming, glyph consistency, and upstream icon notices. The guide's closing content now shares the common package ending instead of maintaining a separate one-off page component.

### Portable workspace and shared endings

- **Portable Markdown source.** Generate the complete reference from the same guide data used by the page. Include examples, setup, usage, integration decisions, troubleshooting, resources, and applicable attribution advice.
- **Three reference views.** Present Text, Code, and rendered Markdown in a shared portable-reference workspace. The initial plain-text view remains complete during SSR.
- **Bounded document height.** Give all portable reference formats one responsive reading-height range with internal scrolling. Nested Markdown fences retain their own content height instead of inheriting the outer document's entire height.
- **Compact download row.** Present the shared heading and secondary caption beside the Markdown download action. The caption truncates and redundant format wording yields before the control becomes cramped.
- **Stationary download target.** Animate only the small download glyph on supported pointer hover. The button's hit target stays fixed and reduced-motion users receive a static action.
- **Exact copy and download.** Keep the full Markdown reference as the value for copying and downloading in every view. Display transformations never truncate the exported document or replace it with rendered HTML.
- **Lazy rendered reference.** Reuse the shared deferred Markdown view and loading surface. Prepare only the current document/view state instead of retaining an unbounded history of rendered references.
- **Canonical exported links.** Resolve local documentation URLs to usable public destinations in downloaded Markdown. A reference kept outside the site does not rely on the current deployment's relative route context.
- **Responsive resource actions.** Keep package identity beside compact documentation, repository, and registry actions. Constrained containers retain accessible labels and usable icon-only controls where appropriate.
- **Shared source desk.** Add one Sources & Attribution ending with dedicated documentation, source/release history, and published-package purposes. The same resource facts are reused by the portable reference.
- **Curated companion handoffs.** Give each package three relevant companion connections and a concrete next build. These are authored integration recommendations, not remote lookups or eager loading of other guide bundles.
- **Preserved old anchors.** Keep the Icons guide's prior next-step fragment as an alias after sharing its ending. Existing incoming links remain useful while the rendered structure becomes consistent.
- **Attribution preservation.** Carry package and icon-family notice guidance into both the page and exported document. Distinguish package licensing from notices attached to upstream icon artwork.

## 15. Landing page, Getting Started, and ecosystem discovery

- **Modular home page.** Replace the landing content with shared hero, workspace, component directory, ecosystem, and next-step sections. Keep the page composed from focused modules rather than a single large component.
- **Interactive workspace.** Show a local workspace-preferences component composition with Preview, Code, and Prompt panes. Demo state remains local and does not introduce production routing, authentication, or persistent domain state.
- **Home source integration.** Reuse the shared code header, source line count, prompt display choices, copy action, and native source scrolling. The home example exercises the same readers as the documentation pages.
- **Composition credits.** Link the UI ingredients used by the workspace in a compact footer. Readers can continue from the visual example to the relevant component documentation.
- **Responsive hero layout.** Refine the workspace offset and surrounding layout across narrow and wide screens. Quiet static background panels support the desktop composition without becoming interactive or runtime-measured elements.
- **Component directory.** Provide linked component cards with a controlled multi-row fade and useful continuation row. Keep the final behavior stable without the reverted decorative card-hover animation.
- **Guided first setup.** Add a substantial Getting Started guide from installation and styles through composition, state ownership, and verification. Use native anchors and shared reference helpers so the guide works through ordinary document navigation.
- **Actionable verification.** Give the setup guide practical acceptance criteria for a first integrated screen. Keep package version and project conventions in view before encouraging more customization.
- **Ecosystem guide.** Add a dedicated guide that explains the related Kamod packages and their roles. Replace the pinned repository dropdown with a direct navigation destination for that guide.
- **Neutral ecosystem cards.** Present package resources and comparisons with compact source actions, restrained accent details, and readable tables. Keep the page focused on choosing and combining tools rather than decorative branding blocks.
- **Theming studies.** Add canonical application-preset studies using small interface examples. Explain local appearance scopes and the relationship between a site preset and an isolated showcase preview.
- **Responsive style guidance.** Add a dedicated Responsiveness section to Component Styles with practical breakpoint examples. Tie the explanation to the existing Tailwind and block layout conventions.

## 16. Navigation, contents, and responsive document layout

### Left navigation and responsive panel

- **Shared navigation content.** Reuse desktop sidebar entries in the responsive navigation drawer. Keep one information architecture while allowing separate expansion and scroll memories for each presentation.
- **Pinned guide destinations.** Align Getting Started and Kamod Ecosystem entries with the rest of the sidebar. Special links remain compact and do not receive component update badges.
- **Consistent entry structure.** Share label, description, count, chevron, and active-state presentation through navigation entry helpers. Selected group descriptions retain their secondary reading role.
- **Subtle selected surfaces.** Reuse the softened inline-code highlight from page labels for selected groups, sublinks and pinned destinations. Desktop and mobile share the same paint while retaining a stronger selected hover.
- **Separate counts and status labels.** Keep every numeric sidebar count on an unpainted background in all states. Fresh/Updated/Planned chips use the current secondary role at 20% alpha, with readable text and icons.
- **Active destination reveal.** Reveal the loaded destination inside its navigation scroll container after route activation. Restore remembered position without leaving the selected item outside the visible region.
- **First-paint restoration.** Restore sidebar position through the dedicated navigation memory helpers. Keep initial navigation lightweight instead of adding repeated layout probes on every render.
- **Deliberate navigation help.** Attach richer help to meaningful group entries rather than every sublink. Use intentional hover behavior so ordinary pointer travel does not open a succession of irrelevant tooltips.
- **Shared responsive footer.** Reuse compact site appearance and resource controls in the navigation panel. Preserve focus trapping, Escape, and return-to-trigger behavior supplied by the existing overlay primitives.

### Right contents and page geometry

- **Unified contents heading.** Share the right-sidebar heading row, section count, and useful compact action. Entry and contents headers align with the same document framing.
- **Hierarchical contents links.** Make nested section links progressively quieter while retaining readable active text. Keep the first page-title link and deeper headings connected to the actual document structure.
- **Contents scroll memory.** Preserve useful right-sidebar state across navigation and restore it without fighting user input. Keep its memory separate from the main document and left navigation.
- **Measured anchor offsets.** Update the topbar offset when the relevant size changes. Heading navigation accounts for the real fixed header so title and section anchors stay visible.
- **Fluid reading columns.** Share page and navbar maximums, symmetric gaps, and responsive sidebar thresholds. Compact desktop widths gain useful article space while wide screens retain clear separation.
- **Sidebar scrollbar clearance.** Reserve enough breathing room around navigation scrollbars and the final contents link. Avoid restoring excessive blank space merely to make the last destination reachable.
- **Natural labels.** Use a text-only Home breadcrumb and format only cn as code within the cn Utility label. Directory and path references preserve normal word spacing.
- **Stationary header hover.** Keep navbar icon controls fixed in position during hover. Limit transitions to color, background, and shadow while retaining meaningful selection feedback elsewhere.
- **Shared footer and brand framing.** Align footer resources and recovery-page branding with the regular site. Remove redundant slogans and keep useful destination links visible.

## 17. Route delivery, prefetching, and runtime readiness

- **Lazy route payloads.** Defer heavier route content and page-specific data instead of loading every document eagerly. The selected route still receives the complete content needed for rendering and navigation.
- **Compact browser metadata.** Reduce the generated browser page catalog to the metadata needed before a route loads. Keep complete SSR records and fetched page data intact.
- **Guarded metadata transformation.** Parse the generated metadata initializer as JSON data and reject unexpected upstream shapes. The optimization does not execute arbitrary generated module content to discover page facts.
- **Stylesheet-based readiness.** Replace repeated computed-style readiness probing with the required stylesheet readiness path. Page readiness corresponds to the actual route/style lifecycle instead of an expensive repeated CSS measurement loop.
- **Shared page requests.** Deduplicate concurrent route load and prefetch work. A navigation request and speculative request for the same page can share useful work instead of issuing parallel copies.
- **Bounded viewport prefetch.** Limit speculative work to a small per-page budget with bounded concurrency and idle scheduling. Skip code, preformatted content, application tooltips, and explicitly excluded links.
- **Pointer-intent prefetch.** Use a short pointer-intent delay instead of capture-phase mouseenter activity for every child of a link. Ignore touch, download, external-target, and irrelevant same-route destinations.
- **Prefetch cleanup.** Cancel pending idle and pointer timers on teardown and stop observing when the page budget is exhausted. Removed links are unobserved rather than retained as stale speculative targets.
- **Scroll persistence guard.** Batch scroll persistence and guard restoration against stale or superseded navigation. Keep browser-history behavior while avoiding repeated writes or a late restoration overriding the current route.
- **Scoped runtime bridge.** Apply narrowly guarded compatibility changes to the pinned PreactPress runtime modules. Fail clearly when an upstream version changes the expected implementation boundary.
- **Development dependency preparation.** Prebundle dependencies reached through virtual routes and configure Prism optimization under its new core owner. Keep large stateless icon catalogs external during SSR where appropriate.
- **Lazy-home dependency analysis.** Register the lazy home entry in Knip's known roots. Dependency checks recognize the real route path instead of reporting its intentionally deferred modules as unused.
- **Route generation hygiene.** Keep generated routes, metadata, and stale-route cleanup aligned with the actual document definitions. Test the generated contract rather than manually maintaining duplicate route lists.

## 18. Atomic development catalogs and stable text rendering

### PreactPress dependency patch

- **Atomic route refresh.** Patch PreactPress 2.2.1 so a watcher rescan builds a replacement document catalog privately. Existing routes remain available while asynchronous reads are in progress.
- **Serialized scans.** Queue overlapping scans rather than letting them publish partial or out-of-order route maps. Development requests see one complete catalog generation at a time.
- **Consistent module snapshots.** Generate page modules from one captured content/metadata snapshot. A response does not combine route facts from different refresh generations.
- **Stale cache protection.** Prevent an older request from overwriting cached output after a newer catalog has published. Later navigation cannot regress to an obsolete generation because a previous read completed slowly.
- **Recoverable failed refresh.** Keep the last complete catalog when a development refresh fails and report the warning. Continue rejecting invalid initial builds so errors are not silently hidden at startup.
- **Pinned patch delivery.** Register the patch through pnpm patchedDependencies and keep its lockfile hash aligned. Include a maintenance note describing the exact guarantees and when an upstream release can replace the patch.
- **Real installed-plugin regressions.** Exercise the installed plugin's actual scan and load functions with controlled I/O. Cover browser and SSR catalog requests, overlapping scans, failed refresh, initial failure, and stale caching.

### Stable documentation typography

- **Native documentation font stacks.** Use immediately available system sans, serif, and monospace stacks throughout the site and local preview scopes. Remove dependence on downloadable text faces for initial paint and stylesheet replacement.
- **Theme API preservation.** Keep the native-font choice scoped to the documentation integration. Public theme presets remain free to expose their existing consumer font stacks.
- **Reproducible brand synchronization.** Wrap the existing brand asset synchronization with deterministic documentation adjustments. Remove external font imports and keep the local wordmark behavior aligned with the stable-font policy.
- **Unused font dependency removal.** Remove the unused Inter font package and its stale dependency-analysis exception after checking the repository's actual usage. Update the lockfile so the native-font path also removes the unnecessary installed dependency.
- **Independent font-request test.** Remove the browser fixture's dependency on a real external font file and abort unexpected font requests instead. Tests still assert that no font request occurs, so the removed package is not retained solely for test setup.
- **Single typography owner.** Replace the old theme-font stylesheet with a dedicated typography stylesheet loaded after theme CSS. Global theme changes and local preset scopes use the same documentation font contract.
- **No font-waiting runtime.** Avoid adding JavaScript font observers, delayed rendering, or a new font-loading state machine. Text remains available through native stacks while the existing page lifecycle continues normally.
- **Text-paint coverage.** Extend browser checks for delayed or blocked fonts and stylesheet replacement. Verify visible text and request behavior rather than treating a loaded-font class as proof of successful rendering.

## 19. Loading, error, and not-found pages

- **Shared page states.** Reuse consistent loading, unavailable-content, interrupted-loading, and not-found presentation. Each state offers a clear route back to useful documentation.
- **Immediate startup feedback.** Keep essential page-state sizing and appearance in the startup critical CSS. A route can show a useful loading view before the complete stylesheet arrives.
- **Coordinated loading motion.** Share restrained skeleton, heading-dot, and spinner timing. Honor reduced motion and keep meaning available without animation.
- **Stable loading artwork.** Use compact neutral decorative panels and the same brand framing as the site. Loading illustration changes do not require runtime measurements or new observers.
- **Viewport-height layout.** Size utility pages with border-box viewport-height rules, including dynamic viewport units with a fallback and safe-area insets. Header and footer remain visible structural regions rather than shrinking unpredictably.
- **Reachable tall content.** Allow the central utility-page content to scroll when its minimum content height exceeds the viewport. Auto margins center shorter content while preserving access to overflowing recovery actions.
- **Short desktop layout.** Use a two-column arrangement for suitable wide but short viewports. Cards and text still stack naturally when the screen narrows or text grows.
- **Responsive recovery actions.** Let recovery cards and controls reflow through intrinsic sizing and wrapping. Large text and small screens retain readable actions without clipped fixed-height containers.
- **Compact interrupted loading.** Keep interrupted-loading recovery focused on the next useful action. Preserve the site state distinction instead of treating all failures as a generic 404.
- **Host fallback distinction.** Test the application's not-found view through the correct server or explicit fallback fixture. A static preview server's plain unknown-URL response is not mistaken for the application's rendered recovery page.

## 20. Visual consistency, stable icons, and interaction polish

- **Shared control-group styling.** Consolidate selected, hovered, and inactive paint for showcase and appearance controls. Preserve the selected fill while adding only the intended hover increment.
- **Stable StateIcon helper.** Add a private docs helper that retains multiple glyph nodes and changes their visibility by state. Use it in display options, appearance controls, theme studies, and changing demonstration controls.
- **Persistent selection marks.** Keep check, radio, and appearance glyphs mounted where their state is purely presentational. This reduces painting instability without introducing shared icon caches or global state.
- **Refresh end-state stability.** Keep completion fills and static animation endpoints aligned with the final state. The control does not rebound or flash a replacement glyph as feedback finishes.
- **Uniform icon-button language.** Share compact sizes, quiet idle surfaces, and restrained hover/focus styling. Navbar controls keep their position while selected controls keep their meaningful state cues.
- **Shared preview pattern.** Use one reusable subdued background pattern and page-colored overlay. Local content appearance remains independent of the decorative outer showcase canvas.
- **Quiet source introductions.** Give Code and Prompt headings matching compact icon weight and readable secondary text. Remove redundant actions that narrowed the actual introduction content.
- **Rendered Markdown presentation.** Keep prepared Markdown typography, code fences, and references under the documentation styles. The readable document view continues to copy its complete original source.
- **Responsive callout internals.** Use container-aware callout metadata placement and wrapping footer content. Long titles and supporting text preserve their hierarchy without a special page-specific skin.
- **Consistent supporting guidance.** Reduce the visual weight of supporting-file notes and supplementary callouts. Preserve their content and links while letting the primary setup and source flow remain dominant.

## 21. Regression coverage added or expanded

### Core and package tests

- **Code language tests.** Cover aliases, explicit hints, bounded inference, file-based resolution, unsupported values, and plain-text fallback. Keep the public language catalog aligned with actual highlighter support.
- **Code import tests.** Exercise multiline and complete leading imports, ineligible source, and source-change resets. Verify folded display never truncates copied source.
- **Code markup tests.** Check escaping, token-preserving transformations, line wrapping, and markup slicing. Retain source fidelity when references and syntax spans coexist.
- **Modular Code behavior tests.** Cover optional headers, content slots, replacement controls, controlled state, and hidden-control behavior. Verify custom composition continues to use the existing actions and status regions.
- **Overflow tests.** Exercise control eligibility against complete unwrapped source and changing available width. Cover cleanup and avoid making the presence of a CSS class the only behavior assertion.
- **Reference parser tests.** Cover import forms, aliases, usages, shadowing, URL rejection, escaped attributes, and resolver inheritance. Include explicit provider opt-out and source fidelity through folding and wrapping.
- **Source-reader SSR tests.** Check useful initial source, custom document output, and optional reader controls in rendered markup. Confirm that source remains available before deferred highlighting runs.
- **Copy lifecycle tests.** Exercise success, rejected clipboard access, retry, stale completion, custom controls, and timer cleanup. Add glyph-stability coverage alongside accessible feedback assertions.
- **Tabs and callout tests.** Extend keyboard, nested behavior, SSR, heading, role, and metadata checks. Verify the new presentations preserve semantic and state contracts.
- **Placement and cleanup tests.** Cover tooltip collision and lazy growth, unchanged measurement reuse, bounded dropdown mount retries, and scrollbar drag teardown. These regressions target the actual loops and lifecycle boundaries changed by the implementation.
- **Spinner and indicator tests.** Verify the HTML animation target, static SVG, status semantics, and reduced-motion behavior. Check stable menu and ThemeToggle glyphs through state changes.
- **Theme runtime tests.** Exercise unchanged preset/scheme requests and explicit scoped application behavior. Preserve system-scheme resolution and the existing theme signal/provider contract.
- **Shared blocks tests.** Cover ThemePicker control ownership, selected state, accessible actions, and integration with catalog examples. Update chart and branding expectations to the resulting presentation.
- **Shell frame tests.** Exercise shared slots, landmarks, navigation, mobile/desktop behavior, and variant-specific ownership. Include cases that protect the reusable API from demo-specific coupling.

### Documentation unit and build-time tests

- **Source catalog tests.** Check verified destinations, API IDs, reference classification, prose annotation, and source-target extraction. Keep the private metadata model separate from the public reader contract.
- **Lazy help tests.** Cover shared pending loads, cache reuse, retry, missing help, stale responses, and the retained destination link. Verify detailed help layout against the facts supplied by extraction.
- **Guide rendering tests.** Check component, package, block, and Code page content through their actual shared compositions. Include anchors, contents structure, examples, and portable document output.
- **Example compilation tests.** Compile important documentation snippets and generated local-source examples against real exports. Catch stale public props and missing source dependencies before a reader copies them.
- **Download and manifest tests.** Validate sidebar and shell source closure, generated archive contents, source labels, and route metadata. Keep source browser choices aligned with the files actually shipped.
- **Preview queue tests.** Cover readiness, failure, unmount, viewport cancellation, fallback scheduling, ID-zero cancellation, and retention of started previews. Protect both startup efficiency and entered user state.
- **Runtime compatibility tests.** Exercise bounded prefetch, shared route work, scroll restoration, metadata reduction, and upstream-module guards. Run atomic catalog regressions against the installed patched dependency.
- **Navigation memory tests.** Cover left and right sidebar state, active destination reveal, link hierarchy, and topbar offsets. Prevent remembered state from overriding the wrong navigation surface.

### Browser suites and visual contracts

- **Code reader browser coverage.** Add or expand source display, imports, overflow, language inference, header metadata, custom controls, copy behavior, and all syntax palettes. Exercise the real documentation integration as well as standalone reader examples.
- **Source reference browser coverage.** Exercise imported symbol navigation, lazy help, focus, placement, and private reference rendering. Include pure-primary resting and hover cues without extra arrows or duplicate underline paint.
- **Showcase browser coverage.** Cover loading, first tab selection, source files, prompts, refresh, preferences, viewport choices, preview activation budgets, and background scope. Keep local appearance and preserved preview input part of the integration contract.
- **Shell browser coverage.** Exercise variant previews, APIs, guides, keyboard navigation, responsive sidebars, and production guidance. Include the generated source/download path and real form-associated footer behavior where relevant.
- **Navigation browser coverage.** Check desktop and mobile navigation, memories, active reveal, right contents, title permalinks, and fixed-header anchor positions. Preserve keyboard focus and readable selected states in both schemes.
- **Guide and landing coverage.** Cover home responsiveness, Getting Started, ecosystem, package resources, portable references, component guidance, and block detail layouts. Test real links and exported content rather than only headings.
- **Fonts and utility-page coverage.** Add delayed-font and stylesheet-replacement checks together with loading, interrupted, and not-found layouts. Exercise narrow, wide, short, and enlarged-text conditions with visible recovery actions.
- **Cross-browser configuration.** Retain the repository's Chromium, Safari/WebKit, and iPhone projects and expand relevant WebKit matching for the new UI paths. Execution availability is recorded in the final validation matrix rather than inferred from configuration alone.
- **Baseline-aware assertions.** Update obsolete selectors and expectations for intentional new markup, labels, and navigation structure. Keep observed environmental or server-fixture limitations separate from product regressions.

## 22. Packaging, generated content, and repository integration

- **Core dependency ownership.** Move Prism and its development types from docs to core, where the shared highlighter now lives. Add the icon dependency required by the reusable core controls and update the lockfile accordingly.
- **Blocks distribution.** Align shell subpath exports and build entrypoints with the public source tree. Include shared theme-picker CSS distribution and document its controlled usage in the blocks README.
- **Documentation aliases.** Add source aliases for the Code entrypoint and highlighter in docs TypeScript, Vite, and test configuration. Unit tests and development imports resolve the same component implementation.
- **Build-only reference tooling.** Keep filesystem and declaration extraction in PreactPress/Vite plugins. Browser modules consume generated facts rather than importing Node filesystem APIs or compiler tooling.
- **Generated route manifests.** Regenerate the shared documentation manifest and focused Markdown route stubs after guide changes. The generated files are consequences of authored page definitions, not independent feature implementations.
- **Generated preview assets.** Include new shell thumbnails and refreshed sidebar images with their updated manifest entries. Remove superseded image references through the established asset workflow.
- **Download generation.** Extend build-time download tooling for the working Shell 3 archive while preserving existing sidebar exports. Keep the public archive route, source listing, and tests in agreement.
- **Brand asset wrapper.** Route docs brand synchronization through the local reproducible script. Keep generated logo styles and typography policy aligned after each development or production build.
- **Pinned dependency maintenance.** Add the PreactPress patch file, workspace registration, lockfile hash, and maintenance README as one integration unit. The patch affects server/build behavior and adds no browser dependency.
- **Correct clean-workspace CI order.** Build theme/typeset prerequisites and the UI packages before building blocks and running its tests ahead of docs. This fixes the observed remote docs-test failure resolving @kamod-ch/blocks/shared when blocks runtime output had not been built.
- **Complete CI suite coverage.** Add theme and blocks unit suites to the root CI command's explicit sequence. Successful local developer builds are no longer an implicit prerequisite for those downstream tests.
- **Standalone docs build dependencies.** Make build:docs build blocks before the documentation package. A clean documentation build receives the shared picker and shell runtime exports it imports.
- **Current Biome configuration.** Update the schema to the installed Biome version and replace deprecated recommended fields with equivalent preset configuration. Preserve the existing checks while removing avoidable configuration notices.
- **Explicit reactive read.** Mark the intentional theme signal tracking read with void. Keep the subscription behavior while removing the unused-expression lint warning.
- **Cross-package consistency.** Include the small OpenUI line-tab adjustment and Typeset hover-capability restriction. These consumers continue to match the shared core and documentation interaction rules.
- **Public discovery metadata.** Add the new Code destination to the root and docs-public LLM indexes. Keep automated discovery consistent with the visible component navigation.
- **Review artifacts.** Add this detailed change ledger and the separate PR description under .github/pull-requests/80. Distinguish contributor documentation and supplied assets from shipped runtime features.

### Contributor documentation and supplied assets

- **Public contributor instructions.** Include AGENTS.md with the repository's Preact, package-ownership, validation, and contribution conventions. Make private context references optional in fresh clones and describe the current CI command's blocks coverage accurately.
- **Fork workflow guide.** Include CONTRIBUTING-FROM-A-FORK.md with explicit fork and upstream responsibilities. Correct remote-specific commands so contributors do not assume origin is the upstream repository.
- **Application shell brief.** Preserve the supplied Application Shell 1 brief and corresponding issue outline as contributor documentation. Make clear that the shell is implemented and that archived embedded phase prompts are reference material rather than new execution requests.
- **Block documentation issue briefs.** Include the detail-layout, detail-template, documentation, guide, overview-preview, and browsing issue drafts. These record rationale and acceptance criteria for the documentation work without adding runtime behavior.
- **Interaction issue briefs.** Include the mobile documentation navigation, sidebar preview scrolling, and tooltip quick-hover briefs. They preserve the context behind shared interaction changes for future maintenance.
- **Supplied logo asset.** Include the root kamod-ui-logo.svg provided with the contributor material. Treat it as a preserved source asset, separate from the generated public brand synchronization output.
- **Reference formatting exclusions.** Keep Oxfmt exclusions for preserved supplied reference documents whose original formatting is intentionally retained. The shared .gitignore edit and private .docs content remain excluded from the contribution under the existing explicit policy.

## 23. File-family coverage ledger

This ledger accounts for every product file family in the combined committed and
working-tree inventory. Paths identify ownership and representative members;
generated image filenames and repetitive route stubs are grouped with their
generator and manifest rather than repeated individually.

| File family                                                                                    | Coverage in this ledger   | Review focus                                                                                                     |
| ---------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| packages/core/src/components/code/**                                                           | Sections 1–3, 13, 21      | Public reader, language/import/wrap/reference helpers, lazy work, palettes, and tests.                           |
| packages/core/src/components/copy-button/**                                                    | Sections 4, 21            | Exact clipboard lifecycle, custom controls, accessible feedback, stable glyphs, and CSS.                         |
| packages/core/src/components/alert/**                                                          | Sections 4, 20–21         | Callout composition, semantic headings, neutral shared styling, and regressions.                                 |
| packages/core/src/components/tabs/**                                                           | Sections 4, 21            | Inset variant, selected/hover paint, indicator geometry, keyboard behavior, and SSR.                             |
| packages/core/src/components/tooltip/**                                                        | Sections 3–4, 21          | Collision placement, lazy resize handling, unchanged measurements, and cleanup.                                  |
| packages/core/src/components/scroll-area/**                                                    | Sections 4, 21            | Stable thumb geometry and pointer-capture lifecycle.                                                             |
| packages/core/src/components/dropdown/**                                                       | Sections 4, 21            | Bounded portal retry and persistent checkbox indicators.                                                         |
| packages/core/src/components/context-menu/** and menubar/**                                    | Sections 4, 20–21         | Stable check/radio glyphs with unchanged selection semantics.                                                    |
| packages/core/src/components/theme-toggle/**                                                   | Sections 4–5, 20–21       | Persistent appearance glyphs and public-toggle behavior.                                                         |
| packages/core/src/components/spinner/**                                                        | Sections 4, 10, 21        | HTML animation wrapper, accessibility, and reduced motion.                                                       |
| packages/core/src/components/type-definition/**                                                | Sections 4, 11, 21        | Shared source-backed reference metadata and disclosure semantics.                                                |
| packages/core/src/components/calendar/**, direction/**, item/**, table/**                      | Section 4                 | Hover-capability corrections, Preact documentation, and header-specific attribute typing.                        |
| packages/core/src/lib/interactive/menu-indicators-regression.test.tsx                          | Section 21                | Shared menu indicator identity and selection regressions.                                                        |
| packages/core/src/index.ts, theme.css, package.json, tsup.config.ts                            | Sections 1, 4, 22         | Public exports, CSS ownership, focused bundles, and dependency distribution.                                     |
| packages/blocks/src/application-shell/application-shell-{2..8}/**                              | Sections 6–7, 21          | Seven reusable layouts, public entrypoints, and separate previews.                                               |
| packages/blocks/src/application-shell/shared/**                                                | Sections 6–7, 21          | Shared frame, navigation, breadcrumbs, typed slots, fixtures, and tests.                                         |
| packages/blocks/src/application-shell/application-shell-1/**                                   | Sections 6, 8             | Existing shell navigation and shared composition integration.                                                    |
| packages/blocks/src/application-shell/{index,metadata,registry,ATTRIBUTION}.*                  | Sections 6–7, 22          | Family exports, component-free metadata, source labels, and accurate attribution.                                |
| packages/blocks/src/shared/theme-picker/** and shared/index.ts                                 | Section 5                 | Controlled picker, system scheme helper, resource actions, CSS, and tests.                                       |
| packages/blocks/src/app-sidebar/** and sidebar/**                                              | Section 8                 | Branding, example navigation, source closure, and installation manifest.                                         |
| packages/blocks/src/auth/**, login/**, signup/**                                               | Section 8                 | Authentication example and presentation consistency.                                                             |
| packages/blocks/src/commerce/**, communication/**                                              | Sections 8, 20            | Example refinement, shared copying, and raw code appearance.                                                     |
| packages/blocks/src/dashboard/**, marketing/**                                                 | Sections 5, 8             | Theme customization, chart expectations, and catalog fixtures.                                                   |
| packages/blocks/README.md, package.json, tsup.config.ts                                        | Sections 5–6, 22          | Documented shared controls, shell exports, and distributable assets.                                             |
| packages/themes/src/tokens.css and brands/**                                                   | Sections 2, 5             | Scoped semantic tokens and eight application presets.                                                            |
| packages/themes/src/index.tsx and index.test.tsx                                               | Sections 5, 21            | No-op appearance application and scoped runtime behavior.                                                        |
| packages/openui/src/components/Tabs.tsx                                                        | Sections 4, 22            | Explicit line-tab presentation.                                                                                  |
| packages/typeset/src/typeset.css                                                               | Sections 4, 22            | Fine-pointer-only link hover paint.                                                                              |
| packages/docs/.preactpress/code-reference-*.ts                                                 | Sections 3, 21–22         | Build-only verified destination/help extraction and virtual modules.                                             |
| packages/docs/.preactpress/component-api-plugin.ts                                             | Sections 11, 21           | Source-backed and lazily delivered component API metadata.                                                       |
| packages/docs/.preactpress/{runtime-performance,page-metadata}-plugin.ts and page-preloader.ts | Sections 17–18, 21        | Guarded runtime integration, compact catalogs, readiness, and startup.                                           |
| packages/docs/.preactpress/block-*-plugin.ts and guide-page-data.ts                            | Sections 7–8, 11, 22      | Block routes/downloads and guide data delivery.                                                                  |
| packages/docs/.preactpress/config.ts, content/**, theme/**                                     | Sections 11, 15–19, 22    | Site integration, shared layout, branding, preview ownership, and theming content.                               |
| packages/docs/src/references/**                                                                | Sections 3, 21            | Private reader adapter, inline annotation, destinations, lazy help, and tests.                                   |
| packages/docs/src/docs/components/component-detail/**                                          | Sections 9–12, 21         | Shared examples, API/reference layouts, accessibility, lazy previews, and queue lifecycle.                       |
| packages/docs/src/docs/components/package-teaser/**                                            | Section 14                | Five guide compositions, portable reference workspace, curated endings, and tests.                               |
| packages/docs/src/docs/components/brand/**                                                     | Sections 3, 11            | Shared brand identities, Markdown references, and destination presentation.                                      |
| packages/docs/src/docs/components/Code*, code-*, highlight-code.ts                             | Sections 1, 3, 9, 13      | Thin core-reader adapters, source labels, static fences, and supporting tests.                                   |
| packages/docs/src/docs/components/StateIcon.tsx and state-icon.css                             | Sections 20–21            | Private persistent glyph presentation and reduced-motion behavior.                                               |
| Remaining packages/docs/src/docs/components/**                                                 | Sections 9–15             | Shared guide/header/contents/path/loading/prose/overview helpers and their tests.                                |
| packages/docs/src/docs/examples/code/**                                                        | Sections 2, 13, 21        | Full Code guide, live studies, API tables, and compilation checks.                                               |
| packages/docs/src/docs/examples/tabs/** and ui-motion/**                                       | Sections 4, 12            | Inset example and updated motion demonstrations.                                                                 |
| packages/docs/src/docs/guides/**                                                               | Sections 5, 15, 21        | Theme studies, runtime guidance, and source-backed documentation checks.                                         |
| packages/docs/src/docs/pages/**                                                                | Sections 12–15            | Component/form/package content, Code registration, and page-level compositions.                                  |
| packages/docs/src/docs/* manifests, loaders, metadata, and types                               | Sections 11–13, 17, 22    | Shared documentation model, lazy delivery, and generated route contracts.                                        |
| packages/docs/src/blocks/detail/**                                                             | Sections 7–8, 21          | Variant guides, source-backed props, quickstart downloads, and release checks.                                   |
| packages/docs/src/blocks/Block*, Blocks*, application-shell-*                                  | Sections 6–9              | Catalog/detail integration, shell metadata, source browser, and live showcases.                                  |
| packages/docs/src/blocks/Prompt*, Preview*, Showcase*, preview-*                               | Sections 2, 9–10, 20      | Source/document views, local appearance, refresh, loading, and preferences.                                      |
| Remaining packages/docs/src/blocks/**                                                          | Sections 7–10, 21–22      | Source maps, manifests, prompts, guide data, responsive helpers, and tests.                                      |
| packages/docs/src/home/**                                                                      | Section 15                | Modular landing page and interactive workspace.                                                                  |
| packages/docs/src/layout/navigation/**                                                         | Section 16                | Shared sidebar/drawer content, link hierarchy, memories, and active reveal.                                      |
| packages/docs/src/layout/runtime/**                                                            | Sections 17–18, 21        | Bounded prefetch, route/scroll lifecycle, and installed-plugin catalog tests.                                    |
| packages/docs/src/layout/tooltips/**                                                           | Sections 3, 11, 16        | Delegated application help, glossary handling, and reference integration.                                        |
| Remaining packages/docs/src/layout/**                                                          | Sections 16, 19           | Site frame, topbar offsets, shared actions, and page states.                                                     |
| packages/docs/src/theme/**                                                                     | Sections 2, 5, 16         | Site theme owners, appearance menu parts, and tests.                                                             |
| packages/docs/src/styles/**                                                                    | Sections 2, 5, 8–20       | Shared product visual rules for readers, guides, navigation, controls, fonts, and utility pages.                 |
| packages/docs/src/kitchen-sink/**, link-title.*, vite-env.d.ts                                 | Sections 11, 17, 21–22    | Integration fixtures, consistent link labeling, and virtual-module typing.                                       |
| packages/docs/docs/**, blocks/**, index.mdx, 404.md                                            | Sections 7, 12–15, 19, 22 | Authored guide Markdown and generated focused route stubs.                                                       |
| packages/docs/e2e/**                                                                           | Section 21                | Browser behavior, responsiveness, palettes, references, navigation, and loading contracts.                       |
| packages/docs/scripts/**                                                                       | Sections 7–8, 17–18, 22   | Route generation/cleanup, downloads, thumbnail capture, and reproducible brand synchronization.                  |
| packages/docs/public/block-previews/** and preview manifests                                   | Sections 7–8, 22          | Generated responsive shell/sidebar preview assets and their source-of-truth references.                          |
| packages/docs/public/styles/**                                                                 | Section 18                | Generated brand styles consistent with native documentation fonts.                                               |
| packages/docs/package.json, playwright.config.ts, tsconfig.json, vitest.config.ts              | Sections 21–22            | Scripts, aliases, browser coverage selection, and plugin-enabled test execution.                                 |
| patches/**, pnpm-workspace.yaml, pnpm-lock.yaml                                                | Sections 18, 22           | Pinned atomic-catalog fix and consistent dependency ownership.                                                   |
| package.json and biome.json                                                                    | Section 22                | Clean-checkout CI/build ordering, complete suite coverage, and current equivalent lint configuration.            |
| knip.json, llms.txt, packages/docs/public/llms.txt                                             | Sections 12, 17, 22       | Lazy-route dependency recognition and public component discovery.                                                |
| AGENTS.md, CONTRIBUTING-FROM-A-FORK.md, .oxfmtrc.json                                          | Section 22                | Public contribution instructions, accurate remote/build commands, and preserved-reference formatting exclusions. |
| Root application-shell, block-documentation, preview, navigation, and tooltip issue briefs     | Section 22                | Supplied specifications and acceptance criteria published as contributor documentation.                          |
| Kamod UI – Application Shell 1.md and kamod-ui-logo.svg                                        | Section 22                | Preserved original feature brief and supplied source artwork.                                                    |
| .github/pull-requests/80/**                                                                    | Section 22                | Detailed change ledger and reviewer-facing description.                                                          |

The root contributor guides, issue briefs, supplied logo, and formatting
configuration are included in the contribution as documentation/assets, as listed
above. Private .docs context and audit notes and the protected .gitignore change
remain excluded under the existing instructions. No local metadata is counted as
a shipped product capability.

## 24. Existing commit coverage

The final audit is based on the resulting source tree, with this history providing
traceability for the already committed work. Intermediate validation recorded in
individual commits is historical evidence, not a substitute for the final matrix.

| Commit   | Delivered area                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| d8df1bb5 | Scoped application palettes and redundant-theme-update avoidance.                                                                                |
| 5da5460a | Core modular Code and shared CopyButton.                                                                                                         |
| 19ef5468 | Inset tabs, AlertCallout, shared API presentation, and placement fixes.                                                                          |
| 37e44f99 | Shared blocks theme picker and catalog presentation.                                                                                             |
| 96c7b3c5 | Shared inline references and structured contextual help.                                                                                         |
| 35fab4c3 | Shared code/copy adapters and themed showcase states.                                                                                            |
| df98e922 | Source-backed API extraction and shared reference layouts.                                                                                       |
| e0390c59 | Code, callout, and inset-tab documentation.                                                                                                      |
| eee41fb4 | Component and Formisch integration guidance.                                                                                                     |
| fd37d8e0 | Package setup guidance and portable references.                                                                                                  |
| 7d6e760d | Block catalog guides and shared reference layouts.                                                                                               |
| 0fdd0d9c | Interactive home and Getting Started.                                                                                                            |
| acd738d7 | Responsive navigation and reading layout.                                                                                                        |
| 8a9bb510 | Deferred route payloads and page readiness.                                                                                                      |
| b664f0fe | Sidebar thumbnails and capture tooling.                                                                                                          |
| 0664b0d6 | Seven additional responsive application-shell compositions.                                                                                      |
| 1e100cbc | Shell variant guides, downloads, and production checks.                                                                                          |
| 6a7fe3e7 | Source-preserving Code and shared-control lifecycle refinements.                                                                                 |
| 4a1b2634 | Stable showcases, ecosystem guidance, and navigation consistency.                                                                                |
| 1020037c | Active sidebar reveal and navigation styling.                                                                                                    |
| c60c5e6f | Resolution of the PR's merge conflict with main.                                                                                                 |
| d4c66e9a | Dependency analysis recognition of the lazy home route.                                                                                          |
| e6adcec5 | Generic source references, additional Prism palettes, and core control refinements.                                                              |
| bad6a138 | Private lazy reference help, responsive navigation, and bounded preview startup.                                                                 |
| 998f5eff | Historical shared UI source modes and paired primary values (reverted by the latest rollback), plus retained callouts and stable control glyphs. |
| 24b05645 | Contributor guides, supplied issue briefs, formatting exclusions, and source artwork.                                                            |
| 8363c56d | Site integration, responsive utility pages, stable fonts, portable guides, catalog patch, and corrected CI build order.                          |

## 25. Verification and review boundaries

The following matrix records the earlier full audit through section 35. The
reference follow-up in section 36 has its own validation record below. Historical
measurements describe their stated workload; they are not substitutes for the
latest focused checks.

| Check                                  | Final local result                                                                                                                     |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `corepack pnpm typecheck`              | Passed across the workspace.                                                                                                           |
| `corepack pnpm build`                  | Passed, including production documentation and package runtime output.                                                                 |
| `corepack pnpm test:ci`                | Passed: **1,531 tests** in **184 files**.                                                                                              |
| Unit breakdown                         | Themes 11; core 421; OpenUI 19; motion 25; blocks 194; docs 861.                                                                       |
| `corepack pnpm lint`                   | Passed.                                                                                                                                |
| `corepack pnpm format:check`           | Passed: 3,025 files before the final Markdown update; final changed-file formatting also checked.                                      |
| `corepack pnpm biome:ci`               | Passed: 1,727 files.                                                                                                                   |
| `corepack pnpm docs:readme:check`      | Passed.                                                                                                                                |
| `corepack pnpm qa:deps`                | Passed: Knip and Syncpack.                                                                                                             |
| `corepack pnpm qa:publint` / `qa:attw` | Passed for all configured packages.                                                                                                    |
| Production browser regression          | **165 distinct affected cases passed across the audit and focused reruns**; all 29 final appearance cases passed across recheck/retry. |
| Whitespace and staged scope            | Checked before each scoped commit; private context and `.gitignore` excluded.                                                          |
| Remote CI                              | Passed: [CI #294](https://github.com/kamod-ch/kamod-ui/actions/runs/38790963363) on implementation `1f97720d`.                         |

Two browser cases were interrupted by Chrome `ERR_NETWORK_CHANGED` while loading
local assets; their traces identify that transport failure and both pass on focused
rerun. The production preview was restarted after the final CSS rebuild so its
server-rendered asset manifest matched the files being tested. These are combined
run results, not a claim that the initial full run had zero interruptions.

The test review found meaningful coverage for retention/eviction, queue release,
observer/listener disposal, pre-hydration readiness, stale results and Markdown
Blob/timer cleanup. The final audit also adds a browser regression for adaptive
syntax colors across alternating local light/dark boundaries. Pure paint and
spacing updates reuse browser layout/style coverage rather than adding unit
tests that merely repeat CSS declarations. Seven inversion-only unit cases and
the dedicated mode suite were removed with the reverted public mode feature.

### Local WebKit runtime limitation

The machine runs macOS 14.8.9 on ARM64. Installed Playwright 1.63.0 selects its
frozen WebKit 2251 override for that platform; the matching browser is already
installed, and an install dry run selects that same archive. Its protocol lacks
`PushAPIEnabled`, which the driver sends before creating a page, so reinstalling
would not repair this mismatch. WebKit needs a supported current runner or an OS
upgrade; no dependency downgrade or protocol patch was introduced to conceal it.

## 26. Theme tokens and Prism explained in depth

### Application theme foundations

- **Foundation selection.** Expand the existing installation section with the separate roles of CSS foundations, brand presets, appearance schemes and component treatments. Retain the established page routes and cross-link the first-setup guide.
- **Component role ownership.** Expand usage with focused Preact examples, surface/ink pairs and a table that assigns layout, variants, application colors and reader overrides to their narrowest useful owner. Explain focus, hover, selected, disabled and feedback states together.
- **Token-to-utility pipeline.** Explain raw values, semantic custom properties, component variables and Tailwind’s `@theme inline` mapping. Include small CSS/TSX examples and distinguish runtime value changes from generating new utility classes.
- **Scope and cascade.** Document preset specificity, local resets, DOM inheritance and portal boundaries. Explain why an inherited component override can lose to a variable declared on the reader itself.
- **Sidebar role family.** Extend the sidebar explanation with an accessible selected-link example, state-by-state checks and porting guidance for Kamod’s actual background/outline token names. Distinguish sidebar emphasis from the color a particular consumer uses for selection.
- **Canonical cross-references.** Connect the preset gallery, general token guide, Code syntax guide and block theming companion. Keep shared detail in its owning guide while retaining block deep links.

### Prism and product syntax palettes

- **Prism rendering pipeline.** Trace literal source into grammar tokens, highlighted classes and CSS paint. Explain which changes reuse highlighted nodes, which may change classification, and why display is separate from execution or validation.
- **Syntax group reference.** Describe the nine variable families and their real grammar-group mappings, including language-specific exceptions and weight/style suffixes. Keep navigation metadata and private lazy help distinct from Prism classification.
- **Reader CSS boundaries.** Explain the actual `data-syntax-theme` attribute, low-specificity component defaults, loading wrappers and source/header/typography variables. Show how root-local classes preserve neighboring readers and caller-owned rendered content.
- **Upstream theme inclusion.** Link the official Prism and Prism Themes collections and distinguish a standalone CSS import from a scoped Kamod adaptation. Include a Dracula-family recipe, vendor selector guidance, attribution and update ownership.
- **Semantic syntax palette.** Add the opt-in `theme` syntax ID, bringing the catalog to nine while retaining existing defaults. Derive six colored groups from primary/chart roles and mix each hue with foreground ink; keep comments secondary and chart fallbacks explicit.
- **Eight-preset local lab.** Compare every existing application preset in local light/dark scopes with a compact role legend. Native controls affect only that preview, preserve token nodes and never write saved appearance preferences.
- **Product palette recipe.** Explain color weights versus opacity, local reader refinements, custom preset inputs and the distinction between CSS-only names and typed runtime registrations. Provide focused CSS and Preact snippets instead of duplicating eight palette implementations.
- **Standalone reader stylesheet.** Export Code’s layout, syntax and copy-feedback CSS without overlapping semantic foundations. Preserve the existing full UI stylesheet path and keep CSS-only exports outside JavaScript type-resolution analysis.
- **Shared guide rendering.** Extract the reusable GuideParts renderer for full guides and embedded Code topics, including correct heading offsets, shared source readers and existing reference-aware inline prose. Store authored fragments outside the route tree and load them through watched virtual string modules compatible with production PreactPress.
- **Verification coverage.** Extend copyable-example compilation to complete TSX snippets in the new authored content and retain existing anchor checks. Update the nine-palette browser regression and add responsive all-preset contrast, local preference isolation, node reuse, unchanged-source and keyboard checks.

- **Glossary regression maintenance.** Keep the legacy inline-help keyboard/navigation test on `className`, which still belongs to that glossary. `cn` now uses private function-reference help, so the test no longer waits for its obsolete glossary marker.

### Verification ownership

The final matrix in section 25 supersedes intermediate follow-up totals. The
Code documentation tests compile complete authored TSX examples against the real
API, and browser coverage checks all nine syntax IDs, eight semantic presets in
both appearances, token reuse, original source, scoped contrast, persistence,
keyboard operation and lazy help. Earlier desktop/mobile screenshots and native
Safari measurements remain evidence only for their explicitly recorded scope.

## 27. Color presets as practical design studies

### Reading flow and visual comparison

- **A clearer Theming introduction.** Shorten the opening description and add four compact reading paths: foundations, palette studies, semantic tokens and appearance preferences. Keep the established sections and their existing anchors in the same order.
- **Eight complete preset studies.** Expand Kamod, shadcn (Geist), Ocean, Sunset, Cursor warm, Voltage, Watson and Professional with individual direction, application advice and review notes. Each neutral frame keeps the explanation readable while its contained sketches show the actual preset.
- **Four simple compositions per preset.** Replace the richer miniature workspace with two static sketches in each explicit appearance: a small workspace and an action card. Thirty-two compositions demonstrate page, navigation, card, primary and secondary relationships without simulated inputs, animation or loading semantics.
- **Palette roles on demand.** Keep four labeled surface/action swatches visible in each appearance. A native disclosure reveals eight more roles, including text, quiet surfaces, selection, boundaries, navigation and feedback, with their real custom-property names.
- **A useful gallery introduction.** Explain how to compare relationships, choose a direction and adapt the result once before the studies. Compact jump links reach every preset without adding another global preference or duplicating the right-hand contents list.
- **Consistent responsive composition.** Arrange the two appearances and supporting guidance side by side when the article has room, then stack them at a 35rem container width. Smaller headers and footers wrap below 23rem while both miniature compositions remain legible inside each appearance.

### Preset-specific guidance and examples

- **Two design principles per preset.** Explain practical decisions such as keeping Ocean's cyan and indigo roles distinct, preserving paper around Cursor warm's ink and pairing Professional's yellow fill with its intended black foreground. Compact token chips connect each recommendation to the underlying roles.
- **Declared typography, honestly represented.** Document body, display and mono stacks for every preset, including inherited application stacks and Watson's separate heading face. Explain that the documentation retains native fonts and does not download the named faces just to illustrate a palette.
- **Shape and radius.** Add a restrained corner sample and small, base and larger radius references for each study. Document inherited values as inherited, and verify every stated base radius against its shipped stylesheet or the shared foundation.
- **Focused shipping review.** Retain an individual review note for every palette and remove font/radius repetition from the surrounding prose. Include feedback, selected states, boundaries and real content where they materially affect that preset's use.
- **Copyable local scope recipes.** Add an optional example for each literal preset ID using the existing theme scope and semantic card/foreground pair. Explain its stylesheet prerequisite, explicit appearance and separation from saved application preferences.
- **Lazy reader lifetime.** Native disclosure events mount a recipe's CodeBlock only while it is open and release it when closed. Closed studies do not create source readers or their highlighting/reference observers.
- **Direct source references.** Link each study to its actual theme stylesheet under `packages/themes/src`, using `tokens.css` for Kamod and the corresponding brand file for the other presets.
- **Shared next steps.** Explain preset versus appearance persistence once, show the public selection handler, and link to CSS setup, token pairs, sidebar roles and a final theme review. Continue into the semantic Code palette and complete-block theming without repeating those guides.

### Navigation, accessibility and maintenance

- **Real subsection routes.** Generate routes for the palette overview, every preset and the shared ending. Keep literal route metadata in parity with the rendered guide and mark these as guide sections rather than component variants.
- **Nested route targeting.** Resolve child guide headings from the complete contents tree when opening an existing section URL without a fragment. Direct preset URLs now scroll to their requested study instead of falling back to the introduction.
- **Readable secondary content.** Mix secondary labels with foreground ink locally, preserving the underlying theme values. Scope the treatment inside each appearance and fix inherited lead, inline-code and copy-caption contrast without changing global Code styling.
- **Partitioned implementation.** Separate preset data, study composition, palette sketches, type/shape details and shared reading guidance. Split their styles by responsibility while retaining one theme subscription and the existing appearance runtime.
- **Unit coverage.** Add route/contents parity, documented-radius parity and recipe mount/unmount regressions. Extend server-render assertions for sixteen preview scopes plus sixteen decorative signature scopes, thirty-two sketches, unchanged saved preferences and the absence of fake loading controls.
- **Browser coverage.** Check every direct preset route, keyboard disclosure, complete copied source and reader cleanup. Exercise all eight applied presets in both appearances, responsive comparison layouts, expanded role lists, persistent selection, contents targets and accessibility scans.

### Preset study verification

The final matrix in section 25 includes the preset studies and full Theming guide.
Coverage protects direct subsection navigation, native disclosures, complete
copied recipes, reader release, role lists, contrast and responsive comparison
layouts. Earlier final desktop and 320px ready-state screenshots were reviewed;
no additional external font, iframe, animation loop or state store is introduced.

## 28. Expanded private inline-reference families

### Detection and trustworthy destinations

- **Four additional families.** Extend the existing nine reference kinds with terminal commands, block variants, technology labels and page/section destinations. Named guides share Page / section, keeping one presentation contract for all thirteen kinds.
- **Twenty recognized command tools.** Recognize supported package managers, executable runners, source-control tools, build tools, linters and container/registry commands. Link to the tool's official command documentation while preserving the literal invocation.
- **Conservative command parsing.** Bound parsing to 1,024 characters and reject shell operators, command expansion and multiline input. Detection never runs a command or implies that arbitrary arguments have been validated.
- **Exact block identities.** Derive block and variant aliases from the actual registry, including verified local installation/source targets. Preserve the private-source distinction instead of pretending every block identity is a published package.
- **Broad technology coverage.** Add 76 curated labels with real official destinations, including Preact, React, TypeScript, JavaScript, Valibot, Tailwind CSS, shadcn and GitHub. Support authored aliases and safe version-label normalization while leaving unknown labels unchanged.
- **Verified guide aliases.** Resolve named guides against existing routes and section metadata. Exclude ambiguous generic headings such as Usage from automatic aliases.
- **Actual page and section links.** Index route titles and real heading IDs, validating fragments before enriching inline links. Keep base-path handling and existing link destinations intact.
- **Deterministic collisions.** Give known exports their existing priority and resolve family aliases by explicit rules. Remove ambiguous same-priority aliases rather than silently choosing a destination.
- **Callable suffix parity.** Normalize only a recognized empty `()` suffix for functions and hooks, leaving displayed text unchanged. Keep `cn()` on its exact API-reference anchor and avoid treating arbitrary expressions as exported callables.
- **Inline-only expansion.** Apply these extra families to private inline detection and explicit supported inline links. Source-code detection remains the conservative import/symbol mechanism, without broad technology-word or command detection inside arbitrary source.

### Lazy facts and common presentation

- **Lightweight eager index.** Keep aliases, routes, destination IDs and supported command names in the initial index. Descriptions, examples and detailed facts remain in lazy family modules.
- **Bounded family loading.** Share a request/cache per additional family, with at most four family entries. Remove failed requests so opening the help again can retry without retaining a rejected result forever.
- **Family-specific help.** Show useful command, block, technology or page facts with official/local reading actions. Keep these private cards independent of the reusable core Code API.
- **Centralized kind styling.** Share icon, label and optional contract-heading metadata across all thirteen kinds. New kinds do not each create a parallel tooltip implementation.
- **Almost-square type badges.** Give the top-right reference-kind badge a barely visible 2px radius on every corner. Preserve its distinct inverted surface, icon and compact alignment.
- **One underline treatment.** Use the same dashed cue at 35% opacity for inline and source references, strengthening fully on hover or keyboard focus. A slow text-shadow emphasis adds visual weight without changing glyph widths or causing layout shifts.
- **Paint above code highlights.** Retain the pointer-inert underline layer above inline chip backgrounds. The emphasis and cue keep original Prism token colors and clickable text bounds.
- **Detection and cleanup coverage.** Exercise all new families, malformed commands, unknown/ambiguous aliases, version labels, verified anchors and fallback destinations. Cover lazy loading, retries, stale tooltip completion, accessible kind labels and keyboard navigation.

## 29. Prompt reading and Markdown downloads

### Default display and responsive controls

- **Code-first Prompt views.** Open every showcase Prompt in Code by default, including blocks, components and the home workspace. Retain a user's current choice while that Prompt is mounted, but stop restoring an obsolete saved display choice on the next mount.
- **Remove stale preference ownership.** Remove Prompt display from shared persisted showcase preferences and its plumbing. Keep the remaining local preview, source and prompt-kind preferences unchanged.
- **Compact icon-only formats.** Hide Plain Text/Code/Markdown text labels on narrow non-block showcases while retaining icons, accessible names and selected semantics. Keep the separate narrower threshold for block detail layouts so their available width is used appropriately.
- **Matched metadata scale.** Match Setup/Adaptation Prompt text and icons to the introduction heading: 14px, then 13px in compact showcase containers, with 0.9em icons and matching strokes. Remove home-specific overrides that made the same metadata inconsistent.
- **Tighter source annotation.** Reduce the gap around Source Included and its dot separator. Keep the row aligned and allow narrow layouts to reserve room for source actions.

### Reusable private download action

- **Download before Copy.** Add a Markdown download action immediately to the left of Copy in showcase Prompts. Reuse it for block, component and home Prompt content without exposing docs-only download state as a new core API.
- **Original document delivery.** Download the complete Markdown source independently of Plain Text, Code or rendered Markdown display. Use a descriptive `.md` filename and retain the existing complete-source Copy contract.
- **Native browser handoff.** Create a Markdown Blob URL and activate a native download link within the initiating gesture. Report browser handoff rather than claiming the application can verify a file was saved to disk.
- **Three clear states.** Show default, downloading and downloaded states before resetting to the initial action. Keep the glyph nodes mounted across changes, avoiding the Safari repaint problem caused by replacing button SVGs.
- **Purple feedback parity.** Share the Copy action's orbit, ring, glow, geometry and restrained label transitions, with purple feedback in corresponding strengths. Preserve the separate green Copy success treatment and reduced-motion fallback.
- **Small shared visual contract.** Generalize internal action label/glyph selectors so Copy and Download use the same spacing and responsive rules. Keep their operations, status text and public CopyButton behavior separate.
- **Finite resource lifetime.** Guard repeat activation, cancel/reset the finite feedback timer on source changes and unmount, and revoke object URLs on every completion/error path. Failed handoff leaves the action available for retry.
- **Accessible progress.** Provide useful action names, a disabled in-progress state and polite status feedback without taking focus away from the initiating button. Keep downloads usable in compact icon-only layouts.
- **Download regressions.** Check complete file bytes and filename, source replacement, repeated clicks, failure cleanup and unmount cleanup. Browser tests cover all Prompt display formats and both responsive presentations.

## 30. Compact, activity-aware showcase loading

- **Minimal secondary captions.** Replace explanatory loading paragraphs and inline reference chips with short, subtle context captions. Use selected filenames or source counts instead of adding another repeated sentence.
- **Exact loading title.** Change the preview title to “Setting the scene...”. Keep code, file, Prompt and Markdown pending states on the same reusable loading component.
- **Paired skeleton composition.** Replace the bottom-right logo tile with a 56×44px miniature skeleton card. Share neutral surface, border and line tokens with the main skeleton, using a quiet primary tile and two smaller strokes.
- **Spinner-colored dots.** Paint the three main-card dots with the spinner's primary color and stagger their small lift/return motion. Keep the decorative dots hidden from assistive technology.
- **Quicker shared rhythm.** Use a 3.8-second main/companion loop with a delayed response and shorter rests. Remove title breathing, line-ink pulsing and the whole-card tint cycle so the remaining motion has one clear relationship.
- **Transform-only feedback.** Animate the paired artwork and dots through transforms, without adding timers, polling or reactive progress values. Existing document/viewport activity and reduced-motion rules stop every animated descendant when appropriate.
- **Reserved responsive panels.** Keep pending source and Markdown content within the existing reading area. Loading feedback works for home, portable references, component and block showcases without an empty tab window.
- **Loading regression updates.** Verify the three dots, companion skeleton, color equality, stagger, reserved height, delayed content and offscreen suspension. Cover every local palette, both modes and reduced motion using the existing browser suite.

## 31. More useful ecosystem foundation cards and ending

### Foundation cards

- **Preserved card foundation.** Keep the existing ecosystem shell and leave the companion/toolkit cards on their established layout. Enrich only the four interface-foundation records through compact data owned by that section.
- **Aligned heading metadata.** Place contextual subtext beside each title with a dot separator and truncate only when space requires it. Center the title, context and right-hand actions on the same header row.
- **Header guide/source actions.** Move the existing documentation and repository links into compact icon buttons at the top right. Reuse delegated tooltips and accessible names rather than creating a controller per card.
- **Useful ownership details.** Add concise Start with and You own rows with actual entry points, code names and reading links. Document Typeset's real classes and the currently available Sidebar example instead of invented APIs.
- **Honest package footers.** Put the package/source identity at bottom left with delivery metadata and a separated supporting detail. Distinguish local Blocks source from registry-delivered packages and keep the row centered as it wraps.
- **Subtle finite hover.** Add a quiet perimeter tint, a 480ms divider sweep and small footer-glyph feedback. Keyboard focus receives the useful highlight, reduced motion removes travel, and cards have no idle animation.
- **Narrow-card arrangement.** Stack detail labels at small card widths, allow footer metadata to wrap and retain usable header actions. Keep additional paint neutral and source code readable in either appearance.

### Page-owned conclusion

- **A complete next step.** Replace the small duplicated Getting Started handoff with a dedicated ecosystem conclusion. Explain how to turn the package map into a first screen and a concrete verification pass.
- **Three deliberate routes.** Offer guided setup, package-boundary guidance and whole-journey verification as compact continuation choices. Use specific descriptions rather than three equivalent links to the same destination.
- **Return paths.** Link back to the existing details-toggle composition and starting-point map. Add the conclusion's real heading to the page contents list.
- **Optional shell footer slot.** Add `DocsShell.contentFooter` so this page owns its ending without enlarging the global contextual footer. Omitted values preserve the default ending and `null` intentionally suppresses it.
- **Responsive static content.** Arrange conclusion choices in one, two or three columns according to article width. Add no observer, subscription, timer or runtime dependency for the additional content.
- **Ecosystem verification.** Extend browser checks for the new actions, useful content, contents target, keyboard navigation and responsive layout. Preserve existing mobile pinned-link and source-destination coverage.

## 32. Final preset-study color and density refinements

- **Own-preset signature.** Give every study a compact three-role signature and a subtle wash using its own actual preset. Two decorative explicit appearance scopes let CSS choose the right signature without changing the page palette or saved preferences.
- **Restrained palette wash.** Blend a 9% primary and 6% secondary tint into the study frame. Keep explanatory text in the ambient page palette and avoid copying raw color literals into documentation data.
- **Balanced wide layout.** Put the introduction beside the light/dark comparison when there is room and stack it on narrow articles. Replace uneven guidance columns with paired rows and tighten insets and sketch artwork.
- **More compact despite more guidance.** Earlier wide-layout measurements show the revised studies are approximately 9–15% shorter. Keep this as a measurement of those tested layouts rather than a universal height promise.
- **Three useful contexts.** Add three suggested application contexts per preset. Keep them short enough to scan before the detailed principles and examples.
- **An actionable exercise.** Add a practical task and a clear result to inspect for each preset. Connect real actions and states to palette relationships instead of adding decorative filler.
- **Visible facts, optional detail.** Keep exact typography and corner metrics available while placing longer advice in native disclosures. Preserve keyboard operation and lazy recipe-reader lifetime.
- **Separated content owners.** Keep exercise data, design notes, sketch rendering, details and layout styles in focused files. Additional visual detail does not create another global theme subscription or animation loop.

## 33. Shared branding, navigation and page labels

### Exception-page branding

- **Bundled brand layout.** Move site-owned logo/wordmark geometry into the main application stylesheet. Exception headers no longer depend on a separately fetched public override stylesheet to become correctly aligned.
- **One visible brand mark.** Hide the inactive light/dark image with `display: none` while retaining official assets. Preserve the shared PageStateFrame and its established symbol, text, spacing and responsive geometry.
- **404 parity regression.** Verify that 404 branding matches loading/error headers even when external brand styles fail. Keep the optional generated brand stylesheet for the ordinary footer instead of removing unrelated asset delivery.

### Sidebar paint and heading geometry

- **More breathing room.** Increase the shared inter-column gutter to `clamp(1.25rem, calc(4vw - 1.75rem), 3rem)`. Give both sidebars additional separation from article content without changing the sidebar widths.
- **Stronger sidebar hover.** Increase neutral link hover to the shared 5% light/9.75% dark mix and raise grouped-link hover increments. Preserve selected accent layers and the right contents indicator.
- **Quiet right-row corners.** Add a subtle 6px radius to right-sidebar hover surfaces with a 150ms background transition. Respect reduced motion and existing pointer/breakpoint gates.
- **Soft page labels.** Give icon-led page labels a softened inline-code highlight, 4px vertical/6px horizontal padding and barely rounded 2px corners. Apply the same treatment to the home label.
- **Unchanged heading positions.** Compensate the added label height with an 8px reduction in the preceding gap. Preserve the main title and following content coordinates across the existing measured layouts.
- **Centralized highlight surfaces.** Define the original inline-code surface and its 75%-strength soft variant once at theme/appearance boundaries. Keep page labels and selected left-navigation paint consistent without duplicating formulas.
- **Shared left selected paint.** Apply that soft variant to selected main groups, nested links and top/bottom pinned destinations. Reuse it in the mobile drawer and derive the stronger selected hover from the same surface.
- **Unpainted count values.** Remove backgrounds from every numeric group/variant count, including active and hover states. Preserve their text metrics, reserved width and secondary hierarchy.
- **Secondary status tint.** Give Fresh/Updated/Planned badges a fixed 20% secondary-role background in both appearances. Mix their readable text/icon ink with foreground while preserving chip size and corners.
- **Exactly three mode bars.** Show three sample color bars for each Light, Dark and System choice. Keep media-based System sampling and the separate palette picker's four samples unchanged.
- **No additional runtime work.** Implement these label, badge, sample and hover changes with shared CSS and existing data. Add no listeners, animation loops or per-row state.

## 34. Final audit corrections and missing-test review

- **Nearest appearance wins.** Fix Default, Dusk and Forest syntax ink inheriting a distant dark ancestor through a nearer light preview. An inherited private CSS weight chooses the nearest explicit appearance without adding a public mode prop, inverse behavior, JS state or theme-value pairs.
- **Alternating boundary regression.** Add a browser case comparing all three adaptive palettes in both root modes, with direct and alternating nested scopes. Assert stable local colors and a real light/dark distinction so either direction of the original leakage is caught.
- **Text-width type cues.** Make TypeDefinition's displayed declaration name fit its text width. Its reference underline now ends at the identifier rather than running across the complete summary panel, with a focused browser regression.
- **Lifecycle review.** Recheck the shared visibility observer, retention pool, serial preview queue, deferred highlighting and download timer/Blob ownership. Existing focused tests exercise teardown and stale completion rather than only happy-path rendering.
- **Appropriate test scope.** Keep meaningful behavior regressions for source fidelity, download transitions, reference detection and preview disposal. Do not add redundant unit tests for reversible color/spacing declarations already inspected in production browsers.
- **Complete final checks.** Run workspace types, builds, all unit suites, formatting, lint, dependency and package-shape checks. Record browser and platform limits separately from passing local checks in section 25.
- **Reviewable change records.** Update this feature-by-feature ledger and the normal PR narrative together. Preserve scoped implementation commits with detailed bodies and leave contributor-local context outside the published diff.

## 35. Final merge-readiness review

- **Verified remote CI.** Record the successful Node 22 test/lint/build/package-validation job and workflow-lint job for implementation head `1f97720d`. Keep the live PR checks link authoritative for subsequent documentation-only revisions.
- **Current base included.** Refresh the fork and upstream refs and confirm current `main` is already an ancestor of the PR branch. No merge commit, rebase or force push is needed to make that comparison conflict-free.
- **Review state verified.** Confirm the PR is open, non-draft and reported clean/mergeable by GitHub, with a maintainer approval and no unresolved inline review threads. Do not equate GitHub mergeability with automatically merging or notifying the maintainer.
- **Full-diff hygiene.** Check the complete branch for whitespace errors, unresolved conflict markers, unmerged index entries and focused tests. Retain intentional existing feature/platform browser skips and keep protected local files outside the contribution.
- **Current review description.** Correct the earlier published summary's obsolete scope, test totals and unverified-CI statement through the completed PR narrative. Link its feature ledger to the actual checked-in file when publishing, rather than a relative URL that is meaningful only inside the repository.
- **No speculative code churn.** Keep the already validated implementation and dependencies unchanged when the final review reveals no additional defect. Limit this follow-up commit to the two PR documents and their verified readiness evidence.

## 36. Reference classification and package-destination correction

### Source identity before page labels

- **Component display titles.** Resolve source-backed names such as `Theme Toggle` to their canonical `ThemeToggle` export before considering page titles. The shared card now shows component props, related contracts and the actual implementation even when the same words name a documentation page.
- **Catalogue-wide precedence audit.** Exercise every generated component display label against its source-backed help kind and implementation. Keep literal documentation routes as Page / section rather than treating every link to a component page as a component symbol.
- **One destination category.** Fold named guides into Page / section and reuse canonical page facts and lazy data. Remove the separate Guide badge and chunk without splitting page destinations into further categories.
- **Stable page facts.** Add guide aliases without overwriting their canonical page's title or summary. Preserve explicit authored section navigation and the existing fragment-validation boundaries.
- **Unambiguous product names.** Classify twelve explicit package/product names through their verified package identities, including Kamod UI, companion libraries, UI Motion, Typeset, OpenUI and Formisch. Ordinary technology spellings retain their existing technology help unless a real export establishes a narrower meaning.
- **Package paths retain identity.** Prevent a scoped package or module from being relabeled as a page merely because its authored href is local. Preserve that authored navigation while deriving accurate source and documentation actions independently.
- **Registered block precedence.** Check registered workspace block targets before generic package fallback. Existing exact variants still receive block facts rather than a broad package card.

### Verified ownership and useful resources

- **Fifteen verified Kamod owners.** Share a repository/workspace map across source resolution, brand fallbacks and tooltip facts. Cover the seven local workspaces and the external Icons, Hooks, Signals, State, i18n, Motion, Charts and PreactPress packages without deriving repository names from package spellings.
- **Canonical Signals repository.** Correct the stale installed manifest URL to the actual `kamod-ch/kamod-signals` repository. Update the authored Signals guide and ecosystem links as well as automatic links and tooltip source actions.
- **Exact checked-out export files.** Resolve public package exports against existing source files during the build. Link stylesheet entrypoints such as `@kamod-ch/ui/theme.css` to the actual CSS file and component entrypoints to their actual source directory.
- **Honest external fallbacks.** Use declared external monorepo directories where available, with GitHub's `HEAD` alias instead of assuming a branch name. Unknown subpaths retain the verified package owner instead of an invented file URL.
- **Independent local integrations.** Choose local guide destinations separately from source navigation. Add specific CSS setup, Code CSS ownership, preset, token, class-merging and runtime links, plus relevant integrations for known third-party packages.
- **Source-first package cards.** Put package/module source in the origin link and primary footer action, retaining a distinct secondary local documentation action. Component/type/function cards continue to prioritize their actual API or definition.
- **Authored source repairs.** Correct nonexistent `packages/ui-motion` destinations to the real `packages/motion` workspace. Point motion component resources at each adapter directory and the cn component resource at its actual implementation.
- **Stylesheet-specific facts.** Keep CSS and JSON entries out of similarly named JavaScript module loaders. Stylesheets receive an accurate CSS-entry explanation rather than unrelated component signatures or props.
- **Private workspace clarity.** Identify Blocks and Docs as private source workspaces. A declared license no longer makes the card claim they are published registry packages.
- **Value classification.** Keep factory-produced context/state values as constants unless source declarations establish a callable. Recognize context `.Provider` exports as components and preserve actual hook/function signatures.

### Structure, cost and regression coverage

- **Shared build collector.** Extract manifest and public-export collection into a focused build helper, reused by navigation and lazy help through one cached promise. Workspace manifests win over installed copies; no runtime registry or GitHub request is added.
- **Small runtime additions.** Add only component-display aliases and verified source destinations to the eager index. Full descriptions, contracts and the four contextual families remain lazy; no per-term listeners or observers are introduced.
- **Meaningful catalogue tests.** Cover all component display labels, verified package owners, real checked-out source targets, local integration routes/fragments, ambiguous category collisions, private package facts and CSS/API separation. Update intentional source-link and Page / section expectations across existing suites.
- **Production regressions.** Exercise the reported Theme Toggle and stylesheet examples, preserved authored links, explicit guide sections, source-first footer actions and keyboard return. Cover narrow and desktop layouts in both appearances alongside existing lazy-loading, source-fidelity and tooltip tests.
- **Updated reference documentation.** Revise the private detection, tooltip, architecture and proposal references, and update both checked-in PR records. Keep contributor-local documentation outside the published change as required by project guidance.

### Follow-up validation

The source correction is committed as `b3442111`. Workspace typecheck and build,
final documentation typecheck/build and `corepack pnpm test:ci` pass: **1,545
tests in 185 files**, including **875 documentation tests in 92 files**. The reference audit adds fourteen unit cases compared
with the earlier 861-test docs suite; the remaining workspace suites pass as well.
Root Oxlint, Oxfmt, Biome, README sync, Knip/Syncpack, Publint and ATTW pass.

All **16 production Chrome reference cases pass in one isolated final run**, covering
both appearances, 320/1440px layouts, lazy requests, original source text, keyboard
navigation and the reported categorization/resource examples. An earlier trace-save
collision between overlapping audit runs was isolated by giving the final run its
own output directory; it was not a failed application assertion. The final focused
rerun uses the rebuilt committed implementation. Platform limits remain as stated
in section 25; these results do not claim a new native Safari or WebKit run.

## 37. ReferenceTooltip reading-surface redesign

### Header and resource hierarchy

- **Preserved heading identity.** Keep the existing icon-led name row and inverse kind badge. Add a subtle origin badge for the verified package, consumer alias, tool or technology role, separated from the kind by a small dot.
- **Barely rounded badges.** Use consistent 2px corners for both badges and retain restrained secondary paint for the origin. Clamp long names and origin labels while preserving their complete accessible text.
- **One-line locations.** Keep the exact import/source path and add up to two slash-separated resource shortcuts directly after it. Paths and shortcut labels yield to narrow space without wrapping or inventing destinations.
- **Distinct verified resources.** Put secondary source, guide, props or type destinations in that location row. Deduplicate shortcut URLs and retain the source-first package policy from the preceding correction.
- **Shared inline-code paint.** Reuse the actual page inline-code highlight for the path, property names, contract names and related code links. Use the paired page foreground so those chips stay readable on the inverse tooltip in every preset.

### Useful prose and compact panels

- **Safe rich descriptions.** Keep source-derived prose and add a small vocabulary for code, bold emphasis and explicit HTTP(S)/root-local Markdown links. Render unsupported URLs and HTML as literal text and preserve deployment prefixes on local links.
- **Quieter supporting detail.** Place existing alias/license/context details or a truthful declaration-scope caption under the description at a smaller size and lower emphasis. Add inline-code/emphasis to generated type, alias and stylesheet explanations without inventing APIs.
- **Structured contract panel.** Give props/signatures an icon-led heading, actual field count, clear required/optional labels, formatted types and compact separators. Preserve the three-field bound and avoid expanding inherited contracts into speculative props.
- **Compact type names.** Present a bare props type name as an inline chip. Reserve a wrapping declaration surface for fuller signatures and commands, keeping tiny contracts from adding an unnecessary nested box.
- **Separate reference details.** Give command, block, technology and page facts their own quiet bordered section with a real count. Use semantic definition lists without styling those facts as declared component props.
- **Related-reading panel.** Give related types, props, guides and sources their own bordered section. Pair each highlighted code link with its useful role caption, use two columns where space allows and one column on narrow screens, and preserve full accessible link names.
- **Single footer action.** Replace the two-link footer with one primary API/source/reading link on the right. On the left, show a small contextual note about installed versions, declarations, copied source or the current reference family.
- **Persistent footer.** Keep that footer visible when the existing bounded tooltip must scroll. Use CSS positioning within the existing scroll container, without another observer or placement system.

### Cost, ownership and verification

- **Contract-only syntax loading.** Reuse the existing TypeScript/Bash highlighter through a separate lazy declaration module. Non-contract reference types do not request it; literal code remains visible while it loads.
- **Optional-highlighting failure isolation.** Keep a local error boundary around declaration coloring so a missing grammar chunk leaves plain code and working links. A network failure in this visual enhancement cannot trigger the page error boundary.
- **Small source fragments.** Highlight tiny declarations without mounting a complete Code reader, controls or its observers. Memoize each mounted fragment's markup, keep source text unchanged, and scope syntax ink to inverse-card theme roles.
- **Focused presentation owners.** Split origin/resource selection, safe prose, contracts, declarations and related reading into small feature files. Keep the public core API, reference detection, lazy fact caches and shared tooltip controller unchanged.
- **Interaction and layout regressions.** Add unit cases for one footer action, source-first resources, shortcut deduplication, missing resources, safe prose and literal-to-highlighted declarations. Update existing source/classification expectations for the moved resources and the 2px badge corners.
- **Production browser matrix.** Verify 320/768/1440px in both appearances across seven reference families, including one-line locations, exact shared highlight paint, viewport bounds, grammar loading and keyboard return. Preserve deliberate-hover, failed-chunk, dismissed-request and original-source checks in the twenty-one-case affected suite, including blocked declaration highlighting.
- **Visual and documentation review.** Inspect desktop/mobile component and stylesheet cards, refine shortcut spacing and compact contract names, and update the private tooltip/architecture references. Record this redesign in both checked-in PR documents while leaving private contributor context excluded.

### Redesign verification

The full `corepack pnpm test:ci` command passes **1,550 tests in 185 files**,
including **880 documentation tests in 92 files**. Documentation typecheck and
production build, root Oxlint, Oxfmt and Biome pass. All **21 affected production
Chrome cases** pass, including seven reference families at 320/768/1440px in both
appearances and a deliberately blocked syntax module. Desktop/mobile component
and stylesheet cards were also inspected visually. These are new Chrome checks;
the earlier documented WebKit/native Safari scope is unchanged.

## 38. Visual-first individual color-theme studies

### Palette, composition and hierarchy

- **Quieter study frames.** Reduce each preset's primary and secondary background washes from 9%/6% to 3%/2%. Preserve the local preset signature and the page's text tokens while letting the samples carry the strongest color.
- **Prominent main-color system.** Replace four small color strips with eight labeled swatch cards in each light/dark appearance. Show Primary, Secondary, Accent, Canvas, Surface, Muted, Danger and Sidebar directly from their real semantic CSS variables, with a minimum 48px color area.
- **Readable token identities.** Put each role name and its exact custom property below the color area. Keep labels on the appearance's readable page surface rather than placing text over arbitrary accent fills, and allow long custom-property names to wrap. Override the generic filled-code chip locally and keep each reference underline bounded to its token text.
- **Supporting palette disclosure.** Retain a native, keyboard-operable role disclosure for text pairings, quiet text, boundaries, focus, success and warning. Keep those supporting roles separate from the eight main samples without adding interactive controls to the static previews.
- **Six static compositions per preset.** Keep the Workspace and Action Card examples and add a Feature sketch to both appearances. Share the decorative structure in a small PaletteSketch component, with no animation, timers, simulated loading or additional runtime dependencies.
- **Clear composition heading.** Separate the main swatch grid from the sketches with an “In composition” row and a thin rule. Label the examples as static studies and update the appearance captions, study footer and introductory guidance to the new counts.
- **Shorter introduction.** Keep the preset's concise design direction and suggested uses near its title. Give each use a small decorative check icon and place the list beside the direction when space permits.
- **Useful color-system navigation.** Add a compact Token guide link beside the color-system heading, targeting the existing token explanation. Preserve the preset source-CSS footer link and existing apply-theme button and exact subsection targets.

### Typography, shape and progressive reading

- **Compact typography specimen.** Add an Aa sample, a short heading/body pairing and a mono fragment beside the source-backed Body, Display and Mono stack labels. Explicitly explain that the specimens use native fonts and named application fonts require their own files; no fonts are downloaded for these cards.
- **Balanced shape panel.** Enlarge the three corner-family samples and add one short description of how the family connects controls and panels. Preserve the actual documented base radius and the expandable preset-specific shape guidance.
- **Optional detailed reading.** Move the full palette narrative, light/dark notes, application guidance, design principles, practical task and shipping review into “Design notes & practical checks.” Preserve all existing guidance while reducing the default reading burden and keeping the color system first.
- **Small presentation owners.** Extract the longer notes into ThemeStudyNotes and the repeated sketches into PaletteSketch. Keep ThemePresetStudy focused on section order, theme application and resource links, and remove obsolete overview layout rules.
- **Container-aware layout.** Use local container width to choose two/four swatch columns and stacked/paired appearances. Preserve wrapping footers, narrow-screen typography panels, visible focus and reduced-motion handling for the added disclosure chevron.
- **Existing reader lifetime.** Preserve lazy recipe mounting and release on close, server-rendered deep links, hydration-safe selected states and independent saved preset/scheme preferences. The redesign adds no observer, persistent listener or background task.

### Regression coverage

- **Gallery contract assertions.** Extend the existing server-render test to check 128 main swatches, the exact eight-role ordering, 48 static compositions and initially closed design notes. Retain route identity, scope isolation, persistence, radius-source and lazy-reader tests rather than adding implementation-mirroring tests.
- **Responsive production checks.** Extend the existing Chrome matrix with 1024px alongside 320/768/1440px. Check actual swatch height/color stability across page-theme changes, initial disclosure state, typography samples, and keyboard access to the expanded practical guidance while retaining contrast, overflow and static-animation checks.

### Visual-study verification

The complete documentation unit suite passes **880 tests in 92 files**, including
all six gallery tests. Final docs typecheck and production build, root Oxlint,
Oxfmt and Biome pass. All **nine production Chrome theme-guide cases** pass against
the rebuilt final implementation: 320/768/1024/1440px, both page appearances,
every applied preset, role-label paint, palette isolation, native disclosures,
contrast, overflow, generated routes, copyable recipes and reader release.
Desktop light/mobile dark Ocean studies were inspected visually after the final
label refinement. The first preview instance stalled on its loading screen; a
restart after the completed build restored startup, and the isolated final run
passes without changing the application startup logic. These are new Chrome
results; the earlier Safari/WebKit scope remains unchanged.

## 39. Simpler preset-gallery introduction

- **Compact reading path.** Replace the three title/paragraph blocks with three short numbered links: compare colors, review type and shape, then apply a preset. Keep a single quiet separator and allow the links to wrap naturally without cards, extra decoration or movement.
- **Useful destinations.** Link directly to the first real preset study, the existing typography/radius guidance and the page's runtime example. Preserve ordered-list semantics, full link names and visible keyboard focus.
- **Emphasized comparison guidance.** Use restrained bold and italic emphasis, real `--primary`/`--card` inline examples and a semantic-pairing link in the shared description. Preserve reference help and the existing copyable runtime snippet rather than adding another source reader to the introduction.
- **Smaller style surface.** Remove the obsolete three-column and narrow-screen grid rules. Use the site's familiar plain numbered-link pattern, shared secondary colors and a subtle underline on hover.
- **Readable short code terms.** Keep the two short token examples together on narrow screens rather than splitting an identifier across lines. Preserve the shared inline-code highlight and delegated reference help.
- **Focused validation.** All six existing gallery tests pass, as do docs typecheck/build and root Oxlint/Oxfmt/Biome. Production Chrome checks pass at 320/768/1024/1440px in both appearances; the final mobile text adjustment is rechecked at 320/1440px, and desktop/mobile screenshots, keyboard focus and every introduction link target are inspected.

## 40. Preset-colored gallery pills

- **Independent preset surfaces.** Give each gallery jump link its preset's actual background and declared primary font stack, with explicit light/dark paint scopes selected by CSS. Keep one accessible link per preset and prevent the current page preset from leaking its colors or named fonts into the other choices.
- **Overlapping three-color signatures.** Add compact overlapping circles for primary, secondary and accent, using the real tokens. Mark the visual copies decorative and preserve the full preset name and exact subsection destination on the anchor.
- **Compact primary-hue labels.** Increase label weight to 600 and reduce its size slightly from 12px to 11.5px. Keep the primary hue, adapting its lightness for small-text readability on very bright palettes; leave the swatches and hover arrow at the exact token colors.
- **Layered color interaction.** Fade in a restrained primary/secondary/accent wash, tint the boundary and add a small colored shadow. Run one secondary-to-primary gradient sweep across the pill on hover or keyboard focus, without idle loops or JavaScript animation.
- **Expressive arrow.** Start the arrow at 45% opacity in the preset foreground, then transition to its exact primary color and full opacity. Grow it by 12% and translate it just 1px toward the upper right, while the link itself stays in place.
- **Reduced-motion presentation.** Remove the sweep, transitions and arrow movement for reduced motion while retaining the active color treatment and visible keyboard focus. Add no timers, listeners, observers, permanent compositor hints, dependencies or font downloads.
- **Focused presentation owner.** Keep the two SSR-stable appearance paints and accessible destination in ThemePresetPill, with its own small stylesheet. Replace the old generic pill rules and update the gallery scope-count assertion for the new isolated paints. Verify the named primary-family prefixes against the shipped CSS so the docs’ native-font override cannot silently replace these small specimens.
- **Interaction regression.** Check exact swatch/background tokens against the corresponding preview, font/color isolation after applying Watson, idle animation absence, both appearances, hover arrow behavior, finite animation cleanup, reduced motion and keyboard navigation. Retain the existing responsive and contrast checks for the entire gallery.

### Pill verification

The six gallery unit tests pass, including source-backed primary-font prefixes.
Docs typecheck and production build, root Oxlint, Oxfmt and Biome pass. Final
production Chrome checks cover 320/768/1024/1440px in both appearances plus the
pill interaction case: all sixteen label contrast ratios reach 4.5:1, preset
backgrounds/signatures match the corresponding source previews, fonts and colors
stay isolated after applying Watson, idle and completed sweeps leave no running
animation, the arrow reaches its specified state, reduced motion removes
movement, and real Tab/Enter navigation reaches the correct study. Desktop light
and mobile dark default/hover states were visually inspected. No new Safari or
WebKit coverage is claimed for this follow-up.

## 41. Subtle detected-inline-code feedback

- **65% resting underline.** Give detected inline source references and glossary hints the same primary-colored 1.5px dashed cue at 65% opacity, reaching full color on hover or keyboard focus. Cover authored references, dynamically detected bare code and legacy nested links through one shared inline stylesheet.
- **Tiny decorative arrow.** Add a 0.55em arrow in the full underline color with only 18% opacity at rest, rising to 100% on interaction. Use an empty-content CSS mask so copied text, original code, accessible names and the existing reference metadata remain unchanged.
- **Barely visible emphasis.** Apply a 0.08px glyph stroke mixed from 45% underline color and the current ink, plus a 0.12px current-color shadow at only 12% opacity. Keep the original text fill and font metrics, transition the emphasis over 520ms, and let legacy inner links inherit the same small stroke.
- **Quarter-pixel lift.** Offset the inline chip upward by only 0.25px over 320ms while preserving its width and surrounding line layout. Keep the arrow's space reserved in both states and disable transitions and lift for reduced motion. Keep glossary chips atomic so an end-of-line break cannot orphan their highlight or arrow.
- **Single decoration owner.** Remove the older dotted glossary rule and duplicate inline cue implementation. Keep the painted underline above the chip highlight, suppress the legacy inner link's extra pseudo-underline, and retain existing focus outlines and delegated lazy help.
- **CSS-only lifetime.** Add no JavaScript, icon DOM nodes, listeners, timers, observers or font assets. Keep source snippet tokens under their existing core styles and preserve all native navigation, copy and tooltip behavior.
- **Focused cue regressions.** Update the existing browser assertions for 65% resting opacity, a tiny 0.08px stroke, reserved-width arrows, quarter-pixel lift and reduced-motion positioning. Keep the original text/fill checks, verify the dashed line is actually painted, and wait for fades to settle before inspecting the resting state.

### Inline-cue verification

All **58 focused reference tests in three files** pass. Docs typecheck and final
production build, root Oxlint, Oxfmt and Biome pass. All **14 affected production
Chrome cases** pass with the final subtle ink: source and glossary help, exact
code text and navigation, source-snippet regressions, lazy loading/dismissal,
320/1440px light/dark cue styling, touch/keyboard operation, legacy nested links,
stable hover widths and reduced motion. Default/hover captures were visually
inspected on desktop light and mobile dark; glossary wrapping now keeps its
highlight and arrow together. These checks do not add new Safari/WebKit coverage.

## 42. Clearer reference header and direct destination action

- **Familiar technology symbol.** Replace the processor icon with a lightbulb in the shared kind map, keeping the heading and type badge consistent without another icon dependency.
- **One larger type badge.** Remove the secondary origin badge and separator. Increase the remaining badge from 10px/550 text to 12px/500, with a 30px height, restrained padding and a matching 11.5px outline icon at 1.75 stroke width.
- **Exact inline-code paint.** Share the same CSS rule for the badge and location chip's page-inline-code background, foreground and subtle 3px corners. Preserve their separate typography and dimensions across page palettes and appearances.
- **Compass destination button.** Add a square, 30px icon link immediately after the badge. Reuse the application's docs-icon-button interaction styles, adapting its resting/hover ink and surface to the inverse tooltip. Keep visible keyboard focus, reduced-motion behavior, a descriptive accessible name and top-frame navigation.
- **One destination owner.** Derive both the new action and footer from the existing verified primary resource. Package and published-module links still prefer their source; documentation references retain their guide/API destination. Omit the button when no destination exists.
- **Smaller implementation.** Remove the now-unused origin-label lookup and owner derivation. Add no timers, event listeners, observers, state, dependencies or background work; the existing delegated lazy tooltip controller remains unchanged.
- **Existing coverage extended.** Check the new action's accessible name and primary URL, source-first package behavior and absent-resource fallback in the existing component tests. Extend the responsive browser matrix to assert one badge, exact chip paint/corners, icon sizing/stroke, square action dimensions and keyboard entry through the new first link.

### Header verification

All **880 documentation tests in 92 files**, docs typecheck, the final production
build and root Oxlint/Oxfmt/Biome pass. All **12 affected production Chrome cases**
pass across the header-layout and lazy-help suites, including seven reference
families at 320/768/1440px in both appearances. The dimension check tolerates
subpixel floating-point rounding while requiring equal rendered action/badge
heights. Desktop light and mobile dark cards were visually inspected; direct
button navigation, visible keyboard focus, hover feedback and reduced motion
were checked separately against the final production build. No new Safari/WebKit
coverage is claimed.

## 43. Compact reference context and quieter header proportions

- **Path-first second row.** Remove the left-hand origin prefix. Replace slash-separated resource labels with one short purpose phrase, clamped to a single line with an ellipsis. Preserve the exact copyable path and its verified native destination.
- **Useful context rather than repeated types.** Add a small lazy presentation owner for authored purpose labels across known core entrypoints and their exports/types: expandable content, layout direction, appearance controls and other concrete roles. Reuse concise technology-role metadata, refining the fifteen shared brand roles. Keep conservative family fallbacks and never truncate source descriptions into context labels.
- **Preserved secondary destinations.** Move the former source/guide shortcuts into the related-reading panel, retaining four related items plus at most one relocated source/guide and deduplicating against the primary resource and existing reading links. Package sources still take priority; local integration remains accessible.
- **A little more supporting copy.** Supply useful family-specific reading notes when source metadata has no detail, and expand the small contract/signature guidance. Retain original descriptions, source facts, safe inline formatting and the quieter supporting-text treatment.
- **Smaller type badge.** Reduce its shared height from 30px to 22px, its text from 12px to 11px and its icon from 11.5px to 10.5px. Reduce padding to 1px vertically and 5px horizontally, retaining medium weight and the page-highlight paint while softening only its corners from 3px to 4px.
- **Clearer chain-link action.** Replace the compass with the standard interlocked-chain symbol. Raise the resting inverse surface from 10% to 17% and hover/focus from 17% to 25%; keep the existing shared hover, focus and reduced-motion behavior and the chosen primary destination.
- **Existing regression coverage updated.** Check source/guide relocation, deduplication and short context in the component tests. Update the responsive layout assertions for the compact badge, one-line purpose, preserved path and secondary resources, plus the classification keyboard journey through the existing first header action. Add no background activity or dependencies.

### Context-trail verification

The documentation suite passes **881 tests in 92 files**; the final related-link
bound also passes all eleven focused card tests. Docs typecheck, final production
build and root Oxlint/Oxfmt/Biome pass. All **14 affected production Chrome cases**
pass: seven families at 320/768/1440px in both appearances, lazy help and failure
fallbacks, source-first packages, keyboard flow and native navigation. A caught
resource regression is fixed: the moved source link no longer displaces the
fourth related destination, including Props & defaults. Desktop light and mobile
dark cards were visually inspected; the chain action's navigation, focus, hover
and reduced-motion behavior were also checked. No new Safari/WebKit coverage is
claimed.

## 44. Linked reference icons and technology-specific marks

- **Sharper technology symbol.** Replace the lightbulb with the installed circuit-board icon for the Technology badge and unknown-brand fallback. Keep the generic kind symbol in the badge even when the main heading uses a logo.
- **Verified heading logos.** Reuse the existing fifteen-brand map, including Tailwind, React, TypeScript, GitHub and tooling marks, and explicitly use React's logo for Preact. Add the installed Astro, CSS, HTML, Svelte, Tabler and Vue marks plus React-family renderers in the lazy help module. Resolve by the canonical metadata name so aliases and versioned text preserve the right mark; unrecognized technologies retain the circuit-board fallback.
- **Reusable icon ownership.** Extract the existing prose brand map into a small shared module without changing its entries. Keep additional technology-only imports behind the existing lazy card boundary, with named imports and no package-wide runtime icon registry.
- **Linked main icon.** Make the left-hand mark a native link to the same chosen destination as the chain action and footer, preserving package-source priority and top-frame navigation. Give it a distinct accessible name and keep a decorative span when no verified destination exists.
- **Consistent action surfaces.** Share the 17% resting and 25% active inverse paint with the chain button, plus the existing site icon-button focus, hover and reduced-motion behavior. Keep the main mark at 30px and the small action at 22px, without shifting the surrounding heading.
- **Stronger icon strokes.** Increase the badge icons from 1.75 to 2.5 stroke and main marks from 2 to 2.25. Preserve the existing text sizes, compact badge geometry and inline-code highlight.
- **Focused regression updates.** Cover Tailwind, React, Preact aliases and unknown-brand fallback, the distinction between heading logos and generic badges, source-first/missing-destination behavior, and matching button paint. Extend the existing responsive keyboard matrix to include the new first header link.

### Linked-icon verification

All **885 documentation tests in 92 files**, docs typecheck and production build,
root Oxlint/Oxfmt/Biome pass. The final combined run passes all **16 production
Chrome cases**, covering responsive light/dark cards at 320/768/1440px, both header
links, source priority, keyboard flow, touch dismissal and lazy/failure behavior.
An initial delayed-chunk case timed out during navigation; it passed in isolation
and in the complete final rerun. A separate normal-load request check confirmed
that the help chunk is not fetched before interaction. Tailwind on desktop light
and Preact on mobile dark were visually inspected; main-link navigation, matching
surfaces, keyboard focus, hover and reduced motion were checked directly. No new
Safari/WebKit coverage is claimed.

## 45. Arrow-free detected inline code with smooth hover emphasis

- **Remove inline arrows completely.** Delete the CSS-mask arrow, its SVG data, opacity states and reserved spacing. Suppress the chip's after-pseudo content and retain the existing suppression of legacy nested arrow elements.
- **Tiny type and position changes.** Increase ordinary detected chip weight from 400 to 450, add 0.15px to the current compact/regular font size and lift it by 0.5px on hover or keyboard focus. Keep the existing 65% resting dashed underline and full-primary interaction state.
- **One smooth transition.** Add transition-all to authored and dynamically enhanced roots, and apply all 360ms ease to trigger roots and chips, inherited by the underline. Keep a 0.08px current-color hairline so emphasis can interpolate smoothly even when a system monospace font has discrete weights; remove the former tinted stroke and shadow effect.
- **Context and motion support.** Retain shared size tokens, utility-name heading typography and atomic short glossary chips. Reduced motion removes transitions, font growth and lift while keeping the active emphasis and cue. Font growth is intentionally tiny and bounded rather than reserving the former arrow space.
- **Same detector lifecycle.** Extend its existing reversible class bookkeeping for transition-all on source/glossary targets. Add no nodes, listeners, timers, observers or dependencies, and leave source-snippet styling under its existing core owner.
- **Existing checks refined.** Assert the root class, all-properties transition, absent arrow, exact type/position changes, bounded width growth and reduced motion. Keep source preservation, painted underline, native navigation, lazy help and legacy nested-link coverage; refresh the older badge-radius assertion to its current 4px design.

### Arrow-free hover verification

All **75 focused reference/branding tests in four files** pass. Docs typecheck,
final production build, root Oxlint/Oxfmt/Biome and diff checks pass. All **14
production Chrome cases** pass for source/glossary references, painted underlines,
exact text and navigation, 320/1440px light/dark feedback, legacy nested links,
lazy help, keyboard/touch operation and snippet isolation. The checks verify
400→450 weight, +0.15px size, -0.5px position, no arrow content and all-properties
transitions. Reduced-motion coverage caught and verified a root selector priority
fix; transitions, growth and lift now stop as intended. Desktop light/mobile dark
rest/hover captures were inspected, and glossary feedback was checked directly.
No new Safari/WebKit coverage is claimed.

## 46. Quiet postscripts, a tinted detail stage and a compact resource footer

- **Useful last mentions.** Retain source-specific supporting detail and append the family's version/contract caveat below the main description; avoid repeating the command execution warning. Increase the description-to-note gap from 7px to 10px, reduce the note from 10px to 8.5px and use exactly 40% inverse ink. Preserve safe code, emphasis and links at that quieter scale.
- **Full-width detail chapter.** Group the existing contracts, facts and related-reading panels inside one separated stage. Give it a faint 10% mix of the actual type-badge/page-code highlight and a full-container rule above. Omit an empty detail stage when no verified content exists.
- **Compact closing row.** Follow the detailed content with a second full-width rule and a smaller sticky footer. Use a quiet book icon and “Full context linked” on the left, with a truthful “Quick reference” fallback when no destinations exist.
- **Verified resource actions.** Keep the selected primary resource first and add at most one distinct source/guide from existing verified reading metadata. Preserve package-source priority, base prefixes, accessible names, top-frame navigation, existing body references and absent-resource behavior. Use Source/Guide/Docs icon buttons, with icon-only presentation on narrow screens.
- **Descriptive resource hints.** Reuse the core Tooltip for hover/focus explanations with a resource heading, emphasized purpose and highlighted exact destination. Anchor the hint across the footer within the scrolling parent, retaining core delay, hover retention and cleanup behavior. Mount at most two hint primitives only for the currently open card.
- **Focused ownership.** Extract ReferenceFooter and its resource-action presentation from the main card; reuse ReferenceSentence for hint emphasis. Keep resource selection in the existing presentation helper and use shared icon-button paint rather than a separate interaction implementation.
- **Regression updates.** Check primary/secondary URLs, resource bounds and closed initial hints in existing card tests. Extend the production matrix for 40%/8.5px postscripts, full-width rules, compact actions, and focused hint content/bounds/dismissal across 320/768/1440px in both appearances. Preserve exact source, grammar fallback, touch/keyboard and related-reading coverage.

### Reading-stage verification

All **885 documentation tests in 92 files**, final docs typecheck and production
build, root Oxlint/Oxfmt/Biome and diff checks pass. All **14 affected production
Chrome cases** pass in the final combined run: seven reference families at
320/768/1440px in both appearances, 40%/8.5px postscripts, full-width stage/footer
rules, bounded resource actions, focused hint content/bounds/dismissal, native
navigation, source priority, lazy help and failed-grammar fallback. Desktop light
and mobile dark cards and resource hints were visually inspected; direct checks
also cover pointer retention over the hint, Escape dismissal, focus return and
no page errors. No new Safari/WebKit coverage is claimed.

## 47. Stationary inline emphasis and source-shaped miniature reference chapters

- **Stronger, stationary detected code.** Raise ordinary detected inline chips to 500 weight and 550 on hover/focus. Remove vertical movement, retain the 65%→100% dashed cue, restrained 0.15px growth and 360ms transition-all, and preserve reduced-motion handling. Undetected code, heading typography and snippet tokens retain their owners.
- **Primary destination controls.** Use a 28px top-right action with a 15px primary-colored chain icon and stroke 3. Footer shortcuts use matching 28px height and 14px/2.75 icons; subsection actions are compact 24px squares. Keep the existing compact type badge and verified technology logos.
- **Substantive chapters only.** Build miniature props and declaration content from the source pages' actual layout patterns. A name/type column sits beside usage prose; declarations have a tiny language toolbar and wrapping syntax. Bare type-name-only cards are omitted, and simple facts become compact summary metadata rather than standalone chapters.
- **Linked chapter headers.** Place the icon and semibold 12px title above each transparent rounded card, with a short clamped extension, real count and separate source action. The title and icon link to that same verified resource with hover-only link styling. Use quiet 30% inverse-ink borders, 8.5px content, restrained field-scope notes and inset separators between adjacent substantive chapters.
- **Dedicated bottom reading shelf.** Move all link collections out of detail cards into a separate full-width, faintly washed reading area. Group Contracts and Resources without empty groups; use compact wrapping code chips, useful icons, exact destinations and native context hints. Preserve all bounded type/props/guide/source links and deployment prefixes.
- **Up to four useful shortcuts.** Keep the primary destination first, then distinct verified source, guide, type or props resources. Preserve the complete reading shelf beyond this shortcut limit. Resource hints retain exact URLs, safe emphasis and existing primitive-owned lifecycle behavior. No fabricated destinations or new per-token behavior.
- **Shared ownership.** Reuse ReferenceSection for chapter structure, ReferenceFacts for metadata, and reference-resources for the shelf/footer's icon, label and descriptive-hint vocabulary. Keep lazy declaration coloring and its literal fallback; introduce no dependency, global observer, interval or token-level listener.
- **Regression coverage.** Extend existing card tests for linked headings, verified source equality, four-resource bounds/deduplication, empty-card suppression and fact/link placement. Browser checks cover centered controls, transparent cards, exact small text, unhighlighted type lines, grouped reading bounds, no inline lift, preserved lazy failure handling and keyboard/touch navigation. The deliberate delayed-chunk test waits for DOM readiness rather than a load event it intentionally holds open.

### Miniature-chapter verification

All **887 documentation tests in 92 files**, final documentation typecheck and
production build, root Oxlint/Oxfmt/Biome and diff checks pass. All **28 production
Chrome reference cases** pass in the final combined run, including seven families
at 320/768/1440px in both appearances, exact small-code styles, transparent cards,
verified chapter links, grouped reading, up to four resources, lazy/grammar failure,
source preservation, keyboard/touch navigation and stationary inline hover feedback.
Desktop light, tablet dark and mobile dark cards/resource hints were inspected;
direct checks cover hint bounds, pointer retention, Escape/focus return and no
page errors. No new Safari/WebKit coverage is claimed.

## 48. Relative prose code, dependable reading controls and a shared page-design detour

- **Sentence-relative inline code.** Replace context-based fixed12/14px prose sizes with one94% optical scale after inheriting the surrounding text size. Cover introductions, subsection descriptions, short continuation text and captions; avoid double scaling inside reference anchors. Preserve heading typography, source/control labels, private tooltip layout and explicit size demonstrations.
- **Underline-only feedback.** Rest detected prose/glossary cues at55% and show full primary ink on hover/focus. Keep the current500 resting text weight without active font growth, stroke, color shifts, movement or arrows. Retain accessible focus indication and reduced-motion support.
- **Predictable reading controls.** Add Code.readingControls with overflow/always/imports policies. Preserve the public overflow default, support wrapping in every language, and let documentation readers choose imports-only visibility at every width. Snippets without imports omit both controls; imports-only source cannot collapse into an empty body. Always/imports policies avoid width observers and repeated layout measurement.
- **CSS import folding.** Recognize complete leading @import rules with quoted/URL targets, layers and supports/media conditions. Preserve comments, @charset and layer-order declarations. Do not consume literal, incomplete or non-leading imports. Reuse original source offsets, token-preserving selection and exact full-source copying. Add a copyable CSS example and update public control documentation.
- **Honest syntax-loading feedback.** Expose an internal active-grammar-request state and pulse the existing source between5% and35% only while that near-viewport request is pending. Restore100% immediately on coloring or literal failure fallback. Plain text, disabled coloring, custom documents and idle offscreen snippets do not pulse. Reduced motion uses static35%; stale source/unmount guards remain intact.
- **Primary page labels.** Use slightly darkened primary ink,600 text weight and matching stronger icon strokes above main page titles. Preserve the existing geometry compensation and subtle highlight.
- **Reference pairs without indentation.** Move the source/design heading outside each card so it labels the reading note and card together. Add icon, dot-separated short context and aligned source action; remove the redundant inner heading and leading note-icon column. Keep existing anchors and source/version guidance.
- **Useful shared endings.** Replace the old one-line Getting Started handoff with a titled setup/composition/review conclusion. Add meaningful internal links, compact open columns, local class/token guidance and a short maintenance note. Keep it static and contextual, with no demo runtime imports.
- **Ecosystem continuation.** Add two centered source/issue icon shortcuts to the source-card heading. Replace final cards with three open reading rows and substantially fuller practical guidance, genuine guide shortcuts and standard underlined footer links. Remove the redundant one-button/one-hook closing sentence.
- **Route-local rocket.** Add an oversized decorative Getting Started rocket with a CSS flight path, exhaust and star. Reuse a reduced flight only on the active desktop pinned guide icon. Reserve the heading corner without altering title flow; disable all parts under reduced motion and introduce no JS frame loop or background subscription.
- **Regression coverage.** Add CSS folding, import-policy visibility/observer and pending-highlight checks; update retired overflow-only and fixed-size expectations. Browser coverage checks relative sentence sizes across routes, all requested page structures, exact source/copy behavior, no inline hover shifts, viewport bounds, selected desktop motion and reduced-motion fallback. Preserve existing tooltip chapter coverage during this separate page-design detour.

### Page-design detour verification

All **427 core tests**, **886 documentation tests in92 files**, and **194 block
tests** pass. The focused core Code suite also passes225 cases after parser and
control refinements. Workspace/affected type checks, core and documentation
production builds, root Oxlint/Oxfmt/Biome and diff checks pass. All **54 affected
production Chrome cases** pass:52 in the combined final run, with two focused
reruns passing after traces identified local ERR_NETWORK_CHANGED asset failures.
Coverage includes CSS fold/copy fidelity, import-aware controls at every width,
relative prose sizes across routes, pending grammar and reduced motion, active
desktop rocket motion, page/reference-pair layout, ecosystem links, and the
unchanged seven-family tooltip matrix at320/768/1440px in both appearances.
Desktop light/mobile dark headings, reference pairs, page endings and repository
cards were inspected. Final viewport captures used fresh contexts to avoid saved
reload-position restoration interfering with screenshots. No new Safari/WebKit
coverage is claimed. Private reference guides and context remain excluded.

## 49. Source-backed reference miniatures, saved technology chapters and scroll retention

- **Read long references without accidental dismissal.** Contain wheel scrolling at the card boundary, extend pointer departure grace to 350ms and cancel it on reentry. Ignore departures from unrelated page elements and native-scrollbar focus loss while retaining deliberate outside clicks, page scrolls, route changes and Escape dismissal. Add controller ownership/reentry/cleanup regressions and production boundary-wheel/reentry checks.
- **A tighter linked heading.** Link the main title and retain verified technology logos. Align the title, main icon and badge/actions at the top. Add a tiny normal-weight destination line with a useful source fact, such as the actual branch or required input. Keep one 22px badge with a larger 12px icon; match the chain action to its height and paint, using a smaller, lighter 11px chain.
- **Stationary actions and primary reading ink.** Use only a quiet background change on tooltip buttons, with no hover movement, shadow or ink/stroke change. Give the main icon the badge's background ink over a subtler surface; use that palette for other compact actions. Keep the origin slash/context and tiny postscript in primary reading ink.
- **Real source components at miniature density.** Replace the bespoke props/declaration presentation with the actual BlockPropsTable, core Code, TypeDefinition and Table components. Preserve source-page surfaces, colors and layout, reducing typography and spacing locally. Bound fields, code lines, characters and source disclosures; preserve complete destinations and literal text when optional grammar loading fails.
- **Setup before contracts.** Extract literal setup/import snippets and documented API rows/defaults at build time without importing or executing documentation pages. Merge component installation/import guidance into the first chapter. Blocks reuse their registered dependency list, actual variant import and copied-source contracts, with verified guide sections and source files.
- **Exact ownership and honest scope.** Select the current component's documented rows, exclude sibling component/hook entries in aggregate tables, and preserve declared field requirements. Show source type declarations in real disclosures; keep inherited/imported types named rather than inventing flattened contracts. Omit empty or bare-name chapters.
- **Quiet chapter framing.** Shrink linked subsection headings/icons, clamp their dot-separated extensions, and remove header action buttons. Put each compact source action inside its borderless card with a detailed destination hint. Use an 8% purple wash over a 17%-opacity version of the showcase pattern, with inset rules between chapters. Center continuation notes beneath each card, beginning with the precise source section and adding an integration/scope caveat.
- **One compact ending index.** Remove the sticky footer and merge all its destinations, related contracts and chapter links into a deduplicated Reference index. Keep small wrapping underlined links, tiny `/` resource labels, Contracts/Resources grouping, detailed native destination hints and factual local/external counts. Header, detail stage and ending share their base background.
- **Ninety technologies, 180 saved chapters.** Add source-specific examples, configuration notes and integration boundaries for every catalog entry, including fourteen missing tools/formats/integrations. Cover all direct external workspace dependencies through tested technology owners. Keep optional alternatives clearly distinguished from installed packages; persist all content in the lazy technology payload without runtime scraping or network lookup.
- **Deployment-safe section navigation.** Prefix local section and definition destinations exactly once and preserve external sources. Validate saved local page and fragment destinations against the generated inventory; reject missing technology profiles rather than fabricating generic filler.
- **A smaller animated loading state.** Change the heading to “Following the reference...”, align a spinner with it, remove the repeated module row and replace the right dot. Add varied shimmering skeleton shapes, a much smaller note and reduced-motion handling; keep failure navigation available.
- **Focused regression coverage.** Cover literal extraction, real table defaults, aggregate ownership, real source disclosures, bounded reader content, zero miniature layout observers, technology completeness, deployment prefixes and source links. Update the production seven-family matrix for both appearances at 320/768/1440px, matching controls, background-only hover, bounded scrolling, keyboard return and grammar fallback.

### Source-miniature verification

Workspace typechecking and **all1,577 test:ci tests** pass:11 themes,427 core,
19 OpenUI,25 motion,194 blocks and901 docs. The full901-test documentation suite
passes again after forward-only source selection; all41 focused help checks pass
after final requirement-label and complete-index refinements. Production docs
build, root Oxlint, Oxfmt and Biome, commit hooks and diff checks pass.

The production Chrome coverage comprises **30 distinct reference cases**, including
the seven-family matrix at320/768/1440px in both appearances, loading and grammar
failure, exact package/source classification, native navigation, inline syntax,
keyboard/touch, boundary-wheel containment and pointer reentry. Both hover-color
cases also pass three fresh-context repetitions each. The final source-ownership
check confirms DirectionProviderProps/DirectionValue remain in its chapter while
DirectionProps stays available only in the related index. Additional light-desktop
and dark-mobile matrices pass after that selection refinement. Desktop, tablet
and narrow-phone component/technology/block captures were inspected with no
horizontal overflow or page errors; small code-reader gaps and the narrow index
heading were corrected during that review. No new Safari/WebKit result is claimed.

The refreshed upstream main remains an ancestor of the feature branch; no merge
conflict or fork divergence required resolution. Private reference guides and
contributor context were updated locally and remain excluded from commits.

### CI dependency-hygiene follow-up

The first remote run caught two internal-only exported functions left behind by
the reader and miniature refactors. Keep command syntax recognition and the local
declaration renderer private. Remove the command helper's obsolete metadata branch
and allowlist: its only caller already resolves explicit/file metadata before
passing bounded source to inference. Public Code exports and behavior are unchanged.
Knip/Syncpack now pass without suppressions; all427 core and41 help tests pass
again. The existing inference, metadata precedence, source rendering and grammar
fallback tests cover this cleanup without adding implementation-mirroring tests.
The follow-up also passes full workspace typechecking/builds, all three publint
checks and all three ATTW checks under the packages' ESM-only profile, plus root
format/lint/Biome, README synchronization and diff checks. ATTW used a task-local
npm cache to keep its pack operations within the workspace sandbox.

## 50. Faithful documented tables and cohesive reference chapters

- **Actual composition tables.** Fix generic-page configuration selection and distinguish a page's component overview from an exact subcomponent reference. Dialog now retains all seven documented rows, including its content and trigger/close options, rather than substituting three unrelated declaration fields. Exact subcomponent/type references keep their narrow ownership scope.
- **Shared API semantics.** Reuse the page table's pure owner resolver for requirements, source-definition links and description fallbacks. Preserve documented defaults separately from usage requirements. Safely serialize supported authored JSX descriptions, inline code, emphasis and links so Pagination keeps its accessibility and behavior guidance without importing or executing page functions.
- **Installation and usage together.** Preserve both actual section texts and the installation command/import snippets in one chapter. Extract the page's usage-import helper for shared use, retaining authored overrides and the existing source/package rewrite rather than inventing example imports.
- **Real data-type cards.** Give source declarations their own chapter linked to `component-data-types`. Root overviews preserve the full page's declaration order, including DialogContextValue; exact exports follow their own contracts. Miniature TypeDefinition cards retain file names, leading JSDoc, declared/required-field metadata and lazily mounted source readers.
- **Honest continuation links.** Replace the plain “3 of 5 documented fields” status with a link and down chevron to the complete table. Use equivalent exact-source continuation links for bounded code and type-card collections. Keep three visible rows/cards and bounded snippets; complete declarations remain accessible in the index and source page.
- **One chapter, one visual unit.** Align the miniature with the tooltip's content edges, reduce gaps above/below it and clamp the shortened continuation note to one line. Use small matching headings and balanced inset separators between chapters. Move the faint in-card source action into a visible primary text link with a chain and trailing arrow at the right of the centered heading row.
- **A more consistent ending.** Give Contracts and Resources their own compact subheadings and context. Normalize link typography, icon sizing and spacing. Underline only each destination label; the slash and resource-kind suffix remain plain. Slightly enlarge the destination/fact subline under the main title and tighten its internal gap.
- **Safe delivery and maintenance.** Keep source parsing at build time, optional coloring lazy, and miniature readers free of layout observers/clipboard controls. Share deep deployment-prefix normalization for excerpt sources, field owners and type definitions. Existing technology chapters remain explicitly project-authored profiles, ready to coexist with future reviewed official excerpts rather than being mislabeled as captured websites.
- **Behavioral coverage.** Add real-checkout Dialog/Pagination regressions, ownership/default/source-card assertions, unsupported-JSX and shadowed-binding cases, complete-table navigation, disclosure laziness and nested-prefix checks. Expand the production matrix to eight reference families. Keep the pointer-reentry browser check inside the actual departure grace by returning the real pointer directly, avoiding locator actionability work during that short interval.

### Documented-table verification

The full workspace `corepack pnpm test:ci` passes **1,583 tests**:11 themes,
427 core,19 OpenUI,25 motion,194 blocks and907 docs. After the final prose-prefix
regression, **908 docs tests in98 files** pass. Documentation typecheck and the
final production documentation build pass; root Oxlint, Oxfmt, Biome,
Knip/Syncpack, commit hooks and whitespace checks pass.

All **30 production Chrome reference cases** pass in the final combined run.
The eight-family matrix covers320/768/1440px in both appearances, actual Dialog
table/owner/default/setup/type-card content, flush alignment and one-line notes,
uniform index styling, keyboard/touch and optional-coloring failure. The existing
classification/source-navigation and contained-scroll/reentry cases pass too.
An earlier reentry test exhausted its350ms grace on locator actionability checks;
returning the real pointer directly fixes that test timing without changing
production dismissal behavior. Final source-specific desktop/mobile/tablet
captures were inspected. No new Safari/WebKit result is claimed.

Upstream main remains an ancestor and the fork was synchronized before the new
commits; no merge conflict needed resolution. Contributor-local guides/context
and the protected ignore-file edit remain excluded.

The final PR prose also reconciles earlier overview facts with the current source:
90 technology profiles,4px kind badges, eight main palette roles and three static
sketches per appearance. This documentation-only correction changes no product behavior.

## 51. Downloads beside Copy across documentation source readers

- **One shared file action.** Generalize the existing Markdown download into a private FileDownloadButton/useFileDownload, retaining the purple Copy-style animation, persistent icons, loading/completion/reset phases, retry feedback and native user-gesture handoff. Keep MarkdownDownloadButton as a thin adapter with its established accessible names and selectors.
- **Every Copy-enabled source reader.** Compose the action once in ReferenceCode through the existing core Copy slot. Ordinary CodeBlock readers, selected showcase files, guides, type declarations and source panels inherit it. Route the five live Code demonstration modules through the same host while preserving their original overflow policy and literal public API examples. Public core Code props/exports and dependencies remain unchanged.
- **Complete source and useful filenames.** Save the exact original string, including folded imports, whitespace and Unicode. Preserve a supplied source basename/extension while removing path/query/fragment/line metadata. Infer unnamed snippet extensions with the same language rules as the reader; select matching UTF-8 MIME metadata. A private filename override keeps Prompt Markdown names independent of Plain Text/Code/Markdown display.
- **Retained composition and opt-outs.** Place Download immediately before the existing Copy control, retaining custom Copy renderers and toolbar composition. Hidden Copy/toolbar and explicitly omitted custom controls omit Download too. Static nested Markdown fences and action-free reference miniatures remain unchanged; unrelated CopyButton product demos keep their own behavior.
- **Compact styling without duplicate Prompt actions.** Remove PromptDocument's extra action injection and obsolete Prompt-only action layout. Share source-toolbar label/glyph sizing and compact28px controls between Copy and Download. Retain Copy's base typography/background and the existing purple feedback. Give the loading spinner self-contained keyframes and a static reduced-motion fallback.
- **Bounded lifecycle.** Allocate no Blob, URL or timer until activation. Guard repeat clicks during feedback, release the URL after browser handoff or on failure/replacement/unmount, cancel phase timers on source/name/MIME changes and retain focus. Completion reports browser handoff without claiming a confirmed disk write.
- **Regression coverage.** Add exact-byte lifecycle/SSR/error tests, filename/language/MIME cases and reader integration tests for folded source, custom Copy composition, Markdown override, opt-outs and file replacement. Add production download cases for ordinary snippets, selected files, both compact appearances and live custom-control/visibility examples. Scope existing Copy feedback assertions to their own live region now that Download has a separate announcement.

### Source-download verification

The final documentation suite passes **946 tests in101 files**, including the
new file/lifecycle/metadata and reader-composition regressions. Documentation
typecheck, the production documentation build, root Oxlint/Oxfmt/Biome,
Knip/Syncpack and whitespace checks pass. Run the full documentation suite after
workspace runtime dependencies finish building: its installation fixtures compile
against those real outputs.

All **29 production Chrome cases** pass together: new exact-byte downloads,
selected showcase files at320px in both appearances, custom Copy composition,
hidden-action settings, all existing Prompt formats/names and clipboard/control
regressions. Desktop-light and phone-dark idle/completion captures were inspected;
Download matches Copy's alignment, compact dimensions and base paint, retains its
purple feedback, and introduces no horizontal overflow or page errors. No new
Safari/WebKit result is claimed. Core public APIs, dependencies and lockfile are
unchanged.

## 52. A quieter, unified page-opening state

- **Consistent label typography.** Let the loading label's Kamod name inherit its neighboring text's font, style and line height, then add only a6.25% size increase, primary ink and600 weight. Use a smaller, ordinary2px neutral spinner instead of the heavy brand-colored ring. The shared first-paint label receives the same self-contained styling.
- **Normal introduction copy.** Match full-route loading descriptions to documentation introduction text:15px, muted semantic ink and1.8 line height, with a modest450 weight. Compact preview descriptions retain their smaller typography.
- **One borderless skeleton.** Remove the lower group's border, surface, inset padding and minimum height. Align its shapes with the upper three bars and tighten the intervening space. Keep the small layout groups for alignment, using just low-opacity primary and secondary-accent tints across the composition.
- **A shorter shared animation.** Replace the long assembly/rest cycle and separate panel sweep with the same staggered sheen and restrained lift on every upper/lower shape. The2.25-second loop has a short5% rest, with stronger but still translucent two-color highlighting. Animate transforms/opacity only; add no JavaScript, requests, timers or dependencies. Reduced motion leaves all loading elements static.
- **Targeted browser coverage.** Check both appearances, the upper/lower animation loop, reduced motion and successful route handoff. Preserve compact-preview loading, first paint without site CSS, recovery navigation, narrow/landscape viewports and enlarged-text behavior. Inspect the label, neutral spinner and unified skeleton geometry in production captures rather than adding tests that merely repeat paint declarations.

### Page-opening verification

All **946 documentation tests in101 files** pass, along with documentation
typecheck and production build, root Oxlint/Oxfmt/Biome and whitespace checks.
All **18 production Chrome page-state cases** pass together, including both
appearances, pending full/compact routes, first paint without site CSS, static
recovery and keyboard navigation, narrow/landscape layouts and enlarged text.
The initial added compact test was corrected to use client navigation: hydration
preserves its server-rendered placeholder rather than mounting that fallback.

Desktop-light, tablet-light and phone-dark captures were inspected with Ocean,
Kamod and Cursor warm presets. Shapes align without a panel border or horizontal
overflow; no page errors occurred, and reduced motion stops every loading
animation. No new Safari/WebKit result is claimed.

## 53. A flat resource ending and balanced reference metadata

- **One ending list.** Replace Contracts/Resources subgroups with a semantic flat list beneath “Useful resources.” Put the tooltip's selected main reference first, retain all unique verified contract/source/guide/chapter/excerpt/declaration destinations, and preserve native navigation. Use the theme's secondary hue at the same highlight strength as the kind badge for that first item; other items retain one shared link style.
- **A compact count row.** Pair the heading with a subtle dot-separated contracts/resources/guides/references/third-party descriptor. Reserve a shared12px minimum gap before the opposite total count; truncate only the descriptor as space tightens. Center the row's contents and give only the number slightly larger semibold emphasis.
- **Independent header metadata.** Turn the destination below the title into a badge-hued underlined link with a small arrow. Move its fact into a separate right-side container beneath the badge/actions, with extra top spacing and a matching info icon. Remove the old dot; add a tiny decorative chain between the badge and open action, plus a small compass beside the linked title.
- **A consistent reading scale.** Match main description, origin context and right-side fact at10px/450 with the same line height and restrained badge-hued ink. Raise the smallest private-tooltip text to the former subgroup-heading size,8.5px, including miniature metadata and continuation notes. Make the main icon's background more visible while retaining stationary background-only action hover.
- **Scoped ownership.** Split header and ending paint into their own imported stylesheets. Keep shared density/color constants and miniature rules in help.css, retain actual source components and verified destinations, and add no state, listeners, timers, requests or dependencies.
- **Behavioral coverage.** Exercise main-first insertion, source-first fallback, exact deduplication/counts, empty-resource handling and preservation of every resource family. Update existing production matrix checks for independent metadata, a flat list, shared typography and native link behavior; keep source accuracy, grammar fallback, bounded scrolling and pointer grace intact.

### Resource-ending verification

The full documentation suite passes **951 tests in102 files**. Documentation
typecheck and the final production build pass, as do root Oxlint/Oxfmt/Biome,
Knip/Syncpack and whitespace checks. All **16 affected production Chrome cases**
pass together on the final build, including the eight-reference family matrix
at320/768/1440px in both appearances, exact classification/source navigation,
optional grammar failure, keyboard operation, bounded scrolling and pointer grace.

Final Ocean desktop-light, Cursor warm phone-dark and Kamod tablet-light captures
were inspected. Visible text stays at least8.5px, the resource row retains its12px
gap and the summary/context/right fact have matching computed typography and ink.
The primary destination is first, counts match unique links, and there is no
header/document overflow or page error. An earlier classification case hit
Chrome `ERR_NETWORK_CHANGED` for local chunks; its trace identifies that transport
failure and the complete final suite passes. No new Safari/WebKit result is claimed.

## 54. A matching reference-loader header and quiet content handoff

- **The actual reference first.** Use the same name, title/compass markup, font and relative placement as the loaded header. Production requests already preserve labels and aliases through every loader branch, so add no eager identity lookup. Replace the tilted page mark and right-side spinner with one16px/stroke2 spinner in the actual30px main icon container and its shared background/ink.
- **Small, clear progress copy.** Put “Following the reference...” beneath the title at10px, moderately larger than the normal destination subline. Replace the old sentence with “Just grabbing the details for you.” Use normal badge-hued secondary ink and an intentionally fractionally smaller8.25px loading caption.
- **Subdued shapes, shared timing.** Remove the reflective gradient and background-position loop. Keep solid low-opacity badge-colored bars/blocks and a very low-contrast flat moving tint. Extract the page-opening skeleton's2.25-second cycle,45ms staggering, settle/sweep keyframes and5% rest into one CSS owner; both loaders use it with their own paint. Page geometry/colors remain unchanged, including compact and reduced-motion layouts.
- **A quiet420ms handoff.** Keep the reading width, reference name and icon frame steady across loading and ready states, then fade details in without movement or blur. Let the old skeleton retire earlier to avoid overlapping text. Make its layer absolute, inert and hidden from assistive tools, retire its busy/live announcement and stop its spinner/shape/pseudo-element loops immediately. Finite effects retain no fill. Reduced motion switches immediately. The bounded decorative markup disappears with the existing tooltip request boundary.
- **No extra async machinery.** Reuse the existing keyed request and active guard for stale resolution/rejection. Add no transition state, timer, listener, observer, animation-frame loop, dependency or extra request. Keep failed optional-detail navigation usable.
- **Meaningful regression checks.** Cover stable dialog/focus, one accessible content/status, stopped outgoing animation, matching width/icon/title geometry and typography, reduced motion and keyboard navigation. Preserve stale-success/error/dismissal checks. Update old loaded-content waits to distinguish the new shared loading layout from verified facts; fix the mobile anchor/div selector specificity so both headings use the same font size.

### Loader-handoff verification

All **954 documentation tests in102 files** pass. Documentation typecheck and the
production builds, root Oxlint/Oxfmt/Biome, Knip/Syncpack and whitespace checks
pass. The **36 combined production Chrome cases** pass together:18 reference and18
page-state cases, covering responsive appearances, actual sources, keyboard and
pointer retention, loading/failure/dismissal, compact previews and reduced motion.
Both handoff cases pass again after the final staged-fade refinement.

Final Ocean desktop-light, Cursor warm phone-dark and Kamod tablet-light captures
were inspected at pending, midpoint and ready states. Icon-container paint/geometry
and title content/font/relative position match exactly; every skeleton uses a solid
base and the shared2.25-second cycle. No overflow or page errors occurred. Earlier
unit waits were updated to distinguish verified content from the new matching
loading layout, and a mobile anchor/div specificity mismatch was corrected before
the final comparisons. No new Safari/WebKit result is claimed.

## 55. Consistent primary page labels with the sidebar badge surface

- **One documentation icon.** Use the requested Tabler ApiBookIcon at14px with a slightly stronger2.25 stroke. Remove the private icon override prop and its eight Layers/Boxes call sites so component/package guides, block collections/variants and Kitchen Sink all follow the shared treatment. Update the standalone home label while retaining its compound label and unrelated book icons.
- **Shared paint, clear ink.** Give both text and icon the primary foreground color. Resolve the existing sidebar status background—secondary at20% over transparent—once at theme/appearance boundaries, then reuse it for page labels and status badges. Remove obsolete home color/size overrides and the stale16px stroke comment.
- **Stable surrounding content.** Keep label typography, padding, subtle corners and compensating top margins intact. The icon fits inside the existing text line box, retaining the main heading and following content positions. Keep page-opening spinners and the separate Getting Started flight decoration.
- **Small implementation.** Simplify the private component and remove repeated icon imports/markup. Add no dependencies, runtime state, listeners, requests or animations. Existing heading, block-header and home-layout browser suites cover the affected behavior; no additional implementation-mirroring unit tests are needed.

## 56. Restore shared block typography and compact palette metadata

- **Keep shared headers in charge.** Exclude modern shared block headers from the generic variant-guide title and description rules. The later guide rules had reduced detail-only titles and leads, violating the established overview/detail typography contract. Retain standalone guide sizing and let the existing responsive block-header rules govern both block routes.
- **Preserve token-label sizing.** Route the home palette grid's11px metadata sizing through the existing inline-code size override. The later project-wide prose rule had defeated its old important font declaration, clipping the nowrap background token around479px. Keep sentence-relative code sizing in prose and avoid a new specificity override.
- **Use the existing regression suites.** Keep the strict header-equality and text-clipping assertions. They exposed both earlier cascade regressions during the new page-label validation; fix the source owners rather than weakening those checks or duplicating them. Update the old20px/12px showcase-gap assertion to the previously requested compact12px/8px layout, preserving its exact spacing check.

### Page-label and responsive verification

All **954 documentation tests in102 files** pass, along with documentation
typecheck, the final production build, root Oxlint/Oxfmt/Biome and whitespace
checks. All **14 affected production Chrome cases** pass together, including
block overview/detail equality across four categories and27 widths in both
appearances, home layouts at26 widths, enlarged text, page labels and keyboard
operation.

Before the independent shared-header repair,36 baseline comparisons across six
page families,320/768/1440px and both appearances confirmed unchanged label
heights and main-heading positions. Ocean desktop-light, Cursor warm phone-dark
and Kamod tablet-light captures were inspected; label paint exactly matches the
sidebar status badge and no page errors occurred. Existing suites exposed the
older cascade regressions and an outdated showcase-gap assertion. The first
post-build preview still held its previous asset manifest; restart it before
browser checks. The final combined run uses fresh assets. No new Safari/WebKit
result is claimed.

## 57. Separate chosen contents links from reading and soften sidebar hierarchy

- **A quieter parent hierarchy.** Keep the selected left sublink surface; give selected main groups and pinned top/bottom entries exactly two-thirds of its visibility, including their hover paint. Share those derived tokens with right contents links and retain the same desktop/mobile behavior.
- **A real URL selection.** Mark only actual same-document fragment matches as selected, independently from aria-current and the section in view. Handle decoded hashes, incoming cross-page links, reload, hash clearing and Back/Forward. Reuse the existing hash listener and post-click animation frame so router history writes are observed without new async machinery. Keep scroll revelation and cleanup intact.
- **Separate reading feedback.** Give the current reading link the same base/layers as an idle main group. Keep its straight2px marker, trim only the5px needed inside the6px corner radius, and paint through the border box so narrow-desktop ellipsis cannot clip it. Reserve the elevated stacking level for the currently viewed link.
- **A clear, fading rail.** Extend the rail6px above the list, fade its ends over14px and add a small foreground contribution for visibility. Keep ordinary hover fills quieter and below the rail, with no pointer interception or content masking.
- **Stable contents heading.** Remove the separator below On This Page while preserving its top and title center; the list rises only the removed1px. Use a familiar16px compass with a slightly stronger stroke inside a28px shortcut, add4px of left separation, and grow around the original center rather than enlarging the row.
- **Focused behavior coverage.** Add six unit cases covering encoded/document-isolated selection, actual versus prospective navigation, clearing, reload and disposal. Add light/dark production cases for real incoming navigation, independent scrolling, following another section, page-top clearing and history. Update existing shortcut expectations while preserving shared row geometry, palette/ink hierarchy, keyboard navigation, scroll memory and expansion tests.

### Sidebar hierarchy and selection verification

All **960 documentation tests in102 files** pass, including the six new selection
regressions. Documentation typecheck and the final production build pass, as do
root Oxlint/Oxfmt/Biome and whitespace checks. All **21 affected production Chrome
cases** pass together on the final build, covering both appearances, real incoming
links, history, reload, keyboard shortcuts, natural scroll limits, manual pane
position, offscreen reading revelation, final-entry clearance and desktop/mobile
expansion. Existing styling checks retain the shared row geometry and ink hierarchy.

Production Ocean-light, Cursor warm-dark and Kamod-wide captures plus both mobile
appearances were inspected. Group/sublink alpha is exactly170/255, selected right
paint matches the group paint, and reading paint matches an idle group. Header
top/title-center offsets remain0px and the list moves up exactly1px. The straight
marker remains visible with ellipsis, the rail stays over ordinary hover fills,
and mobile has no document overflow. Captured desktop pages emit no page errors. No new Safari/WebKit result
is claimed. Earlier parallel runs encountered traced local Chrome
ERR_NETWORK_CHANGED chunk failures; the final sequential combined run passes.
The new cross-page test's initially ambiguous selector was narrowed to the actual
list item, retaining coverage of the shortcut that shares its destination.

## 58. Whole prose-code tokens and consistently compact highlights

- **Move the whole token.** Make ordinary and detected prose code atomic and nowrap, so a fitting multiword term moves to the next line instead of splitting inside a sentence. Bound oversized literals to their container and retain their complete selectable text through local horizontal scrolling with a thin scrollbar.
- **One compact highlight box.** Keep the agreed94% surrounding-font scale and normalize plain/linked prose code to the same1.2 line height,1px border geometry and small0.04em/0.2em inset. This replaces competing context paddings without changing the underlying theme paint or reference-hover cue.
- **Preserve contextual identities.** Leave the source-card package chips shown in the reference at their existing font, inherited line-height and0px/3px padding. Preserve heading names, source readers, toolbar/file/control labels and private tooltip typography. Paths keep their existing atomic grid, middle ellipsis and emergency endpoint fallback for very narrow layouts.
- **No runtime machinery.** Use one nested rule in the existing late-loaded inline-code stylesheet and one shared padding token. Add no components, measurement effects, listeners, observers, requests, dependencies or generated content.
- **Meaningful regression checks.** Cover plain/detected whole-token wrapping, sentence-relative font scaling, equal highlight geometry without enlarging surrounding line boxes, full selection of oversized values and unchanged package-chip identities/destinations. Keep explicit compact inventory sizes outside the prose-only font-ratio matrix. Update the older path test to verify exact source metadata/native titles or stable text, retaining both-end visibility and overflow assertions for rich references that intentionally omit native titles.

### Inline-code wrapping and highlight verification

All **960 documentation tests in102 files** pass, as do documentation typecheck,
the final production build, root Oxlint/Oxfmt/Biome and whitespace checks.
All **20 focused production Chrome cases** pass: five inline-size/wrapping cases,
ten guide cases across20 breakpoints in both appearances, and five path cases at
1440/768/390/320px. The checks cover sentence-relative fonts, whole multiword
references, matching compact boxes within the surrounding line height, full
selection/scrolling of oversized literals, preserved package chips and exact path
text with visible endpoints. No new unit tests duplicate CSS declarations.

Ocean desktop-light and Cursor warm phone-dark source cards, plus a Kamod Theming
introduction, were inspected. Prose code follows the parent at94% with shared
compact insets, while source-card package labels retain15.04px text and0px/3px
padding in their16px context. Captures have no document overflow or page errors.
No new Safari/WebKit result is claimed. Initial browser failures exposed outdated
test assumptions about explicit token-inventory font overrides, inherited unitless
line heights, native titles on rich references and configured-but-unused endpoint
ellipsis; the final tests verify the actual text/geometry contracts instead.

## 59. Saved technology and package previews with aligned reference metadata

- **Read saved content only.** Expand Tailwind, Vite and Valibot into three guide-based chapters each with complete compact snippets and useful official continuation links. Save the authored content in the existing lazy technology family, with dated source provenance. Keep only identities/destinations in the eager index. No tooltip scrapes or fetches a third-party site.
- **Make each technology useful.** Tailwind covers Vite installation, plugin/CSS integration and running/styling the app. Vite combines dev/build/preview commands, plugin registration and environment configuration; it labels deprecated CLI behavior and the reviewed Environment API status. Valibot covers package-manager installation, types versus runtime schemas and an inferred login schema with validation-result handling.
- **Save five package READMEs.** Add fifteen setup, usage and concept cards for Kamod UI, Hooks, PreactPress, Signals and Icons. Preserve review dates and exact README blob identities. Check example imports against installed public exports, rather than showing newer unavailable preview APIs.
- **Separate package and entrypoint.** Bare package subpaths keep their owner's root name, saved chapters and main repository link. A small semantic note preserves the original entrypoint and verified source; if no file was verified, the link explicitly searches the repository instead of inventing a file path. Specific integration guides stay in the resources. Original inline destinations and actual imported components, hooks, types and namespace contracts retain their behavior. Loading already uses the eventual package title.
- **Align the header.** Move the independent fact from beneath the top-right actions into the opposite right of the path/context row. Center the highlighted path through its flex wrapper so it shares the same center as the slash, purpose and fact. Use `ExternalLinkIcon` for the compact top action, keeping the small decorative chain between it and the badge.
- **Use the current page palette.** Every main card and its miniatures use the page background/foreground, including saved external documentation content. Remove the old purple/pattern overlay. Remove redundant technology Role facts while preserving short purpose labels in the origin row.
- **Verify offline and navigation behavior.** Open all three technology previews, five packages and two representative subpaths with external requests blocked in desktop light and mobile dark. Retain exact type-fragment/source navigation, keyboard/focus behavior, loading/reduced-motion handoff, source-coloring failure fallback, scroll boundaries and departure grace.

### Saved-reference verification

All **969 documentation tests in 104 files** pass. Documentation typecheck and the
final production build pass, together with root Oxlint/Oxfmt/Biome, Knip/Syncpack
and whitespace checks. All **22 affected production Chrome cases** pass in one
sequential final run. The matrix includes eight reference families at
320/768/1440px in both appearances, aligned header geometry and actual page-palette
miniatures. New offline checks report no external request while opening the saved
profiles, and preserve the original page URL.

The initial browser run caught a 0.7px inline-baseline offset in the highlighted
origin path; centering its wrapper fixes the actual geometry. Older module/source
assertions now reflect the requested root-package preview while separately
checking unchanged inline navigation and exact subpath sources. Selectors scope
the finished title to the ready layer because the retained inert loading layer
also contains its anchored title. No timing workaround or relaxed centering
assertion was introduced. No new Safari/WebKit result is claimed.

Desktop Ocean Tailwind, Kamod Valibot, and Cursor warm phone-dark Vite/package
subpath previews were inspected at both ends of their scroll area. The aligned
metadata, current-page cards, compact examples, entrypoint notice and wrapping
resource list remain readable, with no horizontal card overflow or page errors.

## 60. Viewport-fitting loading and recovery pages with quiet separators

- **Remove the real extra pixel.** The Matomo image previously followed the full-height app in normal flow. Give the same tracker explicit 1px dimensions and position it absolutely at the origin, preserving its URL and referrer policy while removing its contribution to document height. A deterministic loaded pixel now exercises this regression in browser tests.
- **Fit the normal phone loading view.** At viewport heights up to 600px, use 12px main block insets, 4px loading insets, 16px skeleton top spacing and 7px shape gaps. Correct the short-window footer-shape selector so its 16px height wins over the 22px base. The 320×568 pending page has no internal scroll, without shortening its text or clipping content.
- **Give 404 content its space.** Reduce the height-based illustration and nearby gaps. Increase the destination-grid column minimum to 15rem, producing two balanced columns at ordinary reading widths and a single column on narrow screens, without the former three-plus-one arrangement. The 1024×768 recovery page now fits without an inner scroll range.
- **Keep startup and static reading safe.** Constrain root/body layout only while PreactPress's existing JavaScript-set `aria-busy=true` marker is present and readiness has not completed. The fixed first-paint preloader retains its own scroll region; the rule clears when ready and never locks no-JavaScript server-rendered reading.
- **Use neutral dividers.** Share an 8% foreground-ink rule across utility header/footer borders, the 404 destination separator, recovery divider and the startup track base. Their geometry and loading motion remain unchanged; theme-tinted border paint no longer makes these lines prominent.
- **Test actual scrolling.** Require document height to equal the viewport exactly. Normal pending frames must also have zero main-content scroll range. Short landscape and enlarged text can scroll inside their proper reading region; both ends of oversized text remain reachable. Verify no-JavaScript reading through a real wheel gesture and a reachable final reference paragraph.

### Utility-page validation

All **969 documentation tests in 104 files** pass, together with documentation
typecheck/production build, root Oxlint/Oxfmt/Biome and whitespace checks. All
**21 affected production Chrome cases** pass, covering 320/768/1024/1440px,
boundary/wide sizes, short landscape, both appearances, 200% text, first paint
without site CSS, compact previews, failed-module recovery, keyboard/reload
actions and static reading without JavaScript. The responsive/recovery suite
passes 20 cases; the new no-JavaScript case passes its focused final rerun. Its
first run already proved wheel scrolling, but a large jump used an estimated
article height; the final check reveals the actual ending after deferred layout
settles instead of assuming that estimate is final.

Measurements confirm the outer scroll range changes from 1px to 0px at all four
required widths. At 320×568, loading's inner scroll range changes from 43px to 0px;
at 1024×768, 404's inner range changes from 35px to 0px. Short or enlarged recovery
content remains accessible rather than hidden. No new Safari/WebKit result is
claimed.

Ocean-light and Cursor warm-dark loading/404 views were inspected at the four
required widths. The complete 320×568 loading frame fits, desktop/tablet recovery
links use balanced columns, and the neutral separators remain quiet in both
appearances. No page text was shortened to make the loading view fit.

## 61. Transparent rocket with slow forward flight and changing sparkles

- **Keep the artwork transparent.** Clear background, border and shadow paint on the decoration, vehicle and SVGs. Replace the filled exhaust bars with three faint SVG strokes. The rocket, exhaust and six outlined sparkles all inherit primary text ink from `--foreground`.
- **Fly along one smooth course.** Replace the six-second rotating orbit with a fourteen-second curved ascent. Keep the vehicle's heading steady, travel farther, and fade quietly at the path ends so the invisible reset never sends the rocket backward. The active desktop sidebar icon also moves more slowly with a small diagonal range.
- **Sparkle around a bounded field.** Separate the stationary constellation from the moving vehicle. Stagger six small stars with subtly different sizes and durations. Each real animation iteration chooses a new bounded location and size while the star is invisible; stable initial values preserve server/client agreement. No timers, animation library or JavaScript frame loop are introduced.
- **Move the decoration up and left.** Use a 128×108px field inset 10px from the header top and 20px from its right edge. Below 640px, use an 88×72px field with 8px insets and a 52px vehicle. The desktop vehicle remains 78px. Preserve the normal breadcrumb, eyebrow, title and introduction flow.
- **Pause decorative work appropriately.** Reuse the shared viewport/visibility controller and remove the subscription on unmount. Reduced motion leaves a static rocket and stars. Start the paused server-rendered vehicle halfway along its path, so it remains visible before hydration and without JavaScript.
- **Exercise actual behavior.** Check real sparkle iteration changes, offscreen pause/resume, flight/star containment, heading clearance, transparent paint, theme ink, desktop-only sidebar motion, reduced motion and route departure. Measure total travel across frame pairs rather than from an arbitrary midpoint. Wait for page readiness before the existing pending-syntax test scrolls; its earlier scroll could target startup geometry instead of the final snippet.

### Rocket validation

All **969 documentation tests in 104 files** pass, together with documentation
typecheck/production build, root Oxlint/Oxfmt/Biome and whitespace checks. All
**15 affected production Chrome cases** pass in the final sequential run. Nine
exercise the new artwork and its lifetime; the remaining six retain heading,
reference-pair, ending, CSS folding/copy and pending-syntax coverage.

Inspected Ocean-light and Cursor warm-dark header captures at
320/768/1024/1440px. The artwork has no backdrop, stays clear of heading text and
creates no horizontal overflow. Sampled flight positions progress upward and
forward while visible. The no-JavaScript capture retains a visible paused rocket.
No new Safari/WebKit result is claimed. Earlier failures exposed a midpoint-based
travel assertion, a test-owned Web Animations play override and the pre-readiness
snippet scroll; the final checks retain their behavior and geometry requirements.

## 62. Moderately rounder page-heading labels

Increase the shared page-label corner radius from2px to4px. The same rule covers
the home hero, guides, component/package pages, block collections/variants and
Kitchen Sink, while preserving their paint, typography, insets and heading flow.

The production documentation build, root Oxlint/Oxfmt and whitespace checks pass.
Verified4px on every corner in56 production Chrome combinations: seven page
families at320/768/1024/1440px in both Ocean-light and Cursor warm-dark appearances.
Inspected representative guide/home label captures. This cosmetic adjustment adds
no runtime behavior or tests that duplicate its CSS declaration.

## 63. Minimal 404 with no scrolling

- **Reduce the body to one message.** Remove the folded-sheet illustration, repeated error labels, long explanation and four destination cards. Show a plain 404, “Page not found,” one short sentence and two recovery links. Home is a compact ink-filled action; Getting Started is a quiet underlined link.
- **Preserve the outer frame.** Keep the existing brand/Get Started header and Preact/source footer, their links, safe-area insets and quiet neutral rules. All layout and overflow changes are scoped to the not-found frame; loading and interrupted-load behavior remain intact.
- **Fit real content in the viewport.** Center one unit within a 38rem reading cap. Short windows use smaller decorative type and gaps; short wide windows put the number beside the message and actions. Cap the 404 shell at 100dvh and require both main and document scroll ranges to be 0px while every text/action box stays fully visible.
- **Keep navigation simple.** Retain native base-path-aware anchors, main/heading/navigation landmarks and the shared keyboard focus outline. The page remains server-rendered and needs no new state, observers, dependencies or animation.
- **Verify readability.** Use semantic muted ink for the large number and a stronger foreground mix for the short description. The initial accessibility pass caught insufficient contrast in the faint number and Cursor warm-light copy; increase the ink rather than relaxing those checks.

### Minimal404 validation

All **969 documentation tests in 104 files** pass, along with documentation
typecheck/final production build, root Oxlint/Oxfmt/Biome and whitespace checks.
All **21 affected production Chrome cases** pass in the final sequential run.
They cover direct/client unknown URLs, keyboard recovery, 14 responsive viewports,
200% text at 768×480, both appearances, accessibility, startup without site CSS,
compact loading/recovery and static reading without JavaScript.

The 404 checks now require zero document and main-content scroll and verify that
the number, heading, short sentence and both recovery links remain within the
actual main area. Loading/interrupted-load scroll allowances are preserved.
Additional captures verify full chrome/content visibility and zero scroll at
320×568,768×1024,1024×768,1440×900,320×320 and568×320 in Ocean-light/Cursor warm-dark,
including an actual wheel gesture and a no-JavaScript phone view. Representative
final screenshots were inspected. No new Safari/WebKit result is claimed.
