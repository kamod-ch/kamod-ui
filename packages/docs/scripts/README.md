# Documentation scripts

## Block preview images

See [**Block Preview Images: Generation and Maintenance Guide**](BLOCK-PREVIEW-IMAGES.md)
for the complete workflow: generation, automatic discovery, manual commands,
light/dark captures, deployment base paths, validation and troubleshooting.

The generator is [`generate-block-thumbnails.mjs`](generate-block-thumbnails.mjs).
Run it from the repository root after building the documentation:

```sh
corepack pnpm --filter @kamod-ch/ui-docs blocks:thumbnails
```

Use `--base /kamod-ui/` when that is the base of the production build, or
`--block sidebar/sidebar-01` to update one visible variant. Rebuild the docs after
generation and commit the generated WebP files and manifest together.

**Normal builds and CI do not regenerate screenshots.** The guide explains what
is automated and when maintainers need to run the command.
