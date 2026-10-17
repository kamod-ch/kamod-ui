import { Button } from "@kamod-ch/ui";
import { useMemo } from "preact/hooks";
import type {
  ApplicationShellNavigate,
  ApplicationShellNavigationGroup,
  ApplicationShellNavigationLink,
} from "../application-shell-1/types";

/** Flatten only horizontal global navigation; disabled branches retain disabled descendants. */
function flattenGroups(groups: readonly ApplicationShellNavigationGroup[]) {
  return groups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.items?.length
        ? [
            ...(item.href ? [item] : []),
            ...item.items.map((child) => ({ ...child, disabled: item.disabled || child.disabled })),
          ]
        : [item],
    ),
  );
}

/** Native navigation, not ARIA tabs: routes and active state remain application-owned. */
export function ShellNavigation({
  groups,
  links,
  label = "Workspace navigation",
  currentPath,
  onNavigate,
}: {
  groups?: readonly ApplicationShellNavigationGroup[];
  links?: readonly ApplicationShellNavigationLink[];
  label?: string;
  currentPath?: string;
  onNavigate?: ApplicationShellNavigate;
}) {
  const destinations = useMemo(() => links ?? flattenGroups(groups ?? []), [groups, links]);
  return (
    <nav
      aria-label={label}
      class={`${groups ? "hidden md:flex" : "flex"} min-w-0 flex-wrap gap-1 border-b px-4 py-2`}
    >
      {destinations.map((item, index) => {
        const active =
          !item.disabled && (item.active ?? (!!currentPath && item.href === currentPath));
        return (
          <Button
            key={`${item.id}-${index}`}
            size="sm"
            variant={active ? "secondary" : "ghost"}
            class="max-w-full"
            href={item.disabled ? undefined : item.href}
            disabled={item.disabled}
            aria-current={active ? "page" : undefined}
            onClick={(event: Parameters<ApplicationShellNavigate>[1]) => {
              if (!item.disabled) onNavigate?.(item, event);
            }}
          >
            <span class="truncate">{item.label}</span>
          </Button>
        );
      })}
    </nav>
  );
}
