/**
 * @file Application shell metadata shared by the documentation overview and detail routes.
 * Source-file labels correspond to the docs application's applicationShellSources map.
 */

import { ApplicationShell1Preview } from "./application-shell-1/preview";
import { applicationShellBlockMetadata } from "./metadata";

/**
 * Registered variants with their preview component, source files and dependency metadata.
 * `id` is the route/import identifier; `title` is the zero-padded name displayed to readers.
 * The inherited `installCommand` field holds a workspace import path, not an installation
 * command: this private blocks package is distributed to users as copyable source.
 */
export const applicationShellBlocks = applicationShellBlockMetadata.map((block) => ({
  ...block,
  component: ApplicationShell1Preview,
}));
