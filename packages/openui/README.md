# @kamod-ch/openui

Official [OpenUI](https://www.openui.com/docs) adapter for [Kamod UI](https://kamod-ch.github.io/kamod-ui/).

`@kamod-ch/openui` is a typed, security-focused component library that lets an LLM compose **only** approved `@kamod-ch/ui` surfaces through OpenUI Lang. It does not ship an LLM provider, chat backend, or custom parser.

```text
LLM → OpenUI Lang → @openuidev/react-lang Renderer → @kamod-ch/openui → @kamod-ch/ui → Preact
```

## Installation

```bash
pnpm add @kamod-ch/openui @kamod-ch/ui @openuidev/react-lang zod preact @preact/signals
```

## Prerequisites

| Dependency              | Supported             |
| ----------------------- | --------------------- |
| `@kamod-ch/ui`          | `^0.2.1`              |
| `@openuidev/react-lang` | `^0.2.8`              |
| `preact`                | `^10.29.2`            |
| `zod`                   | `^3.25.0 \|\| ^4.0.0` |
| Node                    | `>=20`                |

Adapter version constant: `KAMOD_OPENUI_ADAPTER_VERSION` (`0.1.0`). OpenUI Lang version comes from upstream only.

## Preact / `preact/compat`

OpenUI’s React peer must be aliased to Preact:

```ts
// vite.config.ts / preactpress config
resolve: {
  alias: [
    { find: "react", replacement: "preact/compat" },
    { find: "react-dom", replacement: "preact/compat" },
    { find: "react/jsx-runtime", replacement: "preact/jsx-runtime" },
  ],
  dedupe: ["preact", "preact/hooks", "preact/compat"],
}
```

Do not bundle a second React runtime beside Preact.

## Quick start

```tsx
import { KamodOpenUIRenderer, kamodOpenUILibrary } from "@kamod-ch/openui";

export function GeneratedInterface({ content }: { content: string }) {
  return (
    <KamodOpenUIRenderer
      content={content}
      library={kamodOpenUILibrary}
      onAction={(action) => {
        console.log(action);
      }}
    />
  );
}
```

## System prompts

```ts
import { createKamodOpenUISystemPrompt } from "@kamod-ch/openui/prompts";
import { kamodOpenUILibrary } from "@kamod-ch/openui";

const systemPrompt = createKamodOpenUISystemPrompt({
  library: kamodOpenUILibrary,
  includeExamples: true,
  additionalInstructions: [
    "Prefer simple interfaces.",
    "Do not render destructive actions unless explicitly requested.",
  ],
});
```

A static default prompt is also exported as `kamodOpenUISystemPrompt`.

## Actions

Models may only emit declarative actions (`event`, `submit`, `navigate`). The host decides what runs:

```tsx
<KamodOpenUIRenderer
  content={content}
  onAction={(action) => {
    // Host-controlled execution
  }}
  onSubmit={({ formName, formState }) => {
    // Host validates and processes form data
  }}
/>
```

### Navigation policy

`navigate` / `open_url` defaults:

- relative internal URLs allowed
- external URLs blocked
- `javascript:`, `data:`, `blob:` blocked

```tsx
<KamodOpenUIRenderer
  content={content}
  navigation={{
    allowExternal: true,
    allowedOrigins: ["https://example.com"],
    allowedProtocols: ["https:"],
  }}
/>
```

## Forms

Form fields bind through OpenUI’s `useStateField` / form context APIs. Supported MVP controls: `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `SubmitButton`, wrapped by `Form` / `Field`.

Rules:

- no model-supplied regex or function validators
- no arbitrary file uploads
- password values are never logged by the adapter

## Presets

```ts
import { basicPreset } from "@kamod-ch/openui/presets/basic";
import { formsPreset } from "@kamod-ch/openui/presets/forms";
import { dashboardPreset } from "@kamod-ch/openui/presets/dashboard";
```

## Configurable library

```ts
import { createKamodOpenUILibrary } from "@kamod-ch/openui";

const library = createKamodOpenUILibrary({
  components: {
    button: true,
    card: true,
    form: true,
    tabs: false,
  },
  security: {
    maxTreeDepth: 10,
    maxTotalNodes: 200,
  },
  navigation: {
    allowExternal: false,
  },
  extend: [myCustomComponent],
});
```

`extend` is typed and does not mutate `kamodOpenUILibrary`.

## Security model

- only registered components
- Zod-validated props (no `z.any()`, no free `className` / `style`)
- semantic tokens (`spacing`, `tone`, `alignment`, `width`) instead of arbitrary CSS
- explicit child allow-lists per container
- tree limits: depth 12, 50 children/node, 300 nodes (configurable)
- actions only via host callbacks

## SSR and streaming

- SSR works when React is aliased to `preact/compat` (see tests using `preact-render-to-string`)
- Client streaming: pass growing `content` and `isStreaming={true}` to `KamodOpenUIRenderer`
- Streaming SSR is intentionally not abstracted in the MVP

## Registered components

| Group       | Components |
| ----------- | ---------- |
| Layout      | `Stack`, `Inline`, `Grid`, `Card`, `ScrollArea`, `AspectRatio` |
| Content     | `Heading`, `Text`, `Divider`, `Label`, `Avatar`, `Empty`, `Image`, `Video`, `Item`, `Prose`, `Kbd` |
| Feedback    | `Alert`, `Badge`, `Progress`, `Skeleton`, `Spinner`, `Tooltip`, `Toast`, `Sonner`, `Chart` |
| Actions     | `Button`, `ButtonGroup`, `Link`, `Tabs`, `Accordion`, `Collapsible`, `Toggle`, `ToggleGroup`, `ThemeToggle` |
| Overlays    | `Dialog`, `AlertDialog`, `Popover`, `HoverCard`, `Dropdown`, `Drawer`, `Sheet`, `Command`, `ContextMenu` |
| Navigation  | `Breadcrumb`, `Pagination`, `Sidebar`, `NavigationMenu`, `Menubar`, `LocaleSegmentGroup` |
| Data        | `Table`, `DataTable`, `Calendar` |
| Forms       | `Form`, `Field`, `Input`, `Textarea`, `Select`, `RichSelect`, `Combobox`, `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `DatePicker`, `InputOtp`, `InputGroup`, `SelectableCard`, `SubmitButton` |

### Adapter primitives (not core exports)

`Stack`, `Inline`, `Grid`, `Form`, `Link`, and `SubmitButton` are adapter wrappers. They map to Kamod primitives (`Typography`, `Separator`, `Button`, `Field`, native `<form>`, etc.) and are documented as such — not silent fake re-exports from `@kamod-ch/ui`.

### Explicitly excluded

| Core | Reason |
| ---- | ------ |
| `Dropzone` | File uploads are a security risk for generative UI |
| `Direction` | RTL/LTR provider is host-owned, not LLM-emitted |
| Free `Typography` / `Separator` / `NativeSelect` / `Field` | Already covered by `Heading`/`Text`, `Divider`, `Select`, and OpenUI `Field` |

## Known limitations

- Nested `Stack`/`Grid`/`Card` inside themselves is disallowed to bound recursion
- Tabs use Kamod’s uncontrolled `defaultValue` API
- Select uses `NativeSelect` for a flat options API; use `RichSelect` for the full Select surface
- Prose accepts plain text only (no HTML / `dangerouslySetInnerHTML`)
- Media URLs (`Image`, `Video`, `Avatar`) are validated via `validateMediaUrl`

## Public API

```ts
import {
  KamodOpenUIRenderer,
  createKamodOpenUILibrary,
  kamodOpenUILibrary,
  KAMOD_OPENUI_ADAPTER_VERSION,
} from "@kamod-ch/openui";

import type {
  KamodOpenUIRendererProps,
  KamodOpenUIAction,
  KamodOpenUIConfig,
  KamodOpenUISecurityPolicy,
} from "@kamod-ch/openui";
```

Subpaths: `@kamod-ch/openui/library`, `@kamod-ch/openui/presets/basic`, `@kamod-ch/openui/presets/forms`, `@kamod-ch/openui/presets/dashboard`, `@kamod-ch/openui/prompts`.

## License

MIT
