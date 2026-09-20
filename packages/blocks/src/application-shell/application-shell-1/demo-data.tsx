/**
 * @file Typed sample content for the Application Shell 1 preview.
 * Hash URLs identify demo selections; replace them with app routes when reusing this data.
 * Fixtures use a single icon family and remain separate from the reusable shell's API.
 */
import {
  BookOpenIcon,
  BoxesIcon,
  CommandIcon,
  EllipsisIcon,
  FrameIcon,
  MapIcon,
  Settings2Icon,
  TerminalIcon,
} from "@kamod-ch/icons/lucide";
import type {
  ApplicationShellBrand,
  ApplicationShellDestination,
  ApplicationShellNavigationGroup,
  ApplicationShellUser,
} from "./types";

/** Sample workspace identity with a decorative icon and a demo home destination. */
export const applicationShell1Brand: ApplicationShellBrand = {
  name: "Acme Inc",
  description: "Enterprise",
  href: "#home",
  logo: <CommandIcon strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />,
};

/** Platform and project groups exercising direct links and one level of child navigation. */
export const applicationShell1Navigation: ApplicationShellNavigationGroup[] = [
  {
    id: "platform",
    label: "Platform",
    items: [
      {
        id: "playground",
        label: "Playground",
        icon: TerminalIcon,
        items: [
          { id: "history", label: "History", href: "#history" },
          { id: "starred", label: "Starred", href: "#starred" },
          { id: "presets", label: "Presets", href: "#presets" },
        ],
      },
      {
        id: "models",
        label: "Models",
        icon: BoxesIcon,
        items: [
          { id: "genesis", label: "Genesis", href: "#genesis" },
          { id: "explorer", label: "Explorer", href: "#explorer" },
          { id: "quantum", label: "Quantum", href: "#quantum" },
        ],
      },
      {
        id: "documentation",
        label: "Documentation",
        icon: BookOpenIcon,
        items: [
          { id: "introduction", label: "Introduction", href: "#introduction" },
          { id: "get-started", label: "Get Started", href: "#get-started" },
          { id: "tutorials", label: "Tutorials", href: "#tutorials" },
          { id: "changelog", label: "Changelog", href: "#changelog" },
        ],
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings2Icon,
        items: [
          { id: "general", label: "General", href: "#general" },
          { id: "team", label: "Team", href: "#team" },
          { id: "billing", label: "Billing", href: "#billing" },
          { id: "limits", label: "Limits", href: "#limits" },
        ],
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    items: [
      { id: "design", label: "Design Engineering", href: "#design", icon: FrameIcon },
      { id: "sales", label: "Sales & Marketing", href: "#sales", icon: BoxesIcon },
      { id: "travel", label: "Travel", href: "#travel", icon: MapIcon },
      {
        id: "more",
        label: "More",
        icon: EllipsisIcon,
        items: [
          { id: "all-projects", label: "All projects", href: "#projects" },
          { id: "archived-projects", label: "Archived projects", href: "#archived-projects" },
        ],
      },
    ],
  },
];

/** Sample identity without an image, demonstrating the generated initials fallback. */
export const applicationShell1User: ApplicationShellUser = {
  name: "Alex Morgan",
  email: "alex@example.com",
};
/** Fixed preview trail; it illustrates the header independently of selected demo links. */
export const applicationShell1Breadcrumbs: ApplicationShellDestination[] = [
  { label: "Workspace", href: "#workspace" },
  { label: "Overview" },
];
