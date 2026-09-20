/**
 * @file Build-time source imports for the Application Shell 1 documentation's Code tab.
 * Vite's raw imports keep copied examples identical to the checked-in implementation.
 */
import sidebar from "../../../blocks/src/application-shell/application-shell-1/app-sidebar.tsx?raw";
import shell from "../../../blocks/src/application-shell/application-shell-1/application-shell-1.tsx?raw";
import data from "../../../blocks/src/application-shell/application-shell-1/demo-data.tsx?raw";
import index from "../../../blocks/src/application-shell/application-shell-1/index.ts?raw";
import menu from "../../../blocks/src/application-shell/application-shell-1/menu.tsx?raw";
import navigation from "../../../blocks/src/application-shell/application-shell-1/nav-main.tsx?raw";
import user from "../../../blocks/src/application-shell/application-shell-1/nav-user.tsx?raw";
import preview from "../../../blocks/src/application-shell/application-shell-1/preview.tsx?raw";
import types from "../../../blocks/src/application-shell/application-shell-1/types.ts?raw";

/**
 * Source text keyed by the file labels in applicationShellBlocks.
 * Keep this map aligned with the registry when adding or renaming a displayed source file.
 */
export const applicationShellSources: Record<string, string> = {
  "application-shell-1.tsx": shell,
  "app-sidebar.tsx": sidebar,
  "nav-main.tsx": navigation,
  "nav-user.tsx": user,
  "menu.tsx": menu,
  "types.ts": types,
  "preview.tsx": preview,
  "demo-data.tsx": data,
  "index.ts": index,
};
