<p align="center">
  <img src="docs/images/logo-kamod-ui-dark.svg#gh-light-mode-only" alt="Kamod UI" width="162" />
  <img src="docs/images/logo-kamod-ui-light.svg#gh-dark-mode-only" alt="Kamod UI" width="162" />
</p>

<h1 align="center">Kamod UI</h1>

Lightweight UI components for **Preact** and **Tailwind**: composable primitives you can customize, extend, and ship without a heavy runtime. Open source; source is meant to be read and adapted.

- **Live demo:** [kamod-ch.github.io/kamod-ui](https://kamod-ch.github.io/kamod-ui/)
- **Repository:** [github.com/kamod-ch/kamod-ui](https://github.com/kamod-ch/kamod-ui/)

![hero](docs/images/kitchen-sink.png)

## Why Kamod UI?

Many UI kits are heavier than necessary, overly opinionated, or tied to React. Kamod UI targets a smaller stack instead:

- **Preact-first** — tiny runtime and familiar patterns if you already use React-like APIs.
- **Tailwind-native** — style with utilities instead of a separate theme layer.
- **Composable** — build UIs from small pieces without extra abstraction.
- **Practical** — ship only what you need; the codebase stays easy to follow.

## Comparison

| Feature | Kamod UI | Radix UI | shadcn/ui |
| --- | :---: | :---: | :---: |
| Preact support | ✅ | ❌ | ❌ |
| Tailwind-first | ✅ | ⚠️ | ✅ |
| Lightweight | ✅ | ⚠️ | ⚠️ |

## Live demo (GitHub Pages)

The deployed kitchen sink and docs live at the **repository root URL** of GitHub Pages, not under `apps/demo` (that path exists only in this monorepo):

**[https://kamod-ch.github.io/kamod-ui/](https://kamod-ch.github.io/kamod-ui/)**

## Documentation

Run the demo app from the repo root:

```bash
pnpm install
pnpm dev
```

Then open the local URL printed in the terminal to browse the kitchen sink and component docs.

## Contributing

- Open issues for bugs and ideas.
- Suggest new components or patterns.
- Improve docs and examples.

## Support

If you find Kamod UI useful:

- Star the repository.
- Share the project with others who use Preact or Tailwind.
