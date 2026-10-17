import { FolderIcon, HouseIcon, SettingsIcon, UsersIcon } from "@kamod-ch/icons/lucide";
import type { ApplicationShellNavigationGroup } from "../application-shell-1/types";

export const profiles = {
  2: {
    brandDescription: "Project workspace",
    title: "Projects",
    subtitle: "A quieter workspace for the work that matters.",
    action: "New project",
    items: ["Design system", "Customer portal", "Autumn launch"],
    kind: "Project",
    metric: "Active work",
  },
  3: {
    brandDescription: "Release workspace",
    title: "Deployments",
    subtitle: "Release confidently. Keep every environment within reach.",
    action: "Stage release",
    items: ["Production API", "Staging dashboard", "Preview website"],
    kind: "Release",
    metric: "Environments",
  },
  4: {
    brandDescription: "Team workspace",
    title: "Team",
    subtitle: "One place for the people building your next idea.",
    action: "Add member",
    items: ["Alex Morgan", "Sam Rivera", "Jordan Chen"],
    kind: "Member",
    metric: "People",
  },
  5: {
    brandDescription: "Support workspace",
    title: "Inbox",
    subtitle: "Keep the conversation central and your tools close.",
    action: "New request",
    items: ["Workspace access", "Billing question", "Export assistance"],
    kind: "Request",
    metric: "Open requests",
  },
  6: {
    brandDescription: "Document workspace",
    title: "Documents",
    subtitle: "Write in context. Keep ownership and review details alongside.",
    action: "Save draft",
    items: ["Launch brief", "Product principles", "Release checklist"],
    kind: "Document",
    metric: "Documents",
  },
  7: {
    brandDescription: "Project sections",
    title: "Project overview",
    subtitle: "Keep each project’s pages together without losing the wider workspace.",
    action: "Add milestone",
    items: ["Research complete", "Prototype review", "Release readiness"],
    kind: "Milestone",
    metric: "Milestones",
  },
} as const;

/** Stable demo destinations, independent of filtering, selection and draft edits. */
export function createPreviewNavigation(title: string): ApplicationShellNavigationGroup[] {
  return [
    {
      id: "workspace",
      label: "Workspace",
      items: [
        { id: "overview", label: title, href: "/workspace", icon: HouseIcon },
        {
          id: "library",
          label: "Library",
          icon: FolderIcon,
          items: [
            { id: "recent", label: "Recent", href: "/recent" },
            { id: "archive", label: "Archive", href: "/archive" },
          ],
        },
        { id: "team", label: "People", href: "/people", icon: UsersIcon },
      ],
    },
    {
      id: "manage",
      label: "Manage",
      items: [{ id: "settings", label: "Settings", href: "/settings", icon: SettingsIcon }],
    },
  ];
}
