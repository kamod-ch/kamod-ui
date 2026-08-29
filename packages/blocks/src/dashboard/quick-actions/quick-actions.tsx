import { FilePlusIcon, FolderIcon, MessageSquareIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@kamod-ch/ui";
import type { BlockLinkComponent } from "../../shared";
import { renderBlockLink } from "../../shared";
import { DashboardSection } from "../shared/section-card";
import type { DashboardIcon } from "../shared/types";

export type QuickAction = {
  id: string;
  label: string;
  description?: string;
  href?: string;
  onSelect?: () => void;
  disabled?: boolean;
  icon?: DashboardIcon;
  shortcut?: string;
};

export type QuickActionsProps = {
  title?: string;
  description?: string;
  actions?: QuickAction[];
  linkComponent?: BlockLinkComponent;
};

const defaultActions: QuickAction[] = [
  {
    id: "new-project",
    label: "New project",
    description: "Start from a template",
    icon: FilePlusIcon,
    shortcut: "⌘N",
  },
  {
    id: "browse-files",
    label: "Browse files",
    description: "Open the workspace library",
    href: "#files",
    icon: FolderIcon,
  },
  {
    id: "ask-ai",
    label: "Ask AI",
    description: "Draft a summary of this week",
    icon: SparklesIcon,
  },
  {
    id: "team-chat",
    label: "Team chat",
    description: "Currently offline",
    icon: MessageSquareIcon,
    disabled: true,
  },
];

export const QuickActions = ({
  title = "Quick actions",
  description = "Shortcuts for the jobs you repeat every day.",
  actions = defaultActions,
  linkComponent,
}: QuickActionsProps) => (
  <DashboardSection slot="block-quick-actions" title={title} description={description}>
    <ul class="grid gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const body = (
          <>
            {Icon ? (
              <ItemMedia variant="icon">
                <Icon size={16} aria-hidden="true" />
              </ItemMedia>
            ) : null}
            <ItemContent>
              <ItemTitle>{action.label}</ItemTitle>
              {action.description ? <ItemDescription>{action.description}</ItemDescription> : null}
            </ItemContent>
            {action.shortcut ? (
              <ItemActions>
                <kbd class="text-muted-foreground font-mono text-[11px]">{action.shortcut}</kbd>
              </ItemActions>
            ) : null}
          </>
        );

        if (action.href && !action.disabled) {
          return (
            <li key={action.id}>
              <Item variant="outline" size="sm" asChild>
                {renderBlockLink(linkComponent, {
                  href: action.href,
                  class: "w-full",
                  "aria-label": action.label,
                  children: body,
                })}
              </Item>
            </li>
          );
        }

        return (
          <li key={action.id}>
            <Item variant="outline" size="sm" asChild>
              <button
                type="button"
                class="w-full text-start"
                disabled={action.disabled}
                aria-label={action.label}
                onClick={() => {
                  if (action.disabled) return;
                  action.onSelect?.();
                }}
              >
                {body}
              </button>
            </Item>
          </li>
        );
      })}
    </ul>
  </DashboardSection>
);
