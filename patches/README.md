# PreactPress 3.0.1: atomic document catalogs

The development watcher empties its route maps before awaiting a rescan. Requests or
prefetch during that gap can receive a 404 for an existing page. Overlapping refreshes
can also mix route content and metadata from different scans.

The patch serializes scans, constructs a replacement catalog privately, and publishes
it after all reads succeed. Module generation retains one complete snapshot; older
requests cannot overwrite the cache after a newer scan publishes. Failed refreshes
keep the previous catalog available and log a warning without crashing the dev watcher.
Initial build errors still fail the build. This changes server/build behavior only; it
adds no client dependency or browser scheduling.

pnpm applies the pinned patch through `patchedDependencies` in `pnpm-workspace.yaml`.
Keep its hash and `pnpm-lock.yaml` aligned. Remove it once an upstream release supplies
the same guarantees, then recheck the runtime compatibility bridge before upgrading.

Validation: `corepack pnpm --filter @kamod-ch/ui-docs test src/layout/runtime/runtime-catalog.test.ts`.
The tests exercise the installed plugin's real scan/load functions with controlled I/O.
