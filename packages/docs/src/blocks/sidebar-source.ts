import type { SidebarBlockId } from "@kamod-ch/blocks";
import sidebarBlockShell from "../../../blocks/src/sidebar/SidebarBlockShell.tsx?raw";
import appSidebar from "../../../blocks/src/sidebar/shared/app-sidebar.tsx?raw";
import dashboardShell from "../../../blocks/src/sidebar/shared/dashboard-shell.tsx?raw";
import nav from "../../../blocks/src/sidebar/shared/nav.tsx?raw";
import sampleData from "../../../blocks/src/sidebar/shared/sample-data.ts?raw";
import searchForm from "../../../blocks/src/sidebar/shared/search-form.tsx?raw";
import versionSwitcher from "../../../blocks/src/sidebar/shared/version-switcher.tsx?raw";
import sidebar01 from "../../../blocks/src/sidebar/sidebar-01/sidebar-01.tsx?raw";
import sidebar02 from "../../../blocks/src/sidebar/sidebar-02/sidebar-02.tsx?raw";
import sidebar03 from "../../../blocks/src/sidebar/sidebar-03/sidebar-03.tsx?raw";
import sidebar04 from "../../../blocks/src/sidebar/sidebar-04/sidebar-04.tsx?raw";
import sidebar05 from "../../../blocks/src/sidebar/sidebar-05/sidebar-05.tsx?raw";
import sidebar06 from "../../../blocks/src/sidebar/sidebar-06/sidebar-06.tsx?raw";
import sidebar07 from "../../../blocks/src/sidebar/sidebar-07/sidebar-07.tsx?raw";
import sidebar08 from "../../../blocks/src/sidebar/sidebar-08/sidebar-08.tsx?raw";
import sidebar09 from "../../../blocks/src/sidebar/sidebar-09/sidebar-09.tsx?raw";
import sidebar10 from "../../../blocks/src/sidebar/sidebar-10/sidebar-10.tsx?raw";
import sidebar11 from "../../../blocks/src/sidebar/sidebar-11/sidebar-11.tsx?raw";
import sidebar12 from "../../../blocks/src/sidebar/sidebar-12/sidebar-12.tsx?raw";
import sidebar13 from "../../../blocks/src/sidebar/sidebar-13/sidebar-13.tsx?raw";
import sidebar14 from "../../../blocks/src/sidebar/sidebar-14/sidebar-14.tsx?raw";
import sidebar15 from "../../../blocks/src/sidebar/sidebar-15/sidebar-15.tsx?raw";
import sidebar16 from "../../../blocks/src/sidebar/sidebar-16/sidebar-16.tsx?raw";

const pageSources: Record<SidebarBlockId, string> = {
  "sidebar-01": sidebar01,
  "sidebar-02": sidebar02,
  "sidebar-03": sidebar03,
  "sidebar-04": sidebar04,
  "sidebar-05": sidebar05,
  "sidebar-06": sidebar06,
  "sidebar-07": sidebar07,
  "sidebar-08": sidebar08,
  "sidebar-09": sidebar09,
  "sidebar-10": sidebar10,
  "sidebar-11": sidebar11,
  "sidebar-12": sidebar12,
  "sidebar-13": sidebar13,
  "sidebar-14": sidebar14,
  "sidebar-15": sidebar15,
  "sidebar-16": sidebar16,
};

const supportSources: Record<string, string> = {
  "components/app-sidebar.tsx": appSidebar,
  "components/dashboard-shell.tsx": dashboardShell,
  "components/search-form.tsx": searchForm,
  "components/version-switcher.tsx": versionSwitcher,
  "components/nav.tsx": nav,
  "components/sidebar-block-shell.tsx": sidebarBlockShell,
  "components/sample-data.ts": sampleData,
};

export const getSidebarBlockSource = (id: SidebarBlockId, fileLabel: string): string => {
  if (fileLabel === "app/dashboard/page.tsx" || fileLabel.endsWith(`${id}.tsx`)) {
    return pageSources[id] ?? "";
  }
  return supportSources[fileLabel] ?? pageSources[id] ?? "";
};
