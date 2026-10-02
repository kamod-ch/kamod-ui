import type { AccessibilityProfiles } from "./types";

export const presentationAccessibility: AccessibilityProfiles = {
  "aspect-ratio": {
    foundation:
      "AspectRatio reserves a proportional layout box. It does not add an accessible name, image alternative, media controls or a semantic figure. Those responsibilities remain with the content placed inside it.",
    naming:
      "Name informative images, videos or embedded content through their own APIs. When media needs a caption, compose a figure and figcaption or other appropriate structure around the visual box. Do not announce the numerical aspect ratio unless it matters to the task.",
    interaction:
      "Static media wrappers should not enter the tab order. Any embedded player or interactive content must remain keyboard reachable at the constrained size, with controls and focus indicators visible rather than cropped.",
    pitfalls:
      "A predictable ratio can still hide important content if object-cover crops labels or diagrams. Provide a readable alternative for information that no longer fits and avoid fixed-height assumptions around captions or enlarged text.",
    checks: [
      "Inspect the inner media's name and alternative description rather than only the wrapper.",
      "Resize the container and confirm captions, controls and focus indicators remain available.",
      "Try missing media and text enlargement without collapsing the surrounding reading order.",
    ],
  },
  avatar: {
    foundation:
      "AvatarImage defaults to an empty alt value and coordinates loading/failure with the fallback. An avatar is decorative when the same identity is already conveyed nearby, but informative when it is the only representation of a person.",
    naming:
      "Decide whether the image or its parent action supplies the name. An avatar-only profile button needs a name such as Open Maya's profile. Initials in a fallback are not always an understandable substitute for a person's full name.",
    interaction:
      "The avatar itself does not need focus unless it is part of a real action or link. Keep the enclosing control stable while the image loads or fails so the user's focus and accessible name do not change unexpectedly.",
    pitfalls:
      "Avoid announcing the same person's name from image, fallback and adjacent text simultaneously. Do not encode online/offline status only in a colored dot; expose a readable status when it is relevant.",
    checks: [
      "Test loaded, missing and failed images and compare the accessible name across all three.",
      "Navigate any enclosing profile action with the keyboard.",
      "Inspect an avatar-only layout and a layout with adjacent names for missing or duplicate descriptions.",
    ],
  },
  image: {
    foundation:
      "Image renders a native img and defaults `alt` to an empty string. This treats an unspecified image as decorative; it does not automatically describe a meaningful photograph, chart or screenshot.",
    naming:
      "Write alt text for the information the image contributes in this context. Use an empty alt for purely decorative imagery or a redundant image inside a sufficiently named link. Put extensive diagram explanations in nearby prose rather than an enormous alt attribute.",
    interaction:
      "Images are not keyboard controls by themselves. If an image opens a larger view, use a real named link or button and preserve focus through the resulting overlay. Keep captions available without hover.",
    pitfalls:
      "Do not repeat filenames or generic Image of wording when it adds no meaning. Text embedded in an image still needs a readable equivalent. Cropping can remove the very information described by the alternative text.",
    checks: [
      "Disable image loading and verify the essential information remains understandable.",
      "Read images in context with a screen reader and remove redundant narration.",
      "Check responsive crops, zoom and any image-opening control without pointer input.",
    ],
  },
  video: {
    foundation:
      "Video renders a native video element with `controls` enabled by default and accepts children such as source and track. Captions and other alternatives are supplied by the application; the component does not generate them.",
    naming:
      "Provide a visible title and identify the video's purpose. Supply accurate caption tracks for spoken content and relevant sounds, a transcript where useful, and an equivalent for important visual information that is not conveyed by the audio.",
    interaction:
      "Retain keyboard-operable playback controls. Avoid automatic sound and provide an easy way to pause any automatic movement. If replacing native controls, you take responsibility for their labels, state, focus order and keyboard behavior.",
    pitfalls:
      "A transcript is useful but does not make unavailable playback controls usable. Test actual track loading and language labels; merely adding a track element does not ensure the caption file exists or contains accurate timing.",
    checks: [
      "Start, pause, seek, change volume and enable captions without a pointer.",
      "Review captions and transcript against the real media, including meaningful non-speech audio.",
      "Check a narrow viewport, fullscreen behavior and an unavailable video source.",
    ],
  },
  carousel: {
    foundation:
      "Carousel exposes a named carousel region when you provide `label` or `aria-label`; items use group/slide semantics. Previous and next controls have names. CarouselAutoplayPause supplies an explicit pause/resume action when you include it.",
    naming:
      "Name the collection by its purpose, not just Carousel. Give slides meaningful content and identify their position when needed. Image alternatives should describe the slide's information, while navigation button names describe movement.",
    interaction:
      "Keep previous/next and any slide controls reachable with the keyboard. If enabling autoplay, include a visible pause control and verify behavior during focus and hover. Do not move keyboard focus just because a slide advances.",
    pitfalls:
      "Offscreen slides must not expose confusing unreachable controls. Autoplay can make reading difficult even when transition animation is subtle. Review reduced-motion and pause behavior in the exact configuration instead of assuming a plugin supplies it.",
    checks: [
      "Navigate every slide and activate its content without dragging.",
      "Pause automatic movement and verify the user's decision remains effective while interacting.",
      "Inspect which offscreen controls can receive focus and how slide changes are conveyed.",
    ],
  },
  card: {
    foundation:
      "Card supplies visual composition rather than an automatic document outline. CardTitle currently renders a div, so its large type does not make it a semantic heading. Add the appropriate heading element when the card introduces a section.",
    naming:
      "Give a card a clear subject and name its actions by outcome. Link text should remain understandable when several cards share the same layout. If the entire card is a destination, avoid nesting additional interactive controls inside that link.",
    interaction:
      "Only actual actions and destinations should receive keyboard focus. Keep reading order aligned with visual order and preserve the focus indicator when content is clipped, rounded or stretched into a clickable surface.",
    pitfalls:
      "Do not turn every decorative card into a landmark or focusable group. A title, image, price and button need a useful reading sequence, while supplementary actions should remain distinct from the primary destination.",
    checks: [
      "Review the document heading outline rather than relying on title size.",
      "Tab through a grid and identify each action's target from its name and context.",
      "Increase text size and verify cards expand without hiding descriptions, prices or actions.",
    ],
  },
  item: {
    foundation:
      "Item is a presentational div by default and can clone a supplied child with `asChild`. ItemGroup exposes a list role, so its composed children need suitable list-item structure. A visual row is not automatically a button or list item.",
    naming:
      "Keep the primary title understandable and associate supporting information without turning the whole row into an excessively long action name. Name secondary icon actions by their target, such as Remove invoice draft.",
    interaction:
      "Use a real link for a destination and a real button for an action. If a row contains several independent controls, leave them as separate actions rather than nesting them inside one large clickable button.",
    pitfalls:
      'Adding `role="listitem"` directly to an interactive element can replace its native semantics. Prefer a list-item wrapper around the link or button. Verify asChild composition preserves the intended element and forwarded attributes.',
    checks: [
      "Read the group as a list and verify its item structure in the accessibility tree.",
      "Use keyboard focus to distinguish the row's primary action from any secondary actions.",
      "Check truncated titles and narrow layouts without losing the target of an action.",
    ],
  },
  table: {
    foundation:
      "Table preserves native table elements through its component parts. Header and cell relationships depend on the structure you provide. TableHead supplies a th element; set scope where needed instead of relying on its visual header styling alone.",
    naming:
      "Give the table a useful caption and clear column names with units. Use row headers when identifying a row matters. For complex multi-level headers, explicitly review the header associations rather than assuming a simple column scope describes them.",
    interaction:
      "A data table is read as a table, not automatically operated as an application grid. Keep links, sort actions and row controls as native interactive elements, and make a wide table's scroll region keyboard reachable when necessary.",
    pitfalls:
      "Do not replace table semantics with divs solely for mobile styling. Avoid blank headings for action or selection columns; provide an accessible label even when the visual heading is hidden.",
    checks: [
      "Navigate cells with a screen reader and verify the correct row/column context is announced.",
      "Reach controls and horizontally scroll on a narrow screen without moving the entire page sideways.",
      "Read empty, loading and total/footer rows with the same header structure.",
    ],
  },
  "data-table": {
    foundation:
      "DataTable is a composition of table content and application controls. Filtering, sorting, selection and pagination require accessible state in the resulting UI; using the component does not automatically announce every dataset change.",
    naming:
      "Use a caption or nearby heading, named filters and specific row-action labels. Name selection checkboxes by row identity, and distinguish selecting all visible rows from selecting the entire dataset.",
    interaction:
      "Keep sorting in real buttons and expose the current sort direction on the appropriate header with `aria-sort`. Preserve a useful focus position when rows update. Report result counts or important filter outcomes without interrupting every keystroke.",
    pitfalls:
      "A sort icon alone does not convey direction, and a highlighted row does not explain selection. Do not label the table as a grid unless implementing the corresponding keyboard model. Confirm selection state after filtering or paging.",
    checks: [
      "Sort, filter, select and paginate entirely by keyboard and inspect their announced states.",
      "Read column headers and selected-row identities using assistive technology.",
      "Test zero results, a removed focused row and a narrow horizontal scroll region.",
    ],
  },
  chart: {
    foundation:
      "The core Chart component is a presentation wrapper with an optional h3 title and description. It does not inspect child graphics, generate a data table or supply keyboard interaction for a charting engine.",
    naming:
      "Explain the chart's subject, units, time range and key conclusion in text. Supply a readable data alternative when precise values matter. Name series directly and use labels, patterns or shapes so color is not the only distinguishing channel.",
    interaction:
      "If the inner chart supports exploration, verify its keyboard and screen-reader behavior separately. Hover-only tooltips are insufficient for essential values. A static chart normally should not add dozens of meaningless tab stops.",
    pitfalls:
      "A title does not describe the relationships in a complex graphic. Do not imply that the wrapper certifies a third-party chart's accessibility, and ensure an empty or failed dataset has a clear textual state.",
    checks: [
      "Understand the main conclusion and retrieve important values without seeing the graphic.",
      "Check series distinction without color and inspect legend/axis contrast in both themes.",
      "Test the inner renderer's keyboard controls and its empty, loading and error states.",
    ],
  },
  "scroll-area": {
    foundation:
      "ScrollArea provides a scrolling viewport and decorative custom scrollbar pieces. The scrollbar visuals are hidden from assistive technology; keyboard access depends on the actual viewport and its content, not on those decorative pieces.",
    naming:
      "Name the scrolling region when it needs a separate focus stop and its purpose is not otherwise clear. The current root forwards HTML attributes to the outer wrapper, not the viewport. If the inner viewport needs explicit focus or naming attributes, extend that surface or use a native overflow region you can configure directly.",
    interaction:
      "Verify keyboard scrolling and that focused descendants scroll into view. Avoid trapping page-navigation keys when focus is in an unrelated input. Keep the scrollbar discoverable enough for pointer and touch users.",
    pitfalls:
      "Nested scrolling areas can make it unclear which region moves. Avoid unnecessary fixed-height panels, and do not let sticky headers or footers cover focused controls at the viewport edges.",
    checks: [
      "Scroll the region without a pointer and then continue keyboard navigation out of it.",
      "Focus controls near every edge and verify they remain visible beneath sticky content.",
      "Test text zoom, long content and both horizontal and vertical overflow.",
    ],
  },
  separator: {
    foundation:
      "Separator defaults to a semantic separator role and exposes its orientation. Set `decorative` when the line only adds visual spacing; that removes the semantic role/orientation rather than announcing every ornamental rule.",
    naming:
      "A decorative separator does not need a label. Use real headings and grouping elements to explain the content structure; a horizontal line alone cannot tell someone what the next section means.",
    interaction:
      "A static separator should not be focusable or clickable. A draggable pane divider is a different interaction requiring focus, keyboard adjustment and value semantics; do not assume this presentational component implements it.",
    pitfalls:
      "Too many semantic separators can add noise without helping navigation. Choose orientation to match the actual layout and recheck it when responsive wrapping changes a horizontal group into a vertical stack.",
    checks: [
      "Inspect whether each separator is intentionally semantic or decorative.",
      "Navigate by headings and verify the document structure remains clear without visible lines.",
      "Check responsive orientation and ensure decorative rules do not become keyboard stops.",
    ],
  },
  typography: {
    foundation:
      "Typography styling affects how content looks; accessibility depends on the actual elements and reading structure used by each primitive. Visual size should not be used as a substitute for a coherent heading hierarchy.",
    naming:
      "Write descriptive headings and link text that make sense when scanned separately. Use native lists for sequences and groups, and reserve code styling for actual identifiers or syntax rather than decorative emphasis.",
    interaction:
      "Keep links keyboard reachable and visibly distinguishable from body text. Let readers enlarge text and reflow content without losing words or controls. Long code samples may scroll within a named, keyboard-accessible region.",
    pitfalls:
      "Muted text still needs readable contrast against its surface. Avoid using uppercase, weight or color as the only carrier of meaning, and do not fix paragraph heights in a way that clips larger text or translated content.",
    checks: [
      "Review the heading outline and link list using assistive technology.",
      "Enlarge text and narrow the viewport while checking for clipped lines and overlapping content.",
      "Check body, muted, link and code colors in every supported theme.",
    ],
  },
  prose: {
    foundation:
      "Prose styles authored document content. It does not repair incorrect heading levels, missing image alternatives, malformed lists or inaccessible embedded components. The markup you place inside remains the semantic source of truth.",
    naming:
      "Use a logical title/heading hierarchy and meaningful link text. Give figures captions and informative images alternatives. Tables embedded in prose still need captions and proper headers; typography alone does not supply those relationships.",
    interaction:
      "Preserve focus visibility on links and embedded controls. Ensure long preformatted code is reachable and scrollable without forcing horizontal overflow on the whole page. Keep anchor destinations clear when navigating by headings.",
    pitfalls:
      "Rendered Markdown can contain visually plausible but semantically incorrect structures. Review generated HTML as well as source text. Avoid relying on color alone to distinguish a link from surrounding prose.",
    checks: [
      "Read the document through its headings, links and list structure with assistive technology.",
      "Inspect Markdown-generated tables, images and embedded controls individually.",
      "Test zoom and narrow layouts with long URLs, code and translated text.",
    ],
  },
  kbd: {
    foundation:
      "Kbd displays keyboard notation; it does not register or execute a shortcut. Its visual key shape is instructional content, not an interactive button or proof that the documented command exists.",
    naming:
      "Describe the shortcut's action in nearby text. Make modifier names and key combinations understandable across platforms. If decorative keycaps are hidden from assistive technology, retain an equivalent readable instruction.",
    interaction:
      "Implement shortcuts at the application layer and preserve ordinary text-entry behavior. Avoid intercepting keys inside editable fields unless that shortcut is part of the editor's explicit interface. Offer a visible action alongside the shortcut.",
    pitfalls:
      "A platform-specific symbol may be unfamiliar or spoken ambiguously. Do not advertise a command the app does not handle, and avoid making a shortcut the only way to reach essential functionality.",
    checks: [
      "Execute the advertised command and confirm it matches the written instruction.",
      "Try the same keys while typing into an input and check for unwanted interception.",
      "Read the instruction with a screen reader and test the visible alternative action.",
    ],
  },
  direction: {
    foundation:
      "Direction supplies direction context for components that consume it. A context value alone does not translate text or set the document's language. HTML direction and locale-specific content still need deliberate application configuration.",
    naming:
      "Set appropriate document or container `dir` and language metadata for the content. Use readable localized labels and isolate embedded identifiers or addresses when mixed-direction text would otherwise become ambiguous.",
    interaction:
      "Test components whose arrow behavior depends on direction, alongside native text editing. Visual reversal through CSS must not produce a misleading reading or tab order. Prefer logical spacing and alignment properties over hand-reversing the DOM.",
    pitfalls:
      "RTL does not mean every icon, number or media control should be mirrored. Keep actions recognizable and verify mixed-language labels, filenames and code snippets independently from the surrounding layout.",
    checks: [
      "Navigate the same interaction in LTR and RTL and compare focus order with reading order.",
      "Inspect document language and direction metadata rather than relying only on visual alignment.",
      "Try mixed-direction names, numbers and long translated labels at narrow widths.",
    ],
  },
  cn: {
    foundation:
      "cn combines class names and has no DOM, roles, focus behavior or accessible name. Its accessibility impact comes from the styles you compose on actual controls and content.",
    naming:
      "Keep labels and ARIA attributes on the rendered element; a class-name helper cannot create their relationships. Make state classes follow the same state value used by semantic attributes so visual and announced behavior do not disagree.",
    interaction:
      "Preserve focus-visible styles when merging overrides and keep disabled styling aligned with actual disabled behavior. Use the helper to express conditional presentation without replacing native interaction with click-only wrappers.",
    pitfalls:
      "A later class can hide content, suppress a focus ring or remove a useful contrast treatment. Review the final computed styles rather than assuming all source classes remain effective after merging.",
    checks: [
      "Inspect the final focused, disabled and invalid control after class overrides.",
      "Compare visual state against checked, pressed, expanded or invalid semantics as applicable.",
      "Test light/dark themes and reduced motion with the fully composed class list.",
    ],
  },
};
