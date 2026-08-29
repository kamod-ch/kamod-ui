import type { AppSidebarBlockId } from "@kamod-ch/blocks/app-sidebar";
import navUser from "../../../blocks/src/app-sidebar/shared/nav-user.tsx?raw";
import types from "../../../blocks/src/app-sidebar/shared/types.ts?raw";
import widthStyle from "../../../blocks/src/app-sidebar/shared/width-style.ts?raw";
import sidebar01 from "../../../blocks/src/app-sidebar/sidebar-01/sidebar-01.tsx?raw";
import navMain from "../../../blocks/src/app-sidebar/sidebar-02/nav-main.tsx?raw";
import navProjects from "../../../blocks/src/app-sidebar/sidebar-02/nav-projects.tsx?raw";
import navSecondary from "../../../blocks/src/app-sidebar/sidebar-02/nav-secondary.tsx?raw";
import sidebar02 from "../../../blocks/src/app-sidebar/sidebar-02/sidebar-02.tsx?raw";
import teamSwitcher from "../../../blocks/src/app-sidebar/sidebar-02/team-switcher.tsx?raw";
import sidebar03 from "../../../blocks/src/app-sidebar/sidebar-03/sidebar-03.tsx?raw";
import sidebar04 from "../../../blocks/src/app-sidebar/sidebar-04/sidebar-04.tsx?raw";
import sidebar05 from "../../../blocks/src/app-sidebar/sidebar-05/sidebar-05.tsx?raw";
import sidebar06 from "../../../blocks/src/app-sidebar/sidebar-06/sidebar-06.tsx?raw";
import sidebar07 from "../../../blocks/src/app-sidebar/sidebar-07/sidebar-07.tsx?raw";

const shared = {
  "components/types.ts": types,
  "components/nav-user.tsx": navUser,
};

const sources: Record<AppSidebarBlockId, Record<string, string>> = {
  "sidebar-01": { "components/sidebar-01.tsx": sidebar01, ...shared },
  "sidebar-02": {
    "components/sidebar-02.tsx": sidebar02,
    "components/team-switcher.tsx": teamSwitcher,
    "components/nav-main.tsx": navMain,
    "components/nav-projects.tsx": navProjects,
    "components/nav-secondary.tsx": navSecondary,
    ...shared,
  },
  "sidebar-03": { "components/sidebar-03.tsx": sidebar03, ...shared },
  "sidebar-04": { "components/sidebar-04.tsx": sidebar04, ...shared },
  "sidebar-05": {
    "components/sidebar-05.tsx": sidebar05,
    "components/width-style.ts": widthStyle,
  },
  "sidebar-06": { "components/sidebar-06.tsx": sidebar06, ...shared },
  "sidebar-07": { "components/sidebar-07.tsx": sidebar07, ...shared },
};

export const getAppSidebarBlockSource = (id: AppSidebarBlockId, fileLabel: string): string =>
  sources[id]?.[fileLabel] ?? Object.values(sources[id] ?? {})[0] ?? "";
