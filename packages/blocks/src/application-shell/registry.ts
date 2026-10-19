/**
 * @file Application shell metadata shared by the documentation overview and detail routes.
 * Source-file labels correspond to the docs application's applicationShellSources map.
 */

import { ApplicationShell1Preview } from "./application-shell-1/preview";
import { ApplicationShell2Preview } from "./application-shell-2/preview";
import { ApplicationShell3Preview } from "./application-shell-3/preview";
import { ApplicationShell4Preview } from "./application-shell-4/preview";
import { ApplicationShell5Preview } from "./application-shell-5/preview";
import { ApplicationShell6Preview } from "./application-shell-6/preview";
import { ApplicationShell7Preview } from "./application-shell-7/preview";
import { ApplicationShell8Preview } from "./application-shell-8/preview";
import { applicationShellBlockMetadata } from "./metadata";

/**
 * Registered variants with their preview component, source files and dependency metadata.
 * `id` is the route/import identifier; `title` is the zero-padded name displayed to readers.
 * The inherited `installCommand` field holds a workspace import path, not an installation
 * command: this private blocks package is distributed to users as copyable source.
 */
const previews = [
  ApplicationShell1Preview,
  ApplicationShell2Preview,
  ApplicationShell3Preview,
  ApplicationShell4Preview,
  ApplicationShell5Preview,
  ApplicationShell6Preview,
  ApplicationShell7Preview,
  ApplicationShell8Preview,
];

export const applicationShellBlocks = applicationShellBlockMetadata.map((block, index) => ({
  ...block,
  component: previews[index],
}));
